import fs, { createWriteStream, stat } from "fs";
import os from "os"
import path from "path"
import crypto from "crypto"
import {type CreateWorkspaceInput, type User } from "./workspace.schema.js";
import { prisma } from "@repo/database/prisma"
import { getAllFiles } from "../../cloudflair/getFullDirectory.js";
import { downloadFiles } from "@repo/cloudflair/r2"
import { ZipArchive } from "archiver";
import axios from "axios";
import FormData from "form-data";


const shareFileWithWorker = async (
  folderPath: string,
  id: string
) => {
  const zipPath = path.join(os.tmpdir(), `${id}.zip`);

  try {
    const archive = new ZipArchive({
      zlib: { level: 6 }
    });

    const output = createWriteStream(zipPath);

    archive.on("error", (err) => {
      console.error("Archive error:", err);
    });

    archive.pipe(output);

    archive.glob("**/*", {
      cwd: folderPath,
      ignore: [
        ".git/**",
        "node_modules/**"
      ]
    });

    // Wait until complete ZIP is written to disk
    const zipReady = new Promise<void>((resolve, reject) => {
      output.on("close", resolve);
      output.on("error", reject);
      archive.on("error", reject);
    });

    await archive.finalize();
    await zipReady;

    console.log("ZIP created:", zipPath);

    // Now send completed ZIP
    const form = new FormData();

    const stats = fs.statSync(zipPath);

    form.append("workspace", fs.createReadStream(zipPath), {
      filename: `${id}.zip`,
      contentType: "application/zip",
      knownLength: stats.size
    });

    const contentLength = await new Promise<number>((resolve, reject) => {
      form.getLength((err, length) => {
        if (err) reject(err);
        else resolve(length);
      });
    });

    const response = await axios.post(
      `${process.env.WORKER_URL!}/sync`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          "Content-Length": contentLength
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 120000
      }
    );

    return response.data;

  } finally {
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
  }
};

export const syncObjectStore = async () => {
  try{
    const workspacePath = path.join(process.cwd(), "../../storage/workspace");
    const entries = fs.readdirSync(workspacePath , {
      withFileTypes : true 
    })
    const workspaceIds = entries
    .filter(entry => entry.isDirectory())
    .filter(entry => {
      const metadataPath = path.join(
        workspacePath,
        entry.name,
        "workspace.json"
      );
      if (!fs.existsSync(metadataPath)) return false;
      

      const metadata = JSON.parse(
        fs.readFileSync(metadataPath, "utf-8")
      );
      return metadata.isDirty === true;
    })
    .map(entry => entry.name);

    const results = [];
    
    for (const id of workspaceIds) {
      const folderPath = path.join(workspacePath, id);

      const result = await shareFileWithWorker(folderPath, id);

      // changing the isDirty == false 
      if (result?.success === true) {
        const metadataPath = path.join(folderPath, "workspace.json");
    
        const metadata = JSON.parse(
            fs.readFileSync(metadataPath, "utf-8")
        );
    
        metadata.isDirty = false;
    
        fs.writeFileSync(
            metadataPath,
            JSON.stringify(metadata, null, 2),
            "utf-8"
        );
    }
      results.push({
        workspaceId: id,
        result
      });
    }
    return results;
  }catch(e){
    console.log(e)
  }finally{

  }
}

export const createWorkspaceService = async (data: CreateWorkspaceInput, user: User) => {
  try {
    const id = crypto.randomUUID();
    const workspacePath = path.join(process.cwd(), "../../storage/workspace", id);

    fs.mkdirSync(workspacePath, {
      recursive: true
    })
    const workspaceMetaData = {
      id,
      userId: user.id,
      name: data.name,
      type: data.type,
      isDirty : true ,
      createdAt: new Date(),
      lastSync : null,
    }
    
    const template_bucket = process.env.R2_BUCKET_TEMPLATES!;
    const result = await getAllFiles(template_bucket, {
      name: data.name,
      type: data.type
    });

    for (const file of result) {
      await downloadFiles(template_bucket, file, workspacePath)
    }

    // storing the id into the db 
    const res = await prisma.workspace.create({
      data: {
        workspaceId: id,
        userId: user.id,
        type: data.type
      }
    })

    fs.writeFileSync(
      path.join(workspacePath, "workspace.json"),
      JSON.stringify(workspaceMetaData, null, 2)
    )
    return {
      id,
      name: data.name,
      type: data.type,
      path: workspacePath,
      status: "created"
    };
  } catch (e) {
    console.log(e)
  }
};

export const getWorkspacesService = (user: User) => {
  const workspacesPath = path.resolve(
    process.cwd(),
    "../../storage/workspace"
  );

  if (!fs.existsSync(workspacesPath)) return [];

  const userId = user.id;

  return fs.readdirSync(workspacesPath)
    .flatMap((folder) => {
      const folderPath = path.join(workspacesPath, folder);
      const workspaceFile = path.join(folderPath, "workspace.json");

      // Directory ya metadata missing hai toh skip kar
      if (
        !fs.existsSync(folderPath) ||
        !fs.statSync(folderPath).isDirectory() ||
        !fs.existsSync(workspaceFile)
      ) {
        return [];
      }

      try {
        const workspace = JSON.parse(
          fs.readFileSync(workspaceFile, "utf-8")
        );

        if (workspace.userId !== userId) return [];

        const { userId: _userId, ...rest } = workspace;
        return [rest];
      } catch (error) {
        console.error(`Invalid workspace: ${folder}`, error);
        return [];
      }
    });
};
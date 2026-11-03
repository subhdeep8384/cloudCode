import { uploadFile , r2 } from "@repo/cloudflair/r2";
import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import "dotenv/config"
import { rm , access } from "node:fs/promises";

const bucket = process.env.R2_BUCKET_PROJECT!;

export async function walk(
  currDir: string,
  rootDir: string,
  bucket: string
) {
  const entries = await readdir(currDir, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const fullPath = join(currDir, entry.name);

    if (entry.isDirectory()) {
      await walk(fullPath, rootDir, bucket);
    } else if (entry.isFile()) {
      const content = await readFile(fullPath);

      const relativePath = relative(rootDir, fullPath)
        .split(sep)
        .join("/");

      const res = await uploadFile(
        bucket,
        relativePath,
        content
      );

      console.log("Uploaded:", entry.name);
    }
  }
  r2.destroy();
  return "done";
}

export async function uploadTemplateOfProject() {
    const rootDir = "./extracted";

    try {
        await access(rootDir);
    } catch {
        console.log("No extracted folder found. Skipping upload.");
        return;
    }

    const result = await walk(rootDir, rootDir, bucket);
    console.log(result);
}

async function deleteUpload() {
    const rootDir = "./extracted";

    try {
        await access(rootDir);
    } catch {
        console.log("Extracted folder does not exist");
        return;
    }

    await rm(rootDir, {
        recursive: true,
        force: true
    });

    console.log("Extracted folder deleted");
}

export async function saveProgress(){
    console.log("saving all the progress")
    setInterval(async () =>{
        await uploadTemplateOfProject();
        await deleteUpload() ;
        console.log("progress saved")
    } , 1000 * 60 * 22) //22 min mai sync hoga optimisation 
}


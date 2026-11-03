import { uploadFile } from "@repo/cloudflair/r2";
import {readFile , readdir } from "node:fs/promises";
import {join , relative ,sep } from "node:path" ;

const bucket = process.env.R2_BUCKET_PROJECT!;

export async function walk(
    currDir: string,
    rootDir: string,
    bucket: string
  ): Promise<void> {
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
  }
  
export async function uploadTemplateOfProject(workspacePath : string) {
    try{
        const rootDir = workspacePath;
        await walk(rootDir, rootDir, bucket);
        return {
            "message" : "file Sync successfully"
        }
    }catch(e){
        return String(e) ;
    }finally{

    }
}
  
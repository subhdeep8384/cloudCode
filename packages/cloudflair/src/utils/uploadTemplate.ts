import fs from "fs"
import path from "path"
import {uploadFile } from "./r2.js"


function walk(dir : string) : string[]{
    const Ignore = ["node_modules" , ".next" ,".dist" ,".git"];
    const res = fs.readdirSync(dir , {withFileTypes:true}).flatMap((e)=>{
        if(Ignore.includes(e.name)) return [] ;

        const p = path.join(dir , e.name) ;
        return e.isDirectory() ? walk(p) : [p] ;
    })
    return res ;
}

export async function uploadTemplate(localDir: string, name: string, version: string , bucket : string) {
    const files = walk(localDir);
    for (const file of files) {
      const rel = path.relative(localDir, file).split(path.sep).join("/");
      const key = `${name}/${version}/${rel}`;
      await uploadFile(process.env.bucket!, key, fs.readFileSync(file));
      console.log("uploaded:", key);
    }
    console.log(`Done: ${files.length} files`);
  }
  
  const [, , localDir, name, version = "v1"] = process.argv;
  if (!localDir || !name) {
    console.log("Usage: tsx uploadTemplate.ts <localDir> <name> [version]");
    process.exit(1);
}

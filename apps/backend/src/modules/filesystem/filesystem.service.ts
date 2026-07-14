import fs from "fs/promises"
import path from "path"
import { getWorkspacePath } from "../../utils/getWorkspacePath.js"


export const listFiles = async (
    workspaceId: string,
    relativePath : string 
) => {

    const workspaceRoot = path.resolve(
        process.cwd() ,
        "../../storage/workspace" ,
        workspaceId
    )
    console.log("\n\n\n\n\n\n\n\n\n")
    console.log(workspaceRoot)

    const currentPath = path.join(
        workspaceRoot ,
        relativePath
    )

   const entries = await fs.readdir(currentPath, {
        withFileTypes : true 
    });

    for (const entry of entries) {
        console.log(entry.name);
        console.log(entry.isDirectory());
        console.log(entry.isFile());
    }

    return entries.map((entry) => ({
        name: entry.name,
        path: relativePath ? path.posix.join(relativePath , entry.name) : entry.name ,
        type: entry.isDirectory() ? "directory" : "file",
    }));
}


export const readFile = async (
    workspaceId: string,
    filePath: string
) => {
    const absolutePath = path.join(
        getWorkspacePath(workspaceId),
        filePath   
    );
    const content = await fs.readFile(
        absolutePath,
        "utf-8"
    );
    return content;
}

export const writeFile = async (
    workspaceId : string ,
    filePath : string ,
    content : string 
) =>{
    try{
        const absolutePath = path.join(
            getWorkspacePath(workspaceId) ,
            filePath
        )
        await fs.writeFile(
            absolutePath ,
            content ,
            "utf-8"
        )
        return {
            success : true 
        }
    }catch(e){
        return {
            success : false  
        }
    }
}



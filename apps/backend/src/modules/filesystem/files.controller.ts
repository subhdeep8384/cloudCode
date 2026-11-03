import type { Request , Response  } from "express"
import { listFiles, readFile, writeFile } from "./filesystem.service.js";
export const getFile = async (req : Request , res : Response ) =>{
    const {id} = req.params ;
    const {path} = req.query ;

    const content = await readFile(id as string , path as string) ;
    return res.json({
        content : content
    } );
}

export const writefile = async(req : Request , res : Response ) =>{
    const { id } = req.params ;
    const { path } = req.query ;
    const {content } = req.body;
    const result =  await writeFile(id as string , path as string , content as string )
    
    res.json(result)
} 
export const listfile = async(req : Request , res : Response ) =>{
    const { id } = req.params ;
    const {path} = req.query ;
    const result =  await listFiles(id as string , path as string)
    res.json(result)
} 
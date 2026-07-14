import fs, { stat } from "fs" ;
import path from "path"
import crypto from "crypto"
import {type CreateWorkspaceInput } from "./workspace.schema.js";
import { copyDirectory } from "../../utils/file.utils.js";

export const createWorkspaceService = (data: CreateWorkspaceInput) => {
  try{
    const id = crypto.randomUUID() ;
    const workspacePath = path.join(process.cwd() , "../../storage/workspace" , id) ;
    
    fs.mkdirSync(workspacePath , {
      recursive : true 
    })
  
    const templatePath = path.join(
      process.cwd() , "../../templates", data.type
    )
    copyDirectory(templatePath , workspacePath) ;
    
    const workspaceMetaData = {
      id ,
      name : data.name ,
      type : data.type ,
      createdAt : new Date() 
    }
    
    fs.writeFileSync(
      path.join(workspacePath , "workspace.json") ,
      JSON.stringify(workspaceMetaData , null , 2)
    )
    return {
      id , 
      name : data.name ,
      type : data.type ,
      path : workspacePath ,
      status : "created" 
    };
}catch(e){
  console.log(e)
}
};
export const getWorkspacesService =() =>{
    const workspacesPath = path.join(process.cwd() , "../../storage/workspace") ; 
    const folders = fs.readdirSync(workspacesPath) ;
    const workspaces = folders.map((folder) =>{
      const workspaceFile = path.join(
        workspacesPath , folder , "workspace.json"
      )
      const data = fs.readFileSync(
        workspaceFile , "utf-8"
      )
      return JSON.parse(data) ;
    }) ;
    return workspaces ;
}
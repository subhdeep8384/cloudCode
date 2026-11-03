import { type Request, type Response } from "express";
import { createWorkspaceService, getWorkspacesService, syncObjectStore } from "./workspace.service.js";
import { execBackground, execCommand, getContainer, startContainer } from "@repo/docker";
import path from "path";


export const createWorkspace = (req: Request, res: Response) => {
    const result = createWorkspaceService(req.body , req.user);
    res.status(201).json(result);
};

export const getAllWorkspaces = (req: Request, res: Response) => {

    const workspaces = getWorkspacesService(req.user);
    res.json(workspaces)
}

export const startWorkspace = async (
    req: Request, res: Response
) => {
    const { id } = req.params;
    
    await startContainer(id as string);
    res.json({
        message: "Workspace started"
    })
}
export const installDependencies = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await execCommand(id as string, [
        "npm",
        "install"
    ])
    res.json(result)
}

export const runWorkspace = async (
    req: Request, res: Response
) => {
    const { id } = req.params;
    console.log("run work space called")
    await execBackground(id as string, [
        "npm",
        "run",
        "dev",
        "--",
        "--host",
        "0.0.0.0",
    ]);
    res.json({
        message: "Dev server started",
    });
}

export const deleteContainer = async (req : Request , res : Response)=>{
    const {id} = req.params ;
    console.log("delete container called")
    const container = await getContainer(id as string)
    if(container) {
        await container.stop()
        await container.remove(function(err , data ){
            if(err){
                console.log(err) ;
                return 
            }
            console.log( data)
        })
        return res.status(200).json({
            message : id + " container deleted"
        })
    }
    res.status(401).json({
        message : "Something went wrong"
    })
}

export const syncObjectStoreWithWorkspace = async (req : Request  , res : Response ) => {
    const result = await syncObjectStore() ;   
    res.send(result)
}
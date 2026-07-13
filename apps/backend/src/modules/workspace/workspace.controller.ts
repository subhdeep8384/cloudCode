import {type  Request,type  Response } from "express";
import { createWorkspaceService, getWorkspacesService } from "./workspace.service.js";

export const createWorkspace = (req: Request, res: Response) => {
    const result = createWorkspaceService(req.body);
    res.status(201).json(result);
};

export const getWorkspaces = (req : Request , res : Response )=>{
    const workspaces = getWorkspacesService() ;
    res.json(workspaces)
}
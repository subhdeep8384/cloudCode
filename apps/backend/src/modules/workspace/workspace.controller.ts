import { type Request, type Response } from "express";
import { createWorkspaceService, getWorkspacesService } from "./workspace.service.js";
import { execBackground, execCommand, startContainer } from "../sandbox/sandbox.service.js";


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
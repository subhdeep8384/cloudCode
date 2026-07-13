import { type Request, type Response } from "express";
import { createWorkspaceService, getWorkspacesService } from "./workspace.service.js";
import { execBackground, execCommand, startContainer } from "../sandbox/sandbox.service.js";


export const createWorkspace = (req: Request, res: Response) => {
    const result = createWorkspaceService(req.body);
    res.status(201).json(result);
};

export const getWorkspaces = (req: Request, res: Response) => {
    const workspaces = getWorkspacesService();
    res.json(workspaces)
}

export const startWorkspace = async (
    req: Request, res: Response
) => {
    const { id } = req.params;
    console.log(id)
    await startContainer(id as string);
    res.json({
        message: "Workspace started"
    })
}
export const installDependencies = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("the id is " ,id)
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
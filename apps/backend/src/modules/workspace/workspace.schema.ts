import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
  type: z.enum(["react", "next", "node", "express"]),
  userId : z.string().optional() 
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
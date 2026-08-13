import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
  type: z.enum(["react", "next", "node", "express"]),
  user : z.object({
    id : z.string() ,
    googleId : z.string() ,
    email : z.email() ,
    name : z.string() ,
    picture : z.string() ,
    createAt : z.date().optional()  ,
    updatedAt : z.date().optional() ,
  }).optional() 
});
export const getWorkspace = z.object({
  user : z.object({
    id : z.string() ,
    googleId : z.string() ,
    email : z.email() ,
    name : z.string() ,
    picture : z.string() ,
    createAt : z.date().optional()  ,
    updatedAt : z.date().optional() ,
  })
});

export const User = z.object({
    id : z.string() ,
    googleId : z.string() ,
    email : z.email() ,
    name : z.string().nullable() ,
    picture : z.string().nullable() ,
    createdAt : z.date().nullable()  ,
    updatedAt : z.date().nullable() ,
  })

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type getWorkspace = z.infer<typeof getWorkspace>
export type User = z.infer<typeof User>
import {type CreateWorkspaceInput } from "./workspace.schema.js";

export const createWorkspaceService = (data: CreateWorkspaceInput) => {
  console.log(data);

  return {
    message: "Workspace created successfully",
  };
};
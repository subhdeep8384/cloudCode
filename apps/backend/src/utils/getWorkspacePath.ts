import path from "path";

export const getWorkspacePath = (workspaceId: string) => {
  return path.resolve(
    process.cwd(),
    "../../storage/workspace",
    workspaceId
  );
};
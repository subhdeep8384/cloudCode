import type { User } from "../modules/workspace/workspace.schema.ts";


declare global {
  namespace Express {
    interface Request {
      user : User;
    }
  }
}

export {};
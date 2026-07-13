import {Router } from "express"
import validate from "../../middlewares/validate.schema.js";
import { createWorkspace, getWorkspaces } from "./workspace.controller.js";
import { createWorkspaceSchema } from "./workspace.schema.js";
const router :Router = Router() ;

router.post("/", validate(createWorkspaceSchema)  , createWorkspace)
router.get("/" , getWorkspaces)
export default router
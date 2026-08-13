import {Router } from "express"
import validate from "../../middlewares/validate.schema.js";
import { createWorkspace, getWorkspaces, installDependencies, runWorkspace, startWorkspace } from "./workspace.controller.js";
import { createWorkspaceSchema } from "./workspace.schema.js";
import { authenticate } from "../../middlewares/authenticate.js";
const router :Router = Router() ;

router.get("/" , getWorkspaces)
router.post("/", validate(createWorkspaceSchema) , authenticate  , createWorkspace)
router.post("/:id/start" , startWorkspace );
router.post("/:id/install" , installDependencies );
router.post("/:id/run" , runWorkspace );
export default router
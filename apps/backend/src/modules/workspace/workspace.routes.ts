import {Router } from "express"
import validate from "../../middlewares/validate.schema.js";
import { createWorkspace, getAllWorkspaces, installDependencies, runWorkspace, startWorkspace } from "./workspace.controller.js";
import { createWorkspaceSchema } from "./workspace.schema.js";
import { authenticate } from "../../middlewares/authenticate.js";
const router :Router = Router() ;

router.get("/" , authenticate , getAllWorkspaces)
router.post("/",   authenticate  , validate(createWorkspaceSchema) , createWorkspace)
router.post("/:id/start" , authenticate  , startWorkspace );
router.post("/:id/install" ,authenticate , installDependencies );
router.post("/:id/run" , authenticate , runWorkspace );
export default router
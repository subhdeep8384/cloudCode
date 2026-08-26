import {Router } from "express"
import validate from "../../middlewares/validate.schema.js";
import { createWorkspace, deleteContainer, getAllWorkspaces, installDependencies, runWorkspace, startWorkspace } from "./workspace.controller.js";
import {prisma} from "@repo/database/prisma"
import { createWorkspaceSchema } from "./workspace.schema.js";
import { authenticate } from "../../middlewares/authenticate.js";
const router :Router = Router() ;

router.get("/" , authenticate , getAllWorkspaces)
router.post("/",   authenticate  , validate(createWorkspaceSchema) , createWorkspace)
router.post("/:id/start" , authenticate  , startWorkspace );
router.post("/:id/install" ,authenticate , installDependencies );
router.post("/:id/run" , authenticate , runWorkspace );
router.post("/:id/delete" , authenticate , deleteContainer) ;
export default router
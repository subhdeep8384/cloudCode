import { Router } from "express";
import { getFile, listfile } from "./files.controller.js";
import { writefile } from "./files.controller.js";

const router :Router = Router() ;

router.get("/:id" , getFile);
router.put("/:id" , writefile)
router.get("/:id/list" , listfile )
export default router 
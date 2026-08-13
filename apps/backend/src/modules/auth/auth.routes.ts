import { Router  } from "express";
import { googleController } from "./google.controller.js";
import { signupController } from "./signup.controller.js";
import { googleCallbackController } from "./googleCallbackController.js";
const router :Router= Router() ;

router.post("/signup" , signupController) ;
router.get("/google" , googleController)
router.get("/google/callback" , googleCallbackController)


export default router ;
import { Router  } from "express";
import { googleController } from "./google.controller.js";
import { signupController } from "./signup.controller.js";
import { googleCallbackController } from "./googleCallbackController.js";
import { meController } from "./meController.js";
const router :Router= Router() ;


router.get("/me" , meController)
router.post("/signup" , signupController) ;
router.get("/google" , googleController)
router.get("/google/callback" , googleCallbackController)


export default router ;
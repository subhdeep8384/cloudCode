import { type Request , type Response , type NextFunction  } from "express";

export  function authenticate(req : Request , res : Response , next : NextFunction ){
    const authCokkie  = req.cookies ;
    const token = authCokkie ;

    
}

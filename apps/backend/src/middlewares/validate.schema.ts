import type { ZodObject } from "zod";
import {type Response , type Request , type NextFunction } from "express" ;
const validate = (schema : ZodObject) =>(req : Request , res : Response , next : NextFunction ) =>{
    const data = schema.safeParse(req.body) ;

    if(data.error) return res.status(400).json({
        message : "Validation failed" ,
        errrors : data.error ,
    })

    if( data.success ){
        req.body = data.data ;
        next() ;
    }

}

export default validate;
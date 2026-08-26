import { type Request , type Response , type NextFunction  } from "express";
import { hashSessionToken } from "../utils/auth/auth.utils.js";
import { prisma } from "@repo/database/prisma";



export async function authenticate(req : Request , res : Response , next : NextFunction ){
    const sessionToken = req.cookies.session ;
    if(!sessionToken )return res.status(401).json({
        message : "Authencation required"
    })

    const tokenHash = hashSessionToken(sessionToken) ;
    const session = await prisma.session.findUnique({
        where:{
            tokenHash : tokenHash 
        }, 
        include : {
            user : true 
        }
    })

    if(!session ){
        return res.status(401).json({
            message : "Invalid session"
        })
    }

    if (session.expiresAt < new Date()) {
      await prisma.session.delete({
        where: {
          id: session.id,
        },
      });

      res.clearCookie("session");

      return res.status(401).json({
        message: "Session expired",
      });
    }
    // console.log(req.body)
    req.user = session.user ;

    next() ;
}

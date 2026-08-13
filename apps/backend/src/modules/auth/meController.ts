import { type Request , type Response  } from "express";
import { hashSessionToken } from "../../utils/auth/auth.utils.js";
import { prisma } from "@repo/database/prisma";
import { json } from "zod";
export async function meController(req : Request , res : Response ){
    try{
        const sessionToken = "aca90c9d591a21cf9ad2785f243e4d44fd26bd8b73701be0d4d7914dae6cf1a7" ;
        if(!sessionToken ){
            return res.status(401).json({
                message : "Not authencated",
            })
        }

        const tokenHash = hashSessionToken(sessionToken);
        const session = await prisma.session.findUnique({
            where :{
                tokenHash : tokenHash
            } ,
            include:{
                user : true 
            }
        })

        if(!session ) return res.status(401).json({
            message : "Invalid session" 
        })

        if(session.expiresAt < new Date() ){
            await prisma.session.delete({
                where :{
                    id : session.id ,
                }
            })
            res.clearCookie("session");
            return res.status(401).json({
                message : "Session expired"
            })
        }

        return res.status(200).json({
            user : session.user 
        })


    }catch(e){
        return res.status(500).json({
            message : "failed"
        })
    }
}

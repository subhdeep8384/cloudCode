import { type Request, type Response } from "express";
import { authorizationCodeGrant } from "openid-client";
import { googleConfig } from "./configs/google.config.js";
import { prisma } from "@repo/database/prisma"
import { generateSessionToken, hashSessionToken } from "../../utils/auth/auth.utils.js";

export async function googleCallbackController(req: Request, res: Response) {
  try {
    const currentUrl = new URL(
      `${process.env.BASE_URL}${req.originalUrl}`
    );

    const state = req.cookies.oauth_state;
    const codeVerifier = req.cookies.oauth_code_verifier;

    if (!state || !codeVerifier) {
      return res.status(400).json({
        message: "Missing OAuth state or code verifier",
      });
    }

    const tokens = await authorizationCodeGrant(
      googleConfig,
      currentUrl,
      {
        pkceCodeVerifier: codeVerifier,
        expectedState: state,
      }
    );

    const claims = await tokens.claims();
    if (!claims) {
      return res.status(400).json({
        message: "Google identity not found"
      })
    }

    const userInfoResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        }
      }
    )

    const userInfo = await userInfoResponse.json();
    const googleId = userInfo.sub;
    const email = userInfo.email;
    const name = userInfo.name;
    const picture = userInfo.picture;
    if (!googleId || !email) {
      return res.status(400).json({
        message: "Invalid Google user information",
      });
    }

    const user = await prisma.user.upsert({
      where :{
        googleId : googleId ,
      } ,
      update :{
        email : email ,
        name : name ,
        picture : picture ,
      } ,
      create:{
        googleId : googleId ,
        email : email ,
        name : name ,
        picture : picture 
      } ,
      select :{
        id : true ,
        name : true ,
        picture : true 
      }
    })

    const sessionToken = generateSessionToken() ;
    const tokenHash = hashSessionToken(sessionToken) ;

    await prisma.session.create({
      data:{
        tokenHash : tokenHash ,
        userId : user.id ,
        expiresAt : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 )
      }
    })

    res.cookie("session" , sessionToken ,{
      httpOnly : true ,
      secure : true ,
      sameSite : "lax" ,
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    })

    res.clearCookie("oauth_state");
    res.clearCookie("oauth_code_verifier");
    return res.redirect(process.env.BASE_URL!);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Google authentication failed",
    });
  }
}
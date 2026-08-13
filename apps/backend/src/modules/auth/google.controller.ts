import { randomBytes, randomUUID } from "crypto";
import { type Request, type Response, type NextFunction } from "express";
import { googleConfig } from "./configs/google.config.js";
import {
  buildAuthorizationUrl,
  randomPKCECodeVerifier,
  calculatePKCECodeChallenge,
} from "openid-client";

export async function googleController(req: Request, res: Response) {
   const state = randomBytes(32).toString("hex");

  const codeVerifier = randomPKCECodeVerifier();
  const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);

  res.cookie("oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  res.cookie("oauth_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  const url = buildAuthorizationUrl(googleConfig, {
    redirect_uri:  `${process.env.GOOGLE_REDIRECT_URI!}` ,
    scope: "openid email profile",
    response_type: "code",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  res.redirect(url.href);

}
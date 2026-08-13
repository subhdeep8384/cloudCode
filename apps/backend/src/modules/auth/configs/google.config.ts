import { discovery } from "openid-client"
import "dotenv/config";

const googleIssuer = new URL("https://accounts.google.com");


export const googleConfig = await discovery(
    googleIssuer ,
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!
)

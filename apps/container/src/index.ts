import express from "express"
import workspaceRouter from "./modules/workspace/workspace.route.js"
const app = express() ;


app.use("/api/workspace" , workspaceRouter)
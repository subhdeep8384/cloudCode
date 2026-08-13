import  express from "express" ;
import workSpaceRouter from "./modules/workspace/workspace.routes.js"
import fileRouter from "./modules/filesystem/file.routes.js"
import authRouter from "./modules/auth/auth.routes.js"
import "dotenv/config";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express() ;

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors()) 
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/" , (req , res )=>{
    res.send("working")
})
app.use("/api/auth" , authRouter) ;
app.use("/api/workspace" , workSpaceRouter) ;
app.use("/api/file" , fileRouter ) ;

const port = process.env.PORT || 3000 ;
app.listen(port , ()=>{
    console.log("Server is running " , port )
})
import fs from "fs" ;
import path from "path" ;

export const copyDirectory = (source : string , destination : string) =>{
    fs.cpSync(source , destination , {
        recursive : true 
    })
}
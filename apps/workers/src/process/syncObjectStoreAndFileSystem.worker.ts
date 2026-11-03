import os from "os"
import cluster from "node:cluster"
import axios from "axios"

export function startObjectSyncWorker(){
    console.log("Object and workspace syncing worker stared")
    try{
        setInterval(async () =>{
            console.log("Syncing server with the object store")
            await axios.post(`http://localhost:3000/api/workspace/active/projects/sync`);
        } , 10000)
    }catch(e){
        console.log(e)
    }
}




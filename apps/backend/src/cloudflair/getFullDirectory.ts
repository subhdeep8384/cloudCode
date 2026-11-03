import { listFiles } from "@repo/cloudflair/r2"
import type { ProjectTypes } from "../types/projectType.js";

export  async function getAllFiles(bucket : string , projectType : ProjectTypes){
    const res = await listFiles(bucket ,projectType.type) ;
    return res;
}
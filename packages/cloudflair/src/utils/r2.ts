import "dotenv/config"
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command
} from "@aws-sdk/client-s3"
import fs from "fs/promises"
import path from "path";


export const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });




export async function uploadFile(bucket : string ,  key : string , content : string | Buffer){
    try{
        const res =  await r2.send(new PutObjectCommand({
            Bucket : bucket ,
            Key : key ,
            Body : content 
        })) ;
        return res ;
    }catch(e){
        console.log(e)
    }
}

// export async function downloadFile(bucket: string , key : string) : Promise<string>{
//     const res = await r2.send(new GetObjectCommand({
//         Bucket:bucket ,
//         Key : key
//     }));
//     return await res.Body!.transformToString() ;
// }

export async function deleteFile(bucket : string , key: string) {
    await r2.send(new DeleteObjectCommand({ Bucket : bucket, Key: key }));
}
  
export async function listFiles(bucket : string , prefix: string): Promise<string[]> {
    const res = await r2.send(new ListObjectsV2Command({ Bucket : bucket, Prefix: prefix }));
    return (res.Contents ?? []).map((o) => o.Key!);
}

export async function downloadFiles(
    bucket: string,
    key: string,
    workspacePath: string
  ) {
    const res = await r2.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
  
    if (!res.Body) {
      throw new Error(`Empty R2 object: ${key}`);
    }
  
    // Remove "react/" from the R2 key
    const relativePath = key.replace(/^react\//, "");
  
    const destinationPath = path.resolve(
      workspacePath,
      relativePath
    );
  
    // Create parent directories
    await fs.mkdir(path.dirname(destinationPath), {
      recursive: true,
    });
  
    await fs.writeFile(
      destinationPath,
      Buffer.from(await res.Body.transformToByteArray())
    );
  
    console.log("Downloaded:", destinationPath);
  }
import axios from "axios"

export const saveFile =async (data : string , workspaceId : string , path : string) =>{
    const abspath = `${import.meta.env.VITE_BACKEND_URL}/api/file/${workspaceId}/?path=${path}`
   const result =await axios.put(abspath ,{
    content : data
   })
   return result.data
}
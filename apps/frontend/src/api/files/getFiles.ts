import axios from "axios" ;

export const getFiles = async (workspaceId :string , path : string) =>{
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/file/${workspaceId}/list?path=${path}`)
    return res.data ;
}

export const getdata = async(workspaceId : string , path : string)=>{
     const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/file/${workspaceId}?path=${path}`)
     return res.data ;
}
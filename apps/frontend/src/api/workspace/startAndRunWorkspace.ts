import axios from "axios";
import { useNavigate } from "react-router-dom";

export async function startAndRunWorkspace(id : string){
    const navigate = useNavigate() ;
    const res =  axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/workspace${id}/start` , {
        withCredentials : true 
    })
}
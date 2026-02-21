import axios from "axios"; 
import useAuth from "./useAuth"; 
import { useNavigate } from "react-router";
import Loader from "../Pages/Shared/Loader/Loadder";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {
    const {user, logOut, loading} = useAuth()

    if(loading) {
        return <Loader/>
    }

    const navigate = useNavigate()
    axiosSecure.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${user.accessToken}`
        return config
    }, error => {
        const status = error.status
        if (status === 403){
            navigate('/forbidden')
        }
        else if(status === 401) {
             logOut()
             .then( () => {
                navigate('/login')
             })
             .catch (() => {})
        }
        return Promise.reject(error)
    }) 
    return axiosSecure
 
};

export default useAxiosSecure;

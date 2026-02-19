import React from 'react';
import useAuth from '../Hooks/useAuth';
import Loadder from "../Pages/Shared/Loader/Loadder";
import useUserRole from '../Hooks/useUserRole';
import { Navigate, useLocation } from 'react-router';

const AdminRoutes = ({ children }) => {
    const {user, loading} = useAuth()
    const location = useLocation();
    const [role, isLoading] = useUserRole()

    if(loading || isLoading){
        return  <Loadder/>;
    }

    if(!user || role !== 'admin'){
        return <Navigate state={{ from: location.pathname }} to={"/forbidden"}></Navigate>
    }
    return children
};

export default AdminRoutes;
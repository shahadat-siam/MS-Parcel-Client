import React from "react";
import useAuth from "../Hooks/useAuth";
import { Navigate, useLocation } from "react-router"; 
import Loadder from "../Pages/Shared/Loader/Loadder";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return  <Loadder/>;
  }

  if (!user) {
    return (
      <Navigate state={{ from: location.pathname }} to={"/login"}></Navigate>
    );
  }
  return children;
};

export default PrivateRoute;

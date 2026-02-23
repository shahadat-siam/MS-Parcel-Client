import React from "react";
import useAuth from "../Hooks/useAuth";
import { useLocation } from "react-router";
import useUserRole from "../Hooks/useUserRole";

const RiderRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { role, loadingRole } = useUserRole();

  if (loading || loadingRole) {
    return <Loadder />;
  }

  if (!user || role !== "rider") {
    return (
      <Navigate state={{ from: location.pathname }} to={"/forbidden"}  ></Navigate>
    );
  }
  return children;
};

export default RiderRoute;

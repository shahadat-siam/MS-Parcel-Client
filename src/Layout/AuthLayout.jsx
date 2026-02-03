import React from "react";
import { Outlet } from "react-router";
import AuthImg from '../assets/authImage.png'
import MsParcelLogo from "../Pages/Shared/MsParcelLogo/MsParcelLogo";

const AuthLayout = () => {
  return (
    <div className=" p-12 bg-base-200 min-h-screen">
        <div>
            <MsParcelLogo/>
        </div>
      <div className="hero-content flex-col lg:flex-row-reverse">
         <div className="flex-1">
            <img
          src={AuthImg}
          className="max-w-sm rounded-lg"
        />
         </div>
        <div className="flex-1 w-full">
          <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

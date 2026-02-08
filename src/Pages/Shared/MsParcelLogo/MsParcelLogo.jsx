import React from "react";
import Logo from "../../../assets/logo.png";
import { Link } from "react-router";

const MsParcelLogo = () => {
  return (
    <Link to={"/"}>
      <div className="flex items-end">
        <img className="mb-2" src={Logo} alt="" />
        <p className="text-3xl -ml-2 font-extrabold">MS Parcel</p>
      </div>
    </Link>
  );
};

export default MsParcelLogo;

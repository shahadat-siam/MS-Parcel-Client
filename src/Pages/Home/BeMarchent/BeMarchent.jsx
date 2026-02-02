import React from "react";
import location from "../../../assets/location-merchant.png";

const BeMarchent = () => {
  return (
    <div className="p-6">
      <div className="hero my-5 bg-[#03373D] rounded-4xl p-20">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img src={location} className="max-w-sm rounded-lg" />
          <div>
            <h1 className="text-4xl text-slate-200 font-bold">
              Merchant and Customer Satisfaction is Our First Priority
            </h1>
            <p className="py-6 text-slate-300">
              We offer the lowest delivery charge with the highest value along
              with 100% safety of your product. Pathao courier delivers your
              parcels in every corner of Bangladesh right on time.
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeMarchent;

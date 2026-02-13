import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import DisplayParcels from "./DisplayParcels";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const MyParcel = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate()
  const { data: parcels = [], refetch } = useQuery({
  queryKey: ["my-parcels", user.email],
  queryFn: async () => {
    const res = await axiosSecure.get(`/parcel?email=${user.email}`);
    return res.data;
  },
});

  const handlePayment = async(id) => {
    navigate(`/dashboard/payment/${id}`)
  }


  const handleDeleteParcel = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This parcel will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/parcels/${id}`);

      if (res.data.deletedCount > 0) {
        Swal.fire(
          "Deleted!",
          "Parcel has been deleted successfully.",
          "success",
        );
        refetch(); // refresh parcel list
      }
    } catch (error) {
      console.error("Delete Parcel Error:", error);
      Swal.fire("Error!", "Failed to delete parcel.", "error");
    }
  };
 
  // console.log(parcels)
  return (
    <div>
      <DisplayParcels parcels={parcels} onPay={handlePayment} onDelete={handleDeleteParcel}/>
    </div>
  );
};

export default MyParcel;

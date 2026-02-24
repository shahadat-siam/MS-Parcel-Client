import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaCheckCircle, FaMoneyBillWave, FaHistory } from "react-icons/fa"; 
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import useAuth from "../../../../Hooks/useAuth";
import Loader from "../../../Shared/Loader/Loadder";
import useUserRole from "../../../../Hooks/useUserRole";

const CompletedDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const {role} = useUserRole()
    console.log(role)
  // 🔹 Fetch completed parcels
  const {
    data: parcels = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["rider-completed-parcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/allparcel/completed?rider_email=${user.email}`
      );
      return res.data;
    },
  });

  // 🔹 Add earning calculation (based on your rule)
  const parcelsWithEarning = useMemo(() => {
    return parcels.map((parcel) => {
      const sameRegion =
        parcel.sender_region?.toLowerCase() ===
        parcel.receiver_region?.toLowerCase();

      const earning = sameRegion
        ? parcel.delivery_cost * 0.8 // 80% same region
        : parcel.delivery_cost * 0.3; // 30% different region

      return {
        ...parcel,
        earning: Number(earning?.toFixed(2) || 0),
      };
    });
  }, [parcels]);

  // 🔹 Total earnings
  const totalEarning = useMemo(() => {
    return parcelsWithEarning.reduce(
      (total, parcel) => total + (parcel.earning || 0),
      0
    );
  }, [parcelsWithEarning]);

  // 🔹 Loading State
  if (isLoading) {
    return <Loader/>
  }

  // 🔹 Error State
  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load completed deliveries
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* 🔹 Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaHistory className="text-blue-600" />
          Completed Deliveries History
        </h2>

        {/* 🔹 Total Earnings Card */}
        <div className="bg-green-100 border border-green-300 rounded-xl px-6 py-3 shadow-sm flex items-center gap-3">
          <FaMoneyBillWave className="text-green-600 text-2xl" />
          <div>
            <p className="text-sm text-gray-600 font-medium">
              Total Rider Earnings
            </p>
            <p className="text-xl font-bold text-green-700">
              ৳ {totalEarning.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* 🔹 Table Section */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="table w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th>#</th>
              <th>Tracking ID</th>
              <th>Parcel Title</th>
              <th>Sender → Receiver</th>
              <th>Region</th>
              <th>Assigned At</th>
              <th>Picked Time</th>
              <th>Delivered Time</th>
              <th>Delivery Cost</th>
              <th>Your Earning</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {parcelsWithEarning.map((parcel, index) => (
              <tr key={parcel._id} className="hover">
                {/* Serial */}
                <td>{index + 1}</td>

                {/* Tracking */}
                <td className="font-semibold text-primary">
                  {parcel.tracking_id}
                </td>

                {/* Title */}
                <td className="font-medium">
                  {parcel.title || parcel.type}
                </td>

                {/* Sender & Receiver */}
                <td>
                  <div className="text-sm">
                    <p className="font-semibold">{parcel.sender_name}</p>
                    <p className="text-gray-500">to {parcel.receiver_name}</p>
                  </div>
                </td>

                {/* Region */}
                <td className="text-sm">
                  {parcel.sender_region} → {parcel.receiver_region}
                </td>

                {/* Assigned Time */}
                <td className="text-sm">
                  {parcel.assigned_at
                    ? new Date(parcel.assigned_at).toLocaleString()
                    : "N/A"}
                </td>

                {/* Picked Time */}
                <td className="text-sm">
                  {parcel.picked_at
                    ? new Date(parcel.picked_at).toLocaleString()
                    : "Not Picked"}
                </td>

                {/* Delivered Time */}
                <td className="text-sm">
                  {parcel.delivered_at
                    ? new Date(parcel.delivered_at).toLocaleString()
                    : "Not Delivered"}
                </td>

                {/* Delivery Cost */}
                <td className="font-medium">
                  ৳ {parcel.delivery_cost}
                </td>

                {/* Earning */}
                <td className="font-bold text-green-600">
                  ৳ {parcel.earning}
                </td>

                {/* Status */}
                <td>
                  <span className="badge badge-success gap-1 capitalize">
                    <FaCheckCircle />
                    {parcel.delivery_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {parcels.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No completed deliveries found
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedDeliveries;
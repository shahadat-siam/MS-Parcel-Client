import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loader from "../../Shared/Loader/Loadder";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // 🔥 FIX 1: must be null (not '')
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔹 Load parcels (paid + not collected)
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/parcel?payment_status=paid&delivery_status=not collected"
      );
      return res.data;
    },
  });

  // 🔹 Load riders based on sender_center → district
  const {
    data: riders = [],
    isLoading: riderLoading,
  } = useQuery({
    queryKey: ["availableriders", selectedParcel?.sender_center],
    enabled: !!selectedParcel?.sender_center, // 🔥 FIX 2 (important)
    queryFn: async () => {
      console.log("Fetching riders for district:", selectedParcel?.sender_center );

      const res = await axiosSecure.get(`/availableriders?district=${selectedParcel.sender_center}`);
      return res.data;
    },
  });

  // 🔹 Assign Rider Mutation
  const assignRiderMutation = useMutation({
    mutationFn: async ({ parcelId, rider }) => {
      const payload = {
        riderId: rider._id,
        rider_name: rider.name,
        rider_email: rider.email,
        delivery_status: "assigned",
      };

      const res = await axiosSecure.patch(`/parcels/assign-rider/${parcelId}`,payload );
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Rider Assigned Successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      setIsModalOpen(false);
      setSelectedParcel(null);
      queryClient.invalidateQueries(["assignableParcels"]);
    },
  });

  const handleOpenModal = (parcel) => {
    console.log("Selected Parcel:", parcel); // debug
    setSelectedParcel(parcel);
    setIsModalOpen(true);
  };

  const handleAssignRider = (rider) => {
    assignRiderMutation.mutate({
      parcelId: selectedParcel._id,
      rider,
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Assign Rider
      </h2>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Parcel ID</th>
              <th>Sender Center</th>
              <th>Receiver</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id} className="hover">
                <td>{index + 1}</td>
                <td className="font-semibold">{parcel._id}</td>

                <td>
                  <span className="badge badge-outline">
                    {parcel.sender_center}
                  </span>
                </td>

                <td>
                  <div>
                    <p className="font-medium">
                      {parcel.receiver_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {parcel.receiver_phone}
                    </p>
                  </div>
                </td>

                <td>
                  <span className="badge badge-success">
                    {parcel.payment_status}
                  </span>
                </td>

                <td>
                  <span className="badge badge-warning capitalize">
                    {parcel.delivery_status}
                  </span>
                </td>

                <td>
                  <button
                    onClick={() => handleOpenModal(parcel)}
                    className="btn btn-sm bg-primary text-slate-900"
                  >
                    Assign Rider
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                Riders in {selectedParcel?.sender_center}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedParcel(null);
                }}
                className="btn btn-sm btn-circle"
              >
                ✕
              </button>
            </div>

            {riderLoading ? (
              <div className="text-center py-10">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : riders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No riders available in this district
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                {riders.map((rider) => (
                  <div
                    key={rider._id}
                    className="border rounded-xl p-4 hover:shadow-md"
                  >
                    <h4 className="font-bold text-lg">
                      {rider.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {rider.email}
                    </p>
                    <p className="text-sm mt-1">
                      District:{" "}
                      <span className="font-semibold">
                        {rider.district}
                      </span>
                    </p>
                    <p className="text-sm mt-1">
                      Phone:{" "}
                      <span className="font-semibold">
                        {rider.phone}
                      </span>
                    </p>

                    <button
                      onClick={() => handleAssignRider(rider)}
                      className="btn btn-sm bg-green-600 text-white w-full mt-3"
                    >
                      Confirm Assign
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
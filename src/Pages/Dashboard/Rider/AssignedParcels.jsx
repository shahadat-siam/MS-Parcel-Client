import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2"; 
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Loader from "../../Shared/Loader/Loadder";
import useTrackingLogger from "../../../Hooks/useTrackingLogger";

const AssignedParcels = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const {logTracking} = useTrackingLogger()

  // ✅ Fetch rider pending parcels
  const {
    data: parcels = [],
    isLoading,
  } = useQuery({
    queryKey: ["riderPendingParcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/allparcel/assigned?rider_email=${user.email}`
      );
      return res.data;
    },
  });
  console.log(parcels)

  // ✅ Mutation for updating status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, parcel}) => {
      const res = await axiosSecure.patch(
        `/parcelride/${id}/status`,
        { status }
      );
        // 2️⃣ Send tracking log using IF condition (your requirement)
    if (status === "in-transit") {
      await logTracking({ 
        tracking_id: parcel?.tracking_id,  
        status: "picked-up",
        location: parcel?.sender_center 
      });
    }

    if (status === "delivered") {
      await logTracking({  
        tracking_id: parcel?.tracking_id,  
        status: "delivered",
        location: parcel?.sender_center 
      });
    }

      return res.data;
    },
    onSuccess: () => {
      // 🔥 FIX: Must include same query key
      queryClient.invalidateQueries({
        queryKey: ["riderPendingParcels", user?.email],
      });
    },
    onError: () => {
      Swal.fire("Error!", "Failed to update parcel status", "error");
    },
  });

  const handlePickedUp = (id, parcel) => {
    updateStatusMutation.mutate(
      { id, status: "in-transit", parcel },
      {
        onSuccess: () => {
          Swal.fire("Success!", "Parcel marked as On Transit", "success");
        },
      }
    );
  };

  const handleDelivered = (id, parcel) => {
    updateStatusMutation.mutate(
      { id, status: "delivered", parcel },
      {
        onSuccess: () => {
          Swal.fire("Delivered!", "Parcel successfully delivered", "success");
        },
      }
    );
  };

  if (isLoading) return <Loader text='assign parcel' />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        Pending Deliveries ({parcels.length})
      </h2>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Tracking ID</th>
              <th>Receiver</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Cost</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>
                <td>{parcel.tracking_id}</td>
                <td>{parcel.receiver_name}</td>
                <td>{parcel.receiver_contact}</td>
                <td>
                  {parcel.receiver_region}, {parcel.receiver_center}
                </td>
                <td>৳ {parcel.delivery_cost}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      parcel.delivery_status === "rider-assigned"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {parcel.delivery_status}
                  </span>
                </td>
                <td>
                  {parcel.delivery_status === "rider_assigned"  && (
                    <button
                      onClick={() => handlePickedUp(parcel._id, parcel)} 
                      className="bg-primary  text-slate-800 cursor-pointer px-3 py-1 rounded"
                    >
                      Picked Up
                    </button>
                  )}

                  {parcel.delivery_status === "in-transit" && (
                    <button
                      onClick={() => handleDelivered(parcel._id, parcel)}
                      className="bg-primary text-slate-800 cursor-pointer px-3 py-1 rounded"
                    >
                      Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {parcels.length === 0 && (
          <p className="text-center py-6 text-gray-500">
            No pending deliveries found.
          </p>
        )}
      </div>
    </div>
  );
};

export default AssignedParcels;
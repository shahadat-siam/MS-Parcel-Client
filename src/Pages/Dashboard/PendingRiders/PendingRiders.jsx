import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../Hooks/useAxios";
import Loader from "../../Shared/Loader/Loadder";
import useAuth from "../../../Hooks/useAuth";

const PendingRider = () => {
  const [selectedRider, setSelectedRider] = useState(null);
  const queryClient = useQueryClient();
  const {user , loading} = useAuth()
  const axiosSecure = useAxios();

  // 🔹 Fetch Pending Riders
  const { data: riders = [], isLoading } = useQuery({
    queryKey: ["riders-pending"],
    enabled: !loading && !!user, 
    queryFn: async () => {
      const res = await axiosSecure.get("/riders?status=pending");
      return res.data;
    },
  });

  // 🔹 Single Status Mutation (Approve / Reject)
  const statusMutation = useMutation({
    mutationFn: async ({ id, status, email }) => {
      const res = await axiosSecure.patch(`/riders/status/${id}`, {
        status, email
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["riders-pending"]);
      setSelectedRider(null);
      // console.log('on success',riders)
    },
    onError: (error) => {
    console.log("Mutation Error:", error);
    alert("Something went wrong!");
  },
  });
   
console.log('on success',riders)
  if (isLoading) {
    return <Loader text="Pending Riders" />;
  } 
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Riders</h2>

      {/* 🔹 Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Region</th>
              <th>District</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {riders.map((rider, index) => (
              <tr key={rider._id}>
                <td>{index + 1}</td>
                <td>{rider.name}</td>
                <td>{rider.email}</td>
                <td>{rider.region}</td>
                <td>{rider.district}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary text-black"
                    onClick={() => setSelectedRider(rider)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Modal */}
      {selectedRider && (
        <div className="fixed inset-0 bg-[#161616be] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[420px] p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Rider Details</h3>

             <div className="space-y-2 text-sm">
              <p><b>Name:</b> {selectedRider.name}</p>
              <p><b>Email:</b> {selectedRider.email}</p>
              <p><b>Phone:</b> {selectedRider.phone}</p>
              <p><b>Region:</b> {selectedRider.region}</p>
              <p><b>District:</b> {selectedRider.district}</p>
              <p><b>Bike Number:</b> {selectedRider.bikeNumber}</p>
              <p><b>NID:</b> {selectedRider.nid}</p>
              <p><b>DOB:</b> {selectedRider.dob}</p>
              <p>
                <b>Joined:</b>{" "}
                {new Date(selectedRider.create_at).toLocaleDateString()}
              </p>
              <p><b>Status:</b> {selectedRider.status}</p>
            </div>

            {/* 🔹 Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="btn btn-sm"
                onClick={() => setSelectedRider(null)}
              >
                Close
              </button>

              <button
                className="btn btn-sm btn-error"
                disabled={statusMutation.isPending}
                onClick={() =>
                  statusMutation.mutate({
                    id: selectedRider._id,
                    status: "rejected",
                    email: selectedRider.email
                  })
                }
              >
                Reject
              </button>

              <button
                className="btn btn-sm btn-success"
                disabled={statusMutation.isPending}
                onClick={() =>
                  statusMutation.mutate({
                    id: selectedRider._id,
                    status: "approved",
                    email: selectedRider.email
                  })
                }
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRider;

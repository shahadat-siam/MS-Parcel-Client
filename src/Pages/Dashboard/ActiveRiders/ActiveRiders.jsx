import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../Hooks/useAxios";
import Loader from "../../Shared/Loader/Loadder";

const ActiveRiders = () => {
  const [search, setSearch] = useState("");
  const [selectedRider, setSelectedRider] = useState(null);

  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  // ✅ Fetch Active Riders
  const { data: riders = [], isLoading } = useQuery({
    queryKey: ["riders-active"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders?status=approved");
      return res.data;
    },
  });

  // ✅ Fire Rider Mutation
  const fireMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/riders/status/${id}`, {
        status: "fired",
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["riders-active"]);
      setSelectedRider(null);
    },
  });

  // ✅ Search Filter (Client Side)
  const filteredRiders = useMemo(() => {
    return riders.filter((rider) =>
      rider.name.toLowerCase().includes(search.toLowerCase()) ||
      rider.phone.includes(search)
    );
  }, [riders, search]);

  if (isLoading) {
    return <Loader text="Active Riders" />;
  }
//   console.log('active riders', riders)

  return (
    <div className="p-6">

      {/* 🔹 Header + Search */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Active Riders</h2>

        <input
          type="text"
          placeholder="Search by name or phone"
          className="input outline-none input-bordered input-sm w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🔹 Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Bike No</th>
              <th>District</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRiders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No Active Riders Found
                </td>
              </tr>
            ) : (
              filteredRiders.map((rider, index) => (
                <tr key={rider._id}>
                  <td>{index + 1}</td>
                  <td>{rider.name}</td>
                  <td>{rider.phone}</td>
                  <td>{rider.bikeNumber}</td>
                  <td>{rider.district}</td>
                  <td>
                    <button
                      className="btn btn-sm bg-primary text-slate-800  "
                      onClick={() => setSelectedRider(rider)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Details Modal */}
      {selectedRider && (
        <div className="fixed inset-0 bg-[#3b3737d2] bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[450px] p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Rider Information</h3>

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

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="btn btn-sm"
                onClick={() => setSelectedRider(null)}
              >
                Close
              </button>

              <button
                className="btn btn-sm btn-error"
                disabled={fireMutation.isPending}
                onClick={() => {
                  const confirmFire = window.confirm(
                    "Are you sure you want to fire this rider?"
                  );
                  if (confirmFire) {
                    fireMutation.mutate(selectedRider._id);
                  }
                }}
              >
                {fireMutation.isPending ? "Processing..." : "Fire Rider"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveRiders;

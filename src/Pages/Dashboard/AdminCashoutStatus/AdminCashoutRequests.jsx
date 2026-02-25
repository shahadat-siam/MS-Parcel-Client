import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const AdminCashoutRequests = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("pending");

  // 🔎 Fetch Cashouts
  const { data: cashouts = [], isLoading } = useQuery({
    queryKey: ["admin-cashouts", statusFilter],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/admin/cashouts?status=${statusFilter}`
      );
      return res.data;
    },
  });

  // 🔁 Common Mutation (Approve/Reject)
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/admin/cashouts/${id}`, {
        status,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-cashouts"]);
      queryClient.invalidateQueries(["rider-earnings-summary"]);
    },
  });

  // 🧠 Handle Action with Swal
  const handleAction = async (cashout, actionType) => {
    const actionText = actionType === "approved" ? "Approve" : "Reject";

    const result = await Swal.fire({
      title: `${actionText} Cashout Request?`,
      html: `
        <div style="text-align:left">
          <p><strong>Rider:</strong> ${cashout.rider_email}</p>
          <p><strong>Amount:</strong> ৳ ${cashout.amount}</p>
          <p><strong>Status:</strong> ${cashout.status}</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: actionType === "approved" ? "#16a34a" : "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${actionText}`,
    });

    if (result.isConfirmed) {
      try {
        await updateStatusMutation.mutateAsync({
          id: cashout._id,
          status: actionType,
        });

        Swal.fire({
          icon: "success",
          title: `Cashout ${actionText}d!`,
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire("Error!", "Failed to update status", "error");
      }
    }
  };

  if (isLoading) {
    return <p className="p-6">Loading cashout requests...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* 🔥 Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          💰 Cashout Request Management
        </h2>

        {/* Filter */}
        <select
          className="select select-bordered"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="all">All</option>
        </select>
      </div>

      {/* 📊 Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border">
        <table className="table">
          <thead className="bg-gray-100">
            <tr>
              <th>Rider Email</th>
              <th>Amount (৳)</th>
              <th>Requested Date</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {cashouts.map((cashout) => (
              <tr key={cashout._id}>
                <td className="font-medium">
                  {cashout.rider_email}
                </td>

                <td className="font-bold text-green-600">
                  ৳ {cashout.amount}
                </td>

                <td>
                  {new Date(
                    cashout.requested_at
                  ).toLocaleString()}
                </td>

                {/* Status Badge */}
                <td>
                  <span
                    className={`badge ${
                      cashout.status === "pending"
                        ? "badge-warning"
                        : cashout.status === "approved"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {cashout.status}
                  </span>
                </td>

                {/* Action Buttons */}
                <td className="text-center space-x-2">
                  {cashout.status === "pending" ? (
                    <>
                      <button
                        onClick={() =>
                          handleAction(cashout, "approved")
                        }
                        className="btn btn-sm btn-success"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          handleAction(cashout, "rejected")
                        }
                        className="btn btn-sm btn-error"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      Processed
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {cashouts.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  No cashout requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCashoutRequests;
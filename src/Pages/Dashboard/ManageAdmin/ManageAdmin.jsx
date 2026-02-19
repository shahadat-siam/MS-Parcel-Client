import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useUserRole from "../../../Hooks/useUserRole";

const ManageAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [role] = useUserRole() 
  const {
    data: users = [],
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["users", search],
    enabled: false,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/search?email=${search}`);
      return res.data;
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) =>
      axiosSecure.patch(`/users/role/${id}`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      Swal.fire({
        icon: "success",
        title: "Role updated",
        timer: 1200,
        showConfirmButton: false,
      });
    }, 
  }); 

  const handleRoleChange = (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";

    Swal.fire({
      title: "Are you sure?",
      text: `Change role to ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        roleMutation.mutate({ id: user._id, role: newRole });
        refetch()
      }
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Admin</h2>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by email"
          className="input outline-none input-bordered w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => refetch()}
          className="btn text-black btn-primary"
        >
          Search
        </button>
      </div>

      {isFetching && <p>Loading...</p>}

      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Email</th>
            <th>Created At</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>
                {user.create_at
                  ? new Date(user.create_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })
                  : 'N/A'}
              </td>
              <td className="capitalize">{user.role || "user"}</td>
              <td>
                <button
                  onClick={() => handleRoleChange(user)}
                  className={`btn btn-sm ${
                    user.role === "admin" ? "btn-error" : "btn-success"
                  }`}
                  disabled={roleMutation.isLoading}
                >
                  {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageAdmin;

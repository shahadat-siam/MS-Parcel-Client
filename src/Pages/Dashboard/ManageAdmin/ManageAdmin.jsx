import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query"; 
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import Loader from "../../Shared/Loader/Loadder";

const ManageAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [searchText, setSearchText] = useState("");
  const [emailQuery, setEmailQuery] = useState("");

  // 🔍 Search Users
  const {
    data: users = [],
    isLoading,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["searchUsers", emailQuery],
    enabled: !!emailQuery,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users/search?email=${emailQuery}`
      );
      return res.data;
    },
  });
 

  // 🛡️ Role Update Mutation (Admin/User)
  const roleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      const res = await axiosSecure.patch(`/users/role/${id}`, { role });
      return res.data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setEmailQuery(searchText.trim());
  };

  const handleMakeAdmin = (id) => { 
    Swal.fire({
      title: "Are you sure?",
      text: `Change role to Admin?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        roleMutation.mutate({ id , role: 'admin' });
        refetch()
      }
    });
    // roleMutation.mutate({ id, role: "admin" });
  };

  const handleRemoveAdmin = (id) => { 
    Swal.fire({
      title: "Are you sure?",
      text: `Change role to User?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        roleMutation.mutate({ id , role: 'user' });
        refetch()
      }
    });
    // roleMutation.mutate({ id, role: "user" });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-5">Manage Admin</h2>

      {/* 🔎 Search Form */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search user by email (partial)..."
          className="border outline-none w-full p-2 rounded-lg"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          type="submit"
          className="bg-primary text-slate-800 px-5 py-2 rounded-lg"
        >
          Search
        </button>
      </form>

      {/* ⏳ Loading */}
      {isLoading && <p className="text-blue-500">Searching users...</p>}

      {/* ❌ Error */}
      {isError && (
        <p className="text-red-500">No user found or server error</p>
      )}

      {/* 📊 Table */}
      {users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Last Login</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="font-medium">{user.email}</td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded text-white text-sm ${
                        user.role === "admin"
                          ? "bg-green-600"
                          : "bg-gray-500"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td>
                    {new Date(user.create_at).toLocaleString()}
                  </td>

                  <td>
                    {user.last_login
                      ? new Date(user.last_login).toLocaleString()
                      : "N/A"}
                  </td>

                  <td className="flex gap-2">
                    {user.role !== "admin" ? (
                      <button
                        onClick={() => handleMakeAdmin(user._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                        disabled={roleMutation.isPending}
                      >
                        Make Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRemoveAdmin(user._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        disabled={roleMutation.isPending}
                      >
                        Remove Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔍 Empty State */}
      {!isLoading && emailQuery && users.length === 0 && (
        <p className="text-gray-500 text-center mt-4">
          No users matched your search.
        </p>
      )}
    </div>
  );
};

export default ManageAdmin;
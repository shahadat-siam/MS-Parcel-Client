import useAuth from "../../../Hooks/useAuth";

const MyProfile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex justify-center items-center bg-gray-50 p-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-6">
          {/* Avatar */}
          <div className="avatar">
            <div className="w-28 h-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
              <img
                src={user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                alt="User Avatar"
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">
              {user?.displayName || "No Name Provided"}
            </h2> 
            <span className="inline-block mt-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
              Active User
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Email */}
          <div className="bg-gray-100 rounded-xl p-4">
            <p className="text-sm text-gray-500">Email</p>
            <h3 className="font-semibold text-gray-800">
              {user?.email || "Not Available"}
            </h3>
          </div>

          {/* Display Name */}
          <div className="bg-gray-100 rounded-xl p-4">
            <p className="text-sm text-gray-500">Full Name</p>
            <h3 className="font-semibold text-gray-800">
              {user?.displayName || "Not Available"}
            </h3>
          </div>

          {/* UID */}
          <div className="bg-gray-100 rounded-xl p-4">
            <p className="text-sm text-gray-500">User ID</p>
            <h3 className="font-semibold text-gray-800 break-all">
              {user?.uid || "Not Available"}
            </h3>
          </div>

          {/* Email Verified */}
          <div className="bg-gray-100 rounded-xl p-4">
            <p className="text-sm text-gray-500">Email Verified</p>
            <h3
              className={`font-semibold ${
                user?.emailVerified ? "text-green-600" : "text-red-500"
              }`}
            >
              {user?.emailVerified ? "Verified" : "Not Verified"}
            </h3>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end">
          <button className="px-5 py-2 rounded-lg bg-primary text-slate-800 cursor-pointer font-medium hover:opacity-90 transition">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

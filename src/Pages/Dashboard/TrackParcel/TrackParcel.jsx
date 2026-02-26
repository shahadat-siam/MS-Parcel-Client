import { useState } from "react";
import { useQuery } from "@tanstack/react-query"; 
import Loader from "../../Shared/Loader/Loadder";
import useAxios from "../../../Hooks/useAxios";

const TrackParcel = () => {
  const [trackingId, setTrackingId] = useState("");
  const [searchId, setSearchId] = useState("");
  const axiosInstance = useAxios()

  const {
    data: logs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["trackingLogs", searchId],
    enabled: !!searchId,
    queryFn: async () => {
      const res = await axiosInstance.get(`/tracking/${searchId}` );
      return res.data;
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchId(trackingId.trim());
  };

  // 🎨 Status Color Mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "parcel-created":
        return "bg-gray-500";
      case "payment-completed":
        return "bg-indigo-500";
      case "rider-assigned":
        return "bg-yellow-500";
      case "picked-up":
        return "bg-blue-500";
      case "in-transit":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-600";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Track Your Parcel
      </h2>

      {/* 🔍 Search Box */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Enter Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="border p-3 w-full rounded-lg"
          required
        />
        <button
          type="submit"
          className="bg-primary text-slate-800 px-6 rounded-lg"
        >
          Track
        </button>
      </form>

      {/* ⏳ Loading */}
      {isLoading && <Loader text="Tracking parcel..." />}

      {/* ❌ Error */}
      {isError && (
        <p className="text-red-500 text-center">
          Failed to load tracking information.
        </p>
      )}

      {/* 📦 Timeline */}
      {logs.length > 0 && (
        <div className="relative border-l-4 border-gray-200 pl-6">
          {logs.map((log, index) => (
            <div key={log._id} className="mb-8 relative">
              {/* Circle */}
              <div
                className={`absolute -left-3 top-1 w-6 h-6 rounded-full ${getStatusColor(
                  log.status
                )}`}
              ></div>

              {/* Content */}
              <div className="bg-white shadow-md p-4 rounded-xl">
                <h4 className="font-semibold capitalize">
                  {log.status.replace("-", " ")}
                </h4>

                <p className="text-sm text-gray-600">
                  Location: {log.location}
                </p>

                <p className="text-sm text-gray-600">
                  Updated By: {log.updated_by}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                   {log.createdAt ? new Date(log.createdAt).toLocaleString()  // converts ISO string to readable date
                    : "No date"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 📭 No Data */}
      {searchId && logs.length === 0 && !isLoading && (
        <p className="text-center text-gray-500">
          No tracking information found.
        </p>
      )}
    </div>
  );
};

export default TrackParcel;
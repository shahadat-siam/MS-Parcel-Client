import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
// import useAxiosPublic from "../../Hooks/useAxiosPublic"; 
import useAxios from "../../../Hooks/useAxios";

const TrackParcel = () => {
  const { trackingId: urlTrackingId } = useParams();
  console.log('Tracking id',urlTrackingId)
  const navigate = useNavigate();
  const axiosInstant = useAxios();

  const [trackingId, setTrackingId] = useState(urlTrackingId || "");

  const { data: updates = [], isLoading, refetch } = useQuery({
    queryKey: ["tracking", trackingId],
    enabled: !!trackingId,
    queryFn: async () => {
      const res = await axiosInstant.get(`/tracking/${trackingId}`);
      return res.data;
    }
  });

  const handleSearch = () => {
    if (!trackingId) return;
    navigate(`/track/${trackingId}`);
    refetch();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h2 className="text-2xl font-bold mb-6">Track Your Parcel</h2>

      {/* Search Box */}
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Enter Tracking ID"
          className="input input-bordered w-full"
        />
        <button
          onClick={handleSearch}
          className="btn btn-primary"
        >
          Track
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center">
          <span className="loading loading-spinner"></span>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {updates.map((item, index) => (
          <div key={index} className="border-l-4 border-primary pl-4 py-2">
            <h4 className="font-semibold">{item.status}</h4>
            <p className="text-sm text-gray-500">{item.location}</p>
            <p className="text-xs">
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default TrackParcel;

import { useCallback } from "react";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useTrackingLogger = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const logTracking = useCallback(
    async ({
      tracking_id,
      status, 
      location,  
    }) => {
      try {
        if (!tracking_id || !status) return;

        await axiosSecure.post("/tracking/log", {
          tracking_id,
          status, 
          location, 
          updated_by: user?.displayName,
          updated_by_email: user?.email || null,
        });
      } catch (error) {
        console.error("Tracking Log Failed:", error);
      }
    },
    [axiosSecure, user]
  );

  return { logTracking };
};

export default useTrackingLogger;
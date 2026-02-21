import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";
import Loader from "../Pages/Shared/Loader/Loadder";

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  if(authLoading) {
    return <Loader/>
  }

  const { data: role, isLoading: roleLoading, refetch } = useQuery({
    queryKey: ["userRole", user?.email], // 🔥 CRITICAL
    enabled: !authLoading && !!user.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      return res.data.role;
    },
  });

  return {role, loadingRole: authLoading || roleLoading, refetch};
};

export default useUserRole;

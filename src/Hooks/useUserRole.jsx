import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: role, isLoading: roleLoading, refetch } = useQuery({
    queryKey: ["userRole", user?.email], // 🔥 CRITICAL
    enabled: !authLoading && !!user.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      return res.data.role;
    },
  });

  return {role, loading: authLoading || roleLoading, refetch};
};

export default useUserRole;

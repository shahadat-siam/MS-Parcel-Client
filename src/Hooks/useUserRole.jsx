import { useQuery } from '@tanstack/react-query'; 
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useUserRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: role, isLoading, refetch } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get('/users/role'); 
      return res.data.role;
    },
    staleTime: 0, // optional but good for role
  });

  // ✅ log here, not inside queryFn
  console.log('role from user role auth:', role);

  return [role, isLoading, refetch];
};

export default useUserRole;

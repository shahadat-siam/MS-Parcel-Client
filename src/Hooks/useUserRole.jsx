import { useQuery } from '@tanstack/react-query'; 
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useUserRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: role, isLoading } = useQuery({
    queryKey: ['userRole'],
    enabled: !loading && !!user,
    queryFn: async () => {
      const res = await axiosSecure.get('/users/role');
      return res.data.role;
    }
  });

  return [role, isLoading];
};

export default useUserRole;

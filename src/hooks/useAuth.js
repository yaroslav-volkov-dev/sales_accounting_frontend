import { notify } from '../utils/notify.js';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ENDPOINTS } from '../api/endpoints.js';
import { axiosInstance } from '../api/axiosConfig.js';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  const { data: userData, isLoading: isUserDataLoading } = useQuery({
    queryKey: [ENDPOINTS.AUTH_ME],
    queryFn: () => {
      if (!token) throw new Error('No token found');

      return axiosInstance.get(ENDPOINTS.AUTH_ME);
    },
    enabled: !!token,
  });

  console.log(userData);

  const { mutate: login } = useMutation({
    mutationFn: (userData) => axiosInstance.post(ENDPOINTS.LOGIN, userData),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.invalidateQueries([ENDPOINTS.AUTH_ME]);
      notify({ message: 'Successfully logged in' });
    },
  });

  const { mutate: registration } = useMutation({
    mutationFn: (userData) => axiosInstance.post(ENDPOINTS.REGISTER, userData),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.invalidateQueries([ENDPOINTS.AUTH_ME]);
      notify({ message: 'Successfully registered' });
    }
  });


  return {
    isAuth: !!token,
    login,
    registration,
    userData,
    isUserDataLoading,
    logout: () => null
  };
};
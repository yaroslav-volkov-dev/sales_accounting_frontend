import { notify } from '../utils/notify.js';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ENDPOINTS } from '../constants/endpoints.js';
import { axiosInstance } from '../api/axiosConfig.js';
import { LOCAL_STORAGE_KEY } from '../constants/localStorageKeys.js';
import { useCallback } from 'react';

const queryKey = {
  auth: ['auth']
}

export const useAuth = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.TOKEN);

  const { data: userData, isLoading: isUserDataLoading } = useQuery({
    queryKey: [queryKey.auth],
    queryFn: () => {
      if (!token) throw new Error('No token found');

      return axiosInstance.get(ENDPOINTS.AUTH_ME);
    },
    enabled: !!token,
  });

  const { mutate: login } = useMutation({
    mutationFn: (userData) => axiosInstance.post(ENDPOINTS.LOGIN, userData),
    onSuccess: (data) => {
      localStorage.setItem(LOCAL_STORAGE_KEY.TOKEN, data.token);
      queryClient.invalidateQueries([queryKey.auth]);
      notify({ message: 'Successfully logged in' });
    },
  });

  const { mutate: registration } = useMutation({
    mutationFn: (userData) => axiosInstance.post(ENDPOINTS.REGISTER, userData),
    onSuccess: (data) => {
      localStorage.setItem(LOCAL_STORAGE_KEY.TOKEN, data.token);
      queryClient.invalidateQueries([queryKey.auth]);
      notify({ message: 'Successfully registered' });
    }
  });

  const logout = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY.TOKEN)
    queryClient.invalidateQueries([queryKey.auth])
    notify({ message: 'Successfully logged out' })
  }, [])


  return {
    isAuth: !!token,
    login,
    registration,
    userData,
    isUserDataLoading,
    logout
  };
};
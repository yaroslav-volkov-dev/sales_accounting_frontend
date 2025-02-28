import { notify } from '../utils/notify.js';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ENDPOINTS } from '../constants/endpoints.js';
import { axiosInstance } from '../api/axiosConfig.js';
import { LOCAL_STORAGE_KEY } from '../constants/localStorageKeys.js';

const queryKey = {
  auth: ['auth']
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);

  const { data: userData, isLoading: isUserDataLoading } = useQuery({
    queryKey: [queryKey.auth],
    queryFn: () => axiosInstance.post(ENDPOINTS.REFRESH_SESSION),
    onSuccess: (response) => {
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY.ACCESS_TOKEN,
        response.session.access_token
      );
    },
    onError: () => {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    },
    enabled: !!token,
  });

  const { mutate: login } = useMutation({
    mutationFn: (userData) => axiosInstance.post(ENDPOINTS.LOGIN, userData),
    onSuccess: (data) => {
      localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, data.access_token);
      queryClient.invalidateQueries([queryKey.auth]);
      notify({ message: 'Successfully logged in' });
    },
  });

  const { mutate: registration } = useMutation({
    mutationFn: (userData) => axiosInstance.post(ENDPOINTS.REGISTER, userData),
    onSuccess: (data) => {
      localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, data.access_token);
      queryClient.invalidateQueries([queryKey.auth]);
      notify({ message: 'Successfully registered' });
    }
  });

  const { mutate: refreshSession } = useMutation({
    mutationFn: () => axiosInstance.post(ENDPOINTS.REFRESH_SESSION, {}, { withCredentials: true }),
    onSuccess: (data) => {
      localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, data.access_token);
      queryClient.invalidateQueries([queryKey.auth]);
    },
    onError: () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
      notify({ message: 'Something went wrong, cannot refresh the session' });
    }
  });

  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post(ENDPOINTS.LOGOUT),
    onSuccess: () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
      notify({ message: 'Successfully logged out' });
    },
    onError: () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
      notify({ message: 'Something went wrong, cannot logout' });
    },
  });

  return {
    isAuth: !!token,
    login,
    registration,
    userData,
    isUserDataLoading,
    logout,
    refreshSession
  };
};
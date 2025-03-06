import { notify } from '../utils/notify.ts';
import { DefaultError, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ENDPOINTS } from '../constants/endpoints.ts';
import { axiosInstance } from '../api/axiosConfig.ts';
import { LOCAL_STORAGE_KEY } from '../constants/localStorageKeys.ts';
import { LoginRequest, LoginResponse, RefreshSessionResponse, RegistrationResponse } from "@/types/auth.types.ts";

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

  const { mutate: login, isPending: isLoginLoading } = useMutation<LoginResponse, DefaultError, LoginRequest>({
    mutationFn: (userData) => axiosInstance.post(ENDPOINTS.LOGIN, userData),
    onSuccess: (data) => {
      localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, data.access_token);
      queryClient.invalidateQueries({ queryKey: [queryKey.auth] });
      notify({ message: 'Successfully logged in' });
    },
  });

  const { mutate: registration } = useMutation<RegistrationResponse>({
    mutationFn: (userData) => axiosInstance.post(ENDPOINTS.REGISTER, userData),
    onSuccess: (data) => {
      localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, data.access_token);
      queryClient.invalidateQueries({ queryKey: [queryKey.auth] });
      notify({ message: 'Successfully registered' });
    }
  });

  const { mutate: refreshSession } = useMutation<RefreshSessionResponse>({
    mutationFn: () => axiosInstance.post(ENDPOINTS.REFRESH_SESSION, {}, { withCredentials: true }),
    onSuccess: (data) => {
      localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, data.access_token);
      queryClient.invalidateQueries({ queryKey: [queryKey.auth] });
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
    refreshSession,
    isLoginLoading
  };
};
import { DefaultError, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ENDPOINTS } from '../constants/endpoints.ts';
import { axiosInstance } from '../api/axios-config.ts';
import { LOCAL_STORAGE_KEY } from '../constants/local-storage-keys.ts';
import { LoginRequest, LoginResponse, RefreshSessionResponse, RegistrationResponse } from "@/types/auth.types.ts";
import { UserModel } from "@/models";
import { notify } from "@/lib/notify.ts";
import { useNavigate } from "react-router-dom";

const authQueryKey = {
  all: ['auth']
};

export const useAuth = () => {
  const client = useQueryClient();
  const navigate = useNavigate();

  const token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);

  const { data: userData, isLoading: isUserDataLoading } = useQuery({
    queryKey: authQueryKey.all,
    queryFn: async () => {
      const response = await axiosInstance.post<UserModel>(ENDPOINTS.REFRESH_SESSION);
      const access_token = response?.data?.session?.access_token;

      if (!token) return;

      window.localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, access_token);

      return response;
    },

    enabled: !!token,
    select: (response) => response?.data
  });

  const { mutate: login, isPending: isLoginLoading } = useMutation<LoginResponse, DefaultError, LoginRequest>({
    mutationFn: (userData) => axiosInstance.post(ENDPOINTS.LOGIN, userData),
    onSuccess: (data) => {
      localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, data.access_token);
      client.invalidateQueries({ queryKey: authQueryKey.all });
      navigate('/shift-view');
      notify({ message: 'Successfully logged in' });
    },
  });

  const { mutate: registration } = useMutation<RegistrationResponse>({
    mutationFn: (userData) => axiosInstance.post(ENDPOINTS.REGISTER, userData),
    onSuccess: (data) => {
      localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, data.access_token);
      client.invalidateQueries({ queryKey: authQueryKey.all });
      notify({ message: 'Successfully registered' });
    }
  });

  const { mutate: refreshSession } = useMutation<RefreshSessionResponse>({
    mutationFn: () => axiosInstance.post(ENDPOINTS.REFRESH_SESSION, {}, { withCredentials: true }),
    onSuccess: (data) => {
      localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, data.access_token);
      client.invalidateQueries({ queryKey: authQueryKey.all });
    },
    onError: () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
      notify({ message: 'Something went wrong, cannot refresh the session' });
    }
  });

  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post(ENDPOINTS.LOGOUT),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: authQueryKey.all });
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
import axios from 'axios';
import { LOCAL_STORAGE_KEY } from '../constants/local-storage-keys.ts';

// export const BASE_URL = 'https://shopping-list-backend-wine.vercel.app';
export const BASE_URL = 'http://localhost:3000/';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
);


axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${BASE_URL}auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (response.data.access_token) {
          window.localStorage.setItem(
            LOCAL_STORAGE_KEY.ACCESS_TOKEN,
            response.data.access_token
          );

          originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;

          return axios(originalRequest).then(response => response.data);
        }
      } catch (refreshError) {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

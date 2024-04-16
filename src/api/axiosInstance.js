import axios from 'axios';

// export const BASE_URL = 'https://shopping-list-backend-wine.vercel.app';
export const BASE_URL = 'http://localhost:3001/';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  config.headers.Authorization = JSON.parse(window.localStorage.getItem('user')).state.userData.token;
  return config;
});

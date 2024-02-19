import axios from 'axios';

export const BASE_URL = 'https://shopping-list-backend-wine.vercel.app';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

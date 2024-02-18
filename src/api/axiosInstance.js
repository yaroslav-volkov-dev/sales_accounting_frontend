import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://shopping-list-backend-wine.vercel.app',
})
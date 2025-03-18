import axios from 'axios'
import { LOCAL_STORAGE_KEY } from '../constants/local-storage-keys.ts'

export const BASE_URL = 'http://localhost:3000/'

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
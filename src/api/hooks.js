import { useQuery } from 'react-query';
import { ENDPOINTS } from './endpoints.js';
import { axiosInstance } from './axiosConfig.js';

export const useProductsQuery = () => useQuery({
  queryKey: [ENDPOINTS.PRODUCTS],
  queryFn: async () => axiosInstance.get(ENDPOINTS.PRODUCTS)
});

export const useCategoriesQuery = () => useQuery({
  queryKey: [ENDPOINTS.CATEGORIES],
  queryFn: async () => axiosInstance.get(ENDPOINTS.CATEGORIES)
});

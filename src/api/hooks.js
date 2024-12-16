import { useQuery } from 'react-query';
import { axiosInstance } from './axiosConfig.js';
import { ENDPOINTS } from '../constants/endpoints.js';

export const useCategoriesQuery = () => useQuery({
  queryKey: [ENDPOINTS.CATEGORIES],
  queryFn: async () => axiosInstance.get(ENDPOINTS.CATEGORIES)
});

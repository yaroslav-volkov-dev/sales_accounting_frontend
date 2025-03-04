import { axiosInstance } from './axiosConfig.ts';
import { ENDPOINTS } from '../constants/endpoints.ts';
import { useQuery } from '@tanstack/react-query';

export const useCategoriesQuery = () => useQuery({
  queryKey: [ENDPOINTS.CATEGORIES],
  queryFn: async () => axiosInstance.get(ENDPOINTS.CATEGORIES)
});

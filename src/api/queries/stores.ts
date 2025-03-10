import { useQuery } from "@tanstack/react-query";
import { StoreModel } from "@/models";
import { axiosInstance } from "@/api/axios-config.ts";
import { ENDPOINTS } from "@/constants/endpoints.ts";

export const storesQueryKey = {
  all: ['stores'] as const
};

export const useStoresQuery = () => {

  return useQuery({
    queryKey: storesQueryKey.all,
    queryFn: async () => axiosInstance.get<StoreModel[]>(ENDPOINTS.STORES),
    select: (response) => response.data
  });
};
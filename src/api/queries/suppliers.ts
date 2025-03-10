import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axios-config.ts";
import { getQueryStringParams } from "@/lib/get-query-string-params.ts";
import { ENDPOINTS } from "@/constants/endpoints.ts";
import { CreateSupplierDto, EditSupplierDto, SupplierModel } from "@/models";
import { notify } from "@/lib/notify.ts";

export const suppliersQueryKey = {
  all: ['suppliers'] as const,
  list: (params: { includeCount?: boolean }) => [...suppliersQueryKey.all, params] as const
};

export const useSupplierQuery = (args: { includeCount: boolean }) => {
  const { includeCount } = args || {};

  return useQuery({
    queryKey: [suppliersQueryKey.list({ includeCount })],
    queryFn: async () => axiosInstance.get<SupplierModel[]>(getQueryStringParams(ENDPOINTS.SUPPLIERS, { includeCount })),
    select: (response) => response.data
  });
};

export const useAddSupplierMutation = (args: { onSuccess: () => void } | void) => {
  const { onSuccess } = args || {};

  const client = useQueryClient();

  return useMutation({
    mutationFn: (newSupplier: CreateSupplierDto) => axiosInstance.post(ENDPOINTS.SUPPLIERS, newSupplier),
    onSuccess: () => {
      onSuccess?.();
      client.invalidateQueries({ queryKey: [suppliersQueryKey.all] });
      notify({ message: 'Supplier successfully added!' });
    },
    onError: (error) => {
      notify({ message: error.message || 'Something went wrong. Cannot add supplier.' });
    }
  });

};

export const useDeleteSupplierMutation = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (supplierId: number) => axiosInstance.delete(`${ENDPOINTS.SUPPLIERS}/${supplierId}`),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: suppliersQueryKey.all });
      notify({ message: 'Supplier successfully deleted!' });
    },
    onError: (error) => {
      notify({ type: 'error', message: error.message || 'Something went wrong' });
    }
  });
};

export const useEditSupplierMutation = (args: { onSuccess: () => void } | void) => {
  const { onSuccess } = args || {};

  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ body, id }: {
      id: number;
      body: EditSupplierDto
    }) => axiosInstance.put(`${ENDPOINTS.SUPPLIERS}/${id}`, body),
    onSuccess: () => {
      onSuccess?.();
      client.invalidateQueries({ queryKey: suppliersQueryKey.all });
      notify({ message: 'Supplier successfully edited!' });
    },
    onError: () => {
      notify({ message: 'Something went wrong. Cannot edit supplier.' });
    }
  });
};
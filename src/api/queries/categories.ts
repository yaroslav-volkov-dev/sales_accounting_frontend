import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axios-config.ts";
import { CategoryModel, CreateCategoryDto, EditCategoryDto } from "@/models";
import { getQueryStringParams } from "@/lib/get-query-string-params.ts";
import { ENDPOINTS } from "@/constants/endpoints.ts";
import { notify } from "@/lib/notify.ts";

export const categoriesQueryKey = {
  all: ['categories'],
  list: (params?: { includeCount?: boolean }) => [...categoriesQueryKey.all, params],
};

export const useCategoriesQuery = (args: { includeCount?: boolean } | void) => {
  const { includeCount } = args || {};

  return useQuery({
    queryKey: categoriesQueryKey.list({ includeCount }),
    queryFn: async () => axiosInstance.get<CategoryModel[]>(getQueryStringParams(ENDPOINTS.CATEGORIES, { includeCount })),
    select: (response) => response.data
  });
};

export const useDeleteCategoryMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: number) => axiosInstance.delete(`${ENDPOINTS.CATEGORIES}/${categoryId}`),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: categoriesQueryKey.all });
      notify({ message: 'Category successfully deleted!' });
    },
    onError: (error) => {
      notify({ type: 'error', message: error.message || 'Something went wrong' });
    }
  });
};

export const useAddCategoryMutation = (args: { onSuccess: () => void } | void) => {
  const { onSuccess } = args || {};

  const client = useQueryClient();

  return useMutation({
    mutationFn: (newCategory: CreateCategoryDto) => axiosInstance.post(ENDPOINTS.CATEGORIES, newCategory),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: categoriesQueryKey.all });
      onSuccess?.();
      notify({ message: 'Category successfully added!' });
    },
    onError: () => {
      notify({ type: 'error', message: 'Something went wrong. Cannot add category.' });
    }
  });
};

export const useEditCategoryMutation = (args: { onSuccess: () => void } | void) => {
  const { onSuccess } = args || {};

  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: {
      id: string | number;
      body: EditCategoryDto
    }) => axiosInstance.put(`${ENDPOINTS.CATEGORIES}/${id}`, body),
    onSuccess: () => {
      onSuccess?.();
      client.invalidateQueries({ queryKey: [categoriesQueryKey.all] });
      notify({ message: 'Category successfully edited!' });
    },
    onError: (error) => {
      notify({ type: 'error', message: error.message });
    }
  });
};

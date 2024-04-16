import { useAppQuery } from '../api/swrConfig.js';

export const useCategoriesQuery = () => {
  const { data: categories = [], isLoading, isValidating, mutate } = useAppQuery('/categories');

  return {
    categories,
    isLoading,
    isValidating,
    mutate,
  };
};
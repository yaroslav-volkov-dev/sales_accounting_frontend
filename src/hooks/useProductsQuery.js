import { useAppQuery } from '../api/swrConfig.js';

export const useProductsQuery = () => {
  const { data: products, isLoading, isValidating } = useAppQuery('/products');

  return { isValidating, isLoading, products };
};
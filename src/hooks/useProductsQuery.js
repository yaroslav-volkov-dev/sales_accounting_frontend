import { useProductsStore } from '../store/useProductsStore.js';
import { useEffect } from 'react';

export const useProductsQuery = () => {
  const products = useProductsStore(state => state.products);
  const fetchProducts = useProductsStore(state => state.fetchProducts);
  const isSuccess = useProductsStore(state => state.isSuccess);
  const isLoading = useProductsStore(state => state.isLoading);

  const initialFetch = async () => {
    if (isSuccess) return;
    await fetchProducts();
  };

  useEffect(() => {
    initialFetch();
  }, []);

  return { isSuccess, isLoading, products, refetch: fetchProducts };
};
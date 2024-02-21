import { create } from 'zustand';
import { axiosInstance } from '../api/axiosInstance.js';

export const useProductsStore = create((set) => ({
  products: [],
  selectedProducts: [],
  isLoading: false,
  isSuccess: false,
  error: null,
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const { data: products } = await axiosInstance.get('/products');
      set({ products });
      set({ isSuccess: true });
    } catch (error) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },
  toggleProduct: (product) => {
    set((state) => {
      const currentSelectedProducts = state.selectedProducts;
      const isProductExists = currentSelectedProducts.find(({ _id }) => _id === product._id);
      if (isProductExists) {
        return { selectedProducts: currentSelectedProducts.filter(({ _id }) => _id !== product._id) };
      }
      return { selectedProducts: [...currentSelectedProducts, product] };
    });
  }
}));
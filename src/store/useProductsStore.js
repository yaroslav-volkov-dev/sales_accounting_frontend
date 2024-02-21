import { create } from 'zustand';
import { axiosInstance } from '../api/axiosInstance.js';

export const useProductsStore = create((set, get) => ({
  products: [],
  selectedProducts: [],
  isLoading: false,
  isSuccess: false,
  error: null,
  fetchProducts: async () => {
    if (get().isSuccess) return;

    set({ loading: true });

    try {
      const { data: products } = await axiosInstance.get('/products');
      set({ products, isSuccess: true });
    } catch (error) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },
  toggleProduct: (product) => {
    const currentSelectedProducts = get().selectedProducts;
    const isProductExists = currentSelectedProducts.find(({ _id }) => _id === product._id);
    if (isProductExists) {
      return set({ selectedProducts: currentSelectedProducts.filter(({ _id }) => _id !== product._id) });
    }
    return set({ selectedProducts: [...currentSelectedProducts, { ...product, amount: 1 }] });
  }
}));
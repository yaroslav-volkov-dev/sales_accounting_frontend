import { create } from 'zustand';
import { axiosInstance } from '../api/axiosInstance.js';
import { notify } from '../utils/notify.js';

export const useProductsStore = create((set, get) => ({
  products: [],
  selectedProducts: [],
  isLoading: false,
  fetchProducts: async () => {
    set({ isLoading: true });

    try {
      const { data: products } = await axiosInstance.get('/products');
      set({ products });
    } catch {
      notify({ message: 'Something went wrong, cannot fetch categories data', type: 'error' });
    } finally {
      set({ isLoading: false });
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
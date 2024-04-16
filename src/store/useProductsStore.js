import { create } from 'zustand';

export const useProductsStore = create((set, get) => ({
  selectedProducts: [],
  toggleProduct: (product) => {
    const currentSelectedProducts = get().selectedProducts;
    const isProductExists = currentSelectedProducts.find(({ _id }) => _id === product._id);
    if (isProductExists) {
      return set({ selectedProducts: currentSelectedProducts.filter(({ _id }) => _id !== product._id) });
    }
    return set({ selectedProducts: [...currentSelectedProducts, { ...product, amount: 1 }] });
  }
}));
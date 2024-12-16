import { create } from 'zustand';

export const useProductsStore = create((set, get) => ({
  selectedProducts: [],
  toggleProduct: (product) => {
    const currentSelectedProducts = get().selectedProducts;
    const isProductExists = currentSelectedProducts.find(({ id }) => id === product.id);
    if (isProductExists) {
      return set({ selectedProducts: currentSelectedProducts.filter(({ id }) => id !== product.id) });
    }
    return set({ selectedProducts: [...currentSelectedProducts, { ...product, amount: 1 }] });
  }
}));
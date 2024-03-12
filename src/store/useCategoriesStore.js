import { create } from 'zustand';
import { axiosInstance } from '../api/axiosInstance.js';
import { notify } from '../utils/notify.js';

const initialState = {
  categories: [],
  isLoading: false,
};

export const useCategoriesStore = create((set) => ({
  ...initialState,
  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/categories');
      set({ categories: response.data, isSuccess: true });
    } catch (err) {
      notify({ message: 'Something went wrong, cannot fetch categories data', type: 'error' });
    } finally {
      set({ isLoading: false });
    }
  }
}));
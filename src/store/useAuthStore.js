import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { axiosInstance } from '../api/axiosInstance.js';
import { notify } from '../utils/notify.js';

const initialState = {
  userData: {
    username: '',
    email: '',
    token: null,
  },
  isLoading: false
};

export const useAuthStore = create(
  persist(
    (set) => ({
      ...initialState,
      removeUserData: () => set(initialState),
      fetchLogin: async ({ data, onSuccess }) => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.post('/auth/login', data);
          const { username, email, token } = response.data;
          set({ userData: { username, email, token } });
          notify({ message: 'Successfully logged in' });
          onSuccess?.();
        } catch (error) {
          notify({ message: error, type: 'error' });
        } finally {
          set({ isLoading: false });
        }
      },
      fetchRegister: async ({ data, onSuccess }) => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.post('/auth/register', data);
          const { username, email, token } = response.data;
          set({ userData: { username, email, token } });
          notify({ message: 'Successfully registered' });
          onSuccess?.();
        } catch (error) {
          notify({ message: error, type: 'error' });
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => localStorage),
    }));
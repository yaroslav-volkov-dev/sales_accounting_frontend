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
      login: async (data) => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.post('/auth/login', data);
          const { username, email, token } = response.data;
          set({ userData: { username, email, token } });
          notify({ message: 'Successfully logged in' });
        } catch (error) {
          notify({ message: error, type: 'error' });
        } finally {
          set({ isLoading: false });
        }
      },
      register: async (data) => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.post('/auth/register', data);
          const { username, email, token } = response.data;
          set({ userData: { username, email, token } });
          notify({ message: 'Successfully registered' });
        } catch (error) {
          notify({ message: error, type: 'error' });
        } finally {
          set({ isLoading: false });
        }
      },
      authMe: async () => {
        set({ isLoading: true });
        try {
          await axiosInstance.get('/auth/me');
        } catch (error) {
          console.log(error);
          notify({ message: 'Cannot auth', type: 'error' });
          set(() => initialState);
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => localStorage),
    }));
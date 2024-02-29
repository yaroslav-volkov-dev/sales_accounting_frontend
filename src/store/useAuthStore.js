import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const initialState = {
  username: '',
  email: '',
  token: null,
};

export const useAuthStore = create(
  persist(
    (set) => ({
      ...initialState,
      setUserData: (data) => set(data),
      removeUserData: () => set(initialState)
    }),
    {
      name: 'global',
      storage: createJSONStorage(() => localStorage),
    }));
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  username: '',
  email: '',
  isAuth: false,
  token: '',
  setUserData: (data) => set(data)
}));
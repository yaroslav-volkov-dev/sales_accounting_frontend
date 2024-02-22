import { useAuthStore } from '../store/useAuthStore.js';

export const useAuth = () => {
  const isAuth = useAuthStore((state) => state.isAuth);

  return {
    isAuth
  };
};
import { useAuthStore } from '../store/useAuthStore.js';
import { notify } from '../utils/notify.js';

export const useAuth = () => {
  const isAuth = !!useAuthStore((state) => state.userData.token);
  const removeUserData = useAuthStore(state => state.removeUserData);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const authMe = useAuthStore((state) => state.authMe);
  const isLoading = useAuthStore((state) => state.isLoading);
  const userData = useAuthStore(state => state.userData);

  const logout = () => {
    removeUserData();
    notify({ message: 'Successfully logged out', type: 'success' });
  };

  return {
    isAuth,
    userData,
    isLoading,
    login,
    logout,
    register,
    authMe
  };
};
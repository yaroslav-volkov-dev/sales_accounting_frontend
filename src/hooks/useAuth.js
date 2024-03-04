import { useAuthStore } from '../store/useAuthStore.js';
import { notify } from '../utils/notify.js';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const isAuth = !!useAuthStore((state) => state.userData.token);
  const removeUserData = useAuthStore(state => state.removeUserData);
  const fetchLogin = useAuthStore((state) => state.fetchLogin);
  const fetchRegister = useAuthStore((state) => state.fetchRegister);
  const isLoading = useAuthStore((state) => state.isLoading);
  const userData = useAuthStore(state => state.userData);

  const navigate = useNavigate();

  const login = async (data) => {
    fetchLogin({ data, onSuccess: () => navigate('/') });
  };

  const register = async (data) => {
    fetchRegister({ data, onSuccess: () => navigate('/') });
  };

  const logout = () => {
    removeUserData();
    navigate('/login');
    notify({ message: 'Successfully logged out', type: 'success' });
  };

  return {
    isAuth,
    userData,
    isLoading,
    login,
    logout,
    register
  };
};
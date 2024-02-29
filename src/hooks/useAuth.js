import { useAuthStore } from '../store/useAuthStore.js';
import { useState } from 'react';
import { axiosInstance } from '../api/axiosInstance.js';
import { notify } from '../utils/notify.js';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const isAuth = !!useAuthStore((state) => state.token);
  const setUserData = useAuthStore(state => state.setUserData);
  const removeUserData = useAuthStore(state => state.removeUserData);
  const navigate = useNavigate();

  const login = async (data) => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/auth/login', data);
      const { username, email, token } = response.data;
      setUserData({ username, email, token });
      notify({ message: 'Successfully logged in' });
      navigate('/');

    } catch (error) {
      notify({ message: 'Something went wrong', type: 'error' });

    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data) => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/auth/register', data);
      const { username, email, token } = response.data;
      setUserData({ username, email, token });
      notify({ message: 'Successfully registered' });
      navigate('/');

    } catch (error) {
      notify({ message: 'Something went wrong', type: 'error' });

    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeUserData();
    navigate('/login');
    notify({ message: 'Successfully logged out', type: 'success' });
  };

  return {
    isAuth,
    isLoading,
    login,
    logout,
    register
  };
};
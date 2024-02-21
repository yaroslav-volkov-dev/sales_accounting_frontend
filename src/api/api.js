import { axiosInstance } from './axiosInstance.js';

export const getProducts = async () => await axiosInstance.get('/products');

export const getCategories = async ({ onSuccess }) => {
  try {
    const response = await axiosInstance.get('/categories');
    onSuccess(response);
  } catch (err) {
    console.log(err);
  }
};
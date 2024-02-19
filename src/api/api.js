import { axiosInstance } from './axiosInstance.js';

export const getProducts = async ({ onSuccess }) => {
  try {
    const response = await axiosInstance.get('/products');
    onSuccess(response);
  } catch (err) {
    console.log(err);
  }
};

export const getCategories = async ({ onSuccess }) => {
  try {
    const response = await axiosInstance.get('/categories');
    onSuccess(response);
  } catch (err) {
    console.log(err);
  }
};
import { axiosInstance } from './axiosInstance.js';
import useSWR from 'swr';

export const queryFetcher = url => axiosInstance.get(url).then(res => res.data);

export const useAppQuery = (url) => useSWR(url, queryFetcher);


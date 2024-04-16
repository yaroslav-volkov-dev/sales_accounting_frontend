import { axiosInstance } from './axiosInstance.js';
import useSWR from 'swr';

export const queryFetcher = url => axiosInstance.get(url).then(res => res.data);

export const mutateFetcher = (url, { arg }) => void axiosInstance.post(url, arg);


export const useAppQuery = (url) => useSWR(url, queryFetcher);


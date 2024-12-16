import { useSearchParams } from 'react-router-dom';

export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  return {
    searchParams,
    setSearchParams
  };
};
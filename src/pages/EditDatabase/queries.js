import { useMutation } from 'react-query';

export const useProductUpdateMutation = (product) => useMutation({
  queryKey: []
});
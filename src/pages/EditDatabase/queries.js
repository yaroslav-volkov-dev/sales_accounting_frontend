export const productsQueryKey = {
  all: ['all'],
  category: (category) => [...productsQueryKey.all, category]
};
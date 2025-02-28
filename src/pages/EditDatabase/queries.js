export const productsQueryKey = {
  all: ['all'],
  category: (category) => [...productsQueryKey.all, category]
};

export const categoriesQueryKey = {
  all: ['all']
};

export const suppliersQueryKey = {
  all: ['all']
};
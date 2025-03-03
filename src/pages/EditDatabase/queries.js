export const productsQueryKey = {
  all: ['all'],
  category: (category) => [...productsQueryKey.all, category]
};

export const categoriesQueryKey = {
  all: ['all'],
  includeCount: (includeCount) => [...categoriesQueryKey.all, includeCount]
};

export const suppliersQueryKey = {
  all: ['all']
};
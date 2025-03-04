export const productsQueryKey = {
  all: ['all'],
  categories: (categoriesIds?: string[], withoutCategory?: boolean) => [...productsQueryKey.all, categoriesIds, withoutCategory]
};

export const categoriesQueryKey = {
  all: ['all'],
  includeCount: (includeCount: boolean) => [...categoriesQueryKey.all, includeCount]
};

export const suppliersQueryKey = {
  all: ['all'],
  includeCount: (includeCount: boolean) => [...suppliersQueryKey.all, includeCount]

};
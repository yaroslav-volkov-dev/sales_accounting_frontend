export const productsQueryKey = {
  all: ['all'],
  categories: (categoriesIds?: string[], withoutCategory?: boolean, suppliersIds?: string[], withoutSupplier?: boolean) =>
    [...productsQueryKey.all, categoriesIds, withoutCategory, suppliersIds, withoutSupplier]
};

export const categoriesQueryKey = {
  all: ['all'],
  includeCount: (includeCount: boolean) => [...categoriesQueryKey.all, includeCount]
};

export const suppliersQueryKey = {
  all: ['all'],
  includeCount: (includeCount: boolean) => [...suppliersQueryKey.all, includeCount]

};
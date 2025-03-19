export const categoriesQueryKey = {
  all: ['all'],
  includeCount: (includeCount: boolean) => [
    ...categoriesQueryKey.all,
    includeCount,
  ],
}

export const suppliersQueryKey = {
  all: ['all'],
  includeCount: (includeCount: boolean) => [
    ...suppliersQueryKey.all,
    includeCount,
  ],
}

export const storesQueryKey = {
  all: ['all'],
}

export const unauthenticatedRoutes = {
  registration: '/registration',
  login: '/login',
}

export const routes = {
  profile: '/profile',
  editDatabase: {
    base: '/edit-database',
    products: '/edit-database/products',
    categories: '/edit-database/categories',
    suppliers: '/edit-database/suppliers',
    stores: '/edit-database/stores',
  },
  shiftView: '/shift-view',
  home: '/',
  products: '/products',
  categories: '/categories',
  suppliers: '/suppliers',
  stores: '/stores',
  company: '/company',
  selectWorkspace: '/select-workspace',
  ...unauthenticatedRoutes
}

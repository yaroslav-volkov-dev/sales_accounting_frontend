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
    stores: '/edit-database/stores',
  },
  shiftView: '/shift-view',
  home: '/',
  products: '/products',
  categories: '/categories',
  stores: '/stores',
  company: '/company',
  selectWorkspace: '/select-workspace',
  ...unauthenticatedRoutes
}

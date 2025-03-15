export const ENDPOINTS = Object.freeze({
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  SUPPLIERS: '/suppliers',
  STORES: '/stores',
  SHIFTS: {
    BASE: '/shifts',
    START: '/shifts/start',
    CLOSE: '/shifts/close',
    ACTIVE: (userId: string) => `/shifts/active/${userId}`,
  },
  PROFILE: {
    BASE: '/profiles',
    GET_BY_ID: (id?: string) => `/profiles/${id}`,
    UPDATE: (id?: string) => `/profiles/${id}`,
  },
  USER: {
    BASE: '/users',
    REFRESH: '/users/refresh',
    REGISTER: '/users/register',
    LOGIN: '/users/login',
    LOGOUT: '/users/logout',
  },
})

export const ENDPOINTS = Object.freeze({
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  REFRESH_SESSION: '/auth/refresh',
  LOGOUT: '/auth/logout',
  UPLOAD: '/upload',
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
});
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
  USER: {
    BASE: '/users',
    REFRESH: '/users/refresh',
    REGISTER: '/users/register',
    LOGIN: '/users/login',
    LOGOUT: '/users/logout',
    UPDATE: (id?: string) => `/users/update/${id}`,
  },
  SALES: {
    BASE: '/sales',
    GET_ALL_BY_SHIFT: (shiftId: string | number) => `/sales/shift/${shiftId}`,
  },
})

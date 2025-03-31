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
  AUTH: {
    BASE: '/auth',
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  PROFILE: {
    BASE: '/users',
    UPDATE: (id?: string) => `/users/update/${id}`,
  },
  USERS: {
    BASE: '/users',
    UPDATE: (id?: string) => `/users/update/${id}`,
    START_SESSION: (workspaceId?: string) => `/users/start-session/${workspaceId}`,
  },
  COMPANY: {
    BASE: '/company',
    PROFILES: '/company/profiles',
  },
  SALES: {
    BASE: '/sales',
    GET_ALL_BY_SHIFT: (shiftId: string | number) => `/sales/shift/${shiftId}`,
  },
  WORKSPACES: {
    BASE: '/workspaces',
    CREATE: '/workspaces/create',
  },
})

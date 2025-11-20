// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    VERIFY_OTP: '/api/auth/verify-otp',
    RESEND_OTP: '/api/auth/resend-otp',
  },
  USERS: {
    GET_BY_ID: (id: number | string) => `/api/users/${id}`,
    UPDATE: (id: number | string) => `/api/users/${id}`,
  },
  SUBSCRIPTIONS: {
    GET_MODEL_LIMIT: (userId: number | string) => `/api/user-subscriptions/user/${userId}/model-limit`,
    GET_ALL: '/api/subscriptions',
  },
  ORDERS: {
    CREATE: '/api/orders',
  },
  // Add more endpoints as needed
} as const;

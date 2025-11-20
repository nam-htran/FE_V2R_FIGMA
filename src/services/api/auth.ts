// Authentication API Services
import { apiClient, ApiResponse } from './client';
import { API_ENDPOINTS } from './config';
import { setToken, removeToken, getToken, getUserRole, hasRole, getUserEmail, getUserFullName, getUserDisplayName, getUserId } from '@/utils/jwt';

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface RegisterResponse {
  message: string;
  userId?: string;
  email?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  jwt?: string;
  accessToken?: string;
  role?: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    role?: string;
  };
  [key: string]: any;
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

export interface VerifyOtpResponse {
  message: string;
  success: boolean;
  token?: string;
}

export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return apiClient.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
  },

  /**
   * Verify OTP code
   */
  verifyOtp: async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    return apiClient.post<VerifyOtpResponse>(API_ENDPOINTS.AUTH.VERIFY_OTP, data);
  },

  /**
   * Resend OTP code
   */
  resendOtp: async (email: string): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>(API_ENDPOINTS.AUTH.RESEND_OTP, { email });
  },

  /**
   * Get stored registration email from session
   */
  getRegistrationEmail: (): string | null => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('registrationEmail');
    }
    return null;
  },

  /**
   * Clear stored registration email
   */
  clearRegistrationEmail: (): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('registrationEmail');
    }
  },

  /**
   * Store JWT token
   */
  setAuthToken: (token: string): void => {
    setToken(token);
  },

  /**
   * Store auth token with TTL (minutes)
   */
  setAuthTokenWithTTL: (token: string, ttlMinutes = 30): void => {
    setToken(token, ttlMinutes);
  },

  /**
   * Get JWT token
   */
  getAuthToken: (): string | null => {
    return getToken();
  },

  /**
   * Remove JWT token (logout)
   */
  removeAuthToken: (): void => {
    removeToken();
  },

  /**
   * Get user role from stored token
   */
  getUserRole: (): string | null => {
    const token = getToken();
    if (!token) return null;
    return getUserRole(token);
  },

  /**
   * Check if user has specific role
   */
  hasRole: (role: string): boolean => {
    const token = getToken();
    if (!token) return false;
    return hasRole(token, role);
  },

  /**
   * Check if user is admin
   */
  isAdmin: (): boolean => {
    const token = getToken();
    if (!token) return false;
    return hasRole(token, 'admin');
  },

  /**
   * Get user email from token
   */
  getUserEmail: (): string | null => {
    const token = getToken();
    if (!token) return null;
    return getUserEmail(token);
  },

  /**
   * Get user full name from token
   */
  getUserFullName: (): string | null => {
    const token = getToken();
    if (!token) return null;
    return getUserFullName(token);
  },

  /**
   * Get user display name (full name or email fallback)
   */
  getUserDisplayName: (): string | null => {
    const token = getToken();
    if (!token) return null;
    return getUserDisplayName(token);
  },

  /**
   * Get user ID from token
   */
  getUserId: (): string | number | null => {
    const token = getToken();
    if (!token) return null;
    return getUserId(token);
  },
};

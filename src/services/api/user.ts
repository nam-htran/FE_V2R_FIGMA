// User API Services
import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export interface Role {
  roleID: number;
  roleName: string;
}

export interface VerificationToken {
  id: number;
  token: string;
  user: string;
  expiryDate: string;
}

export interface UserResponse {
  userID: number;
  email: string;
  password?: string;
  fullName: string;
  loyaltyPoints: number;
  numberOfModel: number;
  address: string;
  phone: string;
  role: Role;
  verificationTokens: VerificationToken[];
  avatar: string;
  status: boolean;
  verified: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  offset: number;
  sort: Sort;
  unpaged: boolean;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
}

export interface UsersListResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: UserResponse[];
  number: number;
  sort: Sort;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: Pageable;
  empty: boolean;
}

export const userService = {
  /**
   * Get user by ID
   */
  getUserById: async (id: number | string): Promise<UserResponse> => {
    return apiClient.get<UserResponse>(API_ENDPOINTS.USERS.GET_BY_ID(id));
  },

  /**
   * Update user information
   */
  updateUser: async (id: number | string, data: Partial<UserResponse>): Promise<UserResponse> => {
    return apiClient.put<UserResponse>(API_ENDPOINTS.USERS.UPDATE(id), data);
  },

  /**
   * Get paginated list of all users
   */
  getUsersList: async (page: number = 0, size: number = 10): Promise<UsersListResponse> => {
    return apiClient.get<UsersListResponse>(`/api/users?page=${page}&size=${size}`);
  },
};

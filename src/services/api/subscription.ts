// Subscription API Services
import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export interface UserModelLimitResponse {
  userId: number;
  modelLimit: number;
  description: string;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  status: boolean;
  price: string;
  numberOfModel: number;
  numberOfModelDisplay: string;
  unlimitedModels: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  offset: number;
  sort: Sort;
  paged: boolean;
  pageSize: number;
  pageNumber: number;
  unpaged: boolean;
}

export interface SubscriptionsResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: SubscriptionPlan[];
  number: number;
  sort: Sort;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: Pageable;
  empty: boolean;
}

export interface ChangeSubscriptionRequest {
  userId: number;
  subscriptionId: number;
}

export interface ChangeSubscriptionResponse {
  message?: string;
  success?: boolean;
  [key: string]: any;
}

export interface Payment {
  paymentID: number;
  transactionCode: string;
  amount: number;
  status: boolean;
  paymentDate: string;
}

export interface UserSubscription {
  id: number;
  user: any; // Reference to user object
  subscription: SubscriptionPlan;
  payment: Payment;
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscriptionsResponse {
  content: UserSubscription[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export const subscriptionService = {
  /**
   * Get user's model limit
   */
  getUserModelLimit: async (userId: number | string): Promise<UserModelLimitResponse> => {
    return apiClient.get<UserModelLimitResponse>(API_ENDPOINTS.SUBSCRIPTIONS.GET_MODEL_LIMIT(userId));
  },

  /**
   * Get all subscription plans
   */
  getAllSubscriptions: async (): Promise<SubscriptionsResponse> => {
    return apiClient.get<SubscriptionsResponse>(API_ENDPOINTS.SUBSCRIPTIONS.GET_ALL);
  },

  /**
   * Change user's subscription plan
   */
  changeUserSubscription: async (data: ChangeSubscriptionRequest): Promise<ChangeSubscriptionResponse> => {
    return apiClient.post<ChangeSubscriptionResponse>('/api/user-subscriptions/change', data);
  },

  /**
   * Get all user subscriptions
   */
  getAllUserSubscriptions: async (page: number = 0, size: number = 100): Promise<UserSubscriptionsResponse> => {
    return apiClient.get<UserSubscriptionsResponse>(`/api/user-subscriptions?page=${page}&size=${size}`);
  },
};

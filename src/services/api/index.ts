// API Services Barrel Export
export * from './client';
export * from './config';
export * from './auth';
export * from './user';
export { subscriptionService } from './subscription';
export * from './order';

// Import all services for easy access
import { authService } from './auth';
import { userService } from './user';
import { subscriptionService } from './subscription';
import { orderService } from './order';

export const api = {
  auth: authService,
  user: userService,
  subscription: subscriptionService,
  order: orderService,
  // Add more services here as you create them
  // dashboard: dashboardService,
  // etc...
};

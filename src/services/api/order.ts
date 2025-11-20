import { apiClient, ApiResponse } from './client';

export interface VnPayResponse {
	code: string;
	message: string;
	paymentUrl?: string;
}

export interface OrderDetail {
	orderDetailId: number;
	subscriptionId: number;
	subscriptionName: string;
	quantity: number;
	pricePerUnit: number;
	totalPrice: number;
}

export interface Order {
	orderID: number;
	userId: number;
	userEmail: string;
	orderDate: string;
	totalPrice: number;
	orderDetails: OrderDetail[];
	checkCode: string;
	status: number;
}

export interface OrdersResponse {
	totalPages: number;
	totalElements: number;
	size: number;
	content: Order[];
	number: number;
	first: boolean;
	last: boolean;
	numberOfElements: number;
	empty: boolean;
}

export const orderService = {
	/**
	 * Create a VNPay payment session for a subscription.
	 * Some backends expect @RequestParam, so we send as query params.
	 */
		createVnPay: async (payload: { subscriptionId: string | number; returnUrl?: string; userId?: string | number }) => {
		const params = new URLSearchParams({
			subscriptionId: String(payload.subscriptionId),
			...(payload.returnUrl ? { returnUrl: payload.returnUrl } : {}),
				...(payload.userId != null ? { userId: String(payload.userId) } : {}),
		});
			const res = await apiClient.post<VnPayResponse>(
				`/api/payment/vn-pay?${params.toString()}`,
				undefined,
				{ credentials: 'include' }
			);
		return res as VnPayResponse;
	},

	/**
	 * Create an order record (used for bank transfer fallback)
	 * payload: { userId: number | string; items: Array<{ subscriptionId: number | string; quantity: number }> }
	 */
	createOrder: async (payload: { userId: number | string; items: Array<{ subscriptionId: string | number; quantity: number }> }) => {
		const res = await apiClient.post('/api/orders', payload, { credentials: 'include' });
		return res;
	},

	/**
	 * Get paginated orders
	 */
	getOrders: async (page: number = 0, size: number = 10): Promise<OrdersResponse> => {
		const res = await apiClient.get<OrdersResponse>(`/api/orders?page=${page}&size=${size}`);
		return res;
	},

	/**
	 * Update order status
	 */
	updateOrderStatus: async (orderId: number, newStatus: number): Promise<any> => {
		const res = await apiClient.put(`/api/orders/${orderId}/status`, { status: newStatus });
		return res;
	},

	/**
	 * Update order check code
	 */
	updateOrderCheckCode: async (orderId: number, checkCode: string): Promise<any> => {
		const res = await apiClient.put(`/api/orders/${orderId}/checkcode`, { checkCode });
		return res;
	},

	/**
	 * Get total price for orders by status
	 */
	getTotalPriceByStatus: async (status: number): Promise<number> => {
		const res = await apiClient.get<number>(`/api/orders/total-price/status/${status}`);
		return res;
	},
};

export default orderService;

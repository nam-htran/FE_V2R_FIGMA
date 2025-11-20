// ===== .\src\app\[locale]\dashboard\orders\page.tsx =====
"use client";

import { useState, useEffect } from 'react';
import { orderService, type Order } from '@/services/api/order';
import { Icon } from '@iconify/react';

// Map status code to Vietnamese label
const getStatusLabel = (status: number): string => {
  switch (status) {
    case 1:
      return 'Đang chờ';
    case 2:
      return 'Hoàn thành';
    case 3:
      return 'Đã hủy';
    default:
      return 'Không xác định';
  }
};

// Get status badge color
const getStatusBadgeColor = (status: number): string => {
  switch (status) {
    case 1:
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'; // Đang chờ
    case 2:
      return 'bg-green-500/20 text-green-400 border-green-500/30'; // Hoàn thành
    case 3:
      return 'bg-red-500/20 text-red-400 border-red-500/30'; // Đã hủy
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN');
};

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Status change modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Check code edit state
  const [isCheckCodeModalOpen, setIsCheckCodeModalOpen] = useState(false);
  const [editingCheckCode, setEditingCheckCode] = useState<string>('');
  const [isUpdatingCheckCode, setIsUpdatingCheckCode] = useState(false);

  const statusOptions = [
    { value: 1, label: 'Đang chờ' },
    { value: 2, label: 'Hoàn thành' },
    { value: 3, label: 'Đã hủy' },
  ];

  const fetchOrders = async (page: number) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await orderService.getOrders(page, pageSize);
      setOrders(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setCurrentPage(response.number);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err?.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(0);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchOrders(newPage);
    }
  };

  const handleOpenStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || selectedStatus === null) return;

    try {
      setIsUpdatingStatus(true);
      await orderService.updateOrderStatus(selectedOrder.orderID, selectedStatus);
      
      // Refresh orders list
      await fetchOrders(currentPage);
      
      // Close modal and show success
      setIsModalOpen(false);
      setError('');
    } catch (err: any) {
      console.error('Error updating order status:', err);
      setError(err?.message || 'Failed to update order status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleOpenCheckCodeModal = (order: Order) => {
    setSelectedOrder(order);
    setEditingCheckCode(order.checkCode || '');
    setIsCheckCodeModalOpen(true);
  };

  const handleUpdateCheckCode = async () => {
    if (!selectedOrder) return;

    try {
      setIsUpdatingCheckCode(true);
      await orderService.updateOrderCheckCode(selectedOrder.orderID, editingCheckCode);
      
      // Refresh orders list
      await fetchOrders(currentPage);
      
      // Close modal and show success
      setIsCheckCodeModalOpen(false);
      setError('');
    } catch (err: any) {
      console.error('Error updating check code:', err);
      setError(err?.message || 'Failed to update check code');
    } finally {
      setIsUpdatingCheckCode(false);
    }
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Icon icon="mdi:loading" className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-['Inter']">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white font-['Unbounded'] mb-2">Orders Management</h1>
        <p className="text-gray-400 font-['Inter']">
          Total: {totalElements} orders
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-500 font-['Inter']">{error}</p>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-neutral-900 rounded-lg border border-zinc-700 overflow-hidden">
        <div className="overflow-visible">
          <table className="w-full table-fixed">
            <thead className="bg-neutral-800 border-b border-zinc-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 font-['Inter'] w-[120px]">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 font-['Inter'] w-[220px]">Customer Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 font-['Inter'] w-[150px]">Subscription</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300 font-['Inter'] w-[130px]">Amount</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300 font-['Inter'] w-[150px]">Check Code</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300 font-['Inter'] w-[130px]">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300 font-['Inter'] w-[150px]">Order Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700">
              {orders.map((order) => {
                const subscriptionName = order.orderDetails[0]?.subscriptionName || 'N/A';
                return (
                  <tr key={order.orderID} className="hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-blue-400 font-semibold font-['Inter']">#{order.orderID}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-300 font-['Inter'] text-sm truncate">{order.userEmail}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold font-['Inter'] bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        {subscriptionName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-white font-semibold font-['Inter']">{formatCurrency(order.totalPrice)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleOpenCheckCodeModal(order)}
                        className="text-blue-400 hover:text-blue-300 font-['Inter'] text-sm underline decoration-dotted"
                      >
                        {order.checkCode || 'N/A'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleOpenStatusModal(order)}
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold font-['Inter'] border cursor-pointer hover:opacity-80 transition-opacity ${getStatusBadgeColor(order.status)}`}
                      >
                        {getStatusLabel(order.status)}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-gray-300 text-sm font-['Inter']">{formatDate(order.orderDate)}</span>
                        <span className="text-gray-500 text-xs font-['Inter']">{formatTime(order.orderDate)}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && !isLoading && (
          <div className="py-12 text-center">
            <Icon icon="mdi:receipt-text-outline" className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 font-['Inter']">No orders found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-gray-400 text-sm font-['Inter']">
            Page {currentPage + 1} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0 || isLoading}
              className="px-4 py-2 bg-neutral-800 text-white rounded-lg font-['Inter'] hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Icon icon="mdi:chevron-left" className="w-5 h-5" />
            </button>
            
            {/* Page numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i;
                } else if (currentPage < 3) {
                  pageNum = i;
                } else if (currentPage > totalPages - 3) {
                  pageNum = totalPages - 5 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={isLoading}
                    className={`w-10 h-10 rounded-lg font-['Inter'] font-semibold transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1 || isLoading}
              className="px-4 py-2 bg-neutral-800 text-white rounded-lg font-['Inter'] hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Icon icon="mdi:chevron-right" className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Change Status Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-800 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl border border-zinc-700">
            {/* Close button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <Icon icon="mdi:close" className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white font-['Unbounded'] mb-2">
                Change Order Status
              </h3>
              <p className="text-gray-400 font-['Inter']">
                Order #{selectedOrder.orderID}
              </p>
            </div>

            {/* Current status info */}
            <div className="bg-neutral-800/50 rounded-lg p-4 mb-6 border border-zinc-700">
              <p className="text-gray-400 text-sm mb-2 font-['Inter']">Current Status:</p>
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold font-['Inter'] border ${getStatusBadgeColor(selectedOrder.status)}`}>
                {getStatusLabel(selectedOrder.status)}
              </span>
            </div>

            {/* Status options */}
            <div className="space-y-3 mb-6">
              <p className="text-gray-400 text-sm mb-3 font-['Inter']">Select New Status:</p>
              {statusOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedStatus === option.value
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-zinc-700 bg-neutral-800/30 hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold font-['Inter']">{option.label}</span>
                    {selectedStatus === option.value && (
                      <Icon icon="mdi:check-circle" className="w-6 h-6 text-blue-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button 
                className="flex-1 px-6 py-3 rounded-lg bg-zinc-800 text-white font-semibold font-['Inter'] hover:bg-zinc-700 transition-colors border border-zinc-700"
                onClick={() => setIsModalOpen(false)}
                disabled={isUpdatingStatus}
              >
                Cancel
              </button>
              <button 
                className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold font-['Inter'] hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleUpdateStatus}
                disabled={selectedStatus === null || isUpdatingStatus}
              >
                {isUpdatingStatus ? (
                  <span className="flex items-center justify-center gap-2">
                    <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  'Update Status'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Check Code Modal */}
      {isCheckCodeModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCheckCodeModalOpen(false)} />
          <div className="relative bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-800 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl border border-zinc-700">
            {/* Close button */}
            <button 
              onClick={() => setIsCheckCodeModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <Icon icon="mdi:close" className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white font-['Unbounded'] mb-2">
                Edit Check Code
              </h3>
              <p className="text-gray-400 font-['Inter']">
                Order #{selectedOrder.orderID}
              </p>
            </div>

            {/* Current check code info */}
            <div className="bg-neutral-800/50 rounded-lg p-4 mb-6 border border-zinc-700">
              <p className="text-gray-400 text-sm mb-2 font-['Inter']">Current Check Code:</p>
              <p className="text-white font-semibold font-['Inter']">{selectedOrder.checkCode || 'N/A'}</p>
            </div>

            {/* Input field */}
            <div className="mb-6">
              <label className="text-gray-400 text-sm mb-2 font-['Inter'] block">New Check Code:</label>
              <input
                type="text"
                value={editingCheckCode}
                onChange={(e) => setEditingCheckCode(e.target.value)}
                placeholder="Enter check code"
                className="w-full px-4 py-3 bg-neutral-800 border border-zinc-700 rounded-lg text-white font-['Inter'] focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button 
                className="flex-1 px-6 py-3 rounded-lg bg-zinc-800 text-white font-semibold font-['Inter'] hover:bg-zinc-700 transition-colors border border-zinc-700"
                onClick={() => setIsCheckCodeModalOpen(false)}
                disabled={isUpdatingCheckCode}
              >
                Cancel
              </button>
              <button 
                className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold font-['Inter'] hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleUpdateCheckCode}
                disabled={isUpdatingCheckCode}
              >
                {isUpdatingCheckCode ? (
                  <span className="flex items-center justify-center gap-2">
                    <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  'Update Check Code'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

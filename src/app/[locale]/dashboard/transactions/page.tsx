// ===== .\src\app\[locale]\dashboard\transactions\page.tsx =====
"use client";

import { useState, useEffect } from 'react';
import { orderService, Order } from '@/services/api/order';
import { Icon } from '@iconify/react';

const getStatusLabel = (status: number): string => {
  switch (status) {
    case 1: return 'Đang chờ';
    case 2: return 'Thành công';
    case 3: return 'Đã hủy';
    default: return 'Không xác định';
  }
};

const getStatusColor = (status: number): string => {
  switch (status) {
    case 1: return 'text-amber-500';
    case 2: return 'text-green-700';
    case 3: return 'text-red-600';
    default: return 'text-gray-500';
  }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
        date: date.toLocaleDateString('vi-VN'),
        time: date.toLocaleTimeString('vi-VN'),
    };
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function TransactionsPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // Fetch dữ liệu từ orders, vì nó chứa thông tin giao dịch
                const response = await orderService.getOrders(0, 50); // Lấy 50 giao dịch gần nhất
                setOrders(response.content);
            } catch (err) {
                setError("Failed to load transactions.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    return (
        <div className="space-y-8">
             <h1 className="text-blue-900 text-4xl font-bold font-['Unbounded']">Giao dịch</h1>
             <div className="bg-white rounded-2xl p-8">
                 <h2 className="text-black text-2xl font-semibold font-['Unbounded'] mb-6">Giao dịch gần đây</h2>
                 {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                        <Icon icon="eos-icons:bubble-loading" className="w-12 h-12 text-blue-500" />
                    </div>
                 ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                 ) : (
                     <div className="overflow-x-auto">
                         <table className="w-full text-left">
                             <thead className="bg-violet-300 rounded-md">
                                 <tr className="text-black text-xl font-normal font-['Inter']">
                                     <th className="p-3">Mã Giao dịch (ID)</th>
                                     <th className="p-3">Email Khách hàng</th>
                                     <th className="p-3">Số tiền</th>
                                     <th className="p-3">Gói dịch vụ</th>
                                     <th className="p-3">Trạng thái</th>
                                     <th className="p-3">Thời gian tạo</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {orders.map((order) => {
                                     const {date, time} = formatDate(order.orderDate);
                                     return (
                                     <tr key={order.orderID} className="border-b">
                                         <td className="p-3 text-black text-xl font-normal">#{order.orderID}</td>
                                         <td className="p-3 text-black text-xl font-semibold">{order.userEmail}</td>
                                         <td className="p-3 text-black text-xl font-semibold">{formatCurrency(order.totalPrice)}</td>
                                         <td className="p-3 text-black text-xl font-normal">{order.orderDetails[0]?.subscriptionName || 'N/A'}</td>
                                         <td className={`p-3 text-xl font-normal ${getStatusColor(order.status)}`}>{getStatusLabel(order.status)}</td>
                                         <td className="p-3 text-black text-xl font-light">
                                             <div>{date}</div>
                                             <div>{time}</div>
                                         </td>
                                     </tr>
                                 )})}
                             </tbody>
                         </table>
                     </div>
                 )}
             </div>
        </div>
    );
}
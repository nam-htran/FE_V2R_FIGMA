"use client";

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import type { UserResponse, UsersListResponse } from '@/services/api/user';
import { Icon } from '@iconify/react';
import Image from 'next/image';

export default function UsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [error, setError] = useState<string>('');
  
  // Subscription change modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number | null>(null);
  const [isChangingSubscription, setIsChangingSubscription] = useState(false);
  
  // User subscriptions mapping
  const [userSubscriptions, setUserSubscriptions] = useState<Map<number, any>>(new Map());

  const fetchUsers = async (page: number = 0) => {
    try {
      setIsLoading(true);
      setError('');
      const response: UsersListResponse = await api.user.getUsersList(page, pageSize);
      setUsers(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setCurrentPage(response.number);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err?.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
    fetchSubscriptions();
    fetchUserSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await api.subscription.getAllSubscriptions();
      setSubscriptions(response.content.filter(sub => sub.status));
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
    }
  };

  const fetchUserSubscriptions = async () => {
    try {
      const response = await api.subscription.getAllUserSubscriptions();
      // Create a map of userId -> active subscription
      const subsMap = new Map();
      response.content.forEach((userSub: any) => {
        if (userSub.active && userSub.user) {
          subsMap.set(userSub.user.userID, userSub);
        }
      });
      setUserSubscriptions(subsMap);
    } catch (err) {
      console.error('Error fetching user subscriptions:', err);
    }
  };

  const handleOpenChangeSubscriptionModal = (user: UserResponse) => {
    setSelectedUser(user);
    setSelectedSubscriptionId(null);
    setIsModalOpen(true);
  };

  const handleChangeSubscription = async () => {
    if (!selectedUser || !selectedSubscriptionId) return;

    try {
      setIsChangingSubscription(true);
      await api.subscription.changeUserSubscription({
        userId: selectedUser.userID,
        subscriptionId: selectedSubscriptionId,
      });
      
      // Refresh users list and subscriptions
      await fetchUsers(currentPage);
      await fetchUserSubscriptions();
      
      // Close modal and show success
      setIsModalOpen(false);
      alert('Subscription changed successfully!');
    } catch (err: any) {
      console.error('Error changing subscription:', err);
      const errorMessage = err?.message || 'Failed to change subscription';
      
      // Show user-friendly error message
      let displayMessage = errorMessage;
      if (errorMessage.includes('TransientObjectException') || errorMessage.includes('unsaved transient instance')) {
        displayMessage = 'Backend error: Unable to process subscription change. Please contact system administrator.';
      }
      
      alert(displayMessage);
    } finally {
      setIsChangingSubscription(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchUsers(newPage);
    }
  };

  const getRoleBadgeColor = (roleName: string) => {
    const role = roleName.toLowerCase();
    if (role.includes('admin')) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (role.includes('user')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Icon icon="mdi:loading" className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-['Inter']">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white font-['Unbounded'] mb-2">Users Management</h1>
        <p className="text-gray-400 font-['Inter']">
          Total: {totalElements} users
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-500 font-['Inter']">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-neutral-900 rounded-lg border border-zinc-700 overflow-hidden">
        <div className="overflow-visible">
          <table className="w-full table-fixed">
            <thead className="bg-neutral-800 border-b border-zinc-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 font-['Inter'] w-[250px]">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 font-['Inter'] w-[280px]">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 font-['Inter'] w-[120px]">Role</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300 font-['Inter'] w-[200px]">Subscription</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300 font-['Inter'] w-[100px]">Models</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300 font-['Inter'] w-[150px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700">
              {users.map((user) => (
                <tr key={user.userID} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.fullName}
                          width={40}
                          height={40}
                          className="rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm font-['Inter']">
                            {user.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-white font-medium font-['Inter'] truncate">{user.fullName || 'N/A'}</p>
                        <p className="text-gray-500 text-xs font-['Inter']">ID: {user.userID}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-300 font-['Inter'] text-sm truncate">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    {user.role ? (
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold font-['Inter'] border ${getRoleBadgeColor(user.role.roleName)}`}>
                        {user.role.roleName}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm font-['Inter']">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {userSubscriptions.has(user.userID) ? (
                      <div className="flex flex-col items-center gap-1">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold font-['Inter'] bg-purple-500/20 text-purple-400 border border-purple-500/30">
                          {userSubscriptions.get(user.userID).subscription.name}
                        </span>
                        <span className="text-gray-500 text-xs font-['Inter']">
                          {new Date(userSubscriptions.get(user.userID).endDate).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm font-['Inter']">No Plan</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-300 font-['Inter'] text-sm">{user.numberOfModel}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleOpenChangeSubscriptionModal(user)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold font-['Inter'] transition-colors"
                    >
                      Change Plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && !isLoading && (
          <div className="py-12 text-center">
            <Icon icon="mdi:account-off" className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 font-['Inter']">No users found</p>
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

      {/* Change Subscription Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-800 rounded-2xl p-8 w-full max-w-2xl mx-4 shadow-2xl border border-zinc-700 max-h-[80vh] overflow-y-auto">
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
                Change Subscription Plan
              </h3>
              <p className="text-gray-400 font-['Inter']">
                Select a new subscription plan for <span className="text-white font-semibold">{selectedUser.fullName || selectedUser.email}</span>
              </p>
            </div>

            {/* Current subscription info */}
            <div className="bg-neutral-800/50 rounded-lg p-4 mb-6 border border-zinc-700">
              <p className="text-gray-400 text-sm mb-1 font-['Inter']">Current Plan:</p>
              <p className="text-white font-semibold font-['Inter']">
                {selectedUser.numberOfModel} models available
              </p>
            </div>

            {/* Subscription plans grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  onClick={() => setSelectedSubscriptionId(subscription.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedSubscriptionId === subscription.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-zinc-700 bg-neutral-800/30 hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-lg font-bold text-white font-['Inter']">{subscription.name}</h4>
                    {selectedSubscriptionId === subscription.id && (
                      <Icon icon="mdi:check-circle" className="w-6 h-6 text-blue-500" />
                    )}
                  </div>
                  <p className="text-2xl font-bold text-blue-500 mb-2 font-['Inter']">
                    {subscription.price}<span className="text-sm text-gray-400">/tháng</span>
                  </p>
                  <p className="text-gray-300 text-sm font-['Inter']">
                    {subscription.unlimitedModels 
                      ? 'Unlimited models' 
                      : `${subscription.numberOfModel} models`
                    }
                  </p>
                </div>
              ))}
            </div>

            {subscriptions.length === 0 && (
              <div className="text-center py-8">
                <Icon icon="mdi:package-variant" className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 font-['Inter']">No subscription plans available</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 mt-6">
              <button 
                className="flex-1 px-6 py-3 rounded-lg bg-zinc-800 text-white font-semibold font-['Inter'] hover:bg-zinc-700 transition-colors border border-zinc-700"
                onClick={() => setIsModalOpen(false)}
                disabled={isChangingSubscription}
              >
                Cancel
              </button>
              <button 
                className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold font-['Inter'] hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleChangeSubscription}
                disabled={!selectedSubscriptionId || isChangingSubscription}
              >
                {isChangingSubscription ? (
                  <span className="flex items-center justify-center gap-2">
                    <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                    Changing...
                  </span>
                ) : (
                  'Change Subscription'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

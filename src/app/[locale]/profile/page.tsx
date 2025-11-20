"use client";

import { useEffect, useState } from 'react';
import { useRouter } from '@/../i18n/navigation';
import { api, ApiError } from '@/services/api';
import type { UserResponse } from '@/services/api/user';
import { Icon } from '@iconify/react';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [modelLimit, setModelLimit] = useState<number>(50);
  const [modelLimitDescription, setModelLimitDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Check authentication
        const token = api.auth.getAuthToken();
        if (!token) {
          router.push('/login');
          return;
        }

        // Get user ID from token
        const userId = api.auth.getUserId();
        if (!userId) {
          setError('User ID not found in token');
          setIsLoading(false);
          return;
        }

        // Fetch user profile and model limit in parallel
        const [userData, modelLimitData] = await Promise.all([
          api.user.getUserById(userId),
          api.subscription.getUserModelLimit(userId).catch(() => null)
        ]);
        
        setProfile(userData);
        
        // Set model limit from API if available
        if (modelLimitData) {
          setModelLimit(modelLimitData.modelLimit);
          setModelLimitDescription(modelLimitData.description);
        }
        
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load profile data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-['Inter']">Loading...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-xl font-['Inter'] text-red-600 mb-4">{error || 'Failed to load profile'}</p>
          <button
            onClick={() => router.back()}
            className="text-blue-900 text-lg font-normal font-['Inter'] hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Determine subscription plan based on role or other criteria
  const subscription = profile.role?.roleName === 'PREMIUM' ? 'Pro' : 'Basic';
  const subscriptionColor = subscription === 'Pro' ? 'text-blue-900' : 'text-black';
  const statusColor = profile.status ? 'text-green-700' : 'text-red-600';
  const statusText = profile.status ? 'Active' : 'Inactive';
  
  // Use model limit from API
  const modelsRemaining = modelLimit - profile.numberOfModel;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-blue-900 text-4xl font-bold font-['Unbounded']">User Profile</h1>
          <button
            onClick={() => router.back()}
            className="text-black text-lg font-normal font-['Inter'] hover:text-blue-900"
          >
            <Icon icon="mdi:arrow-left" className="inline w-6 h-6 mr-2" />
            Back
          </button>
        </div>

        {/* Profile Info Card */}
        <div className="bg-white rounded-2xl p-8 space-y-6">
          <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className="w-24 h-24 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-24 h-24 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-3xl font-bold font-['Unbounded']">
                  {profile.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-black text-2xl font-semibold font-['Unbounded']">{profile.fullName}</h2>
              <p className="text-gray-600 text-xl font-light font-['Inter'] mt-1">{profile.email}</p>
              {profile.verified && (
                <span className="inline-flex items-center mt-2 text-green-700 text-sm font-normal font-['Inter']">
                  <Icon icon="mdi:check-circle" className="w-4 h-4 mr-1" />
                  Verified
                </span>
              )}
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-gray-500 text-base font-normal font-['Inter']">Subscription Plan</p>
              <p className={`text-2xl font-semibold font-['Inter'] ${subscriptionColor}`}>
                {subscription}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-gray-500 text-base font-normal font-['Inter']">Status</p>
              <p className={`text-2xl font-semibold font-['Inter'] ${statusColor}`}>
                {statusText}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-gray-500 text-base font-normal font-['Inter']">Models Created</p>
              <p className="text-black text-2xl font-semibold font-['Inter']">
                {profile.numberOfModel} / {modelLimit}
              </p>
              {modelLimitDescription && (
                <p className="text-gray-500 text-sm font-light font-['Inter']">{modelLimitDescription}</p>
              )}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-900 h-3 rounded-full"
                  style={{ width: `${Math.min((profile.numberOfModel / modelLimit) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-gray-500 text-base font-normal font-['Inter']">Loyalty Points</p>
              <p className="text-black text-2xl font-semibold font-['Inter']">{profile.loyaltyPoints}</p>
            </div>

            {profile.phone && (
              <div className="space-y-2">
                <p className="text-gray-500 text-base font-normal font-['Inter']">Phone</p>
                <p className="text-black text-xl font-light font-['Inter']">{profile.phone}</p>
              </div>
            )}

            {profile.address && (
              <div className="space-y-2">
                <p className="text-gray-500 text-base font-normal font-['Inter']">Address</p>
                <p className="text-black text-xl font-light font-['Inter']">{profile.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Subscription Details Card */}
        <div className="bg-white rounded-2xl p-8">
          <h2 className="text-black text-2xl font-semibold font-['Unbounded'] mb-6">Subscription Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-black text-xl font-normal font-['Inter']">Current Plan</span>
              <span className={`text-xl font-semibold font-['Inter'] ${subscriptionColor}`}>
                {subscription}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-black text-xl font-normal font-['Inter']">Role</span>
              <span className="text-black text-xl font-semibold font-['Inter']">
                {profile.role?.roleName || 'User'}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-black text-xl font-normal font-['Inter']">Models Limit</span>
              <span className="text-black text-xl font-semibold font-['Inter']">
                {modelLimit} models
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-black text-xl font-normal font-['Inter']">Models Remaining</span>
              <span className="text-black text-xl font-semibold font-['Inter']">
                {Math.max(modelsRemaining, 0)} models
              </span>
            </div>

            {modelLimitDescription && (
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-black text-xl font-normal font-['Inter']">Plan Details</span>
                <span className="text-gray-600 text-lg font-light font-['Inter']">
                  {modelLimitDescription}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center py-3">
              <span className="text-black text-xl font-normal font-['Inter']">Loyalty Points</span>
              <span className="text-black text-xl font-light font-['Inter']">{profile.loyaltyPoints} pts</span>
            </div>
          </div>

          {subscription === 'Basic' && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="w-full bg-blue-900 text-white rounded-xl px-6 py-3 font-['Unbounded'] text-lg font-semibold hover:bg-blue-800 transition-colors">
                Upgrade to Pro
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

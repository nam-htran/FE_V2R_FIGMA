"use client";

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from '@/../i18n/navigation';
import { api, ApiError } from '@/services/api';
import type { UserResponse } from '@/services/api/user';
import { Icon } from '@iconify/react';
import { useToast } from '@/context/ToastContext';
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
  const t = useTranslations('Profile');
  const router = useRouter();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [modelLimit, setModelLimit] = useState<number>(50);
  const [modelLimitDescription, setModelLimitDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = api.auth.getAuthToken();
        if (!token) {
          router.push('/login');
          return;
        }
        const userId = api.auth.getUserId();
        if (!userId) {
          setError('User ID not found in token');
          setIsLoading(false);
          return;
        }
        const [userData, modelLimitData] = await Promise.all([
          api.user.getUserById(userId),
          api.subscription.getUserModelLimit(userId).catch(() => null)
        ]);
        setProfile(userData);
        setFullName(userData.fullName || '');
        setPhone(userData.phone || '');
        setAddress(userData.address || '');
        
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
  
  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsUpdating(true);
    try {
      // Logic gọi API update user sẽ ở đây
      await new Promise(resolve => setTimeout(resolve, 1000)); // Giả lập gọi API
      setProfile(prev => prev ? {...prev, fullName, phone, address} : null);
      showToast(t('toasts.updateSuccess'), 'success');
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : t('toasts.updateFailed'), 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast(t('toasts.passwordMismatch'), 'warning');
      return;
    }
    setIsChangingPassword(true);
    try {
      // Logic gọi API đổi mật khẩu sẽ ở đây
      await new Promise(resolve => setTimeout(resolve, 1000)); // Giả lập gọi API
      showToast(t('toasts.passwordChangeSuccess'), 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : t('toasts.passwordChangeFailed'), 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

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

  const subscription = profile.role?.roleName === 'PREMIUM' ? 'Pro' : 'Basic';
  const subscriptionColor = subscription === 'Pro' ? 'text-blue-900' : 'text-black';
  const statusColor = profile.status ? 'text-green-700' : 'text-red-600';
  const statusText = profile.status ? 'Active' : 'Inactive';
  const modelsRemaining = modelLimit - profile.numberOfModel;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
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

        <div className="bg-white rounded-2xl p-8 space-y-6">
            <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
                {profile.avatar ? (
                <img src={profile.avatar} alt={profile.fullName} className="w-24 h-24 rounded-full object-cover flex-shrink-0" />
                ) : (
                <div className="w-24 h-24 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-3xl font-bold font-['Unbounded']">{profile.fullName.charAt(0).toUpperCase()}</span>
                </div>
                )}
                <div>
                <h2 className="text-black text-2xl font-semibold font-['Unbounded']">{profile.fullName}</h2>
                <p className="text-gray-600 text-xl font-light font-['Inter'] mt-1">{profile.email}</p>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-2xl p-8">
          <h2 className="text-black text-2xl font-semibold font-['Unbounded'] mb-6">{t('updateInfo')}</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="text-gray-500 text-sm font-['Inter']">{t('fullName')}</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full mt-1 p-2 border rounded-md"/>
            </div>
            <div>
              <label className="text-gray-500 text-sm font-['Inter']">{t('phone')}</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full mt-1 p-2 border rounded-md"/>
            </div>
            <div>
              <label className="text-gray-500 text-sm font-['Inter']">{t('address')}</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full mt-1 p-2 border rounded-md"/>
            </div>
            <button type="submit" disabled={isUpdating} className="w-full bg-blue-900 text-white rounded-xl px-6 py-3 font-['Unbounded'] text-lg font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50">
              {isUpdating ? t('saving') : t('saveButton')}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl p-8">
          <h2 className="text-black text-2xl font-semibold font-['Unbounded'] mb-6">{t('changePassword')}</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="text-gray-500 text-sm font-['Inter']">{t('currentPassword')}</label>
              <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full mt-1 p-2 border rounded-md"/>
            </div>
            <div>
              <label className="text-gray-500 text-sm font-['Inter']">{t('newPassword')}</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full mt-1 p-2 border rounded-md"/>
            </div>
             <div>
              <label className="text-gray-500 text-sm font-['Inter']">{t('confirmNewPassword')}</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full mt-1 p-2 border rounded-md"/>
            </div>
            <button type="submit" disabled={isChangingPassword} className="w-full bg-neutral-800 text-white rounded-xl px-6 py-3 font-['Unbounded'] text-lg font-semibold hover:bg-neutral-700 transition-colors disabled:opacity-50">
              {isChangingPassword ? t('changing') : t('changePasswordButton')}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl p-8">
            <h2 className="text-black text-2xl font-semibold font-['Unbounded'] mb-6">Subscription Details</h2>
            <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-black text-xl font-normal font-['Inter']">Current Plan</span>
                    <span className={`text-xl font-semibold font-['Inter'] ${subscriptionColor}`}>{subscription}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-black text-xl font-normal font-['Inter']">Models Remaining</span>
                    <span className="text-black text-xl font-semibold font-['Inter']">{Math.max(modelsRemaining, 0)} models</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
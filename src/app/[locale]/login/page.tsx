"use client";

import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '../../../../i18n/navigation';
import { useAuth } from '@/context/AuthContext'; // 1. Import useAuth
import React from 'react';

export default function LoginPage() {
  const t = useTranslations('Login');
  const { login } = useAuth(); // 2. Lấy hàm login

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn form submit lại trang
    login(); // 3. Gọi hàm login để cập nhật trạng thái và chuyển hướng
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-neutral-800">
      <div className="w-full max-w-sm mx-auto bg-stone-900 text-white rounded-2xl shadow-lg p-8">
        
        <div className="text-center mb-4">
          <Image src="/logo/light.png" alt="V2R Logo" width={50} height={31} className="mx-auto mb-6" />
          <h1 className="text-xl font-semibold font-['Unbounded']">{t('welcome')}</h1>
          <p className="text-sm text-gray-300 font-['Inter'] mt-2">{t('get_started')}</p>
        </div>

        {/* 4. Gắn sự kiện onSubmit */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <input 
              type="email" 
              placeholder={t('email_placeholder')}
              className="w-full h-10 px-4 bg-stone-900 border border-zinc-700 rounded-lg text-sm text-zinc-400 font-['Inter'] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder={t('password_placeholder')}
              className="w-full h-10 px-4 bg-stone-900 border border-zinc-700 rounded-lg text-sm text-zinc-400 font-['Inter'] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            type="submit"
            className="w-full h-10 bg-blue-800 rounded-lg text-sm font-bold font-['Unbounded'] hover:bg-blue-700 transition-colors"
          >
            {t('continue_button')}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link href="/forgot-password" className="text-xs text-cyan-300 hover:underline font-semibold font-['Inter']">
            {t('forgot_password')}
          </Link>
        </div>
        
        <div className="flex items-center my-6">
          <hr className="w-full border-zinc-700" />
          <span className="px-2 text-xs text-stone-300 font-['Inter']">{t('or')}</span>
          <hr className="w-full border-zinc-700" />
        </div>

        <button className="w-full h-10 mt-4 bg-white text-black rounded-lg text-sm font-semibold font-['Inter'] flex items-center justify-center hover:bg-gray-200 transition-colors">
          <Icon icon="flat-color-icons:google" className="w-5 h-5 mr-2" />
          {t('continue_with_google')}
        </button>

        <div className="flex justify-center space-x-4 mt-6">
            <Link href="/" className="w-9 h-9 bg-white rounded-full flex items-center justify-center" aria-label="Continue with Facebook">
                <Icon icon="logos:facebook" className="w-full h-full" />
            </Link>
            <Link href="/" className="w-9 h-9 bg-black rounded-full flex items-center justify-center border border-gray-600" aria-label="Continue with X">
                <Icon icon="fa6-brands:square-x-twitter" className="w-full h-full" />
            </Link>
            <Link href="/" className="w-9 h-9 bg-[#5865F2] rounded-full flex items-center justify-center" aria-label="Continue with Discord">
                <Icon icon="skill-icons:discord" className="w-full h-full" />
            </Link>
            <Link href="/" className="w-9 h-9 bg-[#26A5E4] rounded-full flex items-center justify-center" aria-label="Continue with Telegram">
                <Icon icon="streamline-color:telegram-flat" className="w-full h-full" />
            </Link>
        </div>

        <div className="text-center text-xs text-white font-medium font-['Inter'] mt-6">
          {t('no_account')}{' '}
          <Link href="/register" className="text-cyan-300 hover:underline">
            {t('register_now')}
          </Link>
        </div>

        <div className="text-center text-zinc-400 text-[9px] font-medium font-['Inter'] mt-8">
          <span>{t('terms_prefix')} </span>
          <Link href="/terms" className="text-cyan-300 hover:underline">{t('terms_of_use')}</Link>
          <span> {t('terms_and')} </span>
          <Link href="/privacy" className="text-cyan-300 hover:underline">{t('privacy_policy')}</Link>
          <span>.</span>
        </div>

      </div>
    </main>
  );
}
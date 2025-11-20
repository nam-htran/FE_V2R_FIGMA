// ===== .\src\app\[locale]\register\page.tsx =====
"use client";

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/../i18n/navigation';
import Home from '../page';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import type { FormEvent } from 'react';

export default function RegisterPage() {
  const t = useTranslations('Register');
  const { login } = useAuth();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Lớp 1: Nền là toàn bộ trang Landing Page */}
      {/* --- THAY ĐỔI TẠI ĐÂY --- */}
      <div className="absolute inset-0 blur-md scale-105">
        <Home />
      </div>

      {/* Lớp 2: Lớp phủ mờ toàn màn hình */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Lớp 3: Panel Đăng ký ở giữa */}
      <main className="relative z-20 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-sm h-auto bg-white/40 shadow-2xl backdrop-blur-2xl rounded-2xl overflow-hidden p-8 font-['Inter']"
        >
          {/* ... Phần còn lại của component giữ nguyên ... */}
          <div className="absolute w-96 h-[503px] left-[427px] top-[676px] origin-top-left rotate-[-162deg] bg-gradient-to-b from-gray-400 to-cyan-400 rounded-full -z-10" />
          <div className="text-center mb-8">
            <Image src="/logo/dark.png" alt="V2R Logo" width={92} height={57} className="mx-auto" />
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder={t('email_placeholder')}
              className="w-full h-9 px-4 bg-white/40 rounded-[10px] backdrop-blur-md text-zinc-800 placeholder:text-zinc-600 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <input
              type="password"
              placeholder={t('password_placeholder')}
              className="w-full h-9 px-4 bg-white/40 rounded-[10px] backdrop-blur-md text-zinc-800 placeholder:text-zinc-600 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <input
              type="password"
              placeholder={t('confirm_password_placeholder')}
              className="w-full h-9 px-4 bg-white/40 rounded-[10px] backdrop-blur-md text-zinc-800 placeholder:text-zinc-600 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <button
              type="submit"
              className="w-full h-9 bg-gradient-to-r from-cyan-600 to-sky-300 rounded-xl text-white text-xs font-bold font-['Unbounded'] hover:opacity-90 transition-opacity"
            >
              {t('continue_button')}
            </button>
          </form>
          <div className="text-center text-xs font-semibold mt-8">
            <span className="text-zinc-800">{t('have_account')}{' '}</span>
            <Link href="/login" className="text-cyan-600 underline hover:text-cyan-700">{t('login_now')}</Link>
          </div>
          <div className="text-center text-[8px] font-medium text-zinc-800 mt-5">
            <span>{t('terms_prefix')}{' '}</span>
            <Link href="/terms" className="text-cyan-600 hover:underline">{t('terms_of_use')}</Link>
            <span>{' '}{t('terms_and')}{' '}</span>
            <Link href="/privacy" className="text-cyan-600 hover:underline">{t('privacy_policy')}</Link>
            <span>.</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
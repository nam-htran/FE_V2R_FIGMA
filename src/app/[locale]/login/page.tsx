// ===== .\src\app\[locale]\login\page.tsx =====
"use client";

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/../i18n/navigation';
import { Icon } from '@iconify/react';
import Home from '../page';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import type { FormEvent } from 'react';

export default function LoginPage() {
  const t = useTranslations('Login');
  const { login } = useAuth();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Lớp 1: Nền là toàn bộ trang Landing Page */}
      {/* --- THAY ĐỔI TẠI ĐÂY --- */}
      {/* Thêm 'blur-md' để làm mờ component Home */}
      {/* Thêm 'scale-105' để phóng to nhẹ, tránh viền mờ ở cạnh màn hình */}
      <div className="absolute inset-0 blur-md scale-105">
        <Home />
      </div>

      {/* Lớp 2: Lớp phủ mờ toàn màn hình (vẫn giữ để làm tối nền) */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Lớp 3: Panel Đăng nhập ở giữa */}
      <main className="relative z-20 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-sm h-auto bg-white/40 shadow-2xl backdrop-blur-2xl rounded-2xl overflow-hidden p-8 font-['Inter']"
        >
          {/* ... Phần còn lại của component giữ nguyên ... */}
          <div className="absolute w-96 h-[503px] left-[365px] top-[509px] origin-top-left rotate-[127deg] bg-gradient-to-b from-gray-400 to-cyan-400 rounded-full -z-10" />
          <div className="absolute w-96 h-[503px] left-[337px] top-[-130px] origin-top-left rotate-[127deg] bg-gradient-to-b from-gray-400 to-cyan-400 rounded-full -z-10" />
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
            <button
              type="submit"
              className="w-full h-9 bg-gradient-to-r from-cyan-600 to-sky-300 rounded-xl text-white text-xs font-bold font-['Unbounded'] hover:opacity-90 transition-opacity"
            >
              {t('continue_button')}
            </button>
          </form>
          <div className="text-center mt-2">
            <Link href="/forgot-password" className="text-cyan-600 text-xs font-semibold underline hover:text-cyan-700">
              {t('forgot_password')}
            </Link>
          </div>
          <div className="flex items-center my-4">
            <hr className="flex-grow border-black/20" />
            <span className="px-2 text-zinc-800 text-[10px]">Hoặc</span>
            <hr className="flex-grow border-black/20" />
          </div>
          <button className="w-full h-9 bg-white/40 rounded-[10px] backdrop-blur-md flex items-center justify-center gap-x-2 text-black text-xs font-semibold hover:bg-white/60 transition-colors">
            <Icon icon="flat-color-icons:google" className="w-4 h-4" />
            {t('continue_with_google')}
          </button>
          <div className="flex justify-center space-x-4 my-4">
            <Link href="/" className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"><Icon icon="logos:facebook" className="w-full h-full" /></Link>
            <Link href="/" className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center p-1.5 shadow-md hover:scale-110 transition-transform"><Icon icon="skill-icons:discord" className="text-white" /></Link>
            <Link href="/" className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center p-1.5 shadow-md hover:scale-110 transition-transform"><Icon icon="logos:telegram" className="text-white" /></Link>
            <Link href="/" className="w-7 h-7 bg-black rounded-full flex items-center justify-center p-1.5 shadow-md hover:scale-110 transition-transform"><Icon icon="fa6-brands:x-twitter" className="text-white" /></Link>
          </div>
          <div className="text-center text-xs font-semibold">
            <span className="text-zinc-800">{t('no_account')}{' '}</span>
            <Link href="/register" className="text-cyan-600 underline hover:text-cyan-700">{t('register_now')}</Link>
          </div>
          <div className="text-center text-[8px] font-medium text-zinc-800 mt-6">
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
// ===== .\src\components\auth\LoginModal.tsx =====
"use client";

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/../i18n/navigation';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useUI } from '@/context/UIContext';
import type { FormEvent } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const t = useTranslations('Login');
  const { login } = useAuth();
  const { openRegisterModal } = useUI();

  const handleSubmit = (e: FormEvent) => { e.preventDefault(); onClose(); login(); };
  const switchToRegister = () => { onClose(); setTimeout(openRegisterModal, 300); };

  // --- TẠO MỘT BIẾN ĐỂ TÁI SỬ DỤNG CLASS CHO GỌN ---
  const inputClasses = "w-full h-10 px-4 bg-white/40 rounded-[10px] text-zinc-800 placeholder:text-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-[0px_13.07px_43.71px_0px_rgba(0,0,0,0.15)] backdrop-blur-[28.56px]";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 font-inter">
          
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }} onClick={(e) => e.stopPropagation()}
            className="relative w-72 h-[619px] rounded-2xl overflow-hidden flex justify-center">
            
            <Image src="/landing-page/background/login.png" alt="Login background" layout="fill" objectFit="cover" className="-z-10" />
            
            <div className="w-full h-full p-6 flex flex-col">
              <Image src="/logo/dark.png" alt="V2R Logo" width={92} height={57} className="mx-auto mt-16 mb-8" />
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* --- THAY ĐỔI TẠI ĐÂY --- */}
                <input type="email" placeholder={t('email_placeholder')} className={inputClasses} required />
                <input type="password" placeholder={t('password_placeholder')} className={inputClasses} required />
                <button type="submit" className="w-full h-10 bg-gradient-to-r from-cyan-600 to-sky-300 rounded-xl text-white text-sm font-bold font-unbounded hover:opacity-90 transition-opacity">
                  {t('continue_button')}
                </button>
              </form>
              <div className="text-center text-sm font-semibold mt-4">
                <span className="text-zinc-800">{t('no_account')}{' '}</span>
                <button onClick={switchToRegister} className="text-cyan-600 underline hover:text-cyan-700">{t('register_now')}</button>
              </div>
              <div className="text-center mt-1">
                <Link href="/forgot-password" className="text-cyan-600 text-sm font-semibold underline hover:text-cyan-700">
                  {t('forgot_password')}
                </Link>
              </div>
              <div className="flex items-center my-4">
                <hr className="flex-grow border-black/20" /><span className="px-2 text-zinc-800 text-xs">{t('or')}</span><hr className="flex-grow border-black/20" />
              </div>
              {/* --- THAY ĐỔI TẠI ĐÂY --- */}
              <button className={`${inputClasses} flex items-center justify-center gap-x-2 text-black font-semibold hover:bg-white/60 transition-colors`}>
                <Icon icon="flat-color-icons:google" className="w-5 h-5" />
                {t('continue_with_google')}
              </button>
              <div className="flex justify-center space-x-4 mt-4">
                <Link href="/" className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"><Icon icon="logos:facebook" className="w-full h-full" /></Link>
                <Link href="/" className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center p-1.5 shadow-md hover:scale-110 transition-transform"><Icon icon="skill-icons:discord" className="text-white" /></Link>
                <Link href="/" className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center p-1.5 shadow-md hover:scale-110 transition-transform"><Icon icon="logos:telegram" className="text-white" /></Link>
                <Link href="/" className="w-7 h-7 bg-black rounded-full flex items-center justify-center p-1.5 shadow-md hover:scale-110 transition-transform"><Icon icon="fa6-brands:x-twitter" className="text-white" /></Link>
              </div>
              <div className="text-center text-[10px] font-medium text-zinc-800 mt-auto pt-6">
                <span>{t('terms_prefix')}{' '}</span><Link href="/terms" className="text-cyan-600 hover:underline">{t('terms_of_use')}</Link><span>{' '}{t('terms_and')}{' '}</span><Link href="/privacy" className="text-cyan-600 hover:underline">{t('privacy_policy')}</Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
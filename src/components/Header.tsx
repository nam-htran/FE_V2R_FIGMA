// ===== .\src\components\Header.tsx =====
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Link, usePathname } from '../../i18n/navigation';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useAuth } from '@/context/AuthContext';
import { Icon } from '@iconify/react';
import { useUI } from '@/context/UIContext';

const Header = () => {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { openLoginModal, openRegisterModal } = useUI();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="absolute top-0 left-0 w-full z-20">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24">
        <div className="flex items-center">
          <Link href="/">
            <Image src="/logo/dark.png" alt="Logo" width={90} height={56} priority />
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-12 text-lg font-['Unbounded']">
          <Link href="/" className={`relative font-medium transition-colors ${isActive('/') ? 'text-black font-bold' : 'text-neutral-700 hover:text-black'}`}>
            {t('home')}
            {isActive('/') && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-black rounded-full"></span>}
          </Link>
          <Link href="/community" className={`font-medium transition-colors ${isActive('/community') ? 'text-black font-bold' : 'text-neutral-700 hover:text-black'}`}>{t('community')}</Link>
          <Link href="/features" className={`font-medium transition-colors ${isActive('/features') ? 'text-black font-bold' : 'text-neutral-700 hover:text-black'}`}>{t('features')}</Link>
          {/* CẬP NHẬT: Sửa href từ chuỗi thành object để trỏ đến anchor link */}
          <Link 
            href={{ pathname: '/', hash: 'pricing' }} 
            className={`font-medium transition-colors ${pathname.startsWith('/#pricing') ? 'text-black font-bold' : 'text-neutral-700 hover:text-black'}`}
          >
            {t('pricing')}
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <LanguageSwitcher />

          {isAuthenticated ? (
             <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-12 h-12 bg-zinc-300 rounded-full flex items-center justify-center ring-2 ring-offset-2 ring-blue-500">
                <Icon icon="mdi:user" className="w-7 h-7 text-black" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                  {((user?.role || '').toLowerCase() === 'admin') && (
                    <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                  )}
                  <Link href="/workspace" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Workspace</Link>
                  <button onClick={() => { logout(); setIsDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={openLoginModal} className="text-neutral-800 font-['Unbounded'] text-lg font-medium hover:text-black transition-colors">{t('log_in')}</button>
              <Link href="/workspace" className="bg-gradient-to-r from-[#2980B9] to-[#6DD5FA] text-white rounded-xl px-7 py-3 font-['Unbounded'] text-base hover:opacity-90 transition-opacity shadow-md">
                {t('start_for_free')}
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
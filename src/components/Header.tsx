"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '../../i18n/navigation'; // Sử dụng Link từ next-intl
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useAuth } from '@/context/AuthContext'; // 1. Import useAuth hook
import { Icon } from '@iconify/react';

const Header = () => {
  const t = useTranslations('Header');
  const { isAuthenticated, logout } = useAuth(); // 2. Lấy trạng thái và hàm logout
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 w-full z-10">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24">
        <div className="flex items-center">
          <Link href="/">
            <Image src="/logo/dark.png" alt="Logo" width={50} height={50} />
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-gray-800 font-['Unbounded'] text-lg">
          <Link href="/" className="bg-neutral-900 text-neutral-100 rounded-xl px-6 py-2.5 font-bold">{t('home')}</Link>
          <Link href="/community">{t('community')}</Link>
          <Link href="/features">{t('features')}</Link>
          <Link href="/pricing">{t('pricing')}</Link>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <LanguageSwitcher />

          {/* 3. Hiển thị có điều kiện */}
          {isAuthenticated ? (
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-10 h-10 bg-zinc-300 rounded-full flex items-center justify-center">
                <Icon icon="mdi:user" className="w-6 h-6 text-black" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <Link href="/workspace" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Workspace</Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-gray-800 font-['Unbounded'] text-lg">{t('log_in')}</Link>
              <Link href="/start" className="bg-neutral-900 text-neutral-100 rounded-xl px-6 py-2.5 font-['Unbounded'] text-lg">{t('start_for_free')}</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
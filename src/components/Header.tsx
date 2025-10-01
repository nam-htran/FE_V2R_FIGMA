"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Header = () => {
  const t = useTranslations('Header');

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
          <Link href="/login" className="text-gray-800 font-['Unbounded'] text-lg">{t('log_in')}</Link>
          <Link href="/start" className="bg-neutral-900 text-neutral-100 rounded-xl px-6 py-2.5 font-['Unbounded'] text-lg">{t('start_for_free')}</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
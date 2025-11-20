"use client";

import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const Footer: FC = () => {
  const t = useTranslations('Footer');

  return (
    <footer className="relative pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 text-neutral-900">
        <div className="lg:col-span-2">
          {/* === CHỈNH SỬA TẠI ĐÂY === */}
          <h3 className="text-xl font-semibold font-['Unbounded']">{t('subscribe_title')}</h3>
          <p className="mt-2 text-lg font-['Inter']">{t('subscribe_description')}</p>
          <form className="mt-4 flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder={t('email_placeholder')}
              className="w-full sm:w-80 h-11 px-4 rounded-[10px] bg-white text-stone-500 font-['Inter']" 
            />
            {/* === CHỈNH SỬA TẠI ĐÂY === */}
            <button className="bg-gradient-to-r from-cyan-600 to-sky-300 text-white text-lg font-medium font-['Unbounded'] rounded-[10px] h-11 px-8 whitespace-nowrap">
              {t('subscribe_button')}
            </button>
          </form>
        </div>
        
        <div>
          {/* === CHỈNH SỬA TẠI ĐÂY === */}
          <h3 className="text-xl font-semibold font-['Unbounded']">{t('features_title')}</h3>
          <ul className="mt-4 space-y-2 text-lg font-['Inter']">
            <li><Link href="/features#text-to-3d">{t('text_to_3d')}</Link></li>
            <li><Link href="/features#image-to-3d">{t('image_to_3d')}</Link></li>
          </ul>
        </div>

        <div>
          {/* === CHỈNH SỬA TẠI ĐÂY === */}
          <h3 className="text-xl font-semibold font-['Unbounded']">{t('product_title')}</h3>
          <ul className="mt-4 space-y-2 text-lg font-['Inter']">
            <li><Link href="/pricing">{t('pricing')}</Link></li>
            <li><Link href="/community">{t('community')}</Link></li>
            <li><Link href="/plugin">{t('plugin')}</Link></li>
            <li><Link href="/status">{t('status')}</Link></li>
          </ul>
        </div>

        <div>
          {/* === CHỈNH SỬA TẠI ĐÂY === */}
          <h3 className="text-xl font-semibold font-['Unbounded']">{t('company_title')}</h3>
          <ul className="mt-4 space-y-2 text-lg font-['Inter']">
            <li><Link href="/about">{t('about')}</Link></li>
            <li><Link href="/contact">{t('contact')}</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 flex justify-between items-center">
         <Image src="/logo/dark.png" alt="Logo" width={50} height={50} />
      </div>
    </footer>
  );
};

export default Footer;
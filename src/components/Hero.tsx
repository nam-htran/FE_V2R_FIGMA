"use client";

import type { FC } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const Hero: FC = () => {
  const t = useTranslations('Hero');

  return (
    <section className="relative pt-48 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:w-1/2 text-left z-10">
          {/* === CHỈNH SỬA TẠI ĐÂY === */}
          <h1 className="text-5xl lg:text-[52px] font-semibold font-['Unbounded'] capitalize text-[#161616] leading-tight">
            {t('title')}
          </h1>
          {/* === CHỈNH SỬA TẠI ĐÂY === */}
          <p className="mt-6 text-lg font-['Inter'] text-[#171717] max-w-lg">
            {t('description')}
          </p>
          <div className="mt-10 flex items-center space-x-4">
            {/* === CHỈNH SỬA TẠI ĐÂY === */}
            <button className="bg-gradient-to-r from-[#2980B9] to-[#6DD5FA] text-white text-xl font-semibold font-['Unbounded'] tracking-wide rounded-[64px] px-10 py-5 text-center flex items-center hover:opacity-90 transition-opacity shadow-lg">
              {t('start_for_free')}
            </button>
          </div>
        </div>

        <div className="lg:w-1/2 mt-12 lg:mt-0 relative flex justify-center items-center">
          <div className="w-[335px] h-[423px] bg-white/45 shadow-2xl rounded-[50px] backdrop-blur-lg p-4 border border-white/30">
             <div className="w-full h-full relative rounded-[35px] overflow-hidden">
                <Image 
                    src="/landing-page/untiltlsed 3.png" 
                    alt="Featured 3D Model" 
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
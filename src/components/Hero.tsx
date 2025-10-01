"use client";

import type { FC } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const Hero: FC = () => {
  const t = useTranslations('Hero');

  return (
    <section className="relative pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
        {/* Left Content */}
        <div className="lg:w-1/2 text-left">
          <h1 className="text-6xl font-bold font-['Unbounded'] capitalize text-neutral-900">
            {t('title')}
          </h1>
          <p className="mt-6 text-lg font-['Inter'] text-neutral-900 max-w-lg">
            {t('description')}
          </p>
          <div className="mt-8 flex items-center space-x-4">
            <button className="bg-blue-900 text-white text-xl font-semibold font-['Unbounded'] tracking-wide rounded-[30px] px-12 py-4">
              {t('start_for_free')}
            </button>
            <button className="bg-neutral-900 text-neutral-100 text-xl font-semibold font-['Unbounded'] tracking-wide rounded-[30px] px-12 py-4 flex items-center">
              {t('explore')}
              <div className="ml-2 w-7 h-7 flex items-center justify-center">
                 <div className="w-0 h-0 border-t-[7px] border-t-transparent border-l-[10px] border-l-neutral-100 border-b-[7px] border-b-transparent"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="lg:w-1/2 mt-12 lg:mt-0 relative flex justify-center items-center lg:pl-60">
          <div className="w-96 h-[520px] bg-gradient-to-l from-zinc-900 via-gray-400 to-zinc-900 rounded-[20px] relative">
             <Image 
                src="/landing-page/untiltlsed 3.png" 
                alt="Featured 3D Model" 
                width={368} 
                height={465}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover rounded-xl"
             />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
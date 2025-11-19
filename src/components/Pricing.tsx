// ===== .\src\components\Pricing.tsx =====
"use client";

import { useTranslations } from 'next-intl';
import { Icon } from '@iconify/react';
import type { FC } from 'react';

// ... (Component PricingCard giữ nguyên) ...
const PricingCard: FC<{ plan: 'basic' | 'pro' | 'enterprise' }> = ({ plan }) => {
  const t = useTranslations(`Pricing.${plan}`);
  const isPro = plan === 'pro';

  return (
    <div 
      className={`
        flex flex-col p-8 rounded-2xl border transition-all duration-300
        ${isPro 
          ? 'bg-neutral-900 text-white border-blue-700 shadow-2xl lg:scale-105 lg:z-10' 
          : 'bg-white text-neutral-900 border-gray-200 shadow-lg'
        }
      `}
    >
      <h3 className="text-2xl font-bold font-['Inter']">{t('name')}</h3>
      <div className="flex items-baseline mt-8 mb-10 whitespace-nowrap">
        <span className="text-5xl font-bold font-['Inter'] tracking-tight">{t('price')}</span>
        <span className={`text-lg font-medium ml-1 ${isPro ? 'text-gray-400' : 'text-gray-500'}`}>
          /{t('price_period')}
        </span>
      </div>
      <button 
        className={`
          w-full h-12 rounded-lg text-base font-semibold transition-colors
          ${isPro 
            ? 'bg-blue-700 text-white hover:bg-blue-600' 
            : 'bg-neutral-900 text-white hover:bg-neutral-700'
          }
        `}
      >
        {t('cta_button')}
      </button>
      <hr className={`my-8 ${isPro ? 'border-zinc-700' : 'border-gray-300'}`} />
      <ul className="space-y-4 flex-grow">
        {t.raw('features').map((feature: string, index: number) => (
          <li key={index} className="flex items-center text-base font-medium font-['Inter']">
            <div 
              className={`
                w-6 h-6 mr-3 rounded-full flex items-center justify-center flex-shrink-0
                ${isPro ? 'bg-blue-700' : 'bg-neutral-900'}
              `}
            >
              <Icon icon="mdi:check" className="w-4 h-4 text-white" />
            </div>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};


const Pricing: FC = () => {
  const t = useTranslations('Pricing');

  return (
    // SỬA ĐỔI: Thêm id="pricing" vào đây
    <section id="pricing" className="bg-white py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold font-['Unbounded'] text-neutral-900">{t('title')}</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg font-medium font-['Inter'] text-neutral-600">
            {t('subtitle')}
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
          <PricingCard plan="basic" />
          <PricingCard plan="pro" />
          <PricingCard plan="enterprise" />
        </div>
      </div>
    </section>
  );
};

export default Pricing;
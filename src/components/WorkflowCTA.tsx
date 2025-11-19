"use client";

import type { FC } from 'react';
import { useTranslations } from 'next-intl';

const WorkflowCTA: FC = () => {
  const t = useTranslations('WorkflowCTA');

  return (
    <section className="py-20 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold font-['Unbounded'] text-neutral-900">{t('title')}</h2>
        <p className="mt-4 text-xl font-['Inter'] text-neutral-900">
          {t('description')}
        </p>
        <div className="mt-8 flex justify-center items-center space-x-4">
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
    </section>
  );
};

export default WorkflowCTA;
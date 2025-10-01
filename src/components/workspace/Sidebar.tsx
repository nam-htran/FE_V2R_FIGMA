"use client";

import { type FC } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar: FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const t = useTranslations('Sidebar');

  return (
    <>
      {/* Lớp phủ (Overlay) */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-black text-white p-6 overflow-y-auto z-50
          transition-transform duration-300 ease-in-out
          w-full sm:w-96 lg:w-[360px]
          lg:relative lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Image src="/logo/light.png" alt="Logo" width={40} height={25} />
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white">
            <Icon icon="mdi:close" width={28} />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-stone-50 text-black rounded-xl p-1 mb-6">
          <button className="flex-1 p-2.5 rounded-lg text-neutral-400 font-bold text-sm">{t('text_to_3d')}</button>
          <button className="flex-1 p-2.5 bg-blue-900 text-white rounded-lg font-bold text-sm">{t('image_to_3d')}</button>
        </div>

        {/* Image Uploader */}
        <div className="mb-5">
          <label className="text-sm font-normal font-['Inter'] mb-2 block">{t('image_label')}</label>
          <div className="w-full h-60 bg-stone-50 rounded-xl border border-neutral-600 flex flex-col justify-center items-center text-center p-4">
            <Icon icon="icon-park-outline:upload-picture" className="w-12 h-12 text-stone-500 mb-3" />
            <p className="text-stone-500 text-lg font-semibold font-['Inter']">{t('uploader_title')}</p>
            <p className="text-neutral-500 text-xs font-normal font-['Inter'] mt-1">{t('uploader_formats')}</p>
          </div>
        </div>

        {/* Project Name */}
        <div className="mb-5">
          <label className="text-sm font-normal font-['Inter'] mb-2 block">{t('name_label')}</label>
          <input
            type="text"
            placeholder={t('name_placeholder')}
            className="w-full h-12 bg-stone-50 rounded-xl px-4 text-neutral-500 text-sm"
          />
        </div>

        {/* AI Model */}
        <div className="mb-5">
          <label className="text-sm font-normal font-['Inter'] mb-2 block">{t('model_label')}</label>
          <div className="flex items-center justify-between p-1.5 bg-neutral-800 rounded-lg">
            <span className="text-white text-sm">V2R</span>
            <button className="text-xs">▼</button>
          </div>
        </div>

        {/* Symmetry */}
        <div className="mb-6">
          <label className="text-sm font-normal font-['Inter'] mb-2 block">{t('symmetry_label')}</label>
          <div className="flex bg-stone-50 rounded-md p-1">
            <button className="flex-1 text-zinc-600 font-bold p-1.5 text-sm">{t('symmetry_off')}</button>
            <button className="flex-1 bg-blue-900 text-white rounded-md font-bold p-1.5 text-sm">{t('symmetry_auto')}</button>
            <button className="flex-1 text-zinc-600 font-bold p-1.5 text-sm">{t('symmetry_on')}</button>
          </div>
        </div>

        {/* Cost Info */}
        <div className="flex justify-center items-center space-x-3 mb-3 text-sm font-light">
          <span>{t('cost_info_model')}</span>
          <div className="w-px h-5 bg-white"></div>
          <span>{t('cost_info_tokens')}</span>
        </div>

        {/* Generate Button */}
        <button className="w-full h-11 bg-blue-900 rounded-2xl text-neutral-100 text-lg font-semibold font-['Unbounded']">
          {t('generate_button')}
        </button>
      </div>
    </>
  );
};

export default Sidebar;
"use client";

import { type FC } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar: FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, isSidebarOpen, setIsSidebarOpen }) => {
  const t = useTranslations('Sidebar');
  const tWorkspace = useTranslations('Workspace');

  const NavItem = ({ icon, text }: { icon: string; text: string }) => (
    <a
      href="#"
      className={`block flex items-center rounded-md hover:bg-neutral-800 transition-colors ${
        isCollapsed ? 'w-10 h-10 justify-center' : 'p-2 text-neutral-100'
      }`}
    >
      <Icon icon={icon} className="w-6 h-6 text-gray-300 flex-shrink-0" />
      {!isCollapsed && <span className="ml-3 text-sm font-medium whitespace-nowrap">{text}</span>}
    </a>
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`
          bg-neutral-950 text-white flex flex-col h-full z-50
          transition-all duration-300 ease-in-out font-['Inter']
          ${isCollapsed ? 'w-14' : 'w-96'} {/* Cập nhật chiều rộng khi mở rộng */}
          fixed lg:relative top-0 left-0 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className={`flex flex-col flex-grow min-h-0 ${isCollapsed ? 'p-2' : 'p-4'}`}>
           {/* Header */}
          <div className={`flex items-center mb-6 ${isCollapsed ? 'justify-center flex-col space-y-4' : 'justify-between'}`}>
            {!isCollapsed && <Image src="/logo/light.png" alt="Logo" width={40} height={25} />}
            {isCollapsed && <Image src="/logo/light.png" alt="Logo" width={30} height={19} />}

            <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:block text-gray-400 hover:text-white">
              <Icon icon={isCollapsed ? "mdi:arrow-right" : "mdi:arrow-left"} width={20} />
            </button>
            <button onClick={() => setIsSidebarOpen(false)} className={`lg:hidden text-white ${isCollapsed ? 'hidden' : ''}`}>
              <Icon icon="mdi:close" width={28} />
            </button>
          </div>
          
          {/* Nav Items */}
          <nav className={`${isCollapsed ? 'flex flex-col items-center space-y-1' : ''}`}>
            <NavItem icon="mdi:plus-box" text={tWorkspace('new_project')} />
            <NavItem icon="mdi:folder-multiple-image" text={tWorkspace('your_library')} />
            <NavItem icon="mdi:crown" text={tWorkspace('upgrade_account')} />
          </nav>
          
          {/* ====== NỘI DUNG CHI TIẾT KHI MỞ RỘNG ====== */}
          {!isCollapsed && (
            <div className="flex flex-col flex-grow overflow-y-auto mt-4 pr-1">
              <hr className="border-zinc-700 mb-4" />
              
              {/* Mode Toggle */}
              <div className="flex bg-neutral-800 rounded-xl p-1 mb-6">
                <button className="flex-1 p-2 rounded-lg text-neutral-400 font-bold text-sm">{t('text_to_3d')}</button>
                <button className="flex-1 p-2 bg-blue-800 text-white rounded-lg font-bold text-sm">{t('image_to_3d')}</button>
              </div>

              {/* Image Uploader */}
              <div className="mb-5">
                <label className="text-sm font-normal mb-2 block">{t('image_label')}</label>
                <div className="w-full h-40 bg-neutral-900 border border-neutral-700 rounded-xl flex flex-col justify-center items-center text-center p-4">
                  <Icon icon="icon-park-outline:upload-picture" className="w-10 h-10 text-neutral-500 mb-2" />
                  <p className="text-neutral-400 text-base font-semibold">{t('uploader_title')}</p>
                  <p className="text-neutral-500 text-xs font-normal mt-1">{t('uploader_formats')}</p>
                </div>
              </div>

              {/* Project Name */}
              <div className="mb-5">
                <label className="text-sm font-normal mb-2 block">{t('name_label')}</label>
                <input
                  type="text"
                  placeholder={t('name_placeholder')}
                  className="w-full h-11 bg-neutral-800 rounded-xl px-4 text-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>

              {/* AI Model */}
              <div className="mb-5">
                <label className="text-sm font-normal mb-2 block">{t('model_label')}</label>
                <div className="flex items-center justify-between p-2 h-11 bg-neutral-800 rounded-xl">
                  <span className="text-white text-sm">V2R</span>
                  <Icon icon="mdi:chevron-down" className="text-white w-5 h-5" />
                </div>
              </div>

              {/* Symmetry */}
              <div className="mb-6">
                <label className="text-sm font-normal mb-2 block">{t('symmetry_label')}</label>
                <div className="flex bg-neutral-800 rounded-lg p-1">
                  <button className="flex-1 text-neutral-400 font-bold p-1.5 text-sm rounded-md">{t('symmetry_off')}</button>
                  <button className="flex-1 bg-blue-800 text-white rounded-md font-bold p-1.5 text-sm">{t('symmetry_auto')}</button>
                  <button className="flex-1 text-neutral-400 font-bold p-1.5 text-sm rounded-md">{t('symmetry_on')}</button>
                </div>
              </div>

              {/* Cost Info */}
              <div className="flex justify-center items-center space-x-3 mb-4 text-sm font-light text-neutral-300">
                <span>{t('cost_info_model')}</span>
                <div className="w-px h-5 bg-neutral-600"></div>
                <span>{t('cost_info_tokens')}</span>
              </div>

              {/* Generate Button */}
              <button className="w-full h-11 bg-blue-800 rounded-xl text-neutral-100 text-base font-semibold font-['Unbounded'] hover:bg-blue-700 transition-colors">
                {t('generate_button')}
              </button>
            </div>
          )}
        </div>

        {/* User Profile Section */}
        <div className={`border-t border-zinc-700 flex-shrink-0 ${isCollapsed ? 'p-2' : 'p-4'}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 bg-zinc-300 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon icon="mdi:user" className="w-6 h-6 text-black" />
            </div>
            {!isCollapsed && (
              <div className="ml-3">
                <p className="text-sm font-semibold text-white">PhuongBT</p>
                <p className="text-sm font-light text-gray-300">{tWorkspace('user_free_tier')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
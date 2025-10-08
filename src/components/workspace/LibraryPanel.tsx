// ===== .\src\components\workspace\LibraryPanel.tsx =====
"use client";

import { useState, type FC } from 'react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface LibraryPanelProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

const LibraryPanel: FC<LibraryPanelProps> = ({ isCollapsed, setIsCollapsed }) => {
  const t = useTranslations('Workspace');

  const libraryItems = Array(15).fill('/landing-page/image 13.png');
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(libraryItems.length / itemsPerPage);
  const currentItems = libraryItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <aside 
      className={`h-full bg-neutral-950 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out font-['Inter'] overflow-hidden ${
        isCollapsed ? 'w-14 p-2' : 'w-96 p-6'
      }`}
    >
      
      {/* Header không thay đổi */}
      <div className={`flex items-center mb-4 flex-shrink-0 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-white whitespace-nowrap">{t('my_library')}</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-white"
          aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
        >
          <Icon icon={isCollapsed ? "mdi:arrow-left" : "mdi:arrow-right"} width={20} />
        </button>
      </div>

      {/* CẬP NHẬT: Thay vì gỡ bỏ, chúng ta sẽ ẩn nội dung bằng opacity */}
      <div 
        className={`
          flex flex-col flex-grow gap-y-5 transition-opacity duration-200 ease-in-out
          ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
      >
        {/* Nội dung bên trong không thay đổi, chỉ bỏ điều kiện render bên ngoài */}
        <div className="w-[calc(24rem-3rem)] flex flex-col flex-grow gap-y-5" style={{height: 'calc(100vh - 4.5rem)'}}>
          <div className="flex items-center gap-x-4">
            <div className="relative flex-grow">
              <Icon 
                icon="mdi:search" 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" 
              />
              <input 
                type="text" 
                placeholder={t('search')}
                className="w-full h-12 bg-neutral-800 rounded-lg pl-12 pr-4 text-base text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>
            <button className="w-36 h-12 bg-blue-800 rounded-lg text-base font-semibold text-white flex items-center justify-center gap-x-2 hover:bg-blue-700 transition-colors flex-shrink-0">
              <Icon icon="mdi:upload" className="w-6 h-6" />
              {t('upload')}
            </button>
          </div>

          <div className="h-12 bg-neutral-800 rounded-lg flex items-center justify-between px-4">
              <Icon icon="mdi:folder-outline" className="w-6 h-6 text-white" />
              <Icon icon="mdi:arrow-expand-all" className="w-5 h-5 text-white" />
          </div>

          <div className="flex-grow bg-neutral-900 rounded-xl p-4 flex flex-col min-h-0">
            <div className="flex-grow overflow-y-auto pr-2">
              <div className="grid grid-cols-3 gap-4">
                {currentItems.map((src, index) => (
                  <div key={index} className="w-full aspect-square bg-neutral-800 rounded-xl overflow-hidden relative">
                    <Image 
                      src={src} 
                      alt={`Library item ${index + 1}`} 
                      fill
                      style={{ objectFit: 'cover' }}
                      className="opacity-70"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-x-2 flex-shrink-0">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 bg-neutral-800 rounded-md flex items-center justify-center text-white disabled:opacity-50"
              >
                  <Icon icon="mdi:chevron-left" className="w-6 h-6" />
              </button>
              <div className="px-4 py-1.5 bg-neutral-800 rounded-md text-sm text-white">
                  {currentPage} / {totalPages}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 bg-neutral-800 rounded-md flex items-center justify-center text-white disabled:opacity-50"
              >
                  <Icon icon="mdi:chevron-right" className="w-6 h-6" />
              </button>
          </div>
        </div>
      </div>

      {/* CẬP NHẬT: Dùng opacity để hiện các icon khi thu gọn */}
      <div 
        className={`
          flex flex-col items-center space-y-1 mt-10 transition-opacity duration-200 ease-in-out
          ${isCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-neutral-800 cursor-pointer" title={t('search')}>
          <Icon icon="mdi:search" className="w-6 h-6 text-gray-300" />
        </div>
        <div className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-neutral-800 cursor-pointer" title={t('upload')}>
          <Icon icon="mdi:upload" className="w-6 h-6 text-gray-300" />
        </div>
        <div className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-neutral-800 cursor-pointer" title={t('my_library')}>
          <Icon icon="mdi:folder-multiple-image" className="w-6 h-6 text-gray-300" />
        </div>
      </div>
    </aside>
  );
};

export default LibraryPanel;
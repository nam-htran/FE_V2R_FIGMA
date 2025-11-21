// ===== ./src/components/workspace/LibraryPanel.tsx =====
"use client";
import { useState, type FC, useEffect } from 'react'; // Bổ sung useRef, useEffect
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useGeneration } from '@/context/GenerationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { convertAndDownloadModel } from '../../utils/modelConverter';

// --- Component hiển thị trạng thái đang tải ---
const LoadingItem: FC<{ prompt: string; status: string }> = ({ prompt, status }) => (
    <div className="w-full flex flex-col gap-1 p-1 bg-blue-50/50 rounded-lg border border-blue-100 shadow-sm">
        <div className="w-full aspect-square rounded-md bg-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite] z-0" />
            <div className="relative z-10 mb-1">
                <Icon icon="eos-icons:loading" className="w-6 h-6 text-blue-600" />
            </div>
            <div className="relative z-10 w-full flex justify-center px-0.5">
                <span 
                    className="text-[8px] font-black uppercase text-blue-700 tracking-tight whitespace-nowrap origin-center"
                    style={{ transform: 'scale(0.85)' }}
                >
                    {status === 'queued' ? 'WAITING' : 'GENERATING'}
                </span>
            </div>
        </div>
        <p className="text-[10px] text-gray-500 truncate text-center font-medium px-1" title={prompt}>
            {prompt}
        </p>
    </div>
);

const ErrorItem: FC<{ prompt: string; error?: string }> = ({ prompt, error }) => (
    <div className="w-full flex flex-col gap-1 p-1 rounded-lg opacity-70 hover:opacity-100 transition-opacity" title={error}>
        <div className="w-full aspect-square rounded-md bg-red-50 border border-red-100 flex flex-col items-center justify-center">
            <Icon icon="mdi:alert-circle-outline" className="w-6 h-6 text-red-500 mb-1" />
            <span className="text-[9px] font-bold text-red-500">FAILED</span>
        </div>
        <p className="text-[10px] text-gray-500 truncate text-center line-through">{prompt}</p>
    </div>
);

interface LibraryPanelProps { isCollapsed: boolean; toggleCollapse: () => void; }

const LibraryPanel: FC<LibraryPanelProps> = ({ isCollapsed, toggleCollapse }) => {
  const t = useTranslations('Workspace');
  const { library, setCurrentModelUrl, currentModelUrl } = useGeneration();
  
  // State quản lý vị trí menu: { id: jobId, x: number, y: number } hoặc null
  const [activeMenu, setActiveMenu] = useState<{ id: string, x: number, y: number } | null>(null);

  const processingItems = library.filter(item => ['queued', 'processing', 'downloading'].includes(item.status));
  const completedItems = library.filter(item => ['completed', 'failed'].includes(item.status));
  const allItems = [...processingItems, ...completedItems];
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(allItems.length / itemsPerPage) || 1;
  const currentItems = allItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDownload = (url: string, format: 'glb' | 'stl', prompt: string) => {
    convertAndDownloadModel(url, format, prompt.replace(/[^a-z0-9]/gi, '_'));
    setActiveMenu(null);
  };

  // Xử lý mở menu tại vị trí nút bấm
  const handleMenuClick = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    if (activeMenu?.id === jobId) {
        setActiveMenu(null);
    } else {
        const rect = e.currentTarget.getBoundingClientRect();
        // Tính toán vị trí để menu hiện bên trái nút bấm, tránh bị tràn màn hình
        setActiveMenu({ id: jobId, x: rect.left - 130, y: rect.top + 20 }); 
    }
  };

  // Đóng menu khi cuộn trang hoặc click ra ngoài
  useEffect(() => {
    const closeMenu = () => setActiveMenu(null);
    window.addEventListener('click', closeMenu);
    window.addEventListener('scroll', closeMenu, true); // true để bắt sự kiện scroll của div con
    return () => {
        window.removeEventListener('click', closeMenu);
        window.removeEventListener('scroll', closeMenu, true);
    };
  }, []);

  return (
    <aside className={`flex flex-col h-full w-full bg-white/[.43] backdrop-blur-[35px] text-black border-l border-black/10 ${isCollapsed ? 'p-2 items-center' : 'p-4'}`}>
        {/* Header */}
        <div className={`flex items-center mb-4 flex-shrink-0 h-12 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
             {!isCollapsed && <h2 className="text-lg font-['Unbounded'] font-semibold">{t('my_library')}</h2>}
             <button onClick={toggleCollapse} className="text-gray-600 hover:text-black">
                 <Icon icon={isCollapsed ? "mdi:arrow-left" : "mdi:arrow-right"} width={20} />
             </button>
        </div>
        
        {/* Content */}
        <div className={`flex-grow min-w-0 ${isCollapsed ? 'hidden' : 'flex flex-col gap-y-4'}`}>
            <div className="relative">
                <Icon icon="mdi:search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder={t('search')} className="w-full h-10 rounded-lg pl-10 pr-4 text-sm bg-white/60 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="flex-grow overflow-y-auto pr-1 custom-scrollbar relative">
                <div className="grid grid-cols-3 gap-3">
                    {currentItems.length === 0 && (
                        <div className="col-span-3 text-center py-10 text-gray-500 text-sm">
                            <Icon icon="mdi:inbox-outline" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            Library is empty
                        </div>
                    )}

                    <AnimatePresence mode='popLayout'>
                        {currentItems.map((item) => (
                            <motion.div 
                                key={item.jobId} 
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                            >
                                {['queued', 'processing', 'downloading'].includes(item.status) ? (
                                    <LoadingItem prompt={item.prompt} status={item.status} />
                                ) : item.status === 'failed' ? (
                                    <ErrorItem prompt={item.prompt} error={item.error} />
                                ) : (
                                    <div className="relative group">
                                        <div 
                                            onClick={() => setCurrentModelUrl(item.url)}
                                            className={`p-1 rounded-lg cursor-pointer border-2 transition-all ${currentModelUrl === item.url ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:bg-white/40'}`}
                                        >
                                            <div className="w-full aspect-square rounded-md overflow-hidden relative bg-gray-200">
                                                <Image src={item.thumbnailUrl || '/logo/dark.png'} alt={item.prompt} fill className="object-cover" />
                                            </div>
                                            <p className="text-[10px] mt-1 truncate text-center text-gray-700">{item.prompt}</p>
                                        </div>
                                        
                                        {/* Nút 3 chấm */}
                                        <button 
                                            onClick={(e) => handleMenuClick(e, item.jobId)}
                                            className={`absolute top-2 right-2 p-1 rounded-full text-white transition-opacity hover:bg-black/70 z-10 ${activeMenu?.id === item.jobId ? 'bg-black/70 opacity-100' : 'bg-black/50 opacity-0 group-hover:opacity-100'}`}
                                        >
                                            <Icon icon="mdi:dots-horizontal" className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-auto pt-2">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"><Icon icon="mdi:chevron-left" /></button>
                    <span className="text-xs self-center">{currentPage} / {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"><Icon icon="mdi:chevron-right" /></button>
                </div>
            )}
        </div>

        {/* 
            MENU PORTAL: Render menu bằng fixed position để không bị che.
            Nằm ngoài cùng của component return 
        */}
        <AnimatePresence>
            {activeMenu && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.1 }}
                    className="fixed z-[9999] w-36 bg-white rounded-lg shadow-2xl border border-gray-200 p-1"
                    style={{ left: activeMenu.x, top: activeMenu.y }}
                    onClick={(e) => e.stopPropagation()} // Ngăn click vào menu làm đóng menu
                >
                    {(() => {
                        // Tìm item tương ứng để lấy URL
                        const item = library.find(i => i.jobId === activeMenu.id);
                        if (!item) return null;
                        return (
                            <>
                                <button onClick={() => handleDownload(item.url, 'glb', item.prompt)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs rounded hover:bg-gray-100 text-gray-700 font-medium transition-colors">
                                    <Icon icon="mdi:download" className="w-4 h-4 text-blue-600" />
                                    Download GLB
                                </button>
                                <button onClick={() => handleDownload(item.url, 'stl', item.prompt)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs rounded hover:bg-gray-100 text-gray-700 font-medium transition-colors">
                                    <Icon icon="mdi:printer-3d" className="w-4 h-4 text-orange-500" />
                                    Export as STL
                                </button>
                            </>
                        );
                    })()}
                </motion.div>
            )}
        </AnimatePresence>
    </aside>
  );
};

export default LibraryPanel;
// ===== .\src\components\workspace\LibraryPanel.tsx =====
"use client";
import { useState, type FC } from 'react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useGeneration } from '@/context/GenerationContext';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingItem: FC<{ prompt: string; status: string }> = ({ prompt, status }) => (
    <div className="flex flex-col gap-y-2 p-1 rounded-lg">
        <div className="w-full aspect-square rounded-md bg-gray-200/60 animate-pulse flex flex-col items-center justify-center">
            <Icon icon="eos-icons:bubble-loading" className="w-8 h-8 text-blue-600" />
            <p className="text-xs mt-2 font-semibold capitalize text-blue-800">{status}...</p>
        </div>
    </div>
);
const ErrorItem: FC<{ prompt: string; error?: string }> = ({ prompt, error }) => (
    <div className="flex flex-col gap-y-2 p-1 rounded-lg" title={error || 'Failed'}>
        <div className="w-full aspect-square rounded-md bg-red-100 flex flex-col items-center justify-center">
            <Icon icon="mdi:alert-circle-outline" className="w-8 h-8 text-red-600" />
            <p className="text-xs mt-2 font-semibold capitalize text-red-700">Failed</p>
        </div>
    </div>
);

interface LibraryPanelProps { isCollapsed: boolean; toggleCollapse: () => void; }

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 }}};
const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 }};

const LibraryPanel: FC<LibraryPanelProps> = ({ isCollapsed, toggleCollapse }) => {
  const t = useTranslations('Workspace');
  const { library, setCurrentModelUrl, currentModelUrl } = useGeneration();
  
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(library.length / itemsPerPage) || 1;
  const currentItems = library.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <aside className={`flex flex-col h-full w-full bg-white/[.43] backdrop-blur-[35px] text-black border-l border-black/10 ${isCollapsed ? 'p-2 items-center' : 'p-4'}`}>        <div className={`flex items-center mb-4 flex-shrink-0 h-12 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
             <AnimatePresence>
               {/* CẬP NHẬT: Thêm font-['Unbounded'] cho tiêu đề */}
               {!isCollapsed && <motion.h2 initial={{opacity:0, width: 0}} animate={{opacity:1, width: 'auto'}} exit={{opacity:0, width: 0}} className="text-lg font-['Unbounded'] font-semibold whitespace-nowrap overflow-hidden">{t('my_library')}</motion.h2>}
             </AnimatePresence>
             <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} onClick={toggleCollapse} className="text-gray-600 hover:text-black" aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}>
                 <Icon icon={isCollapsed ? "mdi:arrow-left" : "mdi:arrow-right"} width={20} />
             </motion.button>
        </div>
        
        <div className={`flex-grow min-w-0 overflow-hidden ${isCollapsed ? 'hidden' : 'flex flex-col gap-y-5'}`}>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1, transition:{delay: 0.2} }} exit={{ opacity: 0 }}
                  className="flex flex-col flex-grow min-w-0 overflow-hidden gap-y-5"
                >
                    <div className="flex items-center gap-x-4">
                         <div className="relative flex-grow">
                             <Icon icon="mdi:search" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                             <input type="text" placeholder={t('search')} className="w-full h-10 rounded-lg pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 bg-white/80 border border-gray-300" />
                         </div>
                         <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="w-auto h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-x-2 flex-shrink-0 px-4 shadow-md">
                             <Icon icon="mdi:upload" className="w-5 h-5" />
                             <span>{t('upload')}</span>
                         </motion.button>
                    </div>
                    
                    <div className="flex-grow rounded-xl p-2 bg-white/40 min-h-0 border border-white/50">
                        <motion.div 
                          key={currentPage} 
                          variants={containerVariants} initial="hidden" animate="visible"
                          className="h-full overflow-y-auto pr-2"
                        >
                             <div className="grid grid-cols-3 gap-2">
                                 {currentItems.map((item) => (
                                   <motion.div key={item.jobId} variants={itemVariants} className="w-full">
                                        {item.status === 'completed' ? (
                                            <motion.div
                                                whileHover={{ scale: 1.05, zIndex: 10 }} whileTap={{ scale: 0.95 }}
                                                onClick={() => setCurrentModelUrl(item.url)}
                                                className={`p-1 rounded-lg cursor-pointer transition-all border-2 ${currentModelUrl === item.url ? 'border-blue-500 bg-blue-100/50' : 'border-transparent'}`}
                                            >
                                                <div className="w-full aspect-square rounded-md overflow-hidden relative bg-gray-200">
                                                    <Image src={item.thumbnailUrl} alt={item.prompt} fill style={{ objectFit: 'cover' }} />
                                                </div>
                                            </motion.div>
                                        ) : item.status === 'failed' ? (
                                            <ErrorItem prompt={item.prompt} error={item.error} />
                                        ) : (
                                            <LoadingItem prompt={item.prompt} status={item.status} />
                                        )}
                                   </motion.div>
                                 ))}
                             </div>
                        </motion.div>
                    </div>
                    <div className="flex items-center justify-center gap-x-2 flex-shrink-0">
                        <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-9 h-9 rounded-md flex items-center justify-center disabled:opacity-50 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm">
                             <Icon icon="mdi:chevron-left" className="w-6 h-6" />
                        </motion.button>
                        <div className="px-4 py-1.5 rounded-md text-sm bg-white shadow-inner font-semibold text-gray-700">{currentPage} / {totalPages}</div>
                        <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-9 h-9 rounded-md flex items-center justify-center disabled:opacity-50 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm">
                             <Icon icon="mdi:chevron-right" className="w-6 h-6" />
                        </motion.button>
                    </div>
                </motion.div>
              )}
            </AnimatePresence>
        </div>
        
        <div className={`mt-auto ${isCollapsed ? 'block' : 'hidden'}`}>
          <AnimatePresence>
          {isCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center space-y-2"
              >
                  <motion.div whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} className="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer hover:bg-blue-100/60" title={t('search')}><Icon icon="mdi:search" className="w-6 h-6 text-gray-700" /></motion.div>
                  <motion.div whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} className="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer hover:bg-blue-100/60" title={t('upload')}><Icon icon="mdi:upload" className="w-6 h-6 text-gray-700" /></motion.div>
                  <motion.div whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} className="w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer hover:bg-blue-100/60" title={t('my_library')}><Icon icon="mdi:folder-multiple-image" className="w-6 h-6 text-gray-700" /></motion.div>
              </motion.div>
          )}
          </AnimatePresence>
        </div>
    </aside>
  );
};
export default LibraryPanel;
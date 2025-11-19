// ===== .\src\components\workspace\LibraryPanel.tsx =====
"use client";
import { useState, type FC, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useGeneration } from '@/context/GenerationContext';

const LoadingItem: FC<{ prompt: string; status: string }> = ({ prompt, status }) => {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const activeTheme = !mounted ? "dark" : (resolvedTheme || theme || "dark");
    const isLight = activeTheme === 'light';
    const themeClass = (light: string, dark: string) => isLight ? light : dark;

    return (
        <div className="flex flex-col gap-y-2 p-1.5 rounded-lg">
            <div className={`
                w-full aspect-square rounded-md overflow-hidden relative flex flex-col items-center justify-center 
                ${themeClass('bg-indigo-200/60', 'bg-neutral-800 animate-pulse')}
            `}>
                <Icon icon="eos-icons:bubble-loading" className={`w-8 h-8 ${themeClass('text-blue-800', 'text-blue-400')}`} />
                <p className={`text-xs mt-2 font-semibold capitalize ${themeClass('text-blue-900', 'text-blue-300')}`}>{status}...</p>
            </div>
            <p className={`text-xs text-center font-medium truncate ${themeClass('text-neutral-600', 'text-neutral-400')}`}>
                {prompt || 'Untitled'}
            </p>
        </div>
    );
};

const ErrorItem: FC<{ prompt: string; error?: string }> = ({ prompt, error }) => {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const activeTheme = !mounted ? "dark" : (resolvedTheme || theme || "dark");
    const isLight = activeTheme === 'light';
    const themeClass = (light: string, dark: string) => isLight ? light : dark;

    return (
        <div className="flex flex-col gap-y-2 p-1.5 rounded-lg" title={error || 'Failed to generate model'}>
            <div className={`
                w-full aspect-square rounded-md overflow-hidden relative flex flex-col items-center justify-center 
                ${themeClass('bg-red-100', 'bg-red-900/50')}
            `}>
                <Icon icon="mdi:alert-circle-outline" className={`w-8 h-8 ${themeClass('text-red-600', 'text-red-400')}`} />
                 <p className={`text-xs mt-2 font-semibold capitalize ${themeClass('text-red-700', 'text-red-300')}`}>Failed</p>
            </div>
            <p className={`text-xs text-center font-medium truncate ${themeClass('text-neutral-600', 'text-neutral-400')}`}>
                {prompt || 'Untitled'}
            </p>
        </div>
    );
};

interface LibraryPanelProps { isCollapsed: boolean; toggleCollapse: () => void; }

const LibraryPanel: FC<LibraryPanelProps> = ({ isCollapsed, toggleCollapse }) => {
  const t = useTranslations('Workspace');
  const { theme, resolvedTheme } = useTheme();
  const { library, setCurrentModelUrl, currentModelUrl } = useGeneration();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const activeTheme = !mounted ? "dark" : (resolvedTheme || theme || "dark");
  const isLight = activeTheme === 'light';
  
  const themeClass = (light: string, dark: string) => isLight ? light : dark;

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(library.length / itemsPerPage) || 1;
  const currentItems = library.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <aside className={`flex flex-col h-full w-full ${themeClass('bg-white text-black border-l border-gray-200', 'bg-stone-950 text-white')} ${isCollapsed ? 'p-2' : 'p-6'}`}>
        <div className={`flex items-center mb-4 flex-shrink-0 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
             {!isCollapsed && (<h2 className={`text-lg font-semibold whitespace-nowrap`}>{t('my_library')}</h2>)}
             <button onClick={toggleCollapse} className={`${themeClass('text-gray-600 hover:text-black', 'text-gray-400 hover:text-white')}`} aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}>
                 <Icon icon={isCollapsed ? "mdi:arrow-left" : "mdi:arrow-right"} width={20} />
             </button>
        </div>
        <div className={`flex flex-col flex-grow min-w-0 overflow-hidden gap-y-5 transition-opacity duration-200 ease-in-out ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex items-center gap-x-4">
                 <div className="relative flex-grow">
                     <Icon icon="mdi:search" className={`absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 ${themeClass('text-gray-500', 'text-gray-400')}`} />
                     <input type="text" placeholder={t('search')} className={`w-full h-12 rounded-lg pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-700 ${themeClass('bg-indigo-100 text-black placeholder:text-gray-500', 'bg-neutral-800 text-white placeholder:text-gray-400')}`} />
                 </div>
                 <button className="w-36 h-12 bg-blue-900 rounded-lg text-base font-semibold text-white flex items-center justify-center gap-x-2 hover:bg-blue-800 transition-colors flex-shrink-0">
                     <Icon icon="mdi:upload" className="w-6 h-6" />{t('upload')}
                 </button>
            </div>
            <div className={`h-12 rounded-lg flex items-center justify-between px-4 ${themeClass('bg-indigo-100', 'bg-neutral-800')}`}>
                 <Icon icon="mdi:folder-outline" className={`w-6 h-6`} />
                 <Icon icon="mdi:arrow-expand-all" className={`w-5 h-5`} />
            </div>
            <div className={`flex-grow rounded-xl p-4 flex flex-col min-h-0 ${themeClass('bg-indigo-100', 'bg-neutral-900')}`}>
                <div className="flex-grow overflow-y-auto pr-2">
                     <div className="grid grid-cols-3 gap-2">
                         {currentItems.map((item) => {
                            if (item.status === 'completed') {
                                return (
                                    <div
                                        key={item.jobId}
                                        onClick={() => setCurrentModelUrl(item.url)}
                                        className={`
                                            flex flex-col gap-y-2 p-1.5 rounded-lg cursor-pointer transition-colors
                                            ${currentModelUrl === item.url
                                                ? themeClass('bg-blue-200', 'bg-blue-900/50')
                                                : themeClass('hover:bg-indigo-200/60', 'hover:bg-neutral-800')
                                            }
                                        `}
                                    >
                                        <div className="w-full aspect-square rounded-md overflow-hidden relative">
                                            <Image
                                                src={item.thumbnailUrl}
                                                alt={item.prompt}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                        <p className={`text-xs text-center font-medium truncate ${themeClass('text-neutral-800', 'text-neutral-200')}`}>
                                            {item.prompt || 'Untitled'}
                                        </p>
                                    </div>
                                );
                            } else if (item.status === 'failed') {
                                return <ErrorItem key={item.jobId} prompt={item.prompt} error={item.error} />;
                            } else {
                                return <LoadingItem key={item.jobId} prompt={item.prompt} status={item.status} />;
                            }
                         })}
                     </div>
                </div>
            </div>
            <div className="flex items-center justify-center gap-x-2 flex-shrink-0">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className={`w-9 h-9 rounded-md flex items-center justify-center disabled:opacity-50 ${themeClass('bg-blue-900 text-white', 'bg-neutral-800 text-white')}`}>
                     <Icon icon="mdi:chevron-left" className="w-6 h-6" />
                </button>
                <div className={`px-4 py-1.5 rounded-md text-sm ${themeClass('bg-blue-900 text-white', 'bg-neutral-800 text-white')}`}>{currentPage} / {totalPages}</div>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={`w-9 h-9 rounded-md flex items-center justify-center disabled:opacity-50 ${themeClass('bg-blue-900 text-white', 'bg-neutral-800 text-white')}`}>
                     <Icon icon="mdi:chevron-right" className="w-6 h-6" />
                </button>
            </div>
        </div>
        <div className={`flex flex-col items-center space-y-1 mt-auto transition-opacity duration-200 ease-in-out ${isCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`w-10 h-10 flex items-center justify-center rounded-md cursor-pointer ${themeClass('hover:bg-indigo-100', 'hover:bg-neutral-800')}`} title={t('search')}><Icon icon="mdi:search" className={`w-6 h-6 ${themeClass('text-gray-600', 'text-gray-300')}`} /></div>
            <div className={`w-10 h-10 flex items-center justify-center rounded-md cursor-pointer ${themeClass('hover:bg-indigo-100', 'hover:bg-neutral-800')}`} title={t('upload')}><Icon icon="mdi:upload" className={`w-6 h-6 ${themeClass('text-gray-600', 'text-gray-300')}`} /></div>
            <div className={`w-10 h-10 flex items-center justify-center rounded-md cursor-pointer ${themeClass('hover:bg-indigo-100', 'hover:bg-neutral-800')}`} title={t('my_library')}><Icon icon="mdi:folder-multiple-image" className={`w-6 h-6 ${themeClass('text-gray-600', 'text-gray-300')}`} /></div>
        </div>
    </aside>
  );
};
export default LibraryPanel;
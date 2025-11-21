// ===== src/components/workspace/Sidebar.tsx =====
"use client";

import { type FC, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useTranslations, useLocale } from "next-intl";
import { useGeneration } from "@/context/GenerationContext";
import { Link, usePathname, useRouter } from '@/../i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface SidebarProps { 
  isCollapsed: boolean; 
  toggleCollapse: () => void; 
  isSidebarOpen: boolean; 
  setIsSidebarOpen: (isOpen: boolean) => void;
  expandLibraryPanel: () => void;
}

const Sidebar: FC<SidebarProps> = ({ 
  isCollapsed, 
  toggleCollapse, 
  isSidebarOpen, 
  setIsSidebarOpen, 
  expandLibraryPanel 
}) => {
  const t = useTranslations("Sidebar");
  const tWorkspace = useTranslations("Workspace");
  
  const { user, logout, currentProfile } = useAuth();
  const { 
    submitJob, 
    isRateLimited, 
    isGenerating, 
    activeJobCount, 
    maxConcurrentJobs 
  } = useGeneration();
  
  const { showToast } = useToast();

  // --- LANGUAGE SWITCHER LOGIC ---
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'vi' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  // --- LOCAL STATE ---
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState('');
  const [activeTab, setActiveTab] = useState<'image' | 'text'>('image');
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // --- GENERATION LOGIC & VALIDATION ---
  // 1. Check queue limit
  const isLimitReached = activeJobCount >= maxConcurrentJobs;
  // 2. Check input
  const isInputMissing = (activeTab === 'image' && !imageFile) || (activeTab === 'text' && !prompt.trim());
  
  // Disable button if: Sending request OR Input missing OR Queue full OR Rate limited
  const isGenerationDisabled = isGenerating || isInputMissing || isLimitReached || isRateLimited;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGenerate = () => {
    if (activeTab === 'image' && imageFile) {
      submitJob({ type: 'image', imageFile });
    } else if (activeTab === 'text' && prompt.trim()) {
      submitJob({ type: 'text', caption: prompt.trim() });
    } else {
      showToast('Please provide an image or a text prompt.', 'warning');
    }
  };
  
  const handleNewProject = () => {
    setPrompt(''); 
    setImageFile(null); 
    setProjectName('');
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/30 lg:hidden transition-opacity ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} 
        onClick={() => setIsSidebarOpen(false)} 
        aria-hidden="true" 
      />
      
      {/* Main Sidebar Container */}
      <div 
        className={`lg:relative fixed top-0 left-0 h-full z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full'} lg:translate-x-0 lg:w-full`}
      >
        <div ref={userMenuRef} className="flex flex-col h-full w-full bg-white/[.43] backdrop-blur-[35px] text-black border-r border-black/10">
          <div className={`flex flex-col flex-grow min-h-0 overflow-hidden ${isCollapsed ? "p-2" : "p-4"}`}>
              
              {/* --- HEADER SIDEBAR --- */}
              <div className={`flex items-center h-12 ${isCollapsed ? 'justify-center mb-4' : 'justify-between mb-6'}`}>
                   <AnimatePresence>
                     {!isCollapsed && (
                       <motion.div 
                         initial={{opacity:0}} 
                         animate={{opacity:1}} 
                         exit={{opacity:0}}
                         className="flex items-center gap-3" 
                       >
                         <Link href="/">
                           <Image src="/logo/dark.png" alt="Logo" width={40} height={25} />
                         </Link>

                         {/* Language Switcher */}
                         <button
                           onClick={toggleLanguage}
                           className="flex items-center justify-center px-2 py-1 rounded bg-white/50 hover:bg-white/80 border border-gray-200 text-xs font-['Unbounded'] font-bold text-gray-700 transition-colors"
                           title="Switch Language"
                         >
                           {locale === 'en' ? '🇺🇸 EN' : '🇻🇳 VI'}
                         </button>
                       </motion.div>
                     )}
                   </AnimatePresence>

                   {/* Collapse Button (Desktop) */}
                   <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} onClick={toggleCollapse} className="hidden lg:block text-gray-600 hover:text-black" aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
                       <Icon icon={isCollapsed ? "mdi:arrow-right" : "mdi:arrow-left"} width={20} />
                   </motion.button>
                   
                   {/* Close Button (Mobile) */}
                   <AnimatePresence>
                     {!isCollapsed && <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-black" aria-label="Close sidebar" > <Icon icon="mdi:close" width={28} /> </button>}
                   </AnimatePresence>
              </div>

              {/* Logo when collapsed */}
              <AnimatePresence>
                {isCollapsed && (
                  <motion.div 
                    className="mb-6 flex justify-center"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Link href="/">
                      <Image src="/logo/dark.png" alt="Logo" width={32} height={20} />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* --- NAVIGATION --- */}
              <nav className={`${isCollapsed ? "flex flex-col items-center space-y-2" : "space-y-1"}`}>
                  <motion.button whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} onClick={handleNewProject} title={tWorkspace("new_project")} className={`w-full flex items-center rounded-lg transition-colors ${isCollapsed ? "w-10 h-10 justify-center" : "p-2"} hover:bg-blue-100/60`}>
                      <Icon icon="mdi:plus-box-outline" className="w-6 h-6 flex-shrink-0 text-zinc-800" />
                      <AnimatePresence>{!isCollapsed && <motion.span initial={{opacity:0, width: 0}} animate={{opacity:1, width: 'auto', transition:{duration: 0.2}}} exit={{opacity:0, width: 0}} className="ml-3 text-sm font-['Unbounded'] font-medium whitespace-nowrap overflow-hidden">{tWorkspace("new_project")}</motion.span>}</AnimatePresence>
                  </motion.button>
                  <motion.button whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} onClick={expandLibraryPanel} title={tWorkspace("your_library")} className={`w-full flex items-center rounded-lg transition-colors ${isCollapsed ? "w-10 h-10 justify-center" : "p-2"} hover:bg-blue-100/60`}>
                      <Icon icon="mdi:folder-multiple-image" className="w-6 h-6 flex-shrink-0 text-zinc-800" />
                      <AnimatePresence>{!isCollapsed && <motion.span initial={{opacity:0, width: 0}} animate={{opacity:1, width: 'auto', transition:{duration: 0.2}}} exit={{opacity:0, width: 0}} className="ml-3 text-sm font-['Unbounded'] font-medium whitespace-nowrap overflow-hidden">{tWorkspace("your_library")}</motion.span>}</AnimatePresence>
                  </motion.button>
                  <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                    <Link href={{ pathname: '/', hash: 'pricing' }} title={tWorkspace("upgrade_account")} className={`block flex items-center rounded-lg transition-colors ${isCollapsed ? "w-10 h-10 justify-center" : "p-2"} hover:bg-blue-100/60`}>
                        <Icon icon="mdi:crown-outline" className="w-6 h-6 flex-shrink-0 text-zinc-800" />
                        <AnimatePresence>{!isCollapsed && <motion.span initial={{opacity:0, width: 0}} animate={{opacity:1, width: 'auto', transition:{duration: 0.2}}} exit={{opacity:0, width: 0}} className="ml-3 text-sm font-['Unbounded'] font-medium whitespace-nowrap overflow-hidden">{tWorkspace("upgrade_account")}</motion.span>}</AnimatePresence>
                    </Link>
                  </motion.div>
              </nav>

              {/* --- GENERATION CONTROLS --- */}
              <div className={`flex-grow min-w-0 overflow-y-auto ${isCollapsed ? 'hidden' : 'block'}`}>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }} exit={{ opacity: 0 }} className="mt-4 pr-1">
                         <hr className="border-gray-300/70 mb-4" />
                         
                         {/* Tabs */}
                         <div className="bg-white/60 border border-gray-300/50 rounded-lg p-1 mb-6 flex">
                             <button onClick={() => setActiveTab('text')} className={`flex-1 p-1.5 text-xs rounded-md font-bold transition-all ${activeTab === 'text' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow' : 'text-zinc-600'}`}>{t("text_to_3d")}</button>
                             <button onClick={() => setActiveTab('image')} className={`flex-1 p-1.5 text-xs rounded-md font-bold transition-all ${activeTab === 'image' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow' : 'text-zinc-600'}`}>{t("image_to_3d")}</button>
                         </div>
                          
                          {/* Inputs */}
                          {activeTab === 'image' ? (
                            <div className="mb-5">
                                <label className="text-sm font-['Unbounded'] font-semibold mb-2 block">{t("image_label")}</label>
                                <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/png, image/jpeg, image/webp" className="hidden" />
                                <div onClick={() => imageInputRef.current?.click()} className="bg-white/80 border-2 border-dashed border-gray-400/80 rounded-lg w-full h-36 flex flex-col justify-center items-center text-center p-4 cursor-pointer hover:bg-blue-50/70 transition-colors">
                                    <Icon icon="icon-park-outline:upload-picture" className="w-8 h-8 mb-2 text-stone-500" />
                                    {imageFile ? (<p className="text-xs font-semibold text-stone-700 break-all">{imageFile.name}</p>) : (<>
                                        <p className="text-sm font-semibold text-stone-600">{t("uploader_title")}</p>
                                        <p className="text-[10px] font-normal mt-1 text-neutral-500">{t("uploader_formats")}</p>
                                    </>)}
                                </div>
                            </div>
                          ) : (
                            <div className="mb-5">
                                <label className="text-sm font-['Unbounded'] font-semibold mb-2 block">Text Prompt</label>
                                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="A delicious hamburger" className="bg-white/80 border border-gray-300 w-full h-36 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                            </div>
                          )}
                         
                         <div className="mb-5">
                             <label className="text-sm font-['Unbounded'] font-semibold mb-2 block">{t("name_label")}</label>
                             <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder={t("name_placeholder")} className="bg-white/80 border border-gray-300 w-full h-10 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                         </div>
                         
                         {/* Info & Queue Status */}
                         <div className="flex justify-between items-center mb-4 text-xs font-light text-neutral-600">
                             <div className="flex items-center space-x-4"> {/* Đã tăng space-x-4 */}
                                <span>{t("cost_info_model")}</span>
                                <div className="bg-neutral-300 w-px h-3" /> {/* Vạch kẻ mảnh hơn */}
                                <span>{t("cost_info_tokens")}</span>
                             </div>
                             <div className={`font-semibold ${isLimitReached ? 'text-red-500' : 'text-blue-600'}`}>
                                Queue: {activeJobCount}/{maxConcurrentJobs}
                             </div>
                         </div>

                         {/* Generate Button */}
                         <motion.button 
                            whileHover={isGenerationDisabled ? {} : { y: -2, boxShadow: '0 8px 20px -5px rgb(59 130 246 / 0.5)' }} 
                            whileTap={isGenerationDisabled ? {} : { scale: 0.98 }}
                            onClick={handleGenerate} 
                            disabled={isGenerationDisabled} 
                            className={`w-full h-11 rounded-lg text-white text-base font-semibold font-['Unbounded'] flex items-center justify-center transition-colors
                                ${isLimitReached 
                                    ? 'bg-neutral-500 cursor-not-allowed' // Queue Full: Xám đậm, không mờ
                                    : isGenerationDisabled 
                                        ? 'bg-neutral-400 cursor-not-allowed opacity-70' // Disable khác: Xám nhạt, mờ
                                        : 'bg-gradient-to-r from-blue-600 to-cyan-500 cursor-pointer' // Active
                                }
                            `}
                            title={
                                isGenerating ? "Sending request..." : 
                                isLimitReached ? `Queue full (${maxConcurrentJobs} jobs max)` :
                                isRateLimited ? `Rate limit exceeded` : 
                                isInputMissing ? 'Please provide input' : ''
                            }
                         >
                            {isGenerating ? (
                                <>
                                    <Icon icon="eos-icons:bubble-loading" className="w-6 h-6 mr-2" />
                                    <span>Sending...</span>
                                </>
                            ) : isLimitReached ? (
                                <div className="flex items-center gap-2">
                                     <Icon icon="mdi:lock" className="w-4 h-4" />
                                     <span>Queue Full ({activeJobCount}/{maxConcurrentJobs})</span>
                                </div>
                            ) : (
                                t("generate_button")
                            )}
                         </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
              </div>
          </div>
          
          {/* --- USER MENU FOOTER --- */}
          <div className={`relative border-t border-gray-300/70 flex-shrink-0 ${isCollapsed ? "p-2" : "p-4"}`}>
              <AnimatePresence>
                  {isUserMenuOpen && !isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full left-0 right-0 mb-2 p-2"
                    >
                      <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 p-1">
                        <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm rounded-md text-gray-800 hover:bg-blue-100">
                          <Icon icon="mdi:user-circle-outline" className="w-5 h-5" />
                          <span>{tWorkspace('profile')}</span>
                        </Link>
                        <button onClick={() => { logout(); setUserMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50">
                          <Icon icon="mdi:logout" className="w-5 h-5" />
                          <span>{tWorkspace('logout')}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>

              <button
                  onClick={() => setUserMenuOpen(prev => !prev)}
                  className={`w-full p-2 flex items-center transition-colors rounded-lg ${isCollapsed ? 'justify-center' : ''} ${isUserMenuOpen ? 'bg-blue-100/60' : 'hover:bg-black/5'}`}
              >
                   <div className="bg-zinc-300 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {currentProfile?.avatar ? (
                        <Image src={currentProfile.avatar} alt={String(currentProfile.name)} width={40} height={40} className="w-full h-full object-cover" />
                      ) : user?.fullName ? (
                        <span className="text-sm font-semibold text-zinc-700">{user.fullName.split(' ').map(n=>n[0]).slice(0,2).join('')}</span>
                      ) : user?.email ? (
                         <span className="text-sm font-semibold text-zinc-700">{user.email.charAt(0).toUpperCase()}</span>
                      ) : (
                        <Icon icon="mdi:user" className="w-6 h-6 text-zinc-700" />
                      )}
                   </div>
                   <AnimatePresence>
                     {!isCollapsed && (
                       <motion.div initial={{opacity:0, width: 0}} animate={{opacity:1, width: 'auto', transition:{duration: 0.2}}} exit={{opacity:0, width: 0}} className="ml-3 overflow-hidden text-left">
                           <p className="text-sm font-semibold truncate">{user?.fullName || user?.email}</p>
                           <p className="text-gray-600 text-xs font-light truncate">{currentProfile ? `Profile: ${currentProfile.name}` : tWorkspace("user_free_tier")}</p>
                       </motion.div>
                     )}
                   </AnimatePresence>
              </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
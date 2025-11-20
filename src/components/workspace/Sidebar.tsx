// ===== .\src\components\workspace\Sidebar.tsx =====
"use client";
import { type FC, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useGeneration } from "@/context/GenerationContext";
import { Link } from '@/../i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps { 
  isCollapsed: boolean; 
  toggleCollapse: () => void; 
  isSidebarOpen: boolean; 
  setIsSidebarOpen: (isOpen: boolean) => void;
  expandLibraryPanel: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isCollapsed, toggleCollapse, isSidebarOpen, setIsSidebarOpen, expandLibraryPanel }) => {
  const t = useTranslations("Sidebar");
  const tWorkspace = useTranslations("Workspace");
  const { theme, resolvedTheme, setTheme } = useTheme();
  
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState('');
  const [activeTab, setActiveTab] = useState<'image' | 'text'>('image');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { submitJob, isRateLimited } = useGeneration();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const activeTheme = !mounted ? "dark" : (resolvedTheme || theme || "dark");

  const handleGenerate = () => {
    if (activeTab === 'image' && imageFile) {
      submitJob({ type: 'image', imageFile });
    } else if (activeTab === 'text' && prompt) {
      submitJob({ type: 'text', caption: prompt });
    } else {
      alert('Please provide an image or a text prompt.');
    }
  };
  
  const handleNewProject = () => {
    setPrompt(''); setImageFile(null); setProjectName('');
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full w-full bg-white/[.43] backdrop-blur-[35px] text-black border-r border-black/10">      <div className={`flex flex-col flex-grow min-h-0 overflow-hidden ${isCollapsed ? "p-2" : "p-4"}`}>
          <div className={`flex items-center h-12 ${isCollapsed ? 'justify-center mb-4' : 'justify-between mb-6'}`}>
               <AnimatePresence>
                 {!isCollapsed && (
                   <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                     <Link href="/">
                       <Image src="/logo/dark.png" alt="Logo" width={40} height={25} />
                     </Link>
                   </motion.div>
                 )}
               </AnimatePresence>
               <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} onClick={toggleCollapse} className="hidden lg:block text-gray-600 hover:text-black" aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
                   <Icon icon={isCollapsed ? "mdi:arrow-right" : "mdi:arrow-left"} width={20} />
               </motion.button>
               <AnimatePresence>
                 {!isCollapsed && <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-black" aria-label="Close sidebar" > <Icon icon="mdi:close" width={28} /> </button>}
               </AnimatePresence>
          </div>
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
          <div className={`flex-grow min-w-0 overflow-y-auto ${isCollapsed ? 'hidden' : 'block'}`}>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }} exit={{ opacity: 0 }} className="mt-4 pr-1">
                     <hr className="border-gray-300/70 mb-4" />
                     <div className="bg-white/60 border border-gray-300/50 rounded-lg p-1 mb-6 flex">
                         <button onClick={() => setActiveTab('text')} className={`flex-1 p-1.5 text-xs rounded-md font-bold transition-all ${activeTab === 'text' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow' : 'text-zinc-600'}`}>{t("text_to_3d")}</button>
                         <button onClick={() => setActiveTab('image')} className={`flex-1 p-1.5 text-xs rounded-md font-bold transition-all ${activeTab === 'image' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow' : 'text-zinc-600'}`}>{t("image_to_3d")}</button>
                     </div>
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
                     <div className="mb-6">
                         <label className="text-sm font-['Unbounded'] font-semibold mb-2 block">{t("symmetry_label")}</label>
                         <div className="bg-white/80 border border-gray-300 rounded-md p-1 flex">
                             <button className="flex-1 p-1 text-xs rounded-sm font-bold text-zinc-600">{t("symmetry_off")}</button>
                             <button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-sm font-bold p-1 text-xs shadow-sm">{t("symmetry_auto")}</button>
                             <button className="flex-1 p-1 text-xs rounded-sm font-bold text-zinc-600">{t("symmetry_on")}</button>
                         </div>
                     </div>
                     <div className="flex justify-center items-center space-x-3 mb-4 text-xs font-light text-neutral-600">
                         <span>{t("cost_info_model")}</span>
                         <div className="bg-neutral-400 w-px h-4" />
                         <span>{t("cost_info_tokens")}</span>
                     </div>
                     <motion.button 
                        whileHover={{ y: -2, boxShadow: '0 8px 20px -5px rgb(59 130 246 / 0.5)' }} whileTap={{ scale: 0.98 }}
                        onClick={handleGenerate} disabled={isRateLimited} 
                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg text-white text-base font-semibold font-['Unbounded'] disabled:opacity-50 disabled:cursor-not-allowed"
                        title={isRateLimited ? `Rate limit exceeded. Please wait.` : ''}
                    >
                        {t("generate_button")}
                     </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
      </div>
      {/* CẬP NHẬT: Cấu trúc lại toàn bộ phần footer */}
      <div className={`border-t border-gray-300/70 flex-shrink-0 ${isCollapsed ? "p-2" : "p-4"}`}>
          <div className={`flex items-center ${isCollapsed ? 'flex-col gap-y-2' : 'justify-between'}`}>
               <div className="flex items-center min-w-0">
                   <div className="bg-zinc-300 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                       <Icon icon="mdi:user" className="w-6 h-6" />
                   </div>
                   <AnimatePresence>
                     {!isCollapsed && (
                       <motion.div initial={{opacity:0, width: 0}} animate={{opacity:1, width: 'auto', transition:{duration: 0.2}}} exit={{opacity:0, width: 0}} className="ml-3 overflow-hidden">
                           <p className="text-sm font-semibold truncate">PhuongBT</p>
                           <p className="text-gray-600 text-sm font-light truncate">{tWorkspace("user_free_tier")}</p>
                       </motion.div>
                     )}
                   </AnimatePresence>
               </div>
               {/* Nút theme được đưa ra ngoài và luôn hiển thị */}
               <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} onClick={() => setTheme(activeTheme === "light" ? "dark" : "light")} className="flex-shrink-0 w-9 h-9 rounded-md flex items-center justify-center transition-colors bg-black/5 hover:bg-black/10" title="Toggle theme">
                   <Icon icon={activeTheme === "light" ? "mdi:weather-night" : "mdi:white-balance-sunny"} width={18} />
               </motion.button>
          </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={`fixed inset-0 z-40 bg-black/30 lg:hidden transition-opacity ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setIsSidebarOpen(false)} aria-hidden="true" />
      <div className={`lg:relative fixed top-0 left-0 h-full z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full'} lg:translate-x-0 lg:w-full`}>
        <SidebarContent />
      </div>
    </>
  );
};
export default Sidebar;
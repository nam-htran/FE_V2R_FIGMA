// ===== .\src\components\workspace\Sidebar.tsx =====
"use client";
import { type FC, useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

// ... (Interface và NavItem không đổi)
interface SidebarProps { isCollapsed: boolean; toggleCollapse: () => void; isSidebarOpen: boolean; setIsSidebarOpen: (isOpen: boolean) => void; }
const NavItem: FC<{ icon: string; text: string; isCollapsed: boolean; themeClass: (l: string, d: string) => string; }> = ({ icon, text, isCollapsed, themeClass }) => ( <a href="#" className={`block flex items-center rounded-md transition-colors ${isCollapsed ? "w-10 h-10 justify-center" : "p-2"} ${themeClass("hover:bg-indigo-100", "hover:bg-neutral-800")}`}> <Icon icon={icon} className={`w-6 h-6 flex-shrink-0 ${themeClass("text-zinc-700", "text-gray-300")}`} /> {!isCollapsed && (<span className={`ml-3 text-sm font-medium whitespace-nowrap`}>{text}</span>)} </a>);


const Sidebar: FC<SidebarProps> = ({ isCollapsed, toggleCollapse, isSidebarOpen, setIsSidebarOpen, }) => {
  const t = useTranslations("Sidebar");
  const tWorkspace = useTranslations("Workspace");
  const { theme, resolvedTheme, setTheme } = useTheme();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const activeTheme = !mounted ? "dark" : (resolvedTheme || theme || "dark");
  const themeClass = (light: string, dark: string) => activeTheme === "light" ? light : dark;

  return (
    <>
      <div className={`fixed inset-0 z-40 bg-black/30 lg:hidden transition-opacity ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setIsSidebarOpen(false)} aria-hidden="true" />
      <div
        className={`
          flex flex-col h-full w-full font-['Inter']
          ${themeClass(
            "bg-white text-black border-r border-gray-200", // Light Mode
            "bg-neutral-950 text-white" // Dark Mode: Dùng bg-neutral-950 như thiết kế
          )}
        `}
      >
        {/* ... toàn bộ nội dung bên trong Sidebar không thay đổi ... */}
        {/* Phần header */}
        <div className={`flex flex-col flex-grow min-h-0 overflow-hidden ${isCollapsed ? "p-2" : "p-4"}`}>
            <div className={`flex items-center mb-6 ${isCollapsed ? 'flex-col gap-y-4' : 'justify-between'}`}>
                 <Image src={activeTheme === "light" ? "/logo/dark.png" : "/logo/light.png"} alt="Logo" width={isCollapsed ? 30 : 40} height={isCollapsed ? 19 : 25} />
                 <div className="flex items-center">
                     <button onClick={toggleCollapse} className={`hidden lg:block ${themeClass("text-gray-600 hover:text-black", "text-gray-400 hover:text-white")}`} aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
                         <Icon icon={isCollapsed ? "mdi:arrow-right" : "mdi:arrow-left"} width={20} />
                     </button>
                     <button onClick={() => setIsSidebarOpen(false)} className={`lg:hidden ${isCollapsed ? "hidden" : ""} ${themeClass("text-black", "text-white")}`} aria-label="Close sidebar" > <Icon icon="mdi:close" width={28} /> </button>
                 </div>
            </div>
            <nav className={`${isCollapsed ? "flex flex-col items-center space-y-1" : "space-y-1"}`}>
                <NavItem icon="mdi:plus-box" text={tWorkspace("new_project")} isCollapsed={isCollapsed} themeClass={themeClass} />
                <NavItem icon="mdi:folder-multiple-image" text={tWorkspace("your_library")} isCollapsed={isCollapsed} themeClass={themeClass} />
                <NavItem icon="mdi:crown" text={tWorkspace("upgrade_account")} isCollapsed={isCollapsed} themeClass={themeClass} />
            </nav>
            <div className={`flex-grow min-w-0 overflow-y-auto transition-opacity duration-200 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="mt-4 pr-1">
                     <hr className={`${themeClass("border-gray-300", "border-zinc-700")} mb-4`} />
                     <div className={`${themeClass("bg-indigo-50", "bg-neutral-800")} rounded-xl p-1 mb-6 flex`}>
                         <button className={`flex-1 p-2 rounded-lg text-sm font-bold ${themeClass("text-zinc-700", "text-neutral-400")}`}>{t("text_to_3d")}</button>
                         <button className="flex-1 p-2 bg-blue-900 text-white rounded-lg font-bold text-sm">{t("image_to_3d")}</button>
                     </div>
                     <div className="mb-5">
                         <label className={`text-sm font-normal mb-2 block`}>{t("image_label")}</label>
                         <div className={`${themeClass("bg-indigo-100 border-indigo-200", "bg-neutral-900 border-neutral-700")} border rounded-xl w-full h-40 flex flex-col justify-center items-center text-center p-4`}>
                             <Icon icon="icon-park-outline:upload-picture" className={`w-10 h-10 mb-2 ${themeClass("text-stone-500","text-neutral-500")}`} />
                             <p className={`text-base font-semibold ${themeClass("text-stone-600","text-neutral-300")}`}>{t("uploader_title")}</p>
                             <p className={`text-xs font-normal mt-1 ${themeClass("text-neutral-500","text-neutral-400")}`}>{t("uploader_formats")}</p>
                         </div>
                     </div>
                     <div className="mb-5">
                         <label className={`text-sm font-normal mb-2 block`}>{t("name_label")}</label>
                         <input type="text" placeholder={t("name_placeholder")} className={`${themeClass("bg-indigo-100 placeholder:text-zinc-500 text-black","bg-neutral-800 placeholder:text-gray-400 text-white")} w-full h-11 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700`} />
                     </div>
                     <div className="mb-5">
                         <label className={`text-sm font-normal mb-2 block`}>{t("model_label")}</label>
                         <div className={`${themeClass("bg-indigo-100","bg-neutral-800")} flex items-center justify-between p-2 h-11 rounded-xl px-4`}>
                             <span className={`text-sm`}>V2R</span>
                             <Icon icon="mdi:chevron-down" className={`w-5 h-5`} />
                         </div>
                     </div>
                     <div className="mb-6">
                         <label className={`text-sm font-normal mb-2 block`}>{t("symmetry_label")}</label>
                         <div className={`${themeClass("bg-indigo-100","bg-neutral-800")} rounded-lg p-1 flex`}>
                             <button className={`flex-1 p-1.5 text-sm rounded-md font-bold ${themeClass("text-zinc-600","text-neutral-400")}`}>{t("symmetry_off")}</button>
                             <button className="flex-1 bg-blue-900 text-white rounded-md font-bold p-1.5 text-sm">{t("symmetry_auto")}</button>
                             <button className={`flex-1 p-1.5 text-sm rounded-md font-bold ${themeClass("text-zinc-600","text-neutral-400")}`}>{t("symmetry_on")}</button>
                         </div>
                     </div>
                     <div className={`flex justify-center items-center space-x-3 mb-4 text-sm font-light ${themeClass("text-neutral-600","text-neutral-300")}`}>
                         <span>{t("cost_info_model")}</span>
                         <div className={`${themeClass("bg-neutral-400","bg-neutral-600")} w-px h-5`} />
                         <span>{t("cost_info_tokens")}</span>
                     </div>
                     <button className="w-full h-11 bg-blue-900 rounded-xl text-neutral-100 text-base font-semibold font-['Unbounded'] hover:bg-blue-700 transition-colors">{t("generate_button")}</button>
                </div>
            </div>
        </div>
        {/* Phần footer */}
        <div className={`border-t ${themeClass("border-gray-200","border-zinc-700")} flex-shrink-0 ${isCollapsed ? "p-2" : "p-4"}`}>
            <div className={`flex items-center ${isCollapsed ? 'flex-col justify-center gap-y-2' : 'justify-between'}`}>
                 <div className="flex items-center min-w-0">
                     <div className={`${themeClass("bg-zinc-300","bg-zinc-600")} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}>
                         <Icon icon="mdi:user" className={`w-6 h-6`} />
                     </div>
                     {!isCollapsed && (
                     <div className="ml-3 overflow-hidden">
                         <p className={`text-sm font-semibold truncate`}>PhuongBT</p>
                         <p className={`text-stone-500 dark:text-gray-300 text-sm font-light truncate`}>{tWorkspace("user_free_tier")}</p>
                     </div>
                     )}
                 </div>
                 <button onClick={() => setTheme(activeTheme === "light" ? "dark" : "light")} className={`flex-shrink-0 w-9 h-9 rounded-md flex items-center justify-center transition-colors ${themeClass("bg-indigo-100 text-neutral-900 hover:bg-indigo-200", "bg-neutral-800 text-white hover:bg-neutral-700")}`} title="Toggle theme">
                     <Icon icon={activeTheme === "light" ? "mdi:weather-night" : "mdi:white-balance-sunny"} width={isCollapsed ? 16 : 18} />
                 </button>
            </div>
        </div>
      </div>
    </>
  );
};
export default Sidebar;
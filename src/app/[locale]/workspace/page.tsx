// ===== .\src\app\[locale]\workspace\page.tsx =====
"use client";

import { useState } from "react";
import Sidebar from "@/components/workspace/Sidebar";
import ViewPanel from "@/components/workspace/ViewPanel";
import LibraryPanel from "@/components/workspace/LibraryPanel";
import { Icon } from "@iconify/react";

export default function WorkspacePage() {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLibraryPanelCollapsed, setLibraryPanelCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);
  const toggleLibraryPanel = () => setLibraryPanelCollapsed(!isLibraryPanelCollapsed);

  const expandLibraryPanel = () => {
    if (isLibraryPanelCollapsed) {
      setLibraryPanelCollapsed(false);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden select-none relative font-['Inter']">
      {/* CẬP NHẬT: Thay thế các khối màu trang trí theo thiết kế mới */}
      <div className="absolute inset-0 w-full h-full overflow-hidden -z-20 pointer-events-none">
        <div
          className="absolute bg-gradient-to-b from-[#928DAB] to-[#00D2FF] rounded-full"
          style={{
            width: '387.15px',
            height: '503.17px',
            left: '66.87px',
            top: '461.99px',
            transform: 'rotate(-145deg)',
            transformOrigin: 'top left',
          }}
        />
        <div
          className="absolute bg-gradient-to-b from-[#928DAB] to-[#00D2FF] rounded-full"
          style={{
            width: '592.95px',
            height: '884.18px',
            left: '1326.21px',
            top: '462px',
            transform: 'rotate(69deg)',
            transformOrigin: 'top left',
          }}
        />
      </div>
      {/* CẬP NHẬT: Lớp mờ glassmorphism */}
      <div className="absolute inset-0 bg-white/[.43] backdrop-blur-[35px] -z-10"></div>
      
      {/* CÁC LỚP UI VÀ CANVAS (Giữ nguyên) */}
      <div className="fixed inset-0 z-10">
        <ViewPanel />
      </div>
      <div className="fixed inset-0 z-20 pointer-events-none">
        <div className={`absolute top-0 left-0 h-full pointer-events-auto transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-[56px]' : 'w-[288px]'}`}>
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            toggleCollapse={toggleSidebar}
            isSidebarOpen={isMobileSidebarOpen}
            setIsSidebarOpen={setMobileSidebarOpen}
            expandLibraryPanel={expandLibraryPanel}
          />
        </div>
        <div className={`absolute top-0 right-0 h-full pointer-events-auto transition-all duration-300 ease-in-out ${isLibraryPanelCollapsed ? 'w-[56px]' : 'w-[288px]'}`}>
          <LibraryPanel 
            isCollapsed={isLibraryPanelCollapsed} 
            toggleCollapse={toggleLibraryPanel} 
          />
        </div>
        <div className={`absolute top-0 h-full transition-all duration-300 ease-in-out p-4 md:p-6 ${isSidebarCollapsed ? 'left-[56px]' : 'left-[288px]'} ${isLibraryPanelCollapsed ? 'right-[56px]' : 'right-[288px]'}`}>
           <div className="h-full w-full relative border-2 border-[#2980B9] rounded-2xl shadow-lg"></div>
        </div>
      </div>
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="absolute top-4 left-4 z-30 lg:hidden p-2 bg-black/20 text-white rounded-md"
        aria-label="Open sidebar"
      >
        <Icon icon="mdi:menu" width={24} />
      </button>
    </div>
  );
}
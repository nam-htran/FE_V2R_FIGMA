// ===== .\src\app\[locale]\workspace\page.tsx =====
"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import Sidebar from "@/components/workspace/Sidebar";
import ViewPanel from "@/components/workspace/ViewPanel";
import LibraryPanel from "@/components/workspace/LibraryPanel"; 

export default function WorkspacePage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLibraryPanelCollapsed, setIsLibraryPanelCollapsed] = useState(false);

  return (
    <main className="flex w-screen h-screen overflow-hidden bg-neutral-900">
      
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="absolute top-4 left-4 z-30 lg:hidden p-2 bg-gray-700/50 text-white rounded-md"
        aria-label="Open sidebar"
      >
        <Icon icon="mdi:menu" width={24} />
      </button>

      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isSidebarOpen={isMobileSidebarOpen}
        setIsSidebarOpen={setMobileSidebarOpen}
      />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* CẬP NHẬT: Truyền trạng thái của các panel vào ViewPanel */}
        <ViewPanel 
          isSidebarCollapsed={isSidebarCollapsed}
          isLibraryPanelCollapsed={isLibraryPanelCollapsed}
        />
      </div>

      <LibraryPanel 
        isCollapsed={isLibraryPanelCollapsed}
        setIsCollapsed={setIsLibraryPanelCollapsed}
      />
      
    </main>
  );
}
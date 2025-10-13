"use client";

import { useState, useRef, useEffect } from "react";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
  type ImperativePanelHandle, // SỬA LỖI 1: Dùng type đúng là ImperativePanelHandle
} from "react-resizable-panels";

import Sidebar from "@/components/workspace/Sidebar";
import ViewPanel from "@/components/workspace/ViewPanel";
import LibraryPanel from "@/components/workspace/LibraryPanel";
import { Leva } from "leva";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";

const SIDE_PANEL_EXPANDED_PX = 288;
const SIDE_PANEL_COLLAPSED_PX = 56;

export default function WorkspacePage() {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLibraryPanelCollapsed, setLibraryPanelCollapsed] = useState(false);

  const { resolvedTheme } = useTheme();
  
  const [sidePanelSize, setSidePanelSize] = useState(20);
  const [collapsedSize, setCollapsedSize] = useState(4);
  
  const [viewPanelBg, setViewPanelBg] = useState("bg-neutral-900");
  const [handleBg, setHandleBg] = useState("bg-neutral-900");

  useEffect(() => {
    const updatePanelSizes = () => {
      const screenWidth = window.innerWidth;
      setSidePanelSize((SIDE_PANEL_EXPANDED_PX / screenWidth) * 100);
      setCollapsedSize((SIDE_PANEL_COLLAPSED_PX / screenWidth) * 100);
    };

    updatePanelSizes();
    window.addEventListener('resize', updatePanelSizes);
    return () => window.removeEventListener('resize', updatePanelSizes);
  }, []);


  useEffect(() => {
    if (resolvedTheme === 'light') {
      setViewPanelBg("bg-indigo-50");
      setHandleBg("bg-indigo-50");
    } else {
      setViewPanelBg("bg-neutral-900");
      setHandleBg("bg-neutral-900");
    }
  }, [resolvedTheme]);

  const sidebarPanelRef = useRef<ImperativePanelHandle>(null); // SỬA LỖI 1
  const libraryPanelRef = useRef<ImperativePanelHandle>(null); // SỬA LỖI 1

  const toggleSidebar = () => {
    const panel = sidebarPanelRef.current;
    if (panel) { panel.isCollapsed() ? panel.expand() : panel.collapse(); }
  };

  const toggleLibraryPanel = () => {
    const panel = libraryPanelRef.current;
    if (panel) { panel.isCollapsed() ? panel.expand() : panel.collapse(); }
  };

  return (
    <main className="w-screen h-screen overflow-hidden select-none">
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="absolute top-4 left-4 z-50 lg:hidden p-2 bg-gray-700/50 text-white rounded-md"
        aria-label="Open sidebar"
      >
        <Icon icon="mdi:menu" width={24} />
      </button>

      <PanelGroup direction="horizontal">
        <Panel
          ref={sidebarPanelRef}
          defaultSize={sidePanelSize}
          minSize={15}
          collapsible={true}
          collapsedSize={collapsedSize}
          onCollapse={() => setSidebarCollapsed(true)}
          onExpand={() => setSidebarCollapsed(false)}
        >
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            toggleCollapse={toggleSidebar}
            isSidebarOpen={isMobileSidebarOpen}
            setIsSidebarOpen={setMobileSidebarOpen}
          />
        </Panel>
        
        <PanelResizeHandle className={`w-1.5 transition-colors duration-200 group ${handleBg}`}>
          <div className="h-full w-px bg-transparent group-hover:bg-blue-600 transition-colors duration-200" />
        </PanelResizeHandle>

        <Panel minSize={30}>
          <div className={`h-full relative ${viewPanelBg}`}>
            <ViewPanel />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[300px] z-10">
              <Leva fill oneLineLabels collapsed />
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className={`w-1.5 transition-colors duration-200 group ${handleBg}`}>
           <div className="h-full w-px bg-transparent group-hover:bg-blue-600 transition-colors duration-200" />
        </PanelResizeHandle>

        <Panel
          ref={libraryPanelRef}
          defaultSize={sidePanelSize}
          minSize={15}
          collapsible={true}
          collapsedSize={collapsedSize}
          onCollapse={() => setLibraryPanelCollapsed(true)}
          onExpand={() => setLibraryPanelCollapsed(false)}
        >
          <LibraryPanel
            isCollapsed={isLibraryPanelCollapsed}
            toggleCollapse={toggleLibraryPanel}
          />
        </Panel>
      </PanelGroup>
    </main>
  );
}
"use client";

import { useRef, useState } from 'react';
import DashboardLayout from '@/components/dashboard-layout/layout';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  type ImperativePanelHandle,
} from "@/components/ui/resizable";
import { ControlsPanel } from '@/components/workspace/ControlsPanel';
import { ViewerPanel } from '@/components/workspace/ViewerPanel';
import { AssetLibraryPanel } from '@/components/workspace/AssetLibraryPanel';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen, PanelRightOpen } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export default function WorkspacePage() {
  const controlsPanelRef = useRef<ImperativePanelHandle>(null);
  const libraryPanelRef = useRef<ImperativePanelHandle>(null);

  const [isControlsCollapsed, setControlsCollapsed] = useState(false);
  const [isLibraryCollapsed, setLibraryCollapsed] = useState(false);

  const toggleControlsPanel = () => {
    const panel = controlsPanelRef.current;
    if (panel) {
      panel.toggleCollapse();
    }
  };
  
  const toggleLibraryPanel = () => {
    const panel = libraryPanelRef.current;
    if (panel) {
      panel.toggleCollapse();
    }
  };

  return (
    <DashboardLayout>
      {/* --- ĐÃ SỬA: Bỏ nền Aurora và áp dụng padding/gap cho ResizablePanelGroup --- */}
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full max-h-[calc(100vh-4rem)] p-3 gap-3"
      >
        <ResizablePanel
          ref={controlsPanelRef}
          collapsible={true}
          collapsedSize={4}
          minSize={25}
          defaultSize={28}
          onCollapse={() => setControlsCollapsed(true)}
          onExpand={() => setControlsCollapsed(false)}
          className="!overflow-y-auto transition-all duration-300"
        >
          {isControlsCollapsed ? (
            <div className="flex h-full items-center justify-center">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={toggleControlsPanel}>
                      <PanelLeftOpen className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Expand Controls</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <ControlsPanel onToggle={toggleControlsPanel} />
          )}
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={44} minSize={30}>
          <ViewerPanel modelUrl="/model.glb" />
        </ResizablePanel>
        
        <ResizableHandle withHandle />

        <ResizablePanel
          ref={libraryPanelRef}
          collapsible={true}
          collapsedSize={4}
          minSize={25}
          defaultSize={28}
          onCollapse={() => setLibraryCollapsed(true)}
          onExpand={() => setLibraryCollapsed(false)}
          className="transition-all duration-300"
        >
           {isLibraryCollapsed ? (
            <div className="flex h-full items-center justify-center">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={toggleLibraryPanel}>
                      <PanelRightOpen className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Expand Library</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
           ) : (
            <AssetLibraryPanel onToggle={toggleLibraryPanel} />
           )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </DashboardLayout>
  );
}
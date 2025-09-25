"use client";

import type { FC } from 'react';
import ModelViewer from '@/components/ModelViewer';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Download, Maximize, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

export const ViewerPanel: FC<{ modelUrl: string }> = ({ modelUrl }) => (
    <ContextMenu>
        {/* --- ĐÃ SỬA: Bỏ Card, dùng div đơn giản với bo góc và nền --- */}
        <ContextMenuTrigger className="h-full w-full">
            <div className="relative overflow-hidden h-full bg-background rounded-lg shadow-inner">
                <div 
                  className="absolute inset-0 z-0" 
                  style={{ 
                      backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px)', 
                      backgroundSize: '30px 30px',
                      opacity: 0.5
                  }}
                />
                <div className="absolute inset-0 z-10">
                  <ModelViewer modelUrl={modelUrl} />
                </div>
                 <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded">
                    Right-click for options
                </div>
            </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
            <ContextMenuItem onClick={() => toast.info("View has been reset.")}>
                <RotateCw className="mr-2 h-4 w-4" />
                Reset View
            </ContextMenuItem>
            <ContextMenuItem>
                <Maximize className="mr-2 h-4 w-4" />
                Toggle Fullscreen
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export as GLB...
            </ContextMenuItem>
        </ContextMenuContent>
    </ContextMenu>
);
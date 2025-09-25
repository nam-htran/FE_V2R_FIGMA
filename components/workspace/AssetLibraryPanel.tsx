"use client";

import type { FC } from 'react';
import { Search, ChevronLeft, ChevronRight, PanelRightClose, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface AssetLibraryPanelProps {
  onToggle: () => void;
}

export const AssetLibraryPanel: FC<AssetLibraryPanelProps> = ({ onToggle }) => (
  // --- ĐÃ SỬA: Áp dụng Card, bỏ Glassmorphism và thêm viền màu vàng ---
  <Card className="flex flex-col h-full overflow-hidden border-t-4 border-t-yellow-400">
    <div className="p-4 flex justify-between items-center shrink-0">
        <div>
            <h2 className="text-xl font-bold">Asset Library</h2>
            <p className="text-sm text-muted-foreground">Manage your generated models.</p>
        </div>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
                <PanelRightClose className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Collapse Panel</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
    </div>
    
    <div className="flex-1 flex flex-col gap-6 overflow-y-auto p-4 pt-0">
      <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input type="text" placeholder="Search assets..." className="w-full pl-9" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center text-sm text-muted-foreground p-6 rounded-lg bg-yellow-400/10">
          <Sparkles className="h-12 w-12 text-yellow-400 mb-4" />
          <p className="font-bold text-lg text-foreground">Your Creative Library Awaits</p>
          <p className="mt-1 mb-6 max-w-xs mx-auto">Generate your first 3D model to see it here.</p>
          <Button variant="highlight" className="rounded-full">Start Generating</Button>
      </div>
    </div>

    <div className="mt-auto p-2 border-t flex items-center justify-center gap-2 bg-card rounded-b-lg shrink-0">
      <Button variant="ghost" size="icon" disabled><ChevronLeft className="h-5 w-5" /></Button>
      <span className="text-sm font-medium text-muted-foreground">1 / 1</span>
      <Button variant="ghost" size="icon" disabled><ChevronRight className="h-5 w-5" /></Button>
    </div>
  </Card>
);
// components/workspace/AssetLibraryPanel.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, PanelRightClose, Search } from "lucide-react";

interface AssetLibraryPanelProps {
  onToggle: () => void;
}

export const AssetLibraryPanel = ({ onToggle }: AssetLibraryPanelProps) => {
  return (
    <div className="bg-card rounded-lg border shadow-sm flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Asset Library</h2>
          <p className="text-sm text-muted-foreground">Manage your models.</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggle} className="hover:bg-black/[.08] dark:hover:bg-white/[.08]">
          <PanelRightClose className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4 space-y-4 flex-1 flex flex-col">
        {/* === ĐÃ SỬA: Search bar có nền màu xám theo "phương pháp sidebar" === */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search assets..." 
            className="pl-9 border-0 bg-black/[.08] dark:bg-white/[.08] focus-visible:ring-1 focus-visible:ring-ring" 
          />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
          <Bot className="w-10 h-10 mb-4 opacity-50" />
          <h3 className="font-semibold text-foreground mb-1">Your Creative Library</h3>
          <p className="text-sm">Your generated assets will appear here.</p>
        </div>
      </div>
      <div className="p-2 border-t flex items-center justify-between text-sm">
        <Button variant="ghost" size="icon" disabled>‹</Button>
        <span>1 / 1</span>
        <Button variant="ghost" size="icon" disabled>›</Button>
      </div>
    </div>
  );
};
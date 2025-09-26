// components/TopNav.tsx
"use client";

import { Search, Bell, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"; // Import cn utility

interface TopNavProps {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export default function TopNav({ toggleSidebar, isSidebarCollapsed }: TopNavProps) {
  return (
    // Nền `glass-card` của TopNav được giữ nguyên
    <header 
      className="h-16 border-b border-card-border/50 glass-card flex items-center justify-between px-6 fixed top-0 right-0 z-40 transition-[left] duration-300 ease-in-out"
      style={{ left: isSidebarCollapsed ? '5rem' : '16rem' }}
    >
      <div className="flex items-center gap-4">
        {/* === ĐÃ SỬA: Giữ `variant` và `size`, chỉ override màu hover === */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          // Dùng lại màu xám hiệu quả từ Sidebar cho trạng thái hover
          className=" -ml-2 hover:bg-black/[.08] dark:hover:bg-white/[.08]"
        >
            <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">App</span>
          <span className="text-muted-foreground">›</span>
          <span className="font-medium">Workspace</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* === ĐÃ SỬA: Ô tìm kiếm dùng màu xám từ Sidebar làm nền mặc định === */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm..." 
            // Bỏ viền và dùng màu xám hiệu quả từ Sidebar
            className="pl-10 w-64 border-0 bg-black/[.08] dark:bg-white/[.08] focus-visible:ring-1 focus-visible:ring-ring"
          />
          <Badge variant="secondary" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs">
            ⌘K
          </Badge>
        </div>

        {/* === ĐÃ SỬA: Các nút actions cũng giữ `variant` và override màu hover === */}
        <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative hover:bg-black/[.08] dark:hover:bg-white/[.08]"
            >
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-accent"></Badge>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-black/[.08] dark:hover:bg-white/[.08]"
            >
              <Settings className="w-4 h-4" />
            </Button>
        </div>
      </div>
    </header>
  );
}
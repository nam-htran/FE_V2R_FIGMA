// components/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Home, FolderOpen, History, Users, Bell, Settings, HelpCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

const navigationItemsData = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/workspace", label: "Workspace", icon: FolderOpen },
  { href: "/history", label: "Lịch sử", icon: History },
  { href: "/community", label: "Cộng đồng", icon: Users },
];

const supportItemsData = [
  { href: "/notifications", label: "Thông báo", icon: Bell },
  { href: "/settings", label: "Cài đặt", icon: Settings },
  { href: "/help", label: "Trợ giúp", icon: HelpCircle },
];

export default function Sidebar({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname();

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }) => {
    const isActive = pathname.startsWith(href); 
    
    return (
      <Link
        href={href}
        className={cn(
          'flex h-auto w-full items-center justify-start gap-3 rounded-lg px-3 py-2 text-base transition-colors duration-200',
          
          // === THAY ĐỔI CUỐI CÙNG: SỬA LỖI MÀU SẮC ===
          {
            // Nếu Active: Dùng màu đen trong suốt 8% (dark mode thì màu trắng) và chữ đậm
            'bg-black/[.08] dark:bg-white/[.08] font-semibold text-foreground': isActive,
            
            // Nếu Inactive: Nền trong suốt, chữ xám. Khi hover, cũng dùng màu đen trong suốt 8%
            'bg-transparent text-muted-foreground hover:bg-black/[.08] dark:hover:bg-white/[.08] hover:text-foreground': !isActive,
          },
          
          isCollapsed && 'h-10 w-10 justify-center p-0'
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className={cn('truncate', isCollapsed && 'hidden')}>{label}</span>
      </Link>
    );
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen glass-card border-r border-card-border/50 transition-[width] duration-300 ease-in-out z-50",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col p-4 space-y-4">
        {/* Brand */}
        <div className={cn("flex items-center gap-3 h-12 shrink-0", isCollapsed ? 'justify-center' : 'px-2')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
            <Image src="/logo/dark.png" alt="Logo" width={20} height={20} />
          </div>
          <div className={cn("overflow-hidden transition-opacity", isCollapsed && 'opacity-0 w-0')}>
            <h1 className="font-bold text-md">Vision2Reality</h1>
            <p className="text-xs text-muted-foreground">Generator</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 space-y-6 overflow-y-auto">
          <div className="space-y-1">
            {navigationItemsData.map((item) => <NavLink key={item.label} {...item} />)}
          </div>
          <div className="space-y-1">
            <h3 className={cn("text-xs font-semibold text-muted-foreground px-3 pt-4 transition-opacity", isCollapsed && 'hidden')}>HỖ TRỢ</h3>
            {supportItemsData.map((item) => <NavLink key={item.label} {...item} />)}
          </div>
        </div>

        {/* User Profile */}
        <div className="mt-auto shrink-0">
          <Button
            variant="ghost"
            className={cn(
              "w-full h-auto justify-start gap-3 p-2 rounded-lg",
              // Dùng màu trong suốt tương tự cho nhất quán
              "text-muted-foreground hover:bg-black/[.08] dark:hover:bg-white/[.08] hover:text-foreground",
              isCollapsed && "w-12 h-12 justify-center p-0"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>N</AvatarFallback>
            </Avatar>
            <div className={cn("flex-1 text-left", isCollapsed && "hidden")}>
                <p className="text-sm font-semibold text-foreground">User Name</p>
            </div>
            <ChevronDown className={cn("h-4 w-4", isCollapsed && "hidden")} />
          </Button>
        </div>
      </div>
    </aside>
  );
}
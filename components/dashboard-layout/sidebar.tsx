"use client";

import type React from "react";
import { Boxes, Settings, LifeBuoy, Users, History, LayoutDashboard, Bell } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type MenuState = "full" | "collapsed" | "hidden";

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MenuGroup {
    title?: string; 
    items: MenuItem[];
}

interface CustomWindow extends Window {
    toggleMenuState?: () => void;
    setIsMobileMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    menuState?: MenuState;
    isHovered?: boolean;
    isMobile?: boolean;
    isMobileMenuOpen?: boolean;
}

declare const window: CustomWindow;

const menuGroups: MenuGroup[] = [
    {
        items: [
            { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { id: "workspace", label: "Workspace", href: "/workspace", icon: Boxes },
            { id: "history", label: "History", href: "/history", icon: History },
            { id: "community", label: "Community", href: "/community", icon: Users },
        ]
    },
    {
        title: "Manage", 
        items: [
            { id: "notifications", label: "Notifications", href: "/notifications", icon: Bell },
            { id: "settings", label: "Settings", href: "/settings", icon: Settings },
        ]
    },
    {
        title: "Support", 
        items: [
            { id: "help", label: "Help", href: "/help", icon: LifeBuoy },
        ]
    }
];

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuState, setMenuState] = useState<MenuState>("full");
  const [isHovered, setIsHovered] = useState(false);
  const [previousDesktopState, setPreviousDesktopState] = useState<MenuState>("full");
  const [isMobile, setIsMobile] = useState(false);

  const toggleMenuState = () => {
    setMenuState((prev) => (prev === "full" ? "collapsed" : "full"));
  };

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      setIsMobile(!isDesktop);
      if (isDesktop && menuState === "hidden") {
        setMenuState(previousDesktopState);
      } else if (!isDesktop) {
        setPreviousDesktopState(menuState);
        setMenuState("hidden");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    if (typeof window !== "undefined") {
      window.toggleMenuState = toggleMenuState;
      window.setIsMobileMenuOpen = setIsMobileMenuOpen;
    }
    return () => window.removeEventListener("resize", handleResize);
  }, [menuState, previousDesktopState]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.menuState = menuState;
      window.isHovered = isHovered;
      window.isMobile = isMobile;
      window.isMobileMenuOpen = isMobileMenuOpen;
    }
  }, [menuState, isHovered, isMobile, isMobileMenuOpen]);

  const NavItem = ({ item }: { item: MenuItem }) => {
    const pathname = usePathname();
    const isActive = pathname === item.href;
    const isCollapsed = menuState === "collapsed" && !isHovered;

    const linkContent = (
      <Link
        href={item.href}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
        // --- ĐÃ SỬA: Trả về style active nền đen chữ trắng như trong hình ---
        className={cn(
          "flex items-center py-2 px-3 text-sm rounded-md transition-colors group",
          isActive
            ? "bg-neutral-900 text-white font-semibold hover:bg-neutral-900/90"
            : "text-foreground/70 hover:bg-accent hover:text-accent-foreground",
          isCollapsed && "justify-center"
        )}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        <span className={cn("ml-3 flex-1 whitespace-nowrap", isCollapsed && "hidden")}>{item.label}</span>
      </Link>
    );

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkContent;
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-card">
      <div className="flex h-16 shrink-0 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <Image src="/logo/dark.png" alt="V2R Logo" width={32} height={32} />
          {(menuState === "full" || (isHovered && menuState === "collapsed")) && (
            <span className="text-lg text-foreground">Vision2Reality</span>
          )}
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <nav className="flex flex-col gap-4"> 
          {menuGroups.map((group, index) => (
            <div key={index}>
              {group.title && (menuState === 'full' || isHovered) && (
                <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.title}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map(item => (
                  <NavItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );

  const getSidebarWidth = () => {
    if (isMobile) return "w-64";
    if (menuState === "hidden") return "w-0 border-r-0";
    if (menuState === "collapsed" && isHovered) return "w-64";
    return menuState === "collapsed" ? "w-16" : "w-64";
  };

  if (isMobile) {
    return (
      <>
        <nav className={cn("fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out border-r",
          isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
        )}>
          <SidebarContent />
        </nav>
        {isMobileMenuOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
      </>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <nav
        className={cn("fixed inset-y-0 left-0 z-50 border-r transition-all duration-300 ease-in-out", getSidebarWidth())}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ overflow: menuState === "hidden" ? "hidden" : "visible" }}
      >
        <SidebarContent />
      </nav>
    </TooltipProvider>
  );
}
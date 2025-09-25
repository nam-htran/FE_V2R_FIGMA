// ===== File: .\components\dashboard-layout\top-nav.tsx =====
"use client";

import React, { useEffect, useState } from 'react';
import { Menu, Search, Bell, User, Settings, LogOut, Command as CommandIcon, Boxes, History, Users as CommunityIcon, HelpCircle, SidebarOpen, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

// === MỚI: Dữ liệu thông báo giả lập cho dropdown ===
const recentNotifications = [
    { id: 1, user: 'PixelForge', avatar: 'https://github.com/shadcn.png', action: 'liked your model', subject: 'Cyberpunk Samurai', time: '5m ago', read: false },
    { id: 2, user: 'System Update', avatar: '/logo/dark.png', action: 'New premium models are available!', subject: '', time: '1h ago', read: false },
    { id: 3, user: 'ArtisanAI', avatar: 'https://github.com/vercel.png', action: 'commented on your model', subject: 'Forest Elf', time: '3h ago', read: true },
];

interface CustomWindow extends Window {
    isMobile?: boolean;
    isMobileMenuOpen?: boolean;
    setIsMobileMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    toggleMenuState?: () => void;
    toggleWorkspacePanels?: () => void;
}
declare const window: CustomWindow;

export default function TopNav() {
  const [openCommand, setOpenCommand] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isWorkspacePage = pathname === '/workspace';
  
  // === MỚI: Tính toán số thông báo chưa đọc ===
  const unreadCount = recentNotifications.filter(n => !n.read).length;

  const breadcrumbItems = React.useMemo(() => {
    const paths = pathname.split('/').filter(p => p);
    if (paths.length === 0) return [];
    
    const items = paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        const isLast = index === paths.length - 1;
        const name = path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
        return { href, name, isLast };
    });
    
    if (paths[0] !== 'dashboard' && paths.length > 0) {
        return [{ href: '/dashboard', name: 'Dashboard', isLast: false }, ...items];
    }
    
    return items;
  }, [pathname]);


  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenCommand((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  
  const runCommand = (command: () => void) => {
    setOpenCommand(false);
    command();
  };

  const handleMenuToggle = () => {
    if (typeof window !== "undefined") {
      if (window.isMobile) {
        const current = window.isMobileMenuOpen || false;
        if(window.setIsMobileMenuOpen) {
            window.setIsMobileMenuOpen(!current);
        }
      } else if (window.toggleMenuState) {
        window.toggleMenuState();
      }
    }
  };
  
  const handleWorkspacePanelToggle = () => {
    window.toggleWorkspacePanels?.();
  };

  return (
    <>
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleMenuToggle} className="text-muted-foreground">
            <Menu className="h-5 w-5" />
          </Button>
          {isWorkspacePage && (
            <Button variant="ghost" size="icon" onClick={handleWorkspacePanelToggle} className="text-muted-foreground">
              <SidebarOpen className="h-5 w-5" />
            </Button>
          )}
          <Breadcrumb className="hidden md:block">
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={`${item.href}-${index}`}>
                  <BreadcrumbItem>
                    {item.isLast ? (
                      <BreadcrumbPage>{item.name}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={item.href}>{item.name}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!item.isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="gap-2 text-muted-foreground" onClick={() => setOpenCommand(true)}>
            <Search className="h-4 w-4" />
            <span className="hidden lg:inline-block">Search...</span>
            <kbd className="hidden lg:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          
          <ThemeToggle />

          {/* === THAY ĐỔI: Biến nút chuông thành Dropdown Menu === */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-muted-foreground">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96">
                <DropdownMenuLabel className="flex justify-between items-center">
                    <span>Notifications</span>
                    {unreadCount > 0 && <span className="text-xs font-normal text-primary">{unreadCount} New</span>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-1">
                {recentNotifications.map(item => (
                    <DropdownMenuItem key={item.id} className="flex items-start gap-3 p-2 cursor-pointer">
                        <Avatar className="h-8 w-8 border">
                            <AvatarImage src={item.avatar} />
                            <AvatarFallback>{item.user.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                             <p className="text-xs">
                                <span className="font-semibold">{item.user}</span> {item.action} {item.subject && <span className="font-medium text-primary">"{item.subject}"</span>}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                        </div>
                        {!item.read && <div className="h-2 w-2 rounded-full bg-blue-500 mt-1" />}
                    </DropdownMenuItem>
                ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/notifications" className="flex items-center justify-center p-2 cursor-pointer">
                        <Button variant="ghost" size="sm" className="w-full">View all notifications</Button>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-1 rounded-full h-auto">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push('/workspace'))}>
              <Boxes className="mr-2 h-4 w-4" />
              <span>Workspace</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/history'))}>
              <History className="mr-2 h-4 w-4" />
              <span>History</span>
            </CommandItem>
             <CommandItem onSelect={() => runCommand(() => router.push('/community'))}>
              <CommunityIcon className="mr-2 h-4 w-4" />
              <span>Community</span>
            </CommandItem>
             <CommandItem onSelect={() => runCommand(() => router.push('/settings'))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
           <CommandGroup heading="Help">
            <CommandItem onSelect={() => runCommand(() => router.push('/help'))}>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Support</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
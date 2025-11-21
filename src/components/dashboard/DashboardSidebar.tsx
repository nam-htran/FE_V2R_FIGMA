// ===== src/components/dashboard/DashboardSidebar.tsx =====
"use client";

import { useState, useEffect, type ComponentProps } from "react";
import Image from "next/image";
import { Link, usePathname } from "@/../i18n/navigation";
import { Icon } from "@iconify/react";
import { api } from "@/services/api";

type AppPath = ComponentProps<typeof Link>['href'];

interface NavItem {
  title: string; 
  href: AppPath;
  icon: string;
}

interface NavDropdown {
  title: string;
  icon: string;
  items: NavItem[];
}

type SidebarNavItem = NavItem | NavDropdown;

interface DashboardSidebarProps {
  width: number;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  startResizing: () => void; // Nhận hàm resize từ layout
}

const sidebarNavConfig: SidebarNavItem[] = [
  { title: "Tổng quan", href: "/dashboard", icon: "mdi:view-dashboard-outline" },
  {
    title: "Quản lý Người dùng",
    icon: "mdi:account-multiple",
    items: [
      { title: "Danh sách Users", href: "/dashboard/users", icon: "mdi:account-group" },
      { title: "Đơn hàng", href: "/dashboard/orders", icon: "mdi:receipt-text-outline" },
    ],
  },
  {
    title: "Quản lý Máy chủ",
    icon: "mdi:server",
    items: [
      { title: "Trạng thái & Tài nguyên", href: "/dashboard/status", icon: "mdi:server-network" },
      { title: "Báo cáo Chi phí", href: "/dashboard/reports", icon: "mdi:chart-line" },
    ],
  },
  {
    title: "Quản lý Kinh doanh",
    icon: "mdi:briefcase-outline",
    items: [
      { title: "Giao dịch", href: "/dashboard/transactions", icon: "mdi:swap-horizontal" },
      { title: "Doanh thu", href: "/dashboard/revenue", icon: "mdi:finance" },
    ],
  },
];

const flattenedNavItems: NavItem[] = sidebarNavConfig.flatMap(item => 'items' in item ? item.items : item);

export default function DashboardSidebar({ width, isCollapsed, toggleCollapse, startResizing }: DashboardSidebarProps) {
  const pathname = usePathname();
  const activeParent = sidebarNavConfig.find(item => 'items' in item && item.items?.some(subItem => subItem.href === pathname));
  
  const [openDropdowns, setOpenDropdowns] = useState<string[]>(activeParent ? [activeParent.title] : []);
  const [userName, setUserName] = useState<string>('User');
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const displayName = api.auth.getUserDisplayName();
    const role = api.auth.getUserRole();
    if (displayName) setUserName(displayName);
    if (role) setUserRole(role);
  }, []);

  const handleDropdownToggle = (title: string) => {
    setOpenDropdowns(prev => prev.includes(title) ? prev.filter(item => item !== title) : [...prev, title]);
  };

  return (
    <aside 
      className="fixed top-0 left-0 h-full bg-white flex flex-col z-30 shadow-xl overflow-hidden"
      style={{ width: `${width}px` }} // Width động
    >
      {/* Thanh kéo Resize nằm bên phải */}
      <div
        className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors z-40"
        onMouseDown={(e) => {
            e.preventDefault(); // Ngăn chọn text khi kéo
            startResizing();
        }}
      />

      <div className={`flex flex-col h-full ${isCollapsed ? 'p-2' : 'p-4'}`}>
        <Link href="/" className="flex flex-shrink-0 items-center justify-center h-[60px] cursor-pointer">
            <Image src="/logo/dark.png" alt="V2R Logo" width={isCollapsed ? 35 : 43} height={isCollapsed ? 22 : 27} className="transition-all"/>
        </Link>
        
        <nav className="flex flex-col mt-5 w-full flex-grow overflow-y-auto overflow-x-hidden custom-scrollbar">
            {isCollapsed ? (
                <div className="flex flex-col items-center gap-y-2">
                    {flattenedNavItems.map(item => (
                        <Link key={item.href.toString()} href={item.href} title={item.title} className={`flex items-center justify-center p-2 rounded-md transition-colors hover:bg-gray-200 w-full ${pathname === item.href ? "bg-gray-300" : ""}`}>
                            <Icon icon={item.icon} className="w-6 h-6 flex-shrink-0 text-neutral-950" />
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col">
                    {sidebarNavConfig.map((item) => {
                    if ('items' in item) {
                        const isDropdownOpen = openDropdowns.includes(item.title);
                        const isParentActive = item.items?.some(sub => sub.href === pathname);
                        return (
                        <div key={item.title} className="w-full">
                            <button onClick={() => handleDropdownToggle(item.title)} className={`flex items-center justify-between p-2 rounded-md transition-colors hover:bg-gray-200 w-full text-lg font-bold font-['Inter'] ${isParentActive ? "text-blue-900" : "text-neutral-950"}`}>
                            <div className="flex items-center gap-x-3 whitespace-nowrap">
                                <Icon icon={item.icon} className="w-6 h-6 flex-shrink-0" />
                                <span className="truncate">{item.title}</span>
                            </div>
                            <Icon icon="mdi:chevron-down" className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isDropdownOpen ? 'max-h-96' : 'max-h-0'} flex flex-col gap-y-1 ml-4 mt-1`}>
                            {item.items.map(subItem => (
                                <Link key={subItem.href.toString()} href={subItem.href} className={`p-2 rounded-md text-lg font-normal font-['Inter'] hover:bg-gray-200 whitespace-nowrap ${pathname === subItem.href ? 'bg-gray-300 text-neutral-950' : 'text-neutral-950'}`}>
                                {subItem.title}
                                </Link>
                            ))}
                            </div>
                        </div>
                        );
                    } else {
                        return (
                        <Link key={item.href.toString()} href={item.href} className={`flex items-center gap-x-3 p-2 rounded-md transition-colors hover:bg-gray-200 w-full text-lg font-bold font-['Inter'] ${pathname === item.href ? "bg-gray-300 text-neutral-950" : "text-neutral-950"}`}>
                            <Icon icon={item.icon} className="w-6 h-6 flex-shrink-0" />
                            <span className="whitespace-nowrap truncate">{item.title}</span>
                        </Link>
                        );
                    }
                    })}
                </div>
            )}
        </nav>

        <div className="mt-auto border-t border-gray-200 pt-4 w-full flex-shrink-0">
            <div className={`bg-gray-400 rounded-lg p-2 flex items-center gap-x-4 overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}>
                <div className="w-9 h-9 bg-neutral-900 rounded-full flex-shrink-0 flex items-center justify-center">
                <span className="text-white text-sm font-bold">{userName.charAt(0).toUpperCase()}</span>
                </div>
                <div className={`transition-opacity duration-200 whitespace-nowrap ${isCollapsed ? 'hidden' : 'opacity-100'}`}>
                    <p className="text-neutral-950 text-sm font-bold truncate">{userName} {userRole && `(${userRole})`}</p>
                </div>
            </div>
            <button onClick={toggleCollapse} className="w-full flex items-center justify-center mt-2 p-2 rounded-md hover:bg-gray-200 transition-colors" title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}>
                <Icon icon={isCollapsed ? "mdi:arrow-right" : "mdi:arrow-left"} className="w-6 h-6 text-neutral-800" />
            </button>
        </div>
      </div>
    </aside>
  );
}
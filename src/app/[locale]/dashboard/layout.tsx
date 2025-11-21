// ===== src/app/[locale]/dashboard/layout.tsx =====
"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { ReactNode, useState, useEffect, useCallback } from "react";
import { useRouter } from "@/../i18n/navigation";
import { api } from "@/services/api";

const MIN_WIDTH = 80;          // Kích thước thu nhỏ
const DEFAULT_WIDTH = 288;     // Kích thước mặc định
const MAX_WIDTH = 480;         // Kích thước tối đa khi kéo

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH); 
  const [isCollapsed, setIsCollapsed] = useState(false);           
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isResizing, setIsResizing] = useState(false);             
  const router = useRouter();

  // --- Kiểm tra quyền Admin ---
  useEffect(() => {
    const timer = setTimeout(() => {
        const token = api.auth.getAuthToken();
        if (!token) { router.push('/login'); return; }
        
        const role = api.auth.getUserRole();
        if (role && role.toLowerCase() === 'admin') {
          setIsAuthorized(true);
        } else {
          router.push('/');
        }
    }, 100);
    return () => clearTimeout(timer);
  }, [router]);

  // --- Logic Kéo thả (Resize) ---
  const startResizing = useCallback(() => setIsResizing(true), []);
  const stopResizing = useCallback(() => setIsResizing(false), []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = mouseMoveEvent.clientX;
        if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
          setSidebarWidth(newWidth);
          setIsCollapsed(newWidth < 100);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  // --- Logic Nút Bấm Thu/Phóng nhanh ---
  const toggleSidebar = () => {
    if (isCollapsed) {
      setSidebarWidth(DEFAULT_WIDTH);
      setIsCollapsed(false);
    } else {
      setSidebarWidth(MIN_WIDTH);
      setIsCollapsed(true);
    }
  };

  if (!isAuthorized) return null;

  return (
    // --- SỬA LẠI Ở ĐÂY: bg-gray-400 ---
    <div className="bg-gray-400 min-h-screen w-full">
      
      {/* 1. Sidebar cố định bên trái */}
      <DashboardSidebar 
        width={sidebarWidth}
        isCollapsed={isCollapsed} 
        toggleCollapse={toggleSidebar}
        startResizing={startResizing}
      />

      {/* 2. Nội dung chính (Main) */}
      <main 
        className="min-h-screen flex flex-col transition-[margin-left] ease-out"
        style={{ 
          marginLeft: `${sidebarWidth}px`,
          transitionDuration: isResizing ? '0ms' : '300ms' 
        }}
      >
        {/* Giữ p-10 như code gốc của bạn */}
        <div className="p-10 w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
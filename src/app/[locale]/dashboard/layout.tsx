// src/app/[locale]/dashboard/layout.tsx
"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "@/../i18n/navigation";
import { api } from "@/services/api";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authorized to access dashboard
    const token = api.auth.getAuthToken();
    
    if (!token) {
      // No token, redirect to login
      router.push('/login');
      return;
    }

    const role = api.auth.getUserRole();
    
    if (role && role.toLowerCase() === 'admin') {
      // User is admin, allow access
      setIsAuthorized(true);
    } else {
      // User is not admin, redirect to main page
      router.push('/');
    }
  }, [router]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Don't render dashboard content until authorization is checked
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="bg-gray-400 min-h-screen">
      {/* Sidebar giờ đây được đặt ở position: fixed, tách biệt khỏi luồng layout */}
      <DashboardSidebar 
        isCollapsed={isCollapsed} 
        toggleCollapse={toggleSidebar} 
      />
      {/* 
        - Vùng main content sẽ có padding-left thay đổi mượt mà.
        - Transition trên padding sẽ tạo ra hiệu ứng đẩy/co nội dung rất trôi chảy.
      */}
      <main className={`
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'pl-20' : 'pl-72'}
      `}>
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
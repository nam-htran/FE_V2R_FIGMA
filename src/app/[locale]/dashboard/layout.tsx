// src/app/[locale]/dashboard/layout.tsx
"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { ReactNode, useState } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

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
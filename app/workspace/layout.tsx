// app/workspace/layout.tsx
"use client";

import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    // --- THAY ĐỔI: Layout đơn giản, chắc chắn hơn ---
    <div className="min-h-screen bg-background-subtle">
      {/* --- PERBAIKAN: Properti 'toggle' yang tidak perlu dihapus --- */}
      <Sidebar isCollapsed={isSidebarCollapsed} />
      {/* --- PERBAIKAN: Properti 'toggleSidebar' yang hilang ditambahkan --- */}
      <TopNav isSidebarCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      <main className={cn(
        "transition-[padding-left] duration-300 ease-in-out pt-16",
        isSidebarCollapsed ? "pl-20" : "pl-64"
      )}>
        <div className="p-4 sm:p-6 lg:p-8">
            {children}
        </div>
      </main>
    </div>
  );
}
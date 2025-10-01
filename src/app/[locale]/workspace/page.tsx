"use client"; // Chuyển thành Client Component để sử dụng hooks

import { useState } from "react";
import { Icon } from "@iconify/react";
import Sidebar from "@/components/workspace/Sidebar";
import ViewPanel from "@/components/workspace/ViewPanel";

export default function WorkspacePage() {
  // State để quản lý trạng thái đóng/mở của sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // Thêm 'relative' để định vị nút hamburger
    <main className="relative flex w-screen h-screen overflow-hidden bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Nút Hamburger để mở sidebar trên màn hình nhỏ */}
      {/* Nút này sẽ được ẩn trên màn hình lớn (lg:hidden) */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="absolute top-4 left-4 z-30 lg:hidden p-2 bg-gray-700/50 text-white rounded-md"
        aria-label="Open sidebar"
      >
        <Icon icon="mdi:menu" width={24} />
      </button>

      {/* ViewPanel giờ đây sẽ nằm trong một container linh hoạt */}
      <div className="flex-1">
        <ViewPanel />
      </div>
    </main>
  );
}
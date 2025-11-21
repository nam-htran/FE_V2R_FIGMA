// ===== .\src\app\[locale]\workspace\layout.tsx =====
"use client";

import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import { useRouter } from "@/../i18n/navigation";
import { useEffect, ReactNode } from "react";
import { authService } from "@/services/api/auth";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { openLoginModal } = useUI();
  const router = useRouter();

  useEffect(() => {
    // Effect này chạy ở client sau khi component được mount.
    // Lúc này, AuthContext đã có thời gian để khởi tạo từ localStorage.
    if (!isAuthenticated) {
      // Kiểm tra lại một lần nữa bằng token để chắc chắn
      const token = authService.getAuthToken();
      if (!token) {
        console.log("User is not authenticated. Redirecting to home and opening login modal.");
        router.push('/');
        // Mở modal đăng nhập sau khi đã về trang chủ để người dùng biết cần làm gì
        setTimeout(openLoginModal, 300); 
      }
    }
  }, [isAuthenticated, router, openLoginModal]);
  
  // Nếu chưa xác thực, trả về null để không hiển thị gì cả trong khi chờ chuyển hướng.
  // Điều này ngăn trang workspace bị "nháy" lên trước khi chuyển hướng.
  if (!isAuthenticated) {
    return null;
  }

  // Nếu đã xác thực, hiển thị nội dung của workspace.
  return <>{children}</>;
}
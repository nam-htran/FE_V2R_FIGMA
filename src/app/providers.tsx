"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ReactNode } from "react";

// Component này sẽ đóng vai trò là điểm vào phía client cho các provider
export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
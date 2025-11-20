"use client";

import { AuthProvider } from "@/context/AuthContext";
import { GenerationProvider } from "@/context/GenerationContext";
import { UIProvider } from "@/context/UIContext"; // --- BỔ SUNG ---
import { ToastProvider } from "@/context/ToastContext";
import ToastContainer from '@/components/ToastContainer';
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UIProvider>
      <ToastProvider>
        <AuthProvider>
          <GenerationProvider>
            {children}
            <ToastContainer />
          </GenerationProvider>
        </AuthProvider>
      </ToastProvider>
    </UIProvider>
  );
}
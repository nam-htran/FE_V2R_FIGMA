"use client";

import { AuthProvider } from "@/context/AuthContext";
import { GenerationProvider } from "@/context/GenerationContext";
import { UIProvider } from "@/context/UIContext"; // --- BỔ SUNG ---
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UIProvider>
      <AuthProvider>
        <GenerationProvider>
          {children}
        </GenerationProvider>
      </AuthProvider>
    </UIProvider>
  );
}
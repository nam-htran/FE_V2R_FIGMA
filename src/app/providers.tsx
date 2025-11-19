"use client";

import { AuthProvider } from "@/context/AuthContext";
import { GenerationProvider } from "@/context/GenerationContext";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <GenerationProvider>
        {children}
      </GenerationProvider>
    </AuthProvider>
  );
}
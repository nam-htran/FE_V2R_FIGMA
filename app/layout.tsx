// app/layout.tsx

import type { Metadata } from "next";
import { Roboto, Be_Vietnam_Pro } from "next/font/google"; // --- THÊM: Import font ---
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

// --- THÊM: Cấu hình font ---
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-be-vietnam-pro",
});


export const metadata = {
  title: "Vision3D - AI 3D Model Generator",
  description: "Tạo mô hình 3D từ văn bản và hình ảnh với công nghệ AI tiên tiến.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // --- THAY ĐỔI: Áp dụng biến font vào thẻ html ---
    <html lang="en" className={cn(roboto.variable, beVietnamPro.variable)}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
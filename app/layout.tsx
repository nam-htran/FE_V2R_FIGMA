import type { Metadata } from "next";
import { Inter, Be_Vietnam_Pro, Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// --- SỬA LỖI: Chuyển các font vào đây để đồng bộ ---
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const beVietnamPro = Be_Vietnam_Pro({ subsets: ["latin"], weight: ["400", "600", "700", "900"], variable: "--font-be-vietnam-pro" });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-roboto" });

export const metadata = {
  title: "Vision2Reality",
  description: "Generate Stunning 3D Models with AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* --- ĐÃ SỬA: Áp dụng trực tiếp class bg-background và text-foreground --- */}
      <body className={`${inter.variable} ${beVietnamPro.variable} ${roboto.variable} bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
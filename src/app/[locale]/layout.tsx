// ===== .\src\app\[locale]\layout.tsx =====
import { ThemeProvider } from "@/context/ThemeProvider";
import { Providers } from "../providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter, Unbounded } from "next/font/google";
import Image from "next/image";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const unbounded = Unbounded({ subsets: ["latin"], variable: "--font-unbounded" });

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${unbounded.variable} font-inter`}
        suppressHydrationWarning
      >
        <div className="fixed inset-0 -z-20">
          <Image
            src="/landing-page/background/full.png"
            alt="V2R landing page background"
            layout="fill"
            // === CHỈNH SỬA TẠI ĐÂY ===
            // "fill" sẽ kéo dãn ảnh để lấp đầy toàn bộ không gian,
            // đảm bảo không bị cắt và không có khoảng trống.
            objectFit="fill" 
            quality={100}
            priority
          />
        </div>
        
        {/* Toàn bộ nội dung trang nằm ở đây */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <Providers>
              <main>{children}</main>
            </Providers>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
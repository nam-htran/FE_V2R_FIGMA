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

export const metadata = {
  title: "V2R",
  description: "The NO.1 AI 3D Model Generator for Everyone",
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
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
            objectFit="fill" // Giữ nguyên objectFit của bạn
            quality={100}
            priority
          />
        </div>
        
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <Providers>
              {/* Nội dung trang sẽ được render ở đây */}
              <main>{children}</main>
            </Providers>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
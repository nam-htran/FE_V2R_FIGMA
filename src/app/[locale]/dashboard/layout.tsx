import { ThemeProvider } from "@/context/ThemeProvider";
import { Providers } from "../providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter, Unbounded } from "next/font/google";
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
        className={`${inter.variable} ${unbounded.variable} font-inter bg-[#F8F8F8]`}
        suppressHydrationWarning
      >
        {/* Decorative Background Blobs */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-20">
          <div className="absolute top-[-20%] left-[-15%] w-[50rem] h-[50rem] bg-gradient-to-br from-cyan-200 to-blue-400 rounded-full opacity-30 blur-3xl animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-15%] w-[50rem] h-[50rem] bg-gradient-to-br from-purple-200 to-indigo-400 rounded-full opacity-30 blur-3xl animate-pulse [animation-delay:3s]" />
        </div>
        
        {/* Glassmorphism Overlay */}
        <div className="fixed inset-0 bg-white/40 backdrop-blur-2xl -z-10"></div>
        
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
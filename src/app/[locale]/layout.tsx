// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Unbounded } from 'next/font/google';
import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
// 1. Import component Providers mới
import { Providers } from '../providers';

// Font setup
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const unbounded = Unbounded({ subsets: ['latin'], variable: '--font-unbounded' });

export const metadata: Metadata = {
  title: 'Vision2Realty',
  description: 'The NO.1 AI 3D Model Generator for Everyone',
};

// Định nghĩa kiểu cho props của layout
interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({ children, params }: {children: React.ReactNode, params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${unbounded.variable} bg-stone-50 font-inter`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* 2. Sử dụng component Providers ở đây */}
          <Providers>
            <main>{children}</main>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
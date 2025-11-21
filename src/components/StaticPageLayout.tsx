// ===== .\src\components\StaticPageLayout.tsx =====
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

const StaticPageLayout = ({ children, title }: { children: ReactNode; title: string }) => {
  return (
    <>
      <Header />
      {/* CẬP NHẬT: Giao diện luôn sáng, loại bỏ các class dark: */}
      <main className="pt-32 pb-16 bg-white/80 backdrop-blur-md min-h-screen text-neutral-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold font-['Unbounded'] text-neutral-900 mb-8 border-b border-gray-300 pb-4">
            {title}
          </h1>
          {/* Cấu hình prose để tự động style các thẻ p, h2, ul */}
          <div className="prose prose-lg max-w-none font-['Inter']">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default StaticPageLayout;
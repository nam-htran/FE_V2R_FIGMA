// ===== .\src\app\[locale]\community\page.tsx =====
"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useTranslations } from "next-intl";

const communityItems = [
    { src: '/landing-page/image 4.png', alt: '3D model 1', name: 'Yua Mikami', author: 'UserA' },
    { src: '/landing-page/image 13.png', alt: '3D model 2', name: 'Asuka Langley', author: 'UserB' },
    { src: '/landing-page/image 9.png', alt: '3D model 3', name: 'Eimi Fukada', author: 'UserC' },
    { src: '/landing-page/image 11.png', alt: '3D model 4', name: 'Rei Ayanami', author: 'UserD' },
    { src: '/landing-page/image 14.png', alt: '3D model 5', name: 'Shinji Ikari', author: 'UserE' },
    { src: '/landing-page/image 10.png', alt: '3D model 6', name: 'Kaworu Nagisa', author: 'UserF' },
    { src: '/landing-page/image 15.png', alt: '3D model 7', name: 'Mari Illustrious', author: 'UserG' },
    { src: '/landing-page/image 16.png', alt: '3D model 8', name: 'Toji Suzuhara', author: 'UserH' },
    { src: '/landing-page/image 17.png', alt: '3D model 9', name: 'Kensuke Aida', author: 'UserI' },
    { src: '/landing-page/image 18.png', alt: '3D model 10', name: 'Gendo Ikari', author: 'UserJ' },
    { src: '/landing-page/image 19.png', alt: '3D model 11', name: 'Ritsuko Akagi', author: 'UserK' },
    { src: '/landing-page/image 20.png', alt: '3D model 12', name: 'Misato Katsuragi', author: 'UserL' },
];

export default function CommunityPage() {
  const t = useTranslations('Community');
  return (
    <>
      <Header />
      {/* CẬP NHẬT: Bỏ dark mode */}
      <main className="pt-32 pb-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-['Unbounded'] text-neutral-900">
              {t('title')}
            </h1>
            <p className="mt-4 text-lg text-neutral-600">
              {t('subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {communityItems.map((item) => (
              <div key={item.name} className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <Image src={item.src} alt={item.alt} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform duration-300"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-white font-semibold">{item.name}</h3>
                  <p className="text-white/70 text-sm">{t('byAuthor', {author: item.author})}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
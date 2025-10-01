"use client";
import type { FC } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface ImageItem {
  src: string;
  width: number;
  height: number;
  alt: string;
}

const images: ImageItem[] = [
  { src: '/landing-page/image 4.png', width: 413, height: 576, alt: '3D model render' },
  { src: '/landing-page/image 9.png', width: 413, height: 180, alt: '3D model render' },
  { src: '/landing-page/image 10.png', width: 413, height: 592, alt: '3D model render' },
  { src: '/landing-page/image 11.png', width: 413, height: 619, alt: '3D model render' },
  { src: '/landing-page/image 13.png', width: 413, height: 425, alt: '3D model render' },
  { src: '/landing-page/image 14.png', width: 413, height: 674, alt: '3D model render' },
  { src: '/landing-page/image 15.png', width: 413, height: 701, alt: '3D model render' },
  { src: '/landing-page/image 16.png', width: 413, height: 401, alt: '3D model render' },
  { src: '/landing-page/image 17.png', width: 413, height: 592, alt: '3D model render' },
  { src: '/landing-page/image 18.png', width: 413, height: 592, alt: '3D model render' },
  { src: '/landing-page/image 19.png', width: 413, height: 425, alt: '3D model render' },
  { src: '/landing-page/image 20.png', width: 413, height: 269, alt: '3D model render' },
  { src: '/landing-page/image 21.png', width: 413, height: 619, alt: '3D model render' },
  { src: '/landing-page/image 22.png', width: 413, height: 425, alt: '3D model render' },
  { src: '/landing-page/image 23.png', width: 413, height: 592, alt: '3D model render' },
  // Bạn có thể thêm các ảnh còn lại vào đây
];

const ImageGallery: FC = () => {
  const t = useTranslations('ImageGallery');

  return (
    <section className="py-20">
      <div className="text-center max-w-3xl mx-auto px-4">
        <h2 className="text-4xl font-bold font-['Unbounded'] text-neutral-900">{t('title')}</h2>
        <p className="mt-4 text-xl font-['Inter'] text-neutral-900">{t('description')}</p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 columns-1 md:columns-2 lg:columns-3 gap-8">
        {images.map((image) => (
          <div key={image.src} className="mb-8 break-inside-avoid">
            <Image 
              src={image.src} 
              alt={image.alt}
              width={image.width} 
              height={image.height}
              className="rounded-[35px] w-full h-auto"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
          </div>
        ))}
      </div>
      
      <div className="text-center mt-12">
        <button className="bg-neutral-900 text-white text-lg font-medium font-['Unbounded'] rounded-[10px] px-8 py-3">
          {t('load_more')}
        </button>
      </div>
    </section>
  );
};

export default ImageGallery;
// ===== .\src\components\ImageGallery.tsx =====
"use client";
import { useState, type FC } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

const allGalleryItems = [
  { src: '/landing-page/image 4.png', alt: '3D model 1', name: 'Yua Mikami', timestamp: '1 ngày trước' },
  { src: '/landing-page/image 13.png', alt: '3D model 2', name: 'Asuka Langley', timestamp: '3 ngày trước' },
  { src: '/landing-page/image 9.png', alt: '3D model 3', name: 'Eimi Fukada', timestamp: '2 ngày trước' },
  { src: '/landing-page/image 11.png', alt: '3D model 4', name: 'Rei Ayanami', timestamp: '4 ngày trước' },
  { src: '/landing-page/image 14.png', alt: '3D model 5', name: 'Shinji Ikari', timestamp: '5 ngày trước' },
  { src: '/landing-page/image 10.png', alt: '3D model 6', name: 'Kaworu Nagisa', timestamp: '6 ngày trước' },
  { src: '/landing-page/image 15.png', alt: '3D model 7', name: 'Mari Illustrious', timestamp: '7 ngày trước' },
  { src: '/landing-page/image 16.png', alt: '3D model 8', name: 'Toji Suzuhara', timestamp: '8 ngày trước' },
  { src: '/landing-page/image 17.png', alt: '3D model 9', name: 'Kensuke Aida', timestamp: '9 ngày trước' },
];

const carouselVariants = {
  main: { x: -250, y: 0, scale: 1, opacity: 1, zIndex: 3 },
  next: { x: 150, y: 100, scale: 0.7, opacity: 1, zIndex: 2 },
  secondNext: { x: 440, y: 100, scale: 0.7, opacity: 0.7, zIndex: 1 },
  prev: { x: -600, scale: 0.7, opacity: 0, zIndex: 2 },
  hidden: { x: 550, scale: 0.7, opacity: 0, zIndex: 1 },
};
const textVariants = {
    enter: { y: 20, opacity: 0 },
    center: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
};

const ImageGallery: FC = () => {
  const t = useTranslations('ImageGallery');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const paginate = (direction: number) => {
    setActiveIndex((prevIndex) => (prevIndex + direction + allGalleryItems.length) % allGalleryItems.length);
  };

  const getVariantName = (itemIndex: number) => {
    const total = allGalleryItems.length;
    if (itemIndex === activeIndex) return 'main';
    if (itemIndex === (activeIndex + 1) % total) return 'next';
    if (itemIndex === (activeIndex + 2) % total) return 'secondNext';
    if (itemIndex === (activeIndex - 1 + total) % total) return 'prev';
    return 'hidden';
  };
  const activeItem = allGalleryItems[activeIndex];

  return (
    <section className="relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
            <AnimatePresence>
                {!isExpanded && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0"
                        style={{ backgroundImage: `url(/landing-page/background/background-image-gallery.png)`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}/>
                )}
            </AnimatePresence>
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: isExpanded ? 1 : 0 }} transition={{ duration: 0.5 }} className="absolute inset-0 bg-neutral-950"/>
        </div>

        <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-['Unbounded'] font-medium text-white">{t('title')}</h2>
                    <p className="mt-4 text-xl font-['Inter'] text-white/80">{t('description')}</p>
                </div>
                
                <AnimatePresence mode="wait">
                    {!isExpanded ? (
                        <motion.div key="carousel" className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                            <button onClick={() => paginate(-1)} className="absolute left-[-80px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center text-white hover:bg-gray-700/70 transition-colors">
                                <Icon icon="mdi:chevron-left" width={28} />
                            </button>
                            <button onClick={() => paginate(1)} className="absolute right-[-80px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center text-white hover:bg-gray-700/70 transition-opacity">
                                <Icon icon="mdi:chevron-right" width={28} />
                            </button>
                            <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
                                <div className="relative w-full max-w-5xl h-[550px]">
                                    <AnimatePresence mode="wait" initial={false}>
                                        <motion.div key={activeIndex} variants={textVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute top-12 left-[calc(50%+50px)] w-[400px] z-20">
                                            <h3 className="text-white text-4xl font-['Unbounded'] font-medium">{activeItem.name}</h3>
                                            <p className="text-white/70 text-lg font-['Inter'] font-light mt-1">{activeItem.timestamp}</p>
                                        </motion.div>
                                    </AnimatePresence>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {allGalleryItems.map((item, index) => (
                                            <motion.div key={item.name} className="absolute w-[380px] h-[550px]" animate={getVariantName(index)} variants={carouselVariants} transition={{ type: 'spring', stiffness: 200, damping: 25 }} style={{ originY: 0.5, originX: 0.5 }}>
                                               <div className="w-full h-full p-3 rounded-3xl">
                                                    <div className="w-full h-full relative rounded-2xl overflow-hidden">
                                                         <Image src={item.src} alt={item.alt} layout="fill" objectFit={getVariantName(index) === 'main' ? 'contain' : 'cover'} />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {allGalleryItems.map((item) => (
                                    <div key={item.name} className="group relative aspect-[3/4] overflow-hidden rounded-2xl">
                                        <Image src={item.src} alt={item.alt} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform duration-300"/>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
                                        <div className="absolute bottom-0 left-0 p-4">
                                            <h3 className="text-white font-semibold">{item.name}</h3>
                                            <p className="text-white/70 text-sm">{item.timestamp}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            <div className="text-center pt-10 pb-16">
                 {/* CẬP NHẬT: Sử dụng t() để đa ngôn ngữ */}
                 <button onClick={() => setIsExpanded(!isExpanded)} className="bg-neutral-800 text-white font-['Unbounded'] px-8 py-3 rounded-lg hover:bg-neutral-700 transition-colors">
                    {isExpanded ? t('collapse') : t('load_more')}
                </button>
            </div>
        </div>
    </section>
  );
};

export default ImageGallery;
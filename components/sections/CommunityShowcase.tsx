
"use client";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

// Danh sách các hình ảnh từ thư mục public/landing_page
const communityImages = [
  { src: "/landing_page/image 13.png", alt: "Community model 1" },
  { src: "/landing_page/image 14.png", alt: "Community model 2" },
  { src: "/landing_page/image 15.png", alt: "Community model 3" },
  { src: "/landing_page/image 16.png", alt: "Community model 4" },
  { src: "/landing_page/image 18.png", alt: "Community model 5" },
  { src: "/landing_page/image 19.png", alt: "Community model 6" },
  { src: "/landing_page/image 21.png", alt: "Community model 7" },
  { src: "/landing_page/image 22.png", alt: "Community model 8" },
  { src: "/landing_page/image 23.png", alt: "Community model 9" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
};

const CommunityShowcase = () => {
  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-be-vietnam-pro text-4xl font-bold text-neutral-900">
            Step into the World of 3D Imagination
          </h2>
          <p className="font-roboto mt-4 text-xl text-neutral-900 max-w-3xl mx-auto">
            Discover and download a variety of unique 3D models from our vibrant community.
          </p>
        </motion.div>
        
        {/* --- ANIMATION: Áp dụng stagger effect --- */}
        <motion.div 
          className="columns-1 sm:columns-2 md:columns-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {communityImages.map((image, index) => (
            <motion.div key={index} className="mb-8 break-inside-avoid" variants={itemVariants}>
              <Image 
                src={image.src} 
                alt={image.alt} 
                width={413}
                height={600}
                className="rounded-[35px] w-full h-auto object-cover" 
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-8">
          <motion.button 
            className="bg-neutral-900 text-white text-base font-semibold font-be-vietnam-pro rounded-full px-8 py-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Load more
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default CommunityShowcase;
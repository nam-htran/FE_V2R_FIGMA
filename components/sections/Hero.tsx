"use client"; // --- ANIMATION: Cần thiết để sử dụng hook và animation ---
import Image from "next/image";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex items-center pt-24 pb-24">
      <div className="w-full max-w-screen-2xl mx-auto px-8">
        <div className="flex justify-center">
            <div className="flex w-full max-w-7xl flex-col items-center gap-y-16 lg:flex-row lg:justify-center lg:gap-x-32">
                
                {/* --- ANIMATION: Bọc text content vào motion.div --- */}
                <motion.div 
                  className="text-center lg:text-left"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <h1 className="font-be-vietnam-pro text-7xl font-extrabold text-neutral-900 leading-tight">
                    The NO.1 AI 3D
                    <br/>
                    Model Generator
                    <br/>
                    For Everyone
                    </h1>
                    <p className="font-roboto mt-6 text-lg text-neutral-900 leading-relaxed max-w-md mx-auto lg:mx-0">
                    Convert your photos or concept art images into 3D models with
                    stunning details in just a matter of seconds.
                    </p>
                    <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                    <motion.a 
                      href="#" 
                      className="text-center bg-blue-900 rounded-full px-8 py-4 text-white text-base font-semibold font-be-vietnam-pro"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                        START FOR FREE
                    </motion.a>
                    <motion.a 
                      href="#" 
                      className="inline-flex items-center justify-center bg-neutral-900 rounded-full px-8 py-4 text-neutral-100 text-base font-semibold font-be-vietnam-pro"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                        EXPLORE
                        <span className="ml-2 font-bold">&gt;</span>
                    </motion.a>
                    </div>
                </motion.div>

                {/* --- ANIMATION: Thêm hiệu ứng cho card --- */}
                <motion.div 
                  className="flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                    <div className="relative bg-card-bg rounded-3xl shadow-2xl w-[480px] h-[600px] overflow-hidden">
                        <Image
                            src="/landing_page/image 4.png" 
                            alt="AI 3D Model"
                            width={500}
                            height={600}
                            className="w-full h-full object-cover"
                            priority
                        />
                        <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/30 backdrop-blur-sm flex justify-between items-center border border-white/20">
                            <span className="font-roboto text-base font-medium text-blue-900">
                            Ryo Yamada
                            </span>
                            <a href="#" className="text-sm font-semibold text-blue-900 hover:underline">
                            Explore
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
"use client";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

const cardVariants: Variants = {
  offscreen: { y: 50, opacity: 0 },
  onscreen: { y: 0, opacity: 1, transition: { type: "spring", bounce: 0.4, duration: 1 } }
};

const Features = () => {
  return (
    // --- ĐÃ SỬA: Tăng padding dọc ---
    <section className="py-24 mt-10 md:mt-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20"> {/* --- ĐÃ SỬA: Tăng margin-bottom --- */}
          {/* --- ĐÃ SỬA: Tăng font-size tiêu đề --- */}
          <h2 className="font-be-vietnam-pro text-5xl font-bold text-neutral-900">Your Ultimate AI 3D Model Generator</h2>
          {/* --- ĐÃ SỬA: Tăng max-width và làm dịu màu chữ --- */}
          <p className="font-roboto mt-5 text-xl text-neutral-700 max-w-3xl mx-auto">Powerful AI generation tools to help you unlock infinite possibilities.</p>
        </div>

        <div className="space-y-8">
            <motion.div 
              className="bg-blue-800 rounded-3xl p-8 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 mx-auto max-w-7xl"
              initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.5 }} variants={cardVariants}
            >
              <div className="w-full lg:w-5/12 bg-neutral-900 rounded-2xl p-6">
                <Image src="/landing_page/image 10.png" alt="Image to 3D feature" width={400} height={500} className="w-full h-auto object-contain" />
              </div>
              <div className="w-full lg:w-6/12 text-white text-center lg:text-left">
                <h3 className="font-be-vietnam-pro text-4xl font-bold">Image to 3D</h3>
                <p className="font-roboto mt-6 text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
                  Convert your photos or concept art images into 3D models with stunning details in just a matter of seconds.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                    <motion.button className="bg-neutral-900 text-white rounded-full px-8 py-3.5 text-base font-semibold font-be-vietnam-pro" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Learn more</motion.button>
                    <motion.button className="bg-neutral-900 text-white rounded-full px-8 py-3.5 text-base font-semibold font-be-vietnam-pro" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Explore community</motion.button>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-yellow-400 rounded-3xl p-8 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 mx-auto max-w-7xl"
              initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.5 }} variants={cardVariants}
            >
               <div className="w-full lg:w-6/12 text-neutral-900 text-center lg:text-left">
                  <h3 className="font-be-vietnam-pro text-4xl font-bold">Text to 3D</h3>
                  <p className="font-roboto mt-6 text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
                    Text to 3D helps you conceptualize, iterate, and experiment with text prompts to create 3D models in seconds.
                  </p>
                  <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                    <motion.button className="bg-neutral-900 text-white rounded-full px-8 py-3.5 text-base font-semibold font-be-vietnam-pro" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Learn more</motion.button>
                    <motion.button className="bg-neutral-900 text-white rounded-full px-8 py-3.5 text-base font-semibold font-be-vietnam-pro" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Explore community</motion.button>
                  </div>
              </div>
              <div className="w-full lg:w-5/12 bg-neutral-900 rounded-2xl p-6">
                <Image src="/landing_page/image 11.png" alt="Text to 3D feature" width={400} height={500} className="w-full h-auto object-contain" />
              </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
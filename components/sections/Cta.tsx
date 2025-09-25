"use client"; // --- ĐÃ THÊM: Cần thiết cho animation ---
import { motion } from "framer-motion";

const Cta = () => {
    return (
        // --- ĐÃ SỬA: Tăng padding dọc và thêm animation ---
        <motion.section 
            className="py-32"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                 {/* --- ĐÃ SỬA: Tăng font-size tiêu đề --- */}
                 <h2 className="font-be-vietnam-pro text-5xl font-bold text-neutral-900">
                    Unlock a faster 3D workflow.
                 </h2>
                 {/* --- ĐÃ SỬA: Tăng margin, max-width và làm dịu màu chữ --- */}
                 <p className="font-roboto mt-5 text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
                    Transform your design process with V2R. Try it now and see your creativity come to life effortlessly!
                 </p>
                 {/* --- ĐÃ SỬA: Tăng margin và cập nhật style nút bấm --- */}
                 <div className="mt-14 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <motion.a 
                        href="#" 
                        className="bg-blue-900 rounded-full px-8 py-4 text-white text-base font-semibold font-be-vietnam-pro"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        START FOR FREE
                    </motion.a>
                    <motion.a 
                        href="#" 
                        className="bg-neutral-900 rounded-full px-8 py-4 text-neutral-100 text-base font-semibold font-be-vietnam-pro"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        EXPLORE
                    </motion.a>
                 </div>
            </div>
        </motion.section>
    );
}

export default Cta;
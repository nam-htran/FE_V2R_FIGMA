"use client"; // --- ĐÃ THÊM: Cần thiết để xử lý sự kiện onClick ---
import Image from "next/image";
import type { MouseEvent } from "react";

const Footer = () => {

  // --- ĐÃ THÊM: Hàm xử lý hiệu ứng cuộn mượt lên đầu trang ---
  const handleScrollToTop = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Ngăn hành vi nhảy trang mặc định
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Kích hoạt hiệu ứng cuộn mượt
    });
  };

  return (
    <footer className="relative mt-10 bg-gradient-to-b from-stone-50 to-[#E9EFFE] pt-24 pb-12">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-neutral-900">
            <div className="lg:col-span-2">
              <h3 className="font-roboto text-xl font-semibold">Subscribe to updates</h3>
              <p className="font-roboto text-base mt-4">Join our newsletter to stay updated on latest news</p>
              <form className="mt-4 flex flex-col sm:flex-row">
                <input type="email" placeholder="Enter your email" className="w-full sm:w-80 h-11 px-4 py-2.5 bg-white rounded-lg sm:rounded-r-none border-none text-stone-500 placeholder:text-stone-500" />
                <button type="submit" className="mt-2 sm:mt-0 w-full sm:w-32 h-11 bg-blue-800 text-white text-lg font-medium font-roboto rounded-lg sm:rounded-l-none">Subscribe</button>
              </form>
            </div>
            <div className="lg:col-start-3">
              <h3 className="font-roboto text-xl font-semibold">Features</h3>
              <ul className="mt-4 space-y-3 font-be-vietnam-pro text-base">
                <li><a href="#" className="hover:underline">Text to 3D</a></li>
                <li><a href="#" className="hover:underline">Image to 3D</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-roboto text-xl font-semibold">Product</h3>
              <ul className="mt-4 space-y-3 font-be-vietnam-pro text-base">
                <li><a href="#" className="hover:underline">Pricing</a></li>
                <li><a href="#" className="hover:underline">Community</a></li>
                <li><a href="#" className="hover:underline">Plugin</a></li>
                <li><a href="#" className="hover:underline">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-roboto text-xl font-semibold">Company</h3>
              <ul className="mt-4 space-y-3 font-be-vietnam-pro text-base">
                <li><a href="#" className="hover:underline">About</a></li>
                <li><a href="#" className="hover:underline">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-24 flex justify-between items-center pt-8">
          <Image 
            src="/logo/dark.png" 
            alt="V2R Logo" 
            width={90} 
            height={56} 
          />
          {/* --- ĐÃ SỬA: Thêm sự kiện onClick vào nút --- */}
          <a 
            href="#"
            onClick={handleScrollToTop}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-900 text-white"
            aria-label="Scroll to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
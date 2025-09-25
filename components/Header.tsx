"use client"; // --- ĐÃ THÊM: Cần thiết để sử dụng state ---
import Image from "next/image";
import { useState } from "react";

const Header = () => {
  // --- ĐÃ THÊM: State để giả lập trạng thái đăng nhập ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="absolute top-0 left-0 w-full z-20 font-inter">
      <div className="w-full max-w-screen-2xl mx-auto px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-x-10">
            <Image 
              src="/logo/dark.png" 
              alt="V2R Logo" 
              width={40} 
              height={38} 
            />
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="bg-neutral-900 text-neutral-100 text-base font-bold px-5 py-2.5 rounded-lg">Home</a>
              <a href="#" className="text-gray-800 text-base">Community</a>
              <a href="#" className="text-gray-800 text-base">Features</a>
              <a href="#" className="text-gray-800 text-base">Pricing</a>
            </nav>
          </div>
          
          {/* --- ĐÃ SỬA: Logic hiển thị tùy theo trạng thái đăng nhập --- */}
          <div>
            {isLoggedIn ? (
              <div className="flex items-center gap-x-2">
                {/* Notification Bell */}
                <button className="relative w-12 h-12 flex items-center justify-center rounded-full text-black hover:bg-neutral-200 transition-colors" aria-label="Notifications">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.918zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                  </svg>
                </button>
                {/* User Avatar */}
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                  </svg>
                </div> 
              </div>
            ) : (
              <div className="flex items-center gap-x-4">
                <a href="#" className="text-gray-800 text-base font-medium hover:text-black transition-colors">
                  Log in
                </a>
                <a href="#" className="bg-neutral-900 text-neutral-100 text-base font-medium px-5 py-2.5 rounded-lg">
                  Sign up
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { usePathname, Link } from "../../i18n/navigation";
import { Icon } from '@iconify/react';

export default function LanguageSwitcher() {
  // State để quản lý trạng thái mở/đóng của dropdown
  const [isOpen, setIsOpen] = useState(false);

  // Hook để lấy thông tin ngôn ngữ và đường dẫn
  const locale = useLocale();
  const pathname = usePathname();

  // Ref để tham chiếu đến phần tử div chính của component
  const switcherRef = useRef<HTMLDivElement>(null);

  // Danh sách các ngôn ngữ để dễ dàng mở rộng trong tương lai
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'vi', name: 'Tiếng Việt' }
  ];

  // Logic để đóng dropdown khi người dùng nhấp ra bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Thêm event listener khi component được mount
    document.addEventListener('mousedown', handleClickOutside);

    // Dọn dẹp event listener khi component bị unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [switcherRef]);

  return (
    // Container chính, cần 'relative' để định vị menu dropdown
    <div ref={switcherRef} className="relative">
      {/* Nút bấm để mở/đóng dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-2 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Icon icon="ph:globe" className="w-6 h-6 text-gray-700" />
        <span className="mx-2 font-bold font-['Unbounded'] text-gray-800">{locale.toUpperCase()}</span>
        <Icon 
          icon="mdi:chevron-down" 
          className={`w-5 h-5 text-gray-700 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Menu dropdown */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl z-20 py-1"
          role="menu"
        >
          {languages.map((lang) => (
            <Link
              key={lang.code}
              href={pathname}
              locale={lang.code}
              onClick={() => setIsOpen(false)} // Đóng dropdown sau khi chọn
              className={`
                block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100
                font-['Unbounded']
                ${locale === lang.code ? 'font-bold bg-gray-100' : 'font-normal'}
              `}
              role="menuitem"
            >
              {lang.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
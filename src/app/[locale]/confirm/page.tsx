// ===== .\src\app\[locale]\otp\page.tsx =====
"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";

export default function OtpPage() {
  const t = useTranslations("OTP");
  const [otp, setOtp] = useState<string[]>(new Array(5).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-neutral-200 dark:bg-neutral-800 p-4">
      <div className="w-full max-w-[676px] bg-white rounded-[40px] overflow-hidden p-8 sm:p-16 text-center">
        <h1 className="text-black text-4xl font-normal font-['Unbounded']">
          {t("title")}
        </h1>
        <p className="mt-6 text-black text-xl font-normal font-['Inter']">
          {t("subtitle")}
        </p>

        <div className="flex justify-center gap-x-2 sm:gap-x-5 my-14">
          {otp.map((digit, index) => (
            <input
              key={index}
              // === SỬA LỖI TẠI ĐÂY ===
              // Bọc phép gán trong khối lệnh `{}` để hàm không trả về giá trị
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-[10px] border-[1.5px] border-blue-800 text-center text-3xl sm:text-4xl font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          ))}
        </div>

        <button className="w-56 h-20 bg-blue-900 rounded-2xl hover:bg-blue-800 transition-colors">
          <span className="text-white text-2xl font-semibold font-['Unbounded']">
            {t("continue_button")}
          </span>
        </button>

        <p className="mt-12 text-black text-xl font-normal font-['Inter']">
          {t("did_not_receive")}{" "}
          <button className="text-blue-800 font-medium hover:underline">
            {t("resend")}
          </button>
        </p>
      </div>
    </main>
  );
}
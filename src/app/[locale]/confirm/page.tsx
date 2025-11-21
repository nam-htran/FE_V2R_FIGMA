// ===== .\src\app\[locale]\confirm\page.tsx =====
"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, type ChangeEvent, type KeyboardEvent, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { authService } from "@/services/api/auth";

const maskEmail = (email: string): string => {
  if (!email || !email.includes("@")) {
    return "your email";
  }
  const [name, domain] = email.split("@");
  if (name.length <= 3) {
    return `${name.slice(0, 1)}***@${domain}`;
  }
  return `${name.slice(0, 3)}***@${domain}`;
};

export default function OtpPage() {
  const t = useTranslations("OTP");
  const [otp, setOtp] = useState<string[]>(new Array(5).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationEmail, setRegistrationEmail] = useState<string>("");

  useEffect(() => {
    const email = authService.getRegistrationEmail() || sessionStorage.getItem("registrationEmail");
    if (email) {
      setRegistrationEmail(email);
    }
  }, []);

  // --- SỬA LỖI: Di chuyển hai hàm này vào bên trong component ---
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
  // --- KẾT THÚC PHẦN SỬA LỖI ---

  return (
    <main className="flex items-center justify-center min-h-screen bg-neutral-200 dark:bg-neutral-800 p-4">
      <div className="w-full max-w-[676px] bg-white rounded-[40px] overflow-hidden p-8 sm:p-16 text-center">
        <h1 className="text-black text-4xl font-normal font-['Unbounded']">
          {t("title")}
        </h1>
        <p className="mt-6 text-black text-xl font-normal font-['Inter']">
          {t("subtitle", { email: maskEmail(registrationEmail) })}
        </p>

        <div className="flex justify-center gap-x-2 sm:gap-x-5 my-14">
          {otp.map((digit, index) => (
            <input
              key={index}
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

        <div className="flex flex-col items-center gap-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            disabled={loading}
            onClick={async () => {
              setError(null);
              const otpCode = otp.join("");
              if (otpCode.length === 0) {
                setError(t("enter_otp"));
                return;
              }
              if (!registrationEmail) {
                setError(t("no_email_found"));
                return;
              }

              try {
                setLoading(true);
                const res = await authService.verifyOtp({ email: registrationEmail, otpCode });
                if ((res as any).token) {
                  authService.setAuthToken((res as any).token as string);
                }

                const isAdmin = authService.isAdmin();
                const locale = params?.locale || "";
                if (isAdmin) {
                  router.push(`/${locale}/dashboard`);
                } else {
                  router.push(`/${locale}/`);
                }
              } catch (err: any) {
                const msg = err?.message || t("invalid_otp");
                setError(msg);
              } finally {
                setLoading(false);
              }
            }}
            className="w-56 h-20 bg-blue-900 rounded-2xl hover:bg-blue-800 transition-colors disabled:opacity-60"
          >
            <span className="text-white text-2xl font-semibold font-['Unbounded']">
              {loading ? t("verifying") : t("continue_button")}
            </span>
          </button>
        </div>

        <p className="mt-12 text-black text-xl font-normal font-['Inter']">
          {t("did_not_receive")} {" "}
          <button
            onClick={async () => {
              if (!registrationEmail) {
                setError(t("no_email_found"));
                return;
              }
              try {
                await authService.resendOtp(registrationEmail);
              } catch (e) {
                /* ignore */
              }
            }}
            className="text-blue-800 font-medium hover:underline"
          >
            {t("resend")}
          </button>
        </p>
      </div>
    </main>
  );
}
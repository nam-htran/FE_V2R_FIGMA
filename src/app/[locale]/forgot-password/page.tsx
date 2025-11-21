"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/../i18n/navigation';
import { motion } from 'framer-motion';
export default function ForgotPasswordPage() {
const tLogin = useTranslations('Login');
const t = useTranslations('ForgotPassword');
const [email, setEmail] = useState('');
const [submitted, setSubmitted] = useState(false);
const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
console.log('Sending reset link to:', email);
setSubmitted(true);
};
return (
    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-gray-800 p-4">
    <main className="relative z-20">
    <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="relative w-full max-w-sm bg-white/60 dark:bg-black/40 shadow-2xl backdrop-blur-xl rounded-2xl p-8 font-['Inter']"
    >
    <div className="text-center mb-8">
    <Image src="/logo/dark.png" alt="V2R Logo" width={92} height={57} className="mx-auto" />
    </div>
{submitted ? (
        <div className="text-center text-neutral-800 dark:text-neutral-200">
          <h1 className="text-xl font-semibold">{t('submittedTitle')}</h1>
          <p className="mt-2 text-sm">
            {t('submittedText', { email: email })}
          </p>
          <Link href="/login" className="mt-6 inline-block text-cyan-600 underline hover:text-cyan-700 text-sm font-semibold">
            {t('backToLogin')}
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-xl font-semibold text-center text-neutral-800 dark:text-neutral-200 mb-4">{t('title')}</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder={tLogin('email_placeholder')}
              className="w-full h-10 px-4 bg-white/80 rounded-[10px] text-zinc-800 placeholder:text-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="w-full h-10 bg-gradient-to-r from-cyan-600 to-sky-300 rounded-xl text-white text-sm font-bold font-['Unbounded'] hover:opacity-90 transition-opacity"
            >
              {t('submitButton')}
            </button>
          </form>
           <div className="text-center mt-4">
            <Link href="/login" className="text-cyan-600 text-sm font-semibold underline hover:text-cyan-700">
              {t('backToLogin')}
            </Link>
          </div>
        </>
      )}
    </motion.div>
  </main>
</div>
);
}
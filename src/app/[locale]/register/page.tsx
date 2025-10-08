"use client";

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/../i18n/navigation';

export default function RegisterPage() {
  const t = useTranslations('Register');

  return (
    <main className="flex items-center justify-center min-h-screen bg-neutral-800">
      <div className="w-full max-w-sm mx-auto bg-stone-900 text-white rounded-2xl shadow-lg p-8">
        
        <div className="text-center mb-4">
          <Image src="/logo/light.png" alt="V2R Logo" width={50} height={31} className="mx-auto mb-6" />
          <h1 className="text-xl font-semibold font-['Unbounded']">{t('welcome')}</h1>
          <p className="text-sm text-gray-300 font-['Inter'] mt-2">{t('get_started')}</p>
        </div>

        <form className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder={t('email_placeholder')}
              className="w-full h-10 px-4 bg-stone-900 border border-zinc-700 rounded-lg text-sm text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder={t('password_placeholder')}
              className="w-full h-10 px-4 bg-stone-900 border border-zinc-700 rounded-lg text-sm text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
           <div>
            <input 
              type="password" 
              placeholder={t('confirm_password_placeholder')}
              className="w-full h-10 px-4 bg-stone-900 border border-zinc-700 rounded-lg text-sm text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            type="submit"
            className="w-full h-10 bg-blue-800 rounded-lg text-sm font-bold font-['Unbounded'] hover:bg-blue-700 transition-colors"
          >
            {t('continue_button')}
          </button>
        </form>

        <div className="text-center text-xs text-white font-medium font-['Inter'] mt-6">
          {t('have_account')}{' '}
          <Link href="/login" className="text-cyan-300 hover:underline font-semibold">
            {t('login_now')}
          </Link>
        </div>

        <div className="text-center text-zinc-400 text-[9px] font-medium font-roboto mt-8">
          <span>{t('terms_prefix')} </span>
          <Link href="/terms" className="text-cyan-300 hover:underline">{t('terms_of_use')}</Link>
          <span> {t('terms_and')} </span>
          <Link href="/privacy" className="text-cyan-300 hover:underline">{t('privacy_policy')}</Link>
          <span>.</span>
        </div>

      </div>
    </main>
  );
}
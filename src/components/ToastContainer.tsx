"use client";

import React from 'react';
import { useToast } from '@/context/ToastContext';

const colorFor = (type: string) => {
  switch (type) {
    case 'success': return 'bg-emerald-500';
    case 'error': return 'bg-rose-600';
    case 'warning': return 'bg-amber-500';
    default: return 'bg-sky-500';
  }
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed right-4 top-4 z-50 flex flex-col gap-3 w-[320px]">
      {toasts.map((t) => (
        <div key={t.id} className={`rounded-lg p-3 shadow-lg text-white flex items-start gap-3 ${colorFor(t.type)}`}>
          <div className="flex-1 text-sm">{t.message}</div>
          <button onClick={() => removeToast(t.id)} className="opacity-80 hover:opacity-100">✕</button>
        </div>
      ))}
    </div>
  );
}

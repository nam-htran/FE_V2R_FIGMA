// ===== .\src\components\Pricing.tsx =====
"use client";

import { useTranslations } from 'next-intl';
import { Icon } from '@iconify/react';
import type { FC } from 'react';
import { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/api/order';
import { authService } from '@/services/api/auth';

// ... (Component PricingCard giữ nguyên) ...
const PricingCard: FC<{ plan: 'basic' | 'pro' | 'enterprise'; onSubscribe: (planKey: 'basic' | 'pro' | 'enterprise') => void }> = ({ plan, onSubscribe }) => {
  const t = useTranslations(`Pricing.${plan}`);
  const isPro = plan === 'pro';

  return (
    <div 
      className={`
        flex flex-col p-8 rounded-2xl border transition-all duration-300
        ${isPro 
          ? 'bg-neutral-900 text-white border-blue-700 shadow-2xl lg:scale-105 lg:z-10' 
          // CẬP NHẬT: Thêm hiệu ứng trong suốt cho thẻ Basic và Enterprise
          : 'bg-white/60 backdrop-blur-sm text-neutral-900 border-gray-200/50 shadow-lg'
        }
      `}
    >
      <h3 className="text-2xl font-bold font-['Inter']">{t('name')}</h3>
      <div className="flex items-baseline mt-8 mb-10 whitespace-nowrap">
        <span className="text-5xl font-bold font-['Inter'] tracking-tight">{t('price')}</span>
        <span className={`text-lg font-medium ml-1 ${isPro ? 'text-gray-400' : 'text-gray-500'}`}>
          /{t('price_period')}
        </span>
      </div>
      {plan === 'enterprise' ? (
        <a
          href="https://www.facebook.com/v2r.vn/"
          target="_blank"
          rel="noreferrer"
          className={`
            w-full h-12 rounded-lg text-base font-semibold inline-flex items-center justify-center transition-colors relative z-10 pointer-events-auto
            ${isPro 
              ? 'bg-blue-700 text-white hover:bg-blue-600' 
              : 'bg-neutral-900 text-white hover:bg-neutral-700'
            }
          `}
        >
          {t('cta_button')}
        </a>
      ) : (
        <button 
          className={`
            w-full h-12 rounded-lg text-base font-semibold transition-colors relative z-10 pointer-events-auto
            ${isPro 
              ? 'bg-blue-700 text-white hover:bg-blue-600' 
              : 'bg-neutral-900 text-white hover:bg-neutral-700'
            }
          `}
          onClick={() => onSubscribe(plan)}
        >
          {t('cta_button')}
        </button>
      )}
      <hr className={`my-8 ${isPro ? 'border-zinc-700' : 'border-gray-300/50'}`} />
      <ul className="space-y-4 flex-grow">
        {t.raw('features').map((feature: string, index: number) => (
          <li key={index} className="flex items-center text-base font-medium font-['Inter']">
            <div 
              className={`
                w-6 h-6 mr-3 rounded-full flex items-center justify-center flex-shrink-0
                ${isPro ? 'bg-blue-700' : 'bg-neutral-900'}
              `}
            >
              <Icon icon="mdi:check" className="w-4 h-4 text-white" />
            </div>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};


const Pricing: FC = () => {
  const t = useTranslations('Pricing');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<null | 'basic' | 'pro' | 'enterprise'>(null);
  const [imgAttemptIndex, setImgAttemptIndex] = useState(0);
  const [showPostConfirm, setShowPostConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const openModalFor = (planKey: 'basic' | 'pro' | 'enterprise') => {
    setSelectedPlan(planKey);
    setImgAttemptIndex(0);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedPlan(null);
  };

  const subscriptionIdMap: Record<string, number> = {
    basic: 1,
    pro: 2,
    // enterprise is handled via contact link (no purchase id)
  };

  // Candidate filenames to try for each plan (in order)
  const candidateNamesFor = (planKey: string) => [
    `${planKey}.png`,
    `${planKey}.jpg`,
    `${planKey}.jpeg`,
    `${planKey}-qr.png`,
    `${planKey}-qr.jpg`,
    `${planKey}_qr.png`,
    `${planKey}qr.png`,
  ];

  return (
    <>
      {/* CẬP NHẬT: Xóa bỏ "bg-white" để làm trong suốt section này */}
      <section id="pricing" className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold font-['Unbounded'] text-neutral-900">{t('title')}</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg font-medium font-['Inter'] text-neutral-600">
              {t('subtitle')}
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
            <PricingCard plan="basic" onSubscribe={openModalFor} />
            <PricingCard plan="pro" onSubscribe={openModalFor} />
            <PricingCard plan="enterprise" onSubscribe={openModalFor} />
          </div>
        </div>
      </section>
      {/* Inline modal: only affects this file */}
      {modalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60" onClick={closeModal}>
          <div className="relative bg-neutral-900 text-white rounded-2xl w-full max-w-xl mx-4 md:mx-6 p-6 md:p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Close X */}
            <button onClick={closeModal} className="absolute top-4 right-4 text-neutral-300 hover:text-white text-2xl leading-none">×</button>

            {/* Header */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold">{t(`${selectedPlan}.name`)}</h3>
              <p className="text-sm text-neutral-400 mt-1">{t(`${selectedPlan}.price`)}</p>
            </div>

            {/* QR area */}
            <div className="flex items-center justify-center bg-neutral-800 rounded-lg p-6 mb-6">
              <div className="bg-white p-4 rounded-md">
                {imgAttemptIndex < candidateNamesFor(selectedPlan!).length ? (
                  <img
                    key={`${selectedPlan}-${imgAttemptIndex}`}
                    src={`/subscriptions/${candidateNamesFor(selectedPlan!)[imgAttemptIndex]}`}
                    alt={`QR ${selectedPlan}`}
                    className="w-48 h-48 object-contain"
                    onError={() => {
                      const candidates = candidateNamesFor(selectedPlan!);
                      if (imgAttemptIndex + 1 < candidates.length) {
                        setImgAttemptIndex((i) => i + 1);
                      } else {
                        setImgAttemptIndex((i) => i + 1);
                      }
                    }}
                  />
                ) : (
                  <div className="text-center text-sm text-neutral-400">Không tìm thấy mã QR. Vui lòng upload vào <code>/public/subscriptions</code></div>
                )}
              </div>
            </div>

            {/* Transfer content notice */}
            

            {/* Notice box */}
            <div className="bg-yellow-600/10 border border-yellow-500 text-yellow-200 rounded-md p-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">⚠️</div>
                <div className="text-sm leading-tight">Chúng tôi sẽ cập nhật đăng ký sau khi xác nhận thanh toán. Tối đa 24 giờ.</div>
              </div>
            </div>
            <div className="bg-blue-600/20 border-2 border-blue-500 text-white rounded-md p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-xl">📧</div>
                <div>
                  <div className="text-sm font-semibold mb-1">Chuyển khoản với nội dung là email đăng ký tài khoản của bạn</div>
                  <div className="text-base font-bold bg-blue-600 px-3 py-2 rounded inline-block">
                    {user?.email || 'your-email@example.com'}
                  </div>
                </div>
              </div>
            </div>

            {/* Title + subtitle */}
            {/* <div className="text-center mb-4">
              <div className="text-lg font-bold">Xác nhận thanh toán</div>
              <div className="text-sm text-neutral-400 mt-1">Vui lòng chuyển khoản theo thông tin bên dưới</div>
            </div> */}

            {/* Info rows */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-neutral-800 rounded-md p-3 text-sm">
                <div className="text-neutral-400 text-xs">Gói đăng ký:</div>
                <div className="mt-1 font-medium">{t(`${selectedPlan}.name`)}</div>
              </div>
              <div className="bg-neutral-800 rounded-md p-3 text-sm">
                <div className="text-neutral-400 text-xs">Giá:</div>
                <div className="mt-1 font-medium text-blue-400">{t(`${selectedPlan}.price`)}/{t(`${selectedPlan}.price_period`)}</div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button onClick={closeModal} className="flex-1 h-12 rounded-lg bg-neutral-800 text-neutral-200 border border-neutral-700 text-sm">Hủy</button>
              <button
                onClick={async () => {
                  if (!selectedPlan) return;

                  // Get logged-in user ID from token
                  const userId = authService.getUserId();
                  if (!userId) {
                    showToast('Vui lòng đăng nhập để xác nhận giao dịch.', 'warning');
                    return;
                  }

                  const subscriptionId = subscriptionIdMap[selectedPlan] ?? 0;
                  if (!subscriptionId) {
                    showToast('Gói đăng ký không hợp lệ.', 'error');
                    return;
                  }

                  try {
                    setIsSubmitting(true);
                    await orderService.createOrder({
                      userId,
                      items: [{ subscriptionId, quantity: 1 }]
                    });
                    showToast('Ghi nhận xác nhận — chúng tôi sẽ kiểm tra giao dịch.', 'success');
                    setShowPostConfirm(true);
                    setModalOpen(false);
                  } catch (err: any) {
                    console.error('Failed to post order confirmation', err);
                    showToast(err?.message || 'Không thể gửi xác nhận. Vui lòng thử lại.', 'error');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
                className="flex-1 h-12 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-60"
              >
                {isSubmitting ? 'Đang gửi...' : 'Tôi đã chuyển khoản'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-transfer confirmation dialog */}
      {showPostConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-6 bg-black/50" onClick={() => setShowPostConfirm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Thông báo</h3>
            </div>
            <div className="text-sm text-gray-700 mb-6 leading-relaxed">
              Chúng tôi sẽ kiểm tra giao dịch và nâng cấp tài khoản của bạn trong vòng 24h kể từ lúc nhận tiền thành công. Trường hợp sau 24h tài khoản của bạn vẫn chưa được nâng cấp, bạn ghi sai nội dung chuyển khoản hãy <a href="https://www.facebook.com/v2r.vn/" target="_blank" rel="noreferrer" className="text-blue-600 underline">liên hệ hỗ trợ</a>.
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowPostConfirm(false)} className="flex-1 h-10 rounded-lg bg-gray-200 text-sm">OK</button>
              <a href="https://www.facebook.com/v2r.vn/" target="_blank" rel="noreferrer" className="flex-1">
                <button className="w-full h-10 rounded-lg bg-blue-600 text-white text-sm">Hỗ trợ</button>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Pricing;
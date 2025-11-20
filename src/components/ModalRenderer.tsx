// ===== .\src/components/ModalRenderer.tsx =====
"use client"; // --- QUAN TRỌNG: Đánh dấu đây là Client Component ---

import { useUI } from '@/context/UIContext';
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
// import SubscriptionModal from '@/components/SubscriptionModal';

export default function ModalRenderer() {
  const { isLoginModalOpen, isRegisterModalOpen, isSubscriptionModalOpen, subscriptionPayload, closeAllModals } = useUI();

  return (
    <>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeAllModals} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeAllModals} />
      {/* <SubscriptionModal isOpen={isSubscriptionModalOpen} payload={subscriptionPayload} onClose={closeAllModals} /> */}
    </>
  );
}
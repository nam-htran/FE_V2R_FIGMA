// ===== .\src/components/ModalRenderer.tsx =====
"use client"; // --- QUAN TRỌNG: Đánh dấu đây là Client Component ---

import { useUI } from '@/context/UIContext';
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';

export default function ModalRenderer() {
  const { isLoginModalOpen, isRegisterModalOpen, closeAllModals } = useUI();

  return (
    <>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeAllModals} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeAllModals} />
    </>
  );
}
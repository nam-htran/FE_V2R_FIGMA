// ===== .\src\context\UIContext.tsx =====
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

// Định nghĩa các giá trị mà Context sẽ cung cấp
interface UIContextType {
  isLoginModalOpen: boolean;
  isRegisterModalOpen: boolean;
  openLoginModal: () => void;
  openRegisterModal: () => void;
  closeAllModals: () => void;
}

// Tạo Context
const UIContext = createContext<UIContextType | undefined>(undefined);

// Tạo Provider component
export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  const openLoginModal = () => {
    setRegisterModalOpen(false); // Đảm bảo modal kia đã đóng
    setLoginModalOpen(true);
  };

  const openRegisterModal = () => {
    setLoginModalOpen(false); // Đảm bảo modal kia đã đóng
    setRegisterModalOpen(true);
  };

  const closeAllModals = () => {
    setLoginModalOpen(false);
    setRegisterModalOpen(false);
  };

  return (
    <UIContext.Provider value={{ 
      isLoginModalOpen, 
      isRegisterModalOpen, 
      openLoginModal, 
      openRegisterModal, 
      closeAllModals 
    }}>
      {children}
    </UIContext.Provider>
  );
};

// Tạo một custom hook để dễ dàng sử dụng Context
export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
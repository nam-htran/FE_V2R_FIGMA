// ===== .\src\components\LandingPage.tsx =====
"use client";

import { useUI } from "@/context/UIContext";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ImageGallery from "@/components/ImageGallery";
import WorkflowCTA from "@/components/WorkflowCTA";
import Header from "@/components/Header";
import Pricing from "@/components/Pricing";
import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";

export default function LandingPage() {
  const { isLoginModalOpen, isRegisterModalOpen, closeAllModals } = useUI();

  return (
    <>
      {/* 
        Nội dung trang chủ được render trực tiếp, không cần div bọc nữa
      */}
      <Header />
      <Hero />
      <ImageGallery />
      <Pricing />
      <WorkflowCTA />
      <Footer />
      
      {/* 
        Các modal vẫn được render ở đây. Chúng sẽ tự xử lý hiệu ứng blur.
      */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeAllModals} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeAllModals} />
    </>
  );
}
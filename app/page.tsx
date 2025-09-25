import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import CommunityShowcase from "@/components/sections/CommunityShowcase";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    // --- ĐÃ SỬA: Bỏ min-w-[1440px] ---
    <div className="relative overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <Features />
        <CommunityShowcase />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
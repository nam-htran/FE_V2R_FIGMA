"use client";

import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ImageGallery from "@/components/ImageGallery";
import WorkflowCTA from "@/components/WorkflowCTA";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <ImageGallery />
      <WorkflowCTA />
      <Footer />
    </>
  );
}
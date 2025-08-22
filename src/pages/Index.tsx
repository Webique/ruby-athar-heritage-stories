import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import EmotionalSection from '@/components/EmotionalSection';
import GallerySection from '@/components/GallerySection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen pt-24 md:pt-28">
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <EmotionalSection />
      <GallerySection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;

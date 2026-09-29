'use client';

import React, { useState } from 'react';
import SmoothScroll from '@/components/SmoothScroll';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StatsImpact from '@/components/StatsImpact';
import Services from '@/components/Services';
import PriceCalculator from '@/components/PriceCalculator';
import WhyEcoDry from '@/components/WhyEcoDry';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import Faq from '@/components/Faq';
import CtaBanner from '@/components/CtaBanner';
import Footer from '@/components/Footer';
import PickupModal from '@/components/PickupModal';

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Organic Dry Cleaning');
  const [orderSummary, setOrderSummary] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);

  const handleOpenBooking = (serviceName?: string) => {
    if (serviceName) {
      setSelectedService(serviceName);
    }
    setIsBookingOpen(true);
  };

  const handleBookFromCalculator = (itemsSummary: string, total: number) => {
    setSelectedService('Instant Calculated Order');
    setOrderSummary(itemsSummary);
    setOrderTotal(total);
    setIsBookingOpen(true);
  };

  return (
    <SmoothScroll>
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top Header Bar from image */}
        <TopBar />

        {/* Main Navbar */}
        <Navbar onOpenBooking={() => handleOpenBooking()} />

        {/* Hero Section matching provided image */}
        <Hero onOpenBooking={() => handleOpenBooking()} />

        {/* Live Counters & Eco Stats */}
        <StatsImpact />

        {/* Services Showcase */}
        <Services onSelectService={(serviceTitle) => handleOpenBooking(serviceTitle)} />

        {/* Interactive Instant Price Estimator (Free pickup above ₹350) */}
        <PriceCalculator onBookWithItems={handleBookFromCalculator} />

        {/* Comparison: EcoDry vs Traditional Dry Cleaning */}
        <WhyEcoDry />

        {/* How It Works 5-Step Process */}
        <HowItWorks onOpenBooking={() => handleOpenBooking()} />

        {/* Verified Customer Testimonials */}
        <Testimonials />

        {/* FAQ Accordion */}
        <Faq />

        {/* VIP 20% Discount Offer Banner */}
        <CtaBanner onOpenBooking={() => handleOpenBooking()} />

        {/* Comprehensive Footer */}
        <Footer />

        {/* Interactive Doorstep Pickup Modal */}
        <PickupModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          initialService={selectedService}
          initialTotal={orderTotal}
          initialItems={orderSummary}
        />
      </main>
    </SmoothScroll>
  );
}

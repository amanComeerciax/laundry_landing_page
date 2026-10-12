'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SERVICES } from '@/data/laundryData';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Leaf, 
  Clock, 
  ChevronRight,
  Truck,
  Droplets
} from 'lucide-react';

export default function ServicesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Dry Cleaning', 'Wash & Iron', 'Specialty', 'Household'];

  const filteredServices = selectedCategory === 'All' 
    ? SERVICES 
    : SERVICES.filter(s => {
        const text = `${s.title} ${s.tagline} ${s.description}`.toLowerCase();
        if (selectedCategory === 'Dry Cleaning') return text.includes('dry cleaning') || text.includes('steam');
        if (selectedCategory === 'Wash & Iron') return text.includes('wash') || text.includes('iron');
        if (selectedCategory === 'Specialty') return text.includes('sneaker') || text.includes('shoe') || text.includes('bridal') || text.includes('designer');
        if (selectedCategory === 'Household') return text.includes('linen') || text.includes('curtains') || text.includes('home');
        return true;
      });

  const handleBookService = (serviceTitle: string) => {
    router.push(`/book?service=${encodeURIComponent(serviceTitle)}`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fbfe' }}>
      <TopBar />
      <Navbar onOpenBooking={() => router.push('/book')} />

      {/* Header Banner */}
      <section style={{
        backgroundColor: '#133857',
        color: '#ffffff',
        padding: '70px 0 60px 0',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'radial-gradient(circle at 85% 30%, rgba(56, 178, 73, 0.22) 0%, rgba(19, 56, 87, 0) 60%)'
      }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(56, 178, 73, 0.15)',
            color: '#68d391',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '16px',
            border: '1px solid rgba(56, 178, 73, 0.3)'
          }}>
            <Sparkles size={14} />
            <span>Master Garment Care</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 4.5vw, 52px)',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: '#ffffff',
            lineHeight: 1.15,
            marginBottom: '16px'
          }}>
            Our Professional Cleaning Services
          </h1>

          <p style={{
            fontSize: '17px',
            color: 'rgba(255, 255, 255, 0.85)',
            maxWidth: '650px',
            margin: '0 auto 32px auto',
            lineHeight: 1.6
          }}>
            Experience hospital-grade hygiene, non-toxic bio-enzymes, and bespoke fabric treatments. Free doorstep pickup and delivery across the city.
          </p>

          {/* Quick Filter Tabs */}
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '9999px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: selectedCategory === cat ? '#38b249' : 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ padding: '60px 0 90px 0', flex: 1 }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '28px'
          }}>
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="hover-card"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 30px rgba(19, 56, 87, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Image Banner */}
                <div style={{ position: 'relative', height: '200px', backgroundColor: '#e2e8f0' }}>
                  <img
                    src={service.image}
                    alt={service.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {(service.id === 'dry-cleaning' || service.id === 'wash-iron') && (
                    <span style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      backgroundColor: '#38b249',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      Popular Choice
                    </span>
                  )}
                  <span style={{
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                    backgroundColor: '#133857',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '6px 12px',
                    borderRadius: '10px'
                  }}>
                    {service.tagline}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#133857' }}>
                      {service.title}
                    </h3>
                  </div>

                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.55, marginBottom: '16px', flex: 1 }}>
                    {service.description}
                  </p>

                  {/* Highlights */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    {service.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                        <CheckCircle2 size={15} color="#38b249" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing & CTA */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    <div>
                      <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', fontWeight: 600 }}>Starting from</span>
                      <span style={{ fontSize: '20px', fontWeight: 800, color: '#38b249' }}>{service.startingPrice}</span>
                    </div>

                    <button
                      onClick={() => handleBookService(service.title)}
                      className="btn-primary"
                      style={{
                        padding: '10px 18px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>Book Pickup</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Value Props Bar */}
          <div style={{
            marginTop: '60px',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '36px',
            border: '1px solid #e2e8f0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            boxShadow: '0 8px 30px rgba(19, 56, 87, 0.03)'
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ebf8ee', color: '#38b249', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Leaf size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#133857', marginBottom: '4px' }}>100% Organic Solvent</h4>
                <p style={{ fontSize: '13px', color: '#64748b' }}>Zero toxic PERC, safe for babies, skin, and fine silk fabrics.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Truck size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#133857', marginBottom: '4px' }}>Free Doorstep Pickup</h4>
                <p style={{ fontSize: '13px', color: '#64748b' }}>Free pickup and delivery across the city on all orders above ₹350.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#133857', marginBottom: '4px' }}>Garment Care Guarantee</h4>
                <p style={{ fontSize: '13px', color: '#64748b' }}>RFID tag barcode tracking with zero misplaced items promise.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

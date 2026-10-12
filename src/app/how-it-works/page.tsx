'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HowItWorks from '@/components/HowItWorks';
import { Sparkles, ArrowRight, ShieldCheck, Clock, Truck } from 'lucide-react';

export default function HowItWorksPage() {
  const router = useRouter();

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
            <span>Effortless 5-Step Journey</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 4.5vw, 52px)',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: '#ffffff',
            lineHeight: 1.15,
            marginBottom: '16px'
          }}>
            How Glamour Dry Works
          </h1>

          <p style={{
            fontSize: '17px',
            color: 'rgba(255, 255, 255, 0.85)',
            maxWidth: '620px',
            margin: '0 auto 28px auto',
            lineHeight: 1.6
          }}>
            From effortless 30-second online booking to pristine doorstep delivery. Here is how we ensure seamless convenience and zero lost garments.
          </p>

          <button
            onClick={() => router.push('/book')}
            className="btn-primary"
            style={{
              padding: '14px 28px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>Book Your First Pickup</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Embedded Component */}
      <div style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <HowItWorks onOpenBooking={() => router.push('/book')} />
      </div>

      <Footer />
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Copy, Check, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface CtaBannerProps {
  onOpenBooking: () => void;
}

export default function CtaBanner({ onOpenBooking }: CtaBannerProps) {
  const [copied, setCopied] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  const promoCode = 'ECOFIRST20';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-card-content',
        { scale: 0.96, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: bannerRef.current,
            start: 'top 95%',
          },
        }
      );
    }, bannerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={bannerRef}
      style={{
        padding: '60px 0 90px 0',
        backgroundColor: '#ffffff',
        position: 'relative',
      }}
    >
      <div className="container">
        <div
          className="cta-card-content"
          style={{
            position: 'relative',
            borderRadius: '32px',
            overflow: 'hidden',
            backgroundColor: '#133857',
            color: '#ffffff',
            padding: '60px 48px',
            backgroundImage: 'radial-gradient(circle at 90% 20%, rgba(56, 178, 73, 0.25) 0%, rgba(19, 56, 87, 0) 60%), radial-gradient(circle at 10% 80%, rgba(2, 132, 199, 0.2) 0%, rgba(19, 56, 87, 0) 50%)',
            boxShadow: '0 20px 50px rgba(19, 56, 87, 0.2)',
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            alignItems: 'center',
            gap: '40px',
          }} className="cta-grid">
            {/* Left Content */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(56, 178, 73, 0.15)',
                color: '#68d391',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12.5px',
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: '20px',
                border: '1px solid rgba(56, 178, 73, 0.3)',
              }}>
                <Sparkles size={14} />
                <span>Special First-Order Welcome Gift</span>
              </div>

              <h2 style={{
                fontSize: 'clamp(32px, 3.5vw, 46px)',
                lineHeight: 1.15,
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '16px',
              }}>
                Get 20% OFF Your First Pickup
              </h2>

              <p style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.6,
                marginBottom: '28px',
                maxWidth: '520px',
              }}>
                Experience the luxury of crisp, chemical-free garments. Book online in 30 seconds and our captain will collect your clothes today!
              </p>

              {/* Guarantees */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#e2e8f0' }}>
                  <ShieldCheck size={16} color="#38b249" />
                  <span>100% Satisfaction Guarantee</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#e2e8f0' }}>
                  <Clock size={16} color="#38b249" />
                  <span>Free Pickup Above ₹350</span>
                </span>
              </div>
            </div>

            {/* Right: Coupon & Booking Trigger */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              padding: '32px',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase' }}>
                  Promo Coupon Code
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  marginTop: '8px',
                }}>
                  <span style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    color: '#133857',
                  }}>
                    {promoCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      backgroundColor: copied ? '#ebf8ee' : '#f1f5f9',
                      color: copied ? '#15803d' : '#133857',
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '6px 12px',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'Applied!' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>

              <button
                onClick={onOpenBooking}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: 800,
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(56, 178, 73, 0.45)',
                }}
              >
                <span>Book a Doorstep Pickup</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .cta-grid {
            grid-template-columns: 1fr !important;
          }
          .cta-card-content {
            padding: 36px 24px !important;
          }
        }
      `}</style>
    </section>
  );
}

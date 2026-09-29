'use client';

import React, { useEffect, useRef } from 'react';
import { COMPARISON_DATA } from '@/data/laundryData';
import { ShieldCheck, XCircle, CheckCircle2, Leaf, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WhyEcoDry() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.comparison-row',
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: '.comparison-table',
            start: 'top 95%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section"
      style={{ backgroundColor: '#ffffff', position: 'relative' }}
    >
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-tag">
            <Leaf size={14} />
            <span>The Green Cleaning Difference</span>
          </div>
          <h2 className="section-title">
            Why EcoDry Outperforms Traditional Cleaners
          </h2>
          <p className="section-description">
            Traditional dry cleaning uses Perchloroethylene (PERC)—a known toxin that damages clothes and the environment. Here is how we revolutionized fabric care.
          </p>
        </div>

        {/* Comparison Table Container */}
        <div className="comparison-table-wrapper">
        <div
          className="comparison-table"
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            boxShadow: '0 12px 36px rgba(19, 56, 87, 0.06)',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Table Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.6fr 1.6fr',
              padding: '20px 24px',
              backgroundColor: '#133857',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '15px',
              alignItems: 'center',
            }}
            className="comparison-header"
          >
            <div>Garment Care Factor</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#68d391' }}>
              <ShieldCheck size={18} />
              <span>EcoDry Organic Method</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
              <XCircle size={18} color="#f87171" />
              <span>Traditional Dry Cleaners</span>
            </div>
          </div>

          {/* Rows */}
          {COMPARISON_DATA.map((row, idx) => (
            <div
              key={idx}
              className="comparison-row"
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1.6fr 1.6fr',
                padding: '20px 24px',
                borderBottom: idx !== COMPARISON_DATA.length - 1 ? '1px solid #f1f5f9' : 'none',
                backgroundColor: row.highlight ? '#f8fdf9' : '#ffffff',
                alignItems: 'center',
                fontSize: '14px',
              }}
            >
              {/* Factor Title */}
              <div className="comparison-feature-title" style={{ fontWeight: 700, color: '#133857' }}>
                {row.feature}
              </div>

              {/* EcoDry Benefit */}
              <div className="comparison-ecodry" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#166534', fontWeight: 600 }}>
                <span style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}>
                  <CheckCircle2 size={13} />
                </span>
                <div>
                  <div className="mobile-only-label" style={{ display: 'none', fontSize: '11px', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.05em' }}>EcoDry Organic</div>
                  <span>{row.ecodry}</span>
                </div>
              </div>

              {/* Traditional Cleaners */}
              <div className="comparison-traditional" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#64748b' }}>
                <span style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}>
                  <XCircle size={13} />
                </span>
                <div>
                  <div className="mobile-only-label" style={{ display: 'none', fontSize: '11px', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.05em' }}>Traditional Cleaners</div>
                  <span>{row.traditional}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>

        {/* Feature Visual Trio */}
        <div style={{
          marginTop: '60px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
        }} className="feature-trio">
          <div className="glass-card" style={{ padding: '24px', borderRadius: '18px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#ebf8ee',
              color: '#38b249',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
            }}>
              <Leaf size={20} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#133857', marginBottom: '8px' }}>
              Organic Bio-Enzymes
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748b' }}>
              Custom European bio-formulations dissolve coffee, grease, and wine stains without weakening silk, wool, or cotton.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '24px', borderRadius: '18px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
            }}>
              <Sparkles size={20} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#133857', marginBottom: '8px' }}>
              Vacuum Table Steam Press
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748b' }}>
              Our high-suction vacuum press draws heat through garments instantly, fixing sharp creases without shiny thermal marks.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '24px', borderRadius: '18px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
            }}>
              <ShieldCheck size={20} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#133857', marginBottom: '8px' }}>
              Garment Barcode Guarantee
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748b' }}>
              Zero pin-holes and zero misplaced items. Every clothing piece is tracked via RFID cloud ledger from door to door.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .comparison-table-wrapper {
          width: 100%;
          /* Remove overflow-x to allow vertical stacking on mobile */
        }
        @media (max-width: 800px) {
          .comparison-header {
            display: none !important;
          }
          .comparison-row {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
            padding: 20px 16px !important;
          }
          .comparison-feature-title {
            font-size: 16px !important;
            width: 100%;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
            margin-bottom: -4px;
          }
          .comparison-ecodry, .comparison-traditional {
            width: 100% !important;
            padding: 12px !important;
            border-radius: 10px !important;
          }
          .comparison-ecodry {
            background-color: #f0fdf4 !important;
            border: 1px solid #bbf7d0 !important;
          }
          .comparison-traditional {
            background-color: #fef2f2 !important;
            border: 1px solid #fecaca !important;
          }
          .mobile-only-label {
            display: block !important;
          }
          .feature-trio {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

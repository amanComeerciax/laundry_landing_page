'use client';

import React, { useEffect, useRef } from 'react';
import { Droplet, Shirt, Shield, Star } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function StatsImpact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const num1Ref = useRef<HTMLSpanElement>(null);
  const num2Ref = useRef<HTMLSpanElement>(null);
  const num3Ref = useRef<HTMLSpanElement>(null);
  const num4Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Counter animation on scroll
      const countUp = (target: HTMLSpanElement | null, endVal: number, decimals: number = 0, suffix: string = '') => {
        if (!target) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: endVal,
          duration: 2.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: target,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            target.innerText = decimals > 0 ? obj.val.toFixed(decimals) + suffix : Math.floor(obj.val).toLocaleString() + suffix;
          },
        });
      };

      countUp(num1Ref.current, 4.8, 1, 'M+');
      countUp(num2Ref.current, 0, 0, '%');
      countUp(num3Ref.current, 120000, 0, '+');
      countUp(num4Ref.current, 4.9, 1, '★');

      gsap.fromTo(
        '.stat-card',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 95%',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        padding: '50px 0 80px 0',
        backgroundColor: '#ffffff',
        position: 'relative',
      }}
    >
      <div className="container">
        {/* Floating Stat Banner Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridAutoRows: '1fr',
          gap: '20px',
        }} className="stats-grid">
          {/* Stat 1 */}
          <div className="stat-card glass-card" style={{
            padding: '28px 20px',
            textAlign: 'center',
            borderRadius: '20px',
            background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
            border: '1px solid #dcfce7',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
            minHeight: '230px',
            boxSizing: 'border-box',
          }}>
            <div className="stat-icon" style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#ebf8ee',
              color: '#38b249',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              flexShrink: 0,
            }}>
              <Droplet size={22} />
            </div>
            <div className="stat-number" style={{
              fontSize: '36px',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: '#133857',
              lineHeight: 1,
              marginBottom: '6px',
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span ref={num1Ref}>4.8M+</span>
            </div>
            <p className="stat-title" style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#38b249',
              marginBottom: '4px',
              minHeight: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              lineHeight: 1.3,
            }}>
              Liters Water Saved
            </p>
            <p className="stat-desc" style={{
              fontSize: '12px',
              color: '#64748b',
              margin: 0,
              minHeight: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              lineHeight: 1.35,
            }}>
              Through closed-loop recycling
            </p>
          </div>

          {/* Stat 2 */}
          <div className="stat-card glass-card" style={{
            padding: '28px 20px',
            textAlign: 'center',
            borderRadius: '20px',
            background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)',
            border: '1px solid #e0f2fe',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
            minHeight: '230px',
            boxSizing: 'border-box',
          }}>
            <div className="stat-icon" style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              flexShrink: 0,
            }}>
              <Shield size={22} />
            </div>
            <div className="stat-number" style={{
              fontSize: '36px',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: '#133857',
              lineHeight: 1,
              marginBottom: '6px',
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span ref={num2Ref}>0%</span>
            </div>
            <p className="stat-title" style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#0284c7',
              marginBottom: '4px',
              minHeight: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              lineHeight: 1.3,
            }}>
              Toxic PERC Chemicals
            </p>
            <p className="stat-desc" style={{
              fontSize: '12px',
              color: '#64748b',
              margin: 0,
              minHeight: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              lineHeight: 1.35,
            }}>
              100% skin-safe & organic
            </p>
          </div>

          {/* Stat 3 */}
          <div className="stat-card glass-card" style={{
            padding: '28px 20px',
            textAlign: 'center',
            borderRadius: '20px',
            background: 'linear-gradient(180deg, #fefce8 0%, #ffffff 100%)',
            border: '1px solid #fef08a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
            minHeight: '230px',
            boxSizing: 'border-box',
          }}>
            <div className="stat-icon" style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              flexShrink: 0,
            }}>
              <Shirt size={22} />
            </div>
            <div className="stat-number" style={{
              fontSize: '36px',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: '#133857',
              lineHeight: 1,
              marginBottom: '6px',
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span ref={num3Ref}>120,000+</span>
            </div>
            <p className="stat-title" style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#d97706',
              marginBottom: '4px',
              minHeight: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              lineHeight: 1.3,
            }}>
              Garments Delivered
            </p>
            <p className="stat-desc" style={{
              fontSize: '12px',
              color: '#64748b',
              margin: 0,
              minHeight: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              lineHeight: 1.35,
            }}>
              With 99.8% on-time record
            </p>
          </div>

          {/* Stat 4 */}
          <div className="stat-card glass-card" style={{
            padding: '28px 20px',
            textAlign: 'center',
            borderRadius: '20px',
            background: 'linear-gradient(180deg, #faf5ff 0%, #ffffff 100%)',
            border: '1px solid #f3e8ff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
            minHeight: '230px',
            boxSizing: 'border-box',
          }}>
            <div className="stat-icon" style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#f3e8ff',
              color: '#9333ea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              flexShrink: 0,
            }}>
              <Star size={22} fill="#9333ea" />
            </div>
            <div className="stat-number" style={{
              fontSize: '36px',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: '#133857',
              lineHeight: 1,
              marginBottom: '6px',
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span ref={num4Ref}>4.9★</span>
            </div>
            <p className="stat-title" style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#9333ea',
              marginBottom: '4px',
              minHeight: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              lineHeight: 1.3,
            }}>
              Google Rating
            </p>
            <p className="stat-desc" style={{
              fontSize: '12px',
              color: '#64748b',
              margin: 0,
              minHeight: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              lineHeight: 1.35,
            }}>
              From 1,450+ happy families
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-auto-rows: 1fr !important;
            gap: 14px !important;
          }
          :global(.stat-card) {
            min-height: 200px !important;
            padding: 20px 14px !important;
          }
        }
        @media (max-width: 500px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-auto-rows: 1fr !important;
            gap: 10px !important;
          }
          :global(.stat-card) {
            padding: 18px 10px !important;
            border-radius: 18px !important;
            min-height: 195px !important;
            height: 100% !important;
          }
          :global(.stat-card .stat-icon) {
            width: 38px !important;
            height: 38px !important;
            margin-bottom: 8px !important;
          }
          :global(.stat-card .stat-number) {
            min-height: 32px !important;
            margin-bottom: 4px !important;
          }
          :global(.stat-card .stat-number span) {
            font-size: 24px !important;
          }
          :global(.stat-card .stat-title) {
            font-size: 13px !important;
            min-height: 34px !important;
            margin-bottom: 3px !important;
          }
          :global(.stat-card .stat-desc) {
            font-size: 11px !important;
            min-height: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}

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
          gap: '20px',
        }} className="stats-grid">
          {/* Stat 1 */}
          <div className="stat-card glass-card" style={{
            padding: '28px 24px',
            textAlign: 'center',
            borderRadius: '20px',
            background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
            border: '1px solid #dcfce7',
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#ebf8ee',
              color: '#38b249',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
            }}>
              <Droplet size={22} />
            </div>
            <div style={{
              fontSize: '36px',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: '#133857',
              lineHeight: 1,
              marginBottom: '8px',
            }}>
              <span ref={num1Ref}>4.8M+</span>
            </div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#38b249', marginBottom: '4px' }}>
              Liters Water Saved
            </p>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              Through closed-loop recycling
            </p>
          </div>

          {/* Stat 2 */}
          <div className="stat-card glass-card" style={{
            padding: '28px 24px',
            textAlign: 'center',
            borderRadius: '20px',
            background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)',
            border: '1px solid #e0f2fe',
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
            }}>
              <Shield size={22} />
            </div>
            <div style={{
              fontSize: '36px',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: '#133857',
              lineHeight: 1,
              marginBottom: '8px',
            }}>
              <span ref={num2Ref}>0%</span>
            </div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#0284c7', marginBottom: '4px' }}>
              Toxic PERC Chemicals
            </p>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              100% skin-safe & organic
            </p>
          </div>

          {/* Stat 3 */}
          <div className="stat-card glass-card" style={{
            padding: '28px 24px',
            textAlign: 'center',
            borderRadius: '20px',
            background: 'linear-gradient(180deg, #fefce8 0%, #ffffff 100%)',
            border: '1px solid #fef08a',
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#fef3c7',
              color: '#d97706',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
            }}>
              <Shirt size={22} />
            </div>
            <div style={{
              fontSize: '36px',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: '#133857',
              lineHeight: 1,
              marginBottom: '8px',
            }}>
              <span ref={num3Ref}>120,000+</span>
            </div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#d97706', marginBottom: '4px' }}>
              Garments Delivered
            </p>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              With 99.8% on-time record
            </p>
          </div>

          {/* Stat 4 */}
          <div className="stat-card glass-card" style={{
            padding: '28px 24px',
            textAlign: 'center',
            borderRadius: '20px',
            background: 'linear-gradient(180deg, #faf5ff 0%, #ffffff 100%)',
            border: '1px solid #f3e8ff',
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#f3e8ff',
              color: '#9333ea',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
            }}>
              <Star size={22} fill="#9333ea" />
            </div>
            <div style={{
              fontSize: '36px',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: '#133857',
              lineHeight: 1,
              marginBottom: '8px',
            }}>
              <span ref={num4Ref}>4.9★</span>
            </div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#9333ea', marginBottom: '4px' }}>
              Google Rating
            </p>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              From 1,450+ happy families
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 14px !important;
          }
        }
        @media (max-width: 500px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          :global(.stat-card) {
            padding: 16px 10px !important;
            border-radius: 16px !important;
          }
          :global(.stat-card .stat-icon) {
            width: 38px !important;
            height: 38px !important;
            margin-bottom: 10px !important;
          }
          :global(.stat-card span[ref]) {
            font-size: 26px !important;
          }
        }
      `}</style>
    </section>
  );
}

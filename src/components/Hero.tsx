'use client';

import React, { useEffect, useRef } from 'react';
import { Leaf, Truck, Award, ArrowRight } from 'lucide-react';
import gsap from 'gsap';

interface HeroProps {
  onOpenBooking: () => void;
}

export default function Hero({ onOpenBooking }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-anim-item',
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
        }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section id="home" ref={heroRef} className="hero-section">
        {/* ═══════════════════════════════════════════════════════════
            DESKTOP LAYOUT (> 820px)
            Uses wide composite image with left text overlay
            ═══════════════════════════════════════════════════════════ */}
        <div className="hero-desktop-wrapper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/mainhero.png"
            alt="Glamour Dry laundry hero banner"
            className="hero-bg-img"
          />

          <div className="hero-overlay">
            <div className="hero-inner">
              {/* Promo Badge */}
              {/* Headline */}
              <h1 className="hero-headline hero-anim-item">
                Clean More.<br />
                <span className="hero-headline-accent">Pay Less.</span>
              </h1>

              {/* Description */}
              <p className="hero-desc hero-anim-item">
                Experience professional garment care with eco-friendly cleaning,
                convenient doorstep pickup and reliable delivery for your everyday
                clothing and delicate fabrics.
              </p>

              {/* CTA Buttons */}
              <div className="hero-cta hero-anim-item">
                <button onClick={onOpenBooking} className="btn-primary hero-btn-primary">
                  <span>Book a Pickup</span>
                  <span className="hero-btn-arrow-bubble hero-btn-arrow-bubble--primary">
                    <ArrowRight size={13} strokeWidth={2.6} />
                  </span>
                </button>
                <a href="#services" className="btn-outline hero-btn-outline">
                  <span>Explore Services</span>
                  <span className="hero-btn-arrow-bubble hero-btn-arrow-bubble--outline">
                    <ArrowRight size={13} strokeWidth={2.6} />
                  </span>
                </a>
              </div>

              {/* Desktop Value Props Row */}
              <div className="hero-props hero-anim-item">
                <div className="hero-prop-item">
                  <Leaf size={22} strokeWidth={1.5} color="#4a7c82" />
                  <span className="hero-prop-label">Eco friendly</span>
                </div>
                <div className="hero-prop-divider" />
                <div className="hero-prop-item">
                  <Truck size={22} strokeWidth={1.5} color="#4a7c82" />
                  <span className="hero-prop-label">Doorstep Pickup</span>
                </div>
                <div className="hero-prop-divider" />
                <div className="hero-prop-item">
                  <Award size={22} strokeWidth={1.5} color="#4a7c82" />
                  <span className="hero-prop-label">Professional Care</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            MOBILE LAYOUT (<= 820px)
            New stacked layout:
            1. Badge (top center)
            2. Couple image (centered, full width)
            3. "Clean More. Pay Less." headline (centered)
            4. Two buttons (centered row)
            5. Wave
            6. Props card
            ═══════════════════════════════════════════════════════════ */}
        <div className="hero-mobile-wrapper">

          {/* ── 2. Couple Image (center) ─────────────── */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/lhero.png"
            alt="Glamour Dry couple with laundry"
            className="hero-mobile-couple-img hero-anim-item"
          />

          {/* ── 3. Headline + 4. Buttons (centered) ──── */}
          <div className="hero-mobile-text-block hero-anim-item">
            <h1 className="hero-mobile-headline">
              Clean More.<br />
              <span className="hero-headline-accent">Pay Less.</span>
            </h1>

            <div className="hero-mobile-cta">
              <button
                onClick={onOpenBooking}
                className="hero-mobile-btn hero-mobile-btn--primary"
              >
                <span>Book a Pickup</span>
                <span className="hero-btn-arrow-bubble hero-btn-arrow-bubble--primary">
                  <ArrowRight size={14} strokeWidth={2.8} />
                </span>
              </button>

              <a
                href="#services"
                className="hero-mobile-btn hero-mobile-btn--outline"
              >
                <span>Explore Services</span>
                <span className="hero-btn-arrow-bubble hero-btn-arrow-bubble--outline">
                  <ArrowRight size={14} strokeWidth={2.8} />
                </span>
              </a>
            </div>
          </div>


          <div className="hero-mobile-props-card hero-anim-item">
            <div className="hero-mobile-prop-item">
              <Leaf size={20} strokeWidth={1.5} color="#4a7c82" />
              <span className="hero-mobile-prop-label">Eco friendly</span>
            </div>
            
            <div className="hero-prop-divider" style={{ height: '24px' }} />

            <div className="hero-mobile-prop-item">
              <Truck size={20} strokeWidth={1.5} color="#4a7c82" />
              <span className="hero-mobile-prop-label">Doorstep Pickup</span>
            </div>

            <div className="hero-prop-divider" style={{ height: '24px' }} />

            <div className="hero-mobile-prop-item">
              <Award size={20} strokeWidth={1.5} color="#4a7c82" />
              <span className="hero-mobile-prop-label">Professional Care</span>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* ═══════════════════════════════════════════════════════════
           GLOBAL HERO SECTION STYLES
           ═══════════════════════════════════════════════════════════ */
        .hero-section {
          position: relative;
          width: 100%;
          background: #ffffff;
          overflow: hidden;
        }

        /* ─── Desktop Layout (> 820px) ────────────────────────────── */
        .hero-desktop-wrapper {
          display: block;
          position: relative;
          width: 100%;
          height: clamp(520px, calc(100vh - 90px), 880px);
          overflow: hidden;
          background: #c8e8f5;
        }

        .hero-bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          z-index: 10;
          padding-left: clamp(80px, 14vw, 240px);
          padding-top: clamp(40px, 8vh, 90px);
        }

        .hero-inner {
          width: 100%;
          max-width: clamp(340px, 44vw, 560px);
        }

        /* Promo Badge */
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 14px;
          border-radius: 9999px;
          background: rgba(235, 248, 238, 0.95);
          border: 1px solid rgba(56, 178, 73, 0.25);
          backdrop-filter: blur(4px);
          margin-bottom: clamp(12px, 1.6vw, 18px);
        }
        .hero-badge span {
          font-size: clamp(10.5px, 0.85vw, 12.5px);
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #2e963c;
          text-transform: uppercase;
        }

        /* Headline */
        .hero-headline {
          font-size: clamp(34px, 4.2vw, 62px);
          line-height: 1.08;
          font-weight: 800;
          color: #123854;
          letter-spacing: -0.03em;
          margin-bottom: clamp(12px, 1.4vw, 18px);
        }
        .hero-headline-accent {
          color: #38b249;
        }

        /* Description */
        .hero-desc {
          font-size: clamp(13px, 1.05vw, 16px);
          line-height: 1.65;
          color: #536e82;
          margin-bottom: clamp(20px, 2.2vw, 28px);
          max-width: 440px;
        }

        /* CTA Row */
        .hero-cta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: clamp(20px, 2.4vw, 32px);
        }

        .hero-btn-primary {
          font-size: clamp(13px, 0.95vw, 15px) !important;
          padding: clamp(10px, 0.95vw, 14px) clamp(22px, 2vw, 30px) !important;
          border-radius: 9999px !important;
          font-weight: 700 !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 10px !important;
          white-space: nowrap;
          background: #38b249 !important;
          color: #ffffff !important;
          box-shadow: 0 8px 24px rgba(56, 178, 73, 0.35) !important;
          transition: all 0.25s ease !important;
        }
        .hero-btn-primary:hover {
          background: #2e963c !important;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(56, 178, 73, 0.45) !important;
        }

        .hero-btn-outline {
          font-size: clamp(13px, 0.95vw, 15px);
          font-weight: 700;
          padding: clamp(9px, 0.9vw, 13px) clamp(20px, 1.8vw, 28px);
          border-radius: 9999px;
          border: 1.5px solid #123854;
          color: #123854;
          background: #ffffff;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.25s ease;
          white-space: nowrap;
        }
        .hero-btn-outline:hover {
          background: #f0f7fc;
          border-color: #38b249;
          color: #2e963c;
          transform: translateY(-2px);
        }

        /* Circular Arrow Bubble inside buttons */
        .hero-btn-arrow-bubble {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }
        .hero-btn-arrow-bubble--primary {
          background: #ffffff;
          color: #38b249;
        }
        .hero-btn-arrow-bubble--outline {
          background: #123854;
          color: #ffffff;
        }
        .hero-btn-primary:hover .hero-btn-arrow-bubble,
        .hero-btn-outline:hover .hero-btn-arrow-bubble,
        .hero-mobile-btn:hover .hero-btn-arrow-bubble {
          transform: translateX(2px);
        }

        /* Desktop Props Row */
        .hero-props {
          display: flex;
          align-items: center;
          gap: clamp(12px, 1.4vw, 20px);
          padding-top: clamp(12px, 1.2vw, 16px);
          flex-wrap: wrap;
        }
        .hero-prop-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hero-prop-label {
          font-size: clamp(12.5px, 1vw, 14.5px);
          font-weight: 500;
          color: #64748b;
          white-space: nowrap;
        }
        .hero-prop-divider {
          width: 1px;
          height: 18px;
          background: #e2e8f0;
          flex-shrink: 0;
        }

        /* ─── Mobile Layout (<= 820px) — STACKED VERTICAL ──────────── */
        .hero-mobile-wrapper {
          display: none;
          width: 100%;
          background: linear-gradient(160deg, #e8f5fb 0%, #f3fafe 45%, #ffffff 100%);
          position: relative;
          overflow: hidden;
        }

        /* Top area: badge centered */
        .hero-mobile-top {
          display: flex;
          justify-content: center;
          padding: 18px 16px 0 16px;
        }

        /* Mobile Badge */
        .hero-mobile-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #eaf7ec;
          border: 1px solid rgba(56, 178, 73, 0.28);
          padding: 6px 14px;
          border-radius: 9999px;
        }
        .hero-mobile-badge span {
          font-size: 9.5px;
          font-weight: 800;
          color: #2e963c;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }

        /* Couple image — centered, full width, no clipping */
        .hero-mobile-couple-img {
          display: block;
          width: 90%;
          max-width: 360px;
          height: auto;
          margin: 6px auto 0 auto;
          object-fit: contain;
        }

        /* Text block below image: headline + buttons, centered */
        .hero-mobile-text-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 10px 20px 20px 20px;
        }

        /* Mobile Headline */
        .hero-mobile-headline {
          font-size: clamp(30px, 8vw, 40px);
          line-height: 1.08;
          font-weight: 800;
          color: #123854;
          letter-spacing: -0.03em;
          margin-bottom: 18px;
        }

        /* Mobile CTA Buttons — row, centered */
        .hero-mobile-cta {
          display: flex;
          flex-direction: row;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          width: 100%;
        }

        .hero-mobile-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 22px;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 700;
          white-space: nowrap;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .hero-mobile-btn--primary {
          background: #38b249;
          color: #ffffff;
          border: none;
          box-shadow: 0 5px 18px rgba(56, 178, 73, 0.40);
        }
        .hero-mobile-btn--primary:hover {
          background: #2e963c;
          transform: translateY(-1px);
        }

        .hero-mobile-btn--outline {
          background: #ffffff;
          border: 1.5px solid #123854;
          color: #123854;
        }
        .hero-mobile-btn--outline:hover {
          background: #f0f7fc;
          border-color: #38b249;
          color: #2e963c;
        }

        /* Water Splash Wave — removed */

        /* Mobile Feature Card (3 Value Props) */
        .hero-mobile-props-card {
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 6px 24px rgba(19, 56, 87, 0.05);
          border: 1px solid rgba(226, 232, 240, 0.8);
          margin: 10px 16px 22px 16px;
          padding: 16px 12px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          position: relative;
          z-index: 10;
        }

        .hero-mobile-prop-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          text-align: left;
          gap: 6px;
        }

        .hero-mobile-prop-label {
          font-size: 11px;
          font-weight: 500;
          color: #64748b;
          line-height: 1.2;
          white-space: nowrap;
        }

        /* ─── Breakpoint Toggle ───────────────────────────────────── */
        @media (max-width: 820px) {
          .hero-desktop-wrapper {
            display: none !important;
          }
          .hero-mobile-wrapper {
            display: block !important;
          }
        }

        /* Small phones ≤ 420px */
        @media (max-width: 420px) {
          .hero-mobile-couple-img {
            width: 94%;
          }
          .hero-mobile-headline {
            font-size: 28px;
          }
          .hero-mobile-btn {
            font-size: 12.5px;
            padding: 10px 18px;
          }
          .hero-mobile-cta {
            gap: 10px;
          }
        }

        /* Very small ≤ 360px */
        @media (max-width: 360px) {
          .hero-mobile-headline {
            font-size: 26px;
          }
          .hero-mobile-btn {
            font-size: 12px;
            padding: 9px 16px;
          }
          .hero-mobile-prop-icon {
            width: 38px;
            height: 38px;
          }
          .hero-mobile-prop-label {
            font-size: 10.5px;
          }
        }
      `}</style>
    </>
  );
}

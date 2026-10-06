'use client';

import React, { useEffect, useRef } from 'react';
import { HOW_IT_WORKS_STEPS } from '@/data/laundryData';
import { CalendarClock, Truck, Droplets, CheckCircle2, PackageCheck, Sparkles, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HowItWorksProps {
  onOpenBooking: () => void;
}

export default function HowItWorks({ onOpenBooking }: HowItWorksProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'CalendarClock':
        return <CalendarClock size={24} />;
      case 'Truck':
        return <Truck size={24} />;
      case 'Droplets':
        return <Droplets size={24} />;
      case 'CheckCircle2':
        return <CheckCircle2 size={24} />;
      case 'PackageCheck':
      default:
        return <PackageCheck size={24} />;
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate steps cascading
      if (stepsRef.current) {
        gsap.fromTo(
          '.process-step-item',
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.7,
            ease: 'power2.out',
            clearProps: 'opacity,transform',
            scrollTrigger: {
              trigger: stepsRef.current,
              start: 'top 95%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Animate line fill
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { width: '0%' },
          {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: stepsRef.current,
              start: 'top 85%',
              end: 'bottom 80%',
              scrub: 0.6,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="section section-soft"
      style={{ position: 'relative' }}
    >
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={14} />
            <span>Effortless & Contactless</span>
          </div>
          <h2 className="section-title">
            How Glamour Dry Works
          </h2>
          <p className="section-description">
            From scheduled pickup to hanger-fresh doorstep delivery, experience a truly seamless 5-step garment care journey.
          </p>
        </div>

        {/* Steps Container */}
        <div style={{ position: 'relative', marginTop: '40px', marginBottom: '50px' }}>
          {/* Animated Connecting Line (Desktop) */}
          <div
            className="connecting-line-desktop"
            style={{
              position: 'absolute',
              top: '36px',
              left: '10%',
              right: '10%',
              height: '3px',
              backgroundColor: '#e2e8f0',
              zIndex: 1,
            }}
          >
            <div
              ref={lineRef}
              style={{
                height: '100%',
                backgroundColor: '#38b249',
                width: '0%',
              }}
            />
          </div>

          {/* Steps Grid */}
          <div
            ref={stepsRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '20px',
              position: 'relative',
              zIndex: 10,
            }}
            className="steps-grid"
          >
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <div
                key={idx}
                className="process-step-item"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                {/* Step Icon Badge */}
                <div
                  style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '3px solid #38b249',
                    boxShadow: '0 8px 24px rgba(56, 178, 73, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38b249',
                    marginBottom: '20px',
                    position: 'relative',
                    transition: 'transform 0.3s ease',
                  }}
                  className="step-icon-wrap"
                >
                  {getStepIcon(step.icon)}

                  {/* Step Number Tag */}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      right: '-4px',
                      backgroundColor: '#133857',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 800,
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #ffffff',
                    }}
                  >
                    {step.step}
                  </span>
                </div>

                {/* Badge */}
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#38b249',
                    backgroundColor: '#ebf8ee',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    marginBottom: '10px',
                  }}
                >
                  {step.badge}
                </span>

                {/* Title */}
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#133857',
                    marginBottom: '6px',
                  }}
                >
                  {step.title}
                </h3>

                {/* Subtitle */}
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#0284c7',
                    marginBottom: '10px',
                  }}
                >
                  {step.subtitle}
                </p>


              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
        }}>
          <button
            onClick={onOpenBooking}
            className="btn-primary"
            style={{
              padding: '14px 34px',
              fontSize: '15px',
              fontWeight: 700,
            }}
          >
            <span>Schedule Doorstep Pickup Now</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 992px) {
          .connecting-line-desktop {
            display: none !important;
          }
          .steps-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 550px) {
          .steps-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

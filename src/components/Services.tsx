'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { SERVICES, ServiceCategory } from '@/data/laundryData';
import { Sparkles, Shirt, Flame, Footprints, Crown, Layers, Check, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServicesProps {
  onSelectService: (serviceTitle: string) => void;
}

export default function Services({ onSelectService }: ServicesProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles size={20} />;
      case 'Shirt':
        return <Shirt size={20} />;
      case 'Flame':
        return <Flame size={20} />;
      case 'Footprints':
        return <Footprints size={20} />;
      case 'Crown':
        return <Crown size={20} />;
      case 'Layers':
      default:
        return <Layers size={20} />;
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        gsap.fromTo(
          '.service-card',
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power2.out',
            clearProps: 'opacity,transform',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="section section-soft"
      style={{ position: 'relative' }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={14} />
            <span>Eco-Friendly Fabric Care</span>
          </div>
          <h2 className="section-title">
            Exceptional Garment Services
          </h2>
          <p className="section-description">
            Tailored cleaning treatments engineered to protect delicate fibers, eliminate stubborn stains, and restore that crisp &quot;first-day&quot; fresh look.
          </p>
        </div>

        {/* Services Grid */}
        <div ref={cardsRef} className="grid-3">
          {SERVICES.map((service: ServiceCategory) => (
            <div
              key={service.id}
              className="service-card glass-card"
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Card Image Banner */}
              <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  style={{
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease',
                  }}
                  className="service-img"
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(19, 56, 87, 0.1) 0%, rgba(19, 56, 87, 0.6) 100%)',
                }} />

                {/* Tagline Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '14px',
                  left: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#133857',
                }}>
                  {service.tagline}
                </div>

                {/* Starting Price Pill */}
                <div style={{
                  position: 'absolute',
                  top: '14px',
                  right: '16px',
                  backgroundColor: '#38b249',
                  color: '#ffffff',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(56, 178, 73, 0.4)',
                }}>
                  From {service.startingPrice}
                </div>
              </div>

              {/* Card Content */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#ebf8ee',
                    color: '#38b249',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {getIcon(service.icon)}
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#133857' }}>
                    {service.title}
                  </h3>
                </div>

                <p style={{ fontSize: '14px', color: '#536e82', lineHeight: 1.6, marginBottom: '20px' }}>
                  {service.description}
                </p>

                {/* Features List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  {service.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                      <span style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#ebf8ee',
                        color: '#38b249',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Check size={11} strokeWidth={3} />
                      </span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Book Action */}
                <button
                  onClick={() => onSelectService(service.title)}
                  style={{
                    marginTop: 'auto',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: '#f0f7fc',
                    color: '#133857',
                    fontWeight: 700,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.25s ease',
                    border: '1px solid #cbd5e1',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#38b249';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.borderColor = '#38b249';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f7fc';
                    e.currentTarget.style.color = '#133857';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                >
                  <span>Book {service.title.split(' ')[0]}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

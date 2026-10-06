'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SERVICES, ServiceCategory } from '@/data/laundryData';
import { Sparkles, Shirt, Flame, Footprints, Crown, Layers, Check, ArrowRight, X } from 'lucide-react';
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
  const [selectedDetails, setSelectedDetails] = useState<ServiceCategory | null>(null);

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
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', width: '100%' }}>
                  <button
                    onClick={() => setSelectedDetails(service)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      backgroundColor: 'transparent',
                      color: '#536e82',
                      fontWeight: 700,
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #cbd5e1',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                      e.currentTarget.style.color = '#133857';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#536e82';
                    }}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onSelectService(service.title)}
                    style={{
                      flex: 1,
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
                      border: '1px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#38b249';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0f7fc';
                      e.currentTarget.style.color = '#133857';
                    }}
                  >
                    <span>Book Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Details Modal */}
      {selectedDetails && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedDetails(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(4px)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
                zIndex: 10,
              }}
            >
              <X size={18} />
            </button>

            {/* Modal Image */}
            <div style={{ position: 'relative', width: '100%', height: '220px' }}>
              <Image
                src={selectedDetails.image}
                alt={selectedDetails.title}
                fill
                style={{ objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(19,56,87,0.8) 100%)' }} />
              <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px' }}>
                <div style={{ display: 'inline-flex', padding: '4px 10px', backgroundColor: '#38b249', color: '#fff', borderRadius: '8px', fontSize: '11px', fontWeight: 800, marginBottom: '8px' }}>
                  FROM {selectedDetails.startingPrice}
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>{selectedDetails.title}</h2>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: '15px', color: '#536e82', lineHeight: 1.6, marginBottom: '24px' }}>
                {selectedDetails.description}
              </p>

              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#133857', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Included Features
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {selectedDetails.features.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#334155' }}>
                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#ebf8ee', color: '#38b249', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={14} strokeWidth={3} />
                    </span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  onSelectService(selectedDetails.title);
                  setSelectedDetails(null);
                }}
                className="btn-primary"
                style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 20px rgba(56, 178, 73, 0.3)' }}
              >
                Book Now <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

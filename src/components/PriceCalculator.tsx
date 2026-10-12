'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Calculator, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  RotateCcw,
  Shirt,
  Flame,
  Crown
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface CalculatorService {
  id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  popular?: boolean;
  icon?: string;
}

const DEFAULT_SERVICES: CalculatorService[] = [
  {
    id: '6abcb302f2a3b59e1245707b',
    title: 'Premium Dry Cleaning',
    category: 'Dry Cleaning',
    price: 300,
    description: 'Gentle organic hydrocarbon cleaning for suits, sarees, lehengas & delicate designer wear.',
    popular: true,
    icon: 'Sparkles',
  },
  {
    id: '6abcb335f2a3b59e1245707c',
    title: 'Wash & Fold',
    category: 'Wash & Fold',
    price: 500,
    description: 'Everyday laundry washed with bio-safe enzymes, hygienically dried, and neatly folded.',
    popular: false,
    icon: 'Shirt',
  },
  {
    id: '6abcb34ef2a3b59e1245707d',
    title: 'Iron Your Cloths',
    category: 'Ironing',
    price: 100,
    description: 'High-temperature vacuum table industrial steam pressing for crisp, zero-shine creases.',
    popular: false,
    icon: 'Flame',
  },
  {
    id: '6abcb378f2a3b59e1245707e',
    title: 'Special Combo',
    category: 'Special Care',
    price: 1000,
    description: 'Complete all-in-one wardrobe care: Wash, Steam Iron & Dry Clean all included in one package.',
    popular: true,
    icon: 'Crown',
  },
];

interface PriceCalculatorProps {
  onBookWithItems: (itemsSummary: string, total: number) => void;
}

export default function PriceCalculator({ onBookWithItems }: PriceCalculatorProps) {
  const [services, setServices] = useState<CalculatorService[]>(DEFAULT_SERVICES);
  const [quantities, setQuantities] = useState<Record<string, number>>({
    '6abcb302f2a3b59e1245707b': 1,
  });

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch live services from database to stay in sync with admin panel
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.services) && data.services.length > 0) {
          setServices(
            data.services.map((s: any) => ({
              id: s._id || s.id,
              title: s.title,
              category: s.category || 'General Care',
              price: Number(s.price) || 0,
              description: s.description || '',
              popular: Boolean(s.popular),
              icon: s.category === 'Dry Cleaning' 
                ? 'Sparkles' 
                : s.category === 'Ironing' 
                ? 'Flame' 
                : s.category === 'Special Care' 
                ? 'Crown' 
                : 'Shirt',
            }))
          );
        }
      })
      .catch((err) => {
        console.error('Error loading services for calculator:', err);
      });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.calc-container',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 95%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleIncrement = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDecrement = (id: string) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return {
        ...prev,
        [id]: current - 1,
      };
    });
  };

  const handleReset = () => {
    setQuantities({});
  };

  const getServiceIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles size={20} color="#38b249" />;
      case 'Flame':
        return <Flame size={20} color="#d97706" />;
      case 'Crown':
        return <Crown size={20} color="#9333ea" />;
      case 'Shirt':
      default:
        return <Shirt size={20} color="#0284c7" />;
    }
  };

  const getIconBackground = (iconName?: string) => {
    switch (iconName) {
      case 'Sparkles':
        return '#ebf8ee';
      case 'Flame':
        return '#fef3c7';
      case 'Crown':
        return '#f3e8ff';
      case 'Shirt':
      default:
        return '#e0f2fe';
    }
  };

  // Compute total items and price
  const totalItems = Object.values(quantities).reduce((acc, qty) => acc + qty, 0);
  const totalPrice = Object.entries(quantities).reduce((acc, [id, qty]) => {
    const s = services.find((item) => item.id === id);
    return acc + (s ? s.price * qty : 0);
  }, 0);

  const freeDeliveryThreshold = 350;
  const isFreeDelivery = totalPrice >= freeDeliveryThreshold;
  const amountRemaining = Math.max(0, freeDeliveryThreshold - totalPrice);
  const progressPercent = Math.min(100, Math.round((totalPrice / freeDeliveryThreshold) * 100));

  const handleBook = () => {
    const selectedList = Object.entries(quantities)
      .map(([id, qty]) => {
        const s = services.find((item) => item.id === id);
        return `${s?.title} (${qty}x)`;
      })
      .join(', ');

    onBookWithItems(selectedList || 'Custom Laundry Booking', totalPrice);
  };

  return (
    <section
      id="calculator"
      ref={sectionRef}
      className="section"
      style={{
        backgroundColor: '#ffffff',
        position: 'relative',
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-tag">
            <Calculator size={14} />
            <span>Instant Price Estimator</span>
          </div>
          <h2 className="section-title">
            Calculate Your Laundry Cost
          </h2>
          <p className="section-description">
            Transparent, zero-hidden-fee pricing for our 4 core services. Select your services below to calculate real-time rates and unlock 100% free doorstep pickup!
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="calc-container" style={{
          display: 'grid',
          gridTemplateColumns: '1.35fr 0.85fr',
          gap: '32px',
          backgroundColor: '#f8fbfe',
          borderRadius: '28px',
          border: '1px solid #e2e8f0',
          padding: '36px',
          boxShadow: '0 12px 36px rgba(19, 56, 87, 0.05)',
        }}>
          {/* Left: 4 Services Selection */}
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#133857', marginBottom: '4px' }}>
                  Choose Services &amp; Quantity
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  Tap <span style={{ color: '#38b249', fontWeight: 700 }}>+</span> to add garments or packages to your cart
                </p>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#38b249', backgroundColor: '#ebf8ee', padding: '4px 10px', borderRadius: '8px' }}>
                {services.length} Services Available
              </span>
            </div>

            {/* 4 Services Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
            }} className="calc-services-grid">
              {services.map((service) => {
                const qty = quantities[service.id] || 0;
                return (
                  <div
                    key={service.id}
                    className="calc-service-card"
                    style={{
                      padding: '20px',
                      borderRadius: '20px',
                      backgroundColor: qty > 0 ? '#f0fdf4' : '#ffffff',
                      border: qty > 0 ? '2px solid #38b249' : '1.5px solid #e2e8f0',
                      boxShadow: qty > 0 ? '0 10px 24px rgba(56, 178, 73, 0.12)' : '0 4px 16px rgba(19, 56, 87, 0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.25s ease',
                      position: 'relative',
                    }}
                  >
                    <div>
                      {/* Top Header inside Card */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          backgroundColor: getIconBackground(service.icon),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {getServiceIcon(service.icon)}
                        </div>

                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          {service.popular && (
                            <span style={{
                              backgroundColor: '#fef3c7',
                              color: '#b45309',
                              fontSize: '10.5px',
                              fontWeight: 800,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                            }}>
                              Popular
                            </span>
                          )}
                          <span style={{
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            textTransform: 'uppercase',
                          }}>
                            {service.category}
                          </span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h4 style={{
                        fontSize: '16.5px',
                        fontWeight: 800,
                        color: '#133857',
                        marginBottom: '6px',
                        lineHeight: 1.25,
                      }}>
                        {service.title}
                      </h4>
                      <p style={{
                        fontSize: '13px',
                        color: '#64748b',
                        lineHeight: 1.45,
                        marginBottom: '16px',
                        minHeight: '38px',
                      }}>
                        {service.description}
                      </p>
                    </div>

                    {/* Bottom Pricing & Controls */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '12px',
                      borderTop: qty > 0 ? '1px solid #bbf7d0' : '1px solid #f1f5f9',
                    }}>
                      <div>
                        <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', fontWeight: 600 }}>Rate</span>
                        <span style={{ fontSize: '19px', fontWeight: 800, color: '#38b249' }}>
                          ₹{service.price}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {qty === 0 ? (
                          <button
                            type="button"
                            onClick={() => handleIncrement(service.id)}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '10px',
                              backgroundColor: '#133857',
                              color: '#ffffff',
                              fontSize: '13px',
                              fontWeight: 700,
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <Plus size={14} />
                            <span>Add</span>
                          </button>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleDecrement(service.id)}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '10px',
                                backgroundColor: '#ffffff',
                                border: '1.5px solid #cbd5e1',
                                color: '#133857',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <Minus size={15} />
                            </button>
                            <span style={{ fontSize: '15px', fontWeight: 800, color: '#133857', minWidth: '20px', textAlign: 'center' }}>
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleIncrement(service.id)}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '10px',
                                backgroundColor: '#38b249',
                                border: 'none',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <Plus size={15} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Real-time Order Summary Card */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 8px 24px rgba(19, 56, 87, 0.04)',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#133857', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingBag size={18} color="#38b249" />
                  <span>Order Summary</span>
                </h3>
                {totalItems > 0 && (
                  <button
                    onClick={handleReset}
                    style={{
                      fontSize: '12px',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    <RotateCcw size={12} />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {/* Free Delivery Tracker Meter */}
              <div style={{
                padding: '16px',
                borderRadius: '14px',
                backgroundColor: isFreeDelivery ? '#f0fdf4' : '#f0f7fc',
                border: isFreeDelivery ? '1px solid #86efac' : '1px solid #bae6fd',
                marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: isFreeDelivery ? '#15803d' : '#0369a1' }}>
                    {isFreeDelivery ? '🎉 Free Doorstep Pickup Unlocked!' : `Add ₹${amountRemaining} more for FREE Pickup!`}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: isFreeDelivery ? '#15803d' : '#0369a1' }}>
                    {progressPercent}%
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    backgroundColor: isFreeDelivery ? '#38b249' : '#0284c7',
                    borderRadius: '9999px',
                    transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>

              {/* Selected Services Itemized List */}
              {totalItems > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', marginBottom: '18px' }}>
                  {services.filter(s => (quantities[s.id] || 0) > 0).map(s => {
                    const count = quantities[s.id] || 0;
                    return (
                      <div
                        key={s.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '13px',
                          padding: '8px 12px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '10px',
                          border: '1px solid #f1f5f9',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={14} color="#38b249" />
                          <span style={{ fontWeight: 700, color: '#133857' }}>{s.title}</span>
                          <span style={{ color: '#64748b', fontSize: '12px' }}>×{count}</span>
                        </div>
                        <span style={{ fontWeight: 800, color: '#38b249' }}>₹{s.price * count}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{
                  padding: '16px',
                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: '13px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  marginBottom: '18px',
                  border: '1px dashed #cbd5e1',
                }}>
                  No service added yet. Click <strong>+ Add</strong> on any service to estimate cost.
                </div>
              )}

              {/* Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#536e82' }}>
                  <span>Total Selected</span>
                  <span style={{ fontWeight: 700, color: '#133857' }}>{totalItems} services</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#536e82' }}>
                  <span>Doorstep Pickup</span>
                  <span style={{ fontWeight: 700, color: isFreeDelivery ? '#38b249' : '#133857' }}>
                    {isFreeDelivery ? 'FREE' : '₹49 (Free above ₹350)'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#536e82' }}>
                  <span>Eco Packaging &amp; Tags</span>
                  <span style={{ fontWeight: 700, color: '#38b249' }}>Included</span>
                </div>
              </div>

              <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#133857' }}>Estimated Total:</span>
                  <span style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#133857' }}>
                    ₹{totalPrice + (isFreeDelivery || totalPrice === 0 ? 0 : 49)}
                  </span>
                </div>
              </div>
            </div>

            {/* Book Now Button */}
            <button
              onClick={handleBook}
              disabled={totalItems === 0}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '15px',
                fontWeight: 700,
                borderRadius: '12px',
                opacity: totalItems === 0 ? 0.6 : 1,
                cursor: totalItems === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              <Sparkles size={16} />
              <span>Book Pickup With These Services</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          .calc-container {
            grid-template-columns: 1fr !important;
            padding: 24px !important;
          }
          .calc-services-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .calc-container {
            padding: 18px 14px !important;
            border-radius: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}

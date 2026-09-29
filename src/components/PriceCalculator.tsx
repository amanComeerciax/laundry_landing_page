'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CALCULATOR_ITEMS, ServiceItem } from '@/data/laundryData';
import { Calculator, Plus, Minus, ShoppingBag, CheckCircle2, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface PriceCalculatorProps {
  onBookWithItems: (itemsSummary: string, total: number) => void;
}

export default function PriceCalculator({ onBookWithItems }: PriceCalculatorProps) {
  const [selectedCategory, setSelectedCategory] = useState<'men' | 'women' | 'household' | 'specialty'>('men');
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'm-shirt': 2,
    'm-trouser': 2,
    'w-saree': 1,
  });

  const sectionRef = useRef<HTMLDivElement>(null);

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

  const filteredItems = CALCULATOR_ITEMS.filter((item) => item.category === selectedCategory);

  // Compute total items and price
  const totalItems = Object.values(quantities).reduce((acc, qty) => acc + qty, 0);
  const totalPrice = Object.entries(quantities).reduce((acc, [id, qty]) => {
    const item = CALCULATOR_ITEMS.find((it) => it.id === id);
    return acc + (item ? item.price * qty : 0);
  }, 0);

  const freeDeliveryThreshold = 350;
  const isFreeDelivery = totalPrice >= freeDeliveryThreshold;
  const amountRemaining = Math.max(0, freeDeliveryThreshold - totalPrice);
  const progressPercent = Math.min(100, Math.round((totalPrice / freeDeliveryThreshold) * 100));

  const handleBook = () => {
    const selectedList = Object.entries(quantities)
      .map(([id, qty]) => {
        const item = CALCULATOR_ITEMS.find((it) => it.id === id);
        return `${item?.name} (${qty} ${item?.unit})`;
      })
      .join(', ');

    onBookWithItems(selectedList || 'Custom Wash & Dry Clean', totalPrice);
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
            Transparent, zero-hidden-fee pricing. Add your garments below to calculate real-time rates and unlock 100% free doorstep pickup!
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="calc-container" style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 0.8fr',
          gap: '32px',
          backgroundColor: '#f8fbfe',
          borderRadius: '28px',
          border: '1px solid #e2e8f0',
          padding: '36px',
          boxShadow: '0 12px 36px rgba(19, 56, 87, 0.05)',
        }}>
          {/* Left: Items Selection */}
          <div style={{ minWidth: 0 }}>
            {/* Category Filter Tabs */}
            <div className="category-tabs-container" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '24px',
            }}>
              {[
                { id: 'men', label: "Men's Wear" },
                { id: 'women', label: "Women's Wear" },
                { id: 'household', label: 'Home Linen' },
                { id: 'specialty', label: 'Shoes & Leather' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    backgroundColor: selectedCategory === cat.id ? '#133857' : '#ffffff',
                    color: selectedCategory === cat.id ? '#ffffff' : '#536e82',
                    border: selectedCategory === cat.id ? '1px solid #133857' : '1px solid #cbd5e1',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Items List */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '14px',
              maxHeight: '440px',
              overflowY: 'auto',
              padding: '4px 4px 24px 4px',
              margin: '-4px -4px -24px -4px', /* Counteract padding to keep alignment while allowing shadow to show */
            }} className="calc-items-grid">
              {filteredItems.map((item) => {
                const qty = quantities[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '16px',
                      backgroundColor: qty > 0 ? '#f0fdf4' : '#ffffff',
                      border: qty > 0 ? '1.5px solid #38b249' : '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                      <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#133857', marginBottom: '2px', wordBreak: 'break-word', lineHeight: 1.2 }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '13px', color: '#38b249', fontWeight: 700, marginTop: '4px' }}>
                        ₹{item.price} <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>/{item.unit}</span>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      {qty > 0 && (
                        <>
                          <button
                            onClick={() => handleDecrement(item.id)}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '8px',
                              backgroundColor: '#ffffff',
                              border: '1px solid #cbd5e1',
                              color: '#133857',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontSize: '14px', fontWeight: 800, color: '#133857', minWidth: '18px', textAlign: 'center' }}>
                            {qty}
                          </span>
                        </>
                      )}

                      <button
                        onClick={() => handleIncrement(item.id)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          backgroundColor: qty > 0 ? '#38b249' : '#133857',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Real-time Order Summary Card */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
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

              {/* Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#536e82' }}>
                  <span>Total Items</span>
                  <span style={{ fontWeight: 700, color: '#133857' }}>{totalItems} garments</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#536e82' }}>
                  <span>Doorstep Pickup</span>
                  <span style={{ fontWeight: 700, color: isFreeDelivery ? '#38b249' : '#133857' }}>
                    {isFreeDelivery ? 'FREE' : '₹49 (Free above ₹350)'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#536e82' }}>
                  <span>Eco Packaging & Hangers</span>
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
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '15px',
                fontWeight: 700,
                borderRadius: '12px',
              }}
            >
              <Sparkles size={16} />
              <span>Book Pickup With These Items</span>
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
          .calc-items-grid {
            display: flex !important;
            flex-direction: column !important;
            max-height: none !important;
            overflow-y: visible !important;
          }
        }
        @media (max-width: 600px) {
          .calc-container {
            padding: 18px 14px !important;
            border-radius: 20px !important;
          }
        }
        
        /* Hide scrollbar for category tabs */
        .category-tabs-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

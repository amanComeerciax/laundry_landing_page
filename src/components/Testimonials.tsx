'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { TESTIMONIALS } from '@/data/laundryData';
import { Star, Quote, CheckCircle, HeartHandshake } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        gsap.fromTo(
          '.testimonial-card',
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power2.out',
            clearProps: 'opacity,transform',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 95%',
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
      ref={sectionRef}
      className="section section-soft"
      style={{ position: 'relative' }}
    >
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-tag">
            <HeartHandshake size={14} />
            <span>Real Customer Experiences</span>
          </div>
          <h2 className="section-title">
            Loved By 12,000+ Smart Households
          </h2>
          <p className="section-description">
            Discover why residents, fashion designers, and working professionals trust Glamour Dry for their everyday and heirloom clothing care.
          </p>
        </div>

        {/* Review Cards Grid */}
        <div ref={cardsRef} className="grid-2" style={{ gap: '24px' }}>
          {TESTIMONIALS.map((review) => (
            <div
              key={review.id}
              className="testimonial-card glass-card"
              style={{
                padding: '32px',
                borderRadius: '24px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              {/* Top Quote Icon */}
              <div style={{
                color: '#cbd5e1',
                marginBottom: '16px',
              }}>
                <Quote size={28} fill="#cbd5e1" />
              </div>

              <div>
                {/* Rating Stars & Service Tag */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={17} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>

                  <span style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: '#0284c7',
                    backgroundColor: '#e0f2fe',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                  }}>
                    {review.service}
                  </span>
                </div>

                {/* Review Text */}
                <p style={{
                  fontSize: '15px',
                  lineHeight: 1.7,
                  color: '#334155',
                  marginBottom: '24px',
                  fontStyle: 'normal',
                }}>
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ position: 'relative', width: '46px', height: '46px', borderRadius: '50%', overflow: 'hidden' }}>
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    sizes="46px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#133857' }}>
                      {review.name}
                    </h4>
                    {review.verified && (
                      <CheckCircle size={14} color="#38b249" />
                    )}
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#64748b' }}>
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

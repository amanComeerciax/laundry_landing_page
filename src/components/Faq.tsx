'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FAQS } from '@/data/laundryData';
import { HelpCircle, ChevronDown, MessageSquare } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faq-item',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: '.faq-list',
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleAccordion = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="section"
      style={{ backgroundColor: '#ffffff', position: 'relative' }}
    >
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-tag">
            <HelpCircle size={14} />
            <span>Got Questions?</span>
          </div>
          <h2 className="section-title">
            Frequently Asked Questions
          </h2>
          <p className="section-description">
            Everything you need to know about our organic eco-cleaning process, pricing, doorstep pickup, and care guarantees.
          </p>
        </div>

        {/* FAQ List */}
        <div
          className="faq-list"
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="faq-item"
                style={{
                  borderRadius: '16px',
                  border: isOpen ? '1.5px solid #38b249' : '1px solid #e2e8f0',
                  backgroundColor: isOpen ? '#fcfdfd' : '#ffffff',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  boxShadow: isOpen ? '0 8px 24px rgba(56, 178, 73, 0.08)' : '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    textAlign: 'left',
                    color: '#133857',
                    fontWeight: 700,
                    fontSize: '16px',
                  }}
                >
                  <span>{faq.question}</span>
                  <span
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      color: isOpen ? '#38b249' : '#64748b',
                      flexShrink: 0,
                    }}
                  >
                    <ChevronDown size={20} />
                  </span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 24px 22px 24px',
                      color: '#536e82',
                      fontSize: '14.5px',
                      lineHeight: 1.7,
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '16px',
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

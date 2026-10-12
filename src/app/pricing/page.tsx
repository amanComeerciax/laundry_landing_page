'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PriceCalculator from '@/components/PriceCalculator';
import { 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Truck, 
  CheckCircle2, 
  Tag, 
  ArrowRight
} from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();

  const handleBookFromCalculator = (itemsSummary: string, total: number) => {
    router.push(`/book?summary=${encodeURIComponent(itemsSummary)}&total=${total}`);
  };

  const pricingTiers = [
    {
      category: 'Men\'s Wear',
      items: [
        { name: 'Shirt / T-Shirt (Steam Press)', price: '₹40' },
        { name: 'Shirt / T-Shirt (Organic Wash & Steam)', price: '₹70' },
        { name: 'Formal Trouser / Jeans', price: '₹80' },
        { name: '2-Piece Suit (Organic Dry Clean)', price: '₹350' },
        { name: 'Blazer / Coat', price: '₹220' },
        { name: 'Sherwani / Indo-Western', price: '₹450' }
      ]
    },
    {
      category: 'Women\'s Wear',
      items: [
        { name: 'Silk / Georgette Saree (Dry Clean)', price: '₹280' },
        { name: 'Heavy Zari / Embroidered Saree', price: '₹390' },
        { name: 'Kurti / Salwar Kameez', price: '₹120' },
        { name: 'Bridal Lehenga (Multi-layer)', price: '₹850' },
        { name: 'Western Evening Gown', price: '₹420' },
        { name: 'Steam Press Only (Saree/Suit)', price: '₹60' }
      ]
    },
    {
      category: 'Home & Bedding',
      items: [
        { name: 'Single Bedsheet + Pillow Cover', price: '₹110' },
        { name: 'Double Bedsheet Set', price: '₹160' },
        { name: 'Comforter / Quilt (Single)', price: '₹280' },
        { name: 'Heavy Blanket / Rajai (Double)', price: '₹420' },
        { name: 'Curtains (Per Panel)', price: '₹180' },
        { name: 'Sofa Cover (Set)', price: '₹350' }
      ]
    },
    {
      category: 'Footwear & Bags',
      items: [
        { name: 'Sneaker Deep Clean & Deodorize', price: '₹320' },
        { name: 'Leather Boot / Shoe Conditioning', price: '₹450' },
        { name: 'Suede Shoe Revitalize', price: '₹380' },
        { name: 'Handbag Spa & Conditioning', price: '₹490' },
        { name: 'Travel Duffel / Backpack', price: '₹290' },
        { name: 'Water-Repellent Nano Coating', price: '₹150' }
      ]
    }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fbfe' }}>
      <TopBar />
      <Navbar onOpenBooking={() => router.push('/book')} />

      {/* Header Banner */}
      <section style={{
        backgroundColor: '#133857',
        color: '#ffffff',
        padding: '70px 0 60px 0',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'radial-gradient(circle at 85% 30%, rgba(56, 178, 73, 0.22) 0%, rgba(19, 56, 87, 0) 60%)'
      }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(56, 178, 73, 0.15)',
            color: '#68d391',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '16px',
            border: '1px solid rgba(56, 178, 73, 0.3)'
          }}>
            <Tag size={14} />
            <span>Honest & Transparent Rates</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 4.5vw, 52px)',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: '#ffffff',
            lineHeight: 1.15,
            marginBottom: '16px'
          }}>
            Garment Care Pricing & Calculator
          </h1>

          <p style={{
            fontSize: '17px',
            color: 'rgba(255, 255, 255, 0.85)',
            maxWidth: '620px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Zero hidden charges. Free doorstep pickup and delivery on all orders above ₹350. Pay after delivery via cash, UPI, or card.
          </p>
        </div>
      </section>

      {/* Interactive Price Calculator */}
      <div id="calculator">
        <PriceCalculator onBookWithItems={handleBookFromCalculator} />
      </div>

      {/* Rate Card Grid */}
      <section style={{ padding: '70px 0 90px 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#133857', marginBottom: '12px' }}>
              Standard Item Rate Card
            </h2>
            <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
              Complete itemized pricing list for our organic garment care services.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#f8fbfe',
                  borderRadius: '20px',
                  padding: '28px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#133857', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #e2e8f0' }}>
                  {tier.category}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {tier.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                      <span style={{ color: '#334155', fontWeight: 500 }}>{item.name}</span>
                      <span style={{ fontWeight: 800, color: '#38b249' }}>{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing FAQ & Guarantees */}
          <div style={{
            marginTop: '60px',
            backgroundColor: '#133857',
            borderRadius: '24px',
            padding: '40px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px'
          }}>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
                Need Corporate or Bulk Hotel / Salon Rates?
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '15px', maxWidth: '500px' }}>
                We provide commercial laundry partnerships with GST invoicing and dedicated daily pickup slots.
              </p>
            </div>

            <a
              href="tel:+916355090297"
              className="btn-primary"
              style={{
                padding: '14px 28px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Call +91 63550 90297</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

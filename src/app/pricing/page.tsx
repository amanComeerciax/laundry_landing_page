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
  ArrowRight,
  Phone,
  Building2,
  MessageCircle
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
      {/* Rate Card Grid */}
      <section className="pricing-rate-section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="pricing-rate-header">
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, color: '#133857', marginBottom: '8px' }}>
              Standard Item Rate Card
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
              Complete itemized pricing list for our organic garment care services.
            </p>
          </div>

          <div className="pricing-cards-grid">
            {pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#f8fbfe',
                  borderRadius: '18px',
                  padding: '24px 22px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#133857', marginBottom: '16px', paddingBottom: '10px', borderBottom: '2px solid #e2e8f0' }}>
                  {tier.category}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
          <div className="pricing-corporate-card">
            <div className="corporate-content">
              <div className="corporate-badge">
                <Building2 size={13} />
                <span>Commercial &amp; Bulk Partnerships</span>
              </div>

              <h3 className="corporate-title">
                Need Corporate, Hotel or Salon Bulk Laundry?
              </h3>

              <p className="corporate-desc">
                We provide specialized commercial laundry partnerships with official GST invoicing, dedicated daily pickup slots, and doorstep express turnaround across Ahmedabad.
              </p>

              <div className="corporate-features">
                <span className="corporate-chip">
                  <CheckCircle2 size={13} color="#38b249" />
                  <span>GST Invoicing &amp; Tax Credits</span>
                </span>
                <span className="corporate-chip">
                  <Truck size={13} color="#38b249" />
                  <span>Dedicated Daily Pickup</span>
                </span>
                <span className="corporate-chip">
                  <Clock size={13} color="#38b249" />
                  <span>24-48h Express Turnaround</span>
                </span>
              </div>
            </div>

            <div className="corporate-actions">
              <a
                href="tel:+916355090297"
                className="btn-primary pricing-corporate-btn"
              >
                <Phone size={15} />
                <span>Call +91 63550 90297</span>
                <ArrowRight size={15} />
              </a>

              <a
                href="https://wa.me/916355090297?text=Hi%20Glamour%20Dry,%20I%20am%20interested%20in%20Corporate%20/%20Bulk%20Laundry%20Rates"
                target="_blank"
                rel="noopener noreferrer"
                className="pricing-whatsapp-btn"
              >
                <MessageCircle size={15} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .pricing-rate-section {
          padding: 40px 0 32px 0;
        }
        .pricing-rate-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .pricing-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .pricing-corporate-card {
          margin-top: 24px;
          background: linear-gradient(135deg, #133857 0%, #0f2c44 100%);
          border-radius: 20px;
          padding: 28px 30px;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
          box-shadow: 0 16px 36px rgba(19, 56, 87, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.08);
          height: auto !important;
        }
        .corporate-content {
          flex: 1 1 0%;
          min-width: 280px;
          height: auto !important;
        }
        .corporate-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: rgba(56, 178, 73, 0.18);
          color: #4ade80;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.02em;
          margin-bottom: 10px;
          border: 1px solid rgba(56, 178, 73, 0.3);
        }
        .corporate-title {
          font-size: clamp(19px, 3.4vw, 24px) !important;
          font-weight: 800 !important;
          color: #ffffff !important;
          line-height: 1.25 !important;
          margin: 0 0 8px 0 !important;
        }
        .corporate-desc {
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.55;
          margin: 0 0 16px 0;
          max-width: 580px;
        }
        .corporate-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .corporate-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 5px 11px;
          font-size: 12.5px;
          color: #f1f5f9;
          font-weight: 500;
        }
        .corporate-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 0 0 auto;
        }
        .pricing-corporate-btn {
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          white-space: nowrap;
        }
        .pricing-whatsapp-btn {
          padding: 11px 24px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 600;
          color: #ffffff;
          background-color: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.16);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .pricing-whatsapp-btn:hover {
          background-color: rgba(255, 255, 255, 0.15);
        }

        @media (max-width: 768px) {
          .pricing-rate-section {
            padding: 24px 0 16px 0 !important;
          }
          .pricing-rate-header {
            margin-bottom: 20px !important;
          }
          .pricing-cards-grid {
            gap: 14px !important;
          }
          .pricing-corporate-card {
            margin-top: 16px !important;
            padding: 20px 18px !important;
            border-radius: 16px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 16px !important;
            height: auto !important;
            min-height: 0 !important;
          }
          .corporate-content {
            flex: none !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
          }
          .corporate-desc {
            margin-bottom: 12px !important;
            font-size: 13.5px !important;
          }
          .corporate-features {
            display: flex !important;
            flex-direction: column !important;
            gap: 8px !important;
          }
          .corporate-chip {
            width: 100% !important;
            box-sizing: border-box !important;
            padding: 7px 12px !important;
          }
          .corporate-actions {
            width: 100% !important;
            margin-top: 2px !important;
            gap: 10px !important;
          }
          .pricing-corporate-btn, .pricing-whatsapp-btn {
            width: 100% !important;
            padding: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}

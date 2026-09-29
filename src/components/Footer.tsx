'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, ShieldCheck, Heart, Send, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer style={{
      backgroundColor: '#0b2438',
      color: '#cbd5e1',
      paddingTop: '80px',
      paddingBottom: '30px',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    }}>
      <div className="container">
        {/* Main 4-Column Footer */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr',
          gap: '40px',
          marginBottom: '60px',
        }} className="footer-grid">
          {/* Column 1: Brand & Contact Info */}
          <div>
            {/* Logo */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ position: 'relative', width: '38px', height: '38px' }}>
                <svg width="38" height="38" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="44" stroke="#38b249" strokeWidth="5" fill="#133857" />
                  <circle cx="50" cy="50" r="34" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="160 50" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="24" fill="#0284c7" fillOpacity="0.3" stroke="#38b249" strokeWidth="3" />
                  <path d="M42 22C36 10 24 12 24 12C24 12 22 24 34 30C40 33 43 28 42 22Z" fill="#38b249" />
                </svg>
              </div>
              <div style={{ lineHeight: 1 }}>
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#38b249' }}>Eco</span>
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>Dry</span>
                <div style={{ fontSize: '8px', letterSpacing: '0.12em', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', marginTop: '2px' }}>
                  Dry Cleaning & Laundry
                </div>
              </div>
            </div>

            <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#94a3b8', marginBottom: '22px', maxWidth: '320px' }}>
              India&apos;s premier eco-conscious garment care brand. 100% toxic-chemical free, gentler on your fine fabrics, and kind to Mother Earth.
            </p>

            {/* Direct Contacts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href="mailto:support@ecodrylaundry.com"
                style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: '#e2e8f0', textDecoration: 'none' }}
              >
                <Mail size={15} color="#38b249" />
                <span>support@ecodrylaundry.com</span>
              </a>

              <a
                href="tel:+919007515150"
                style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: '#e2e8f0', textDecoration: 'none' }}
              >
                <Phone size={15} color="#38b249" />
                <span>+91 90075 15150 / +91 90075 15159</span>
              </a>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#94a3b8' }}>
                <Clock size={15} color="#38b249" />
                <span>Mon - Sun: 7:00 AM - 9:00 PM</span>
              </div>
            </div>
          </div>

          {/* Column 2: Garment Services */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '18px' }}>
              Garment Services
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li>
                <a href="#services" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#38b249')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>
                  Organic Dry Cleaning
                </a>
              </li>
              <li>
                <a href="#services" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#38b249')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>
                  Premium Wash & Steam Press
                </a>
              </li>
              <li>
                <a href="#services" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#38b249')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>
                  Bridal & Silk Saree Care
                </a>
              </li>
              <li>
                <a href="#services" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#38b249')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>
                  Sneaker & Leather Spa
                </a>
              </li>
              <li>
                <a href="#services" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#38b249')} onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>
                  Curtains & Heavy Quilts
                </a>
              </li>
              <li>
                <a href="#calculator" style={{ color: '#38b249', fontWeight: 600 }}>
                  Live Price Estimator →
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Pickup Hubs */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '18px' }}>
              Doorstep Hubs
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={13} color="#38b249" />
                <span>Indiranagar & Domlur</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={13} color="#38b249" />
                <span>Koramangala & HSR Layout</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={13} color="#38b249" />
                <span>Whitefield & Marathahalli</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={13} color="#38b249" />
                <span>Bellandur & Sarjapur</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={13} color="#38b249" />
                <span>JP Nagar & Jayanagar</span>
              </div>
              <p style={{ fontSize: '12px', color: '#38b249', marginTop: '6px', fontWeight: 600 }}>
                ✓ Free pickup on orders above ₹350
              </p>
            </div>
          </div>

          {/* Column 4: Newsletter & Eco Guarantee */}
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>
              Garment Care Tips
            </h4>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '14px' }}>
              Subscribe to get exclusive seasonal discounts and luxury fabric care guides directly to your inbox.
            </p>

            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#38b249',
                  borderRadius: '10px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Send size={15} />
              </button>
            </form>

            {subscribed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#4ade80', fontWeight: 600 }}>
                <CheckCircle2 size={13} />
                <span>Thank you! Welcome promo sent.</span>
              </div>
            )}

            <div style={{
              marginTop: '16px',
              padding: '10px 14px',
              borderRadius: '10px',
              backgroundColor: 'rgba(56, 178, 73, 0.12)',
              border: '1px solid rgba(56, 178, 73, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <ShieldCheck size={18} color="#38b249" />
              <span style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: 600 }}>
                Certified 100% PERC-Free Cleaners
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Legal / Copyright */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '13px',
          color: '#64748b',
        }}>
          <div>
            © {new Date().getFullYear()} EcoDry Laundry & Dry Cleaning Services. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#home" style={{ color: '#94a3b8' }}>Privacy Policy</a>
            <a href="#home" style={{ color: '#94a3b8' }}>Terms of Service</a>
            <a href="#home" style={{ color: '#94a3b8' }}>Garment Care Guarantee</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}

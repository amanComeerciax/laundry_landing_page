'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhyEcoDry from '@/components/WhyEcoDry';
import { 
  Leaf, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Droplet, 
  Truck, 
  Clock, 
  Users,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fbfe' }}>
      <TopBar />
      <Navbar onOpenBooking={() => router.push('/book')} />

      {/* Hero Banner */}
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
            <Leaf size={14} />
            <span>The Green Cleaning Revolution</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 4.5vw, 52px)',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: '#ffffff',
            lineHeight: 1.15,
            marginBottom: '16px'
          }}>
            About Glamour Dry
          </h1>

          <p style={{
            fontSize: '17px',
            color: 'rgba(255, 255, 255, 0.85)',
            maxWidth: '680px',
            margin: '0 auto 32px auto',
            lineHeight: 1.6
          }}>
            We set out with a simple mission: provide world-class couture garment care without harming your delicate skin, fine fabrics, or the planet.
          </p>

          <button
            onClick={() => router.push('/book')}
            className="btn-primary"
            style={{
              padding: '14px 28px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>Experience Glamour Dry</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Story & Philosophy Section */}
      <section style={{ padding: '80px 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '50px',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#38b249', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', marginBottom: '12px' }}>
                <Sparkles size={16} />
                <span>Our Heritage & Standards</span>
              </div>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#133857', lineHeight: 1.25, marginBottom: '20px' }}>
                Why We Never Use Toxic PERC Chemicals
              </h2>
              <p style={{ fontSize: '15.5px', color: '#64748b', lineHeight: 1.7, marginBottom: '16px' }}>
                For over 70 years, traditional dry cleaners have relied on <strong>Perchloroethylene (PERC)</strong>—a petroleum chemical compound known to cause headaches, skin rashes, and persistent fabric degradation.
              </p>
              <p style={{ fontSize: '15.5px', color: '#64748b', lineHeight: 1.7, marginBottom: '24px' }}>
                At <strong>Glamour Dry</strong>, we replaced outdated chemical vats with state-of-the-art European organic bio-enzymes, hydrocarbon gentle detergents, and closed-loop computerized cleaning machines. Your clothes smell naturally fresh, feel softer, and last 3x longer.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  '100% Skin Safe & Hypoallergenic for baby clothes',
                  'Closed-loop filtration that saves 80% water on every load',
                  'Individual RFID barcode tagging from pickup to doorstep delivery',
                  'Zero pin-holes and zero fiber burn guarantee'
                ].map((point, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14.5px', color: '#334155', fontWeight: 600 }}>
                    <CheckCircle2 size={18} color="#38b249" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Stats Card */}
            <div style={{
              backgroundColor: '#f8fbfe',
              borderRadius: '28px',
              padding: '40px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 16px 40px rgba(19, 56, 87, 0.05)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#133857', marginBottom: '24px' }}>
                Our Environmental Impact Numbers
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: '#38b249', lineHeight: 1, marginBottom: '6px' }}>4.8M+</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#133857' }}>Liters Water Saved</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Recycled closed loop</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: '#0284c7', lineHeight: 1, marginBottom: '6px' }}>0%</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#133857' }}>Toxic Chemicals</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>100% bio-safe enzymes</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: '#d97706', lineHeight: 1, marginBottom: '6px' }}>120K+</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#133857' }}>Garments Delivered</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>99.8% on-time record</div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: '#9333ea', lineHeight: 1, marginBottom: '6px' }}>4.9★</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#133857' }}>Google Rating</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>1,450+ happy families</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section Component */}
      <WhyEcoDry />

      <Footer />
    </div>
  );
}

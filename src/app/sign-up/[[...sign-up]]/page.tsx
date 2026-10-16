'use client';

import React from 'react';
import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, Clock, Truck, Gift } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="auth-wrapper">
      {/* Left Column: Brand Showcase (Desktop) */}
      <div className="auth-showcase">
        <div className="auth-showcase-content">
          <Link href="/" className="auth-back-link">
            <ArrowLeft size={16} />
            <span>Back to Glamour Dry</span>
          </Link>

          <div style={{ marginTop: '36px', marginBottom: '24px' }}>
            <Logo lightText size="lg" />
          </div>

          <h1 className="auth-hero-title">
            Smart Laundry Care,<br />
            <span style={{ color: '#38b249' }}>Starts Here.</span>
          </h1>

          <p className="auth-hero-desc">
            Create an account in 30 seconds. Enjoy free doorstep pickup and ₹50 off on your first dry cleaning order.
          </p>

          <div className="auth-perks-list">
            <div className="auth-perk-item">
              <span className="auth-perk-icon"><Gift size={16} /></span>
              <div>
                <strong>Special Welcome Offer</strong>
                <p>Flat ₹50 OFF &amp; Free Pickup on your first booking</p>
              </div>
            </div>

            <div className="auth-perk-item">
              <span className="auth-perk-icon"><Sparkles size={16} /></span>
              <div>
                <strong>Eco-Friendly Garment Spa</strong>
                <p>Woolmark &amp; silk certified organic gentle cleaning</p>
              </div>
            </div>

            <div className="auth-perk-item">
              <span className="auth-perk-icon"><Truck size={16} /></span>
              <div>
                <strong>Doorstep Pickup &amp; Express Delivery</strong>
                <p>Pick your convenient slot anytime, 7 days a week</p>
              </div>
            </div>
          </div>

          <div className="auth-quote-card">
            <div style={{ display: 'flex', gap: '4px', color: '#f59e0b', marginBottom: '8px' }}>
              {'★★★★★'}
            </div>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.9)', fontStyle: 'italic', lineHeight: 1.5 }}>
              &ldquo;Best laundry service in town! Super transparent pricing, on-time delivery, and crisp clothes.&rdquo;
            </p>
            <span style={{ display: 'block', marginTop: '8px', fontSize: '12px', fontWeight: 700, color: '#38b249' }}>
              — Satisfied Member, Ahmedabad
            </span>
          </div>
        </div>

        <div className="auth-showcase-footer">
          <span>&copy; {new Date().getFullYear()} Glamour Dry Laundry Services. All rights reserved.</span>
        </div>
      </div>

      {/* Right Column: Custom Styled Sign Up Form */}
      <div className="auth-form-side">
        <div className="auth-mobile-header">
          <Link href="/" className="auth-mobile-back">
            <ArrowLeft size={15} />
            <span>Home</span>
          </Link>
          <Logo size="sm" />
        </div>

        <div className="auth-form-container">
          <div className="auth-form-intro">
            <span className="auth-badge">✨ Get Started</span>
            <h2 className="auth-form-title">Create your account</h2>
            <p className="auth-form-subtitle">
              Book doorstep pickups, track orders, and get exclusive member perks.
            </p>
          </div>

          <div className="clerk-container">
            <SignUp
              path="/sign-up"
              routing="path"
              signInUrl="/sign-in"
              appearance={{
                variables: {
                  colorPrimary: '#38b249',
                  colorBackground: '#ffffff',
                  fontFamily: "'Outfit', -apple-system, sans-serif",
                  borderRadius: '12px',
                },
                elements: {
                  rootBox: {
                    width: '100%',
                  },
                  card: {
                    boxShadow: '0 8px 30px rgba(19, 56, 87, 0.08)',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '20px',
                    padding: '28px 24px',
                    backgroundColor: '#ffffff',
                  },
                  headerTitle: {
                    color: '#133857',
                    fontSize: '20px',
                    fontWeight: '800',
                  },
                  headerSubtitle: {
                    color: '#64748b',
                    fontSize: '13.5px',
                  },
                  socialButtonsBlockButton: {
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#133857',
                    padding: '11px',
                    transition: 'all 0.2s ease',
                  },
                  formButtonPrimary: {
                    backgroundColor: '#38b249',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: '700',
                    borderRadius: '12px',
                    padding: '12px',
                    boxShadow: '0 4px 14px rgba(56, 178, 73, 0.35)',
                    transition: 'all 0.2s ease',
                  },
                  formFieldInput: {
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '12px',
                    fontSize: '14.5px',
                    padding: '11px 14px',
                    color: '#0f172a',
                  },
                  formFieldLabel: {
                    color: '#133857',
                    fontWeight: '700',
                    fontSize: '13px',
                  },
                  footerActionLink: {
                    color: '#38b249',
                    fontWeight: '700',
                  },
                },
              }}
            />
          </div>

          <div className="auth-security-note">
            <ShieldCheck size={16} color="#38b249" />
            <span>256-Bit SSL Encrypted &amp; Secure Authentication</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-wrapper {
          min-height: 100vh;
          display: grid;
          grid-template-columns: minmax(360px, 480px) 1fr;
          background-color: #ffffff;
        }

        .auth-showcase {
          background: linear-gradient(155deg, #0b2438 0%, #133857 55%, #184b73 100%);
          color: #ffffff;
          padding: 40px 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        .auth-showcase::after {
          content: '';
          position: absolute;
          width: 380px;
          height: 380px;
          background: radial-gradient(circle, rgba(56, 178, 73, 0.18) 0%, transparent 70%);
          bottom: -80px;
          right: -80px;
          border-radius: 50%;
          pointer-events: none;
        }

        .auth-back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 13.5px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .auth-back-link:hover {
          color: #38b249;
          transform: translateX(-3px);
        }

        .auth-hero-title {
          font-size: 34px;
          font-weight: 800;
          line-height: 1.2;
          color: #ffffff;
          letter-spacing: -0.5px;
          margin-bottom: 14px;
        }

        .auth-hero-desc {
          font-size: 15px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.78);
          margin-bottom: 32px;
        }

        .auth-perks-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-bottom: 36px;
        }

        .auth-perk-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .auth-perk-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: rgba(56, 178, 73, 0.2);
          color: #38b249;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .auth-perk-item strong {
          display: block;
          font-size: 14px;
          color: #ffffff;
          margin-bottom: 2px;
        }

        .auth-perk-item p {
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.65);
          margin: 0;
        }

        .auth-quote-card {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          padding: 16px 20px;
          backdrop-filter: blur(10px);
        }

        .auth-showcase-footer {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 32px;
        }

        .auth-form-side {
          background-color: #f8fbfe;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 24px;
          min-height: 100vh;
        }

        .auth-mobile-header {
          display: none;
          width: 100%;
          max-width: 440px;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .auth-mobile-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #133857;
          font-weight: 700;
          font-size: 13.5px;
          text-decoration: none;
        }

        .auth-form-container {
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .auth-form-intro {
          text-align: center;
          margin-bottom: 20px;
          width: 100%;
        }

        .auth-badge {
          display: inline-block;
          background: rgba(56, 178, 73, 0.12);
          color: #23742f;
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .auth-form-title {
          font-size: 24px;
          font-weight: 800;
          color: #133857;
          margin-bottom: 6px;
          letter-spacing: -0.3px;
        }

        .auth-form-subtitle {
          font-size: 14px;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        .clerk-container {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .auth-security-note {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
          margin-top: 20px;
        }

        @media (max-width: 900px) {
          .auth-wrapper {
            grid-template-columns: 1fr;
          }

          .auth-showcase {
            display: none;
          }

          .auth-mobile-header {
            display: flex;
          }

          .auth-form-side {
            padding: 24px 16px;
            min-height: 100vh;
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

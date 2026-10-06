'use client';

import React from 'react';
import { Mail, Phone, Clock, MapPin } from 'lucide-react';

export default function TopBar() {
  return (
    <div style={{
      backgroundColor: '#163853',
      color: '#ffffff',
      fontSize: '13px',
      padding: '8px 0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'relative',
      zIndex: 40,
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        {/* Left: Email contact */}
        <div className="topbar-email" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a
            href="mailto:support@glamourdry.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '9px',
              color: '#f0f7fc',
              transition: 'color 0.2s ease',
              textDecoration: 'none',
              fontWeight: 500,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#38b249')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#f0f7fc')}
          >
            <span style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#163853',
              flexShrink: 0,
            }}>
              <Mail size={13} strokeWidth={2.2} />
            </span>
            <span>support@glamourdry.com</span>
          </a>
        </div>

        {/* Center: Operational Notice (Hidden on small screens) */}
        <div className="topbar-center" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          color: 'rgba(255, 255, 255, 0.75)',
          fontSize: '12px',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Clock size={13} style={{ color: '#38b249' }} />
            <span>Open 7 Days: 7:00 AM - 9:00 PM</span>
          </span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <MapPin size={13} style={{ color: '#38b249' }} />
            <span>Doorstep Pickup Across City</span>
          </span>
        </div>

        {/* Right: Phone contact from image */}
        <div className="topbar-phone" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a
            href="tel:+919265588226"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '9px',
              color: '#f0f7fc',
              transition: 'color 0.2s ease',
              textDecoration: 'none',
              fontWeight: 600,
              letterSpacing: '0.01em',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#38b249')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#f0f7fc')}
          >
            <span style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#163853',
              flexShrink: 0,
            }}>
              <Phone size={13} strokeWidth={2.2} />
            </span>
            <span>+91 92655 88226</span>
          </a>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .topbar-center {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .topbar-email {
            display: none !important;
          }
          .topbar-phone {
            width: 100% !important;
            justify-content: center !important;
          }
          .topbar-phone a {
            font-size: 11.5px !important;
          }
        }
      `}</style>
    </div>
  );
}

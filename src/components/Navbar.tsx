'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles, ChevronRight, Phone, Leaf } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Calculator', href: '#calculator' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ];

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header
        ref={headerRef}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.96)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(14px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(14px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(226, 232, 240, 0.9)' : 'none',
          boxShadow: isScrolled ? '0 4px 20px rgba(19, 56, 87, 0.06)' : 'none',
          transition: 'background 0.35s ease, box-shadow 0.35s ease, border 0.35s ease',
          padding: isScrolled ? '12px 0' : '16px 0',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Brand Logo */}
          <Link href="#home" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{ position: 'relative', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="44" stroke="#133857" strokeWidth="5" fill="#f8fbfe" />
                <circle cx="50" cy="50" r="34" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="160 50" strokeLinecap="round" />
                <circle cx="50" cy="50" r="24" fill="#0284c7" fillOpacity="0.15" stroke="#38b249" strokeWidth="3" />
                <path d="M35 52C40 48 44 56 50 52C56 48 60 56 65 52" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
                <path d="M42 22C36 10 24 12 24 12C24 12 22 24 34 30C40 33 43 28 42 22Z" fill="#38b249" />
                <path d="M26 14C34 22 36 28 36 28" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M50 20C47 13 41 12 41 12C41 12 40 18 45 22C47 24 50 23 50 20Z" fill="#68d391" />
              </svg>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 1 }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: 800, color: '#38b249', letterSpacing: '-0.02em' }}>Eco</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: 800, color: '#133857', letterSpacing: '-0.02em' }}>Dry</span>
              </div>
              <div style={{ fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.12em', color: '#536e82', textTransform: 'uppercase', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Dry Cleaning &amp; Laundry</span>
                <span style={{ color: '#38b249' }}>•</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                style={{ fontSize: '15px', fontWeight: 600, color: '#133857', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#38b249')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#133857')}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={onOpenBooking}
              className="btn-primary"
              style={{ padding: '11px 26px', fontSize: '15px', fontWeight: 700, boxShadow: '0 8px 20px rgba(56, 178, 73, 0.35)' }}
            >
              <span>Book a Pickup</span>
            </button>
          </div>

          {/* Mobile Hamburger — clean icon, no box */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              border: 'none',
              background: mobileMenuOpen ? '#f1f5f9' : 'transparent',
              color: '#133857',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            {mobileMenuOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
          </button>
        </div>
      </header>

      {/* ─── Mobile Full-Screen Drawer ─────────────────────── */}
      {/* Backdrop */}
      <div
        className={`mobile-backdrop ${mobileMenuOpen ? 'mobile-backdrop--open' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Slide-in Drawer Panel */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'mobile-drawer--open' : ''}`}>
        {/* Drawer Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 20px 14px 20px',
          borderBottom: '1px solid #f1f5f9',
          background: '#ffffff',
        }}>
          <Link href="#home" onClick={closeMenu} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="44" stroke="#133857" strokeWidth="5" fill="#f8fbfe" />
              <circle cx="50" cy="50" r="34" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="160 50" strokeLinecap="round" />
              <circle cx="50" cy="50" r="24" fill="#0284c7" fillOpacity="0.15" stroke="#38b249" strokeWidth="3" />
              <path d="M35 52C40 48 44 56 50 52C56 48 60 56 65 52" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
              <path d="M42 22C36 10 24 12 24 12C24 12 22 24 34 30C40 33 43 28 42 22Z" fill="#38b249" />
            </svg>
            <div>
              <div style={{ lineHeight: 1 }}>
                <span style={{ fontSize: '22px', fontWeight: 800, color: '#38b249', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>Eco</span>
                <span style={{ fontSize: '22px', fontWeight: 800, color: '#133857', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>Dry</span>
              </div>
              <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.1em', color: '#536e82', textTransform: 'uppercase', marginTop: '2px' }}>
                Dry Cleaning &amp; Laundry
              </div>
            </div>
          </Link>

          {/* Clean close button — no heavy border */}
          <button
            onClick={closeMenu}
            aria-label="Close menu"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              border: 'none',
              background: '#f1f5f9',
              color: '#133857',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Nav Links */}
        <nav style={{ padding: '12px 0', flex: 1, overflowY: 'auto' }}>
          {navLinks.map((link, idx) => (
            <a
              key={link.name}
              href={link.href}
              onClick={closeMenu}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 24px',
                fontSize: '16px',
                fontWeight: 600,
                color: '#133857',
                textDecoration: 'none',
                borderBottom: idx < navLinks.length - 1 ? '1px solid #f8fafc' : 'none',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fbfe'; e.currentTarget.style.color = '#38b249'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#133857'; }}
            >
              <span>{link.name}</span>
              <ChevronRight size={16} color="#cbd5e1" />
            </a>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div style={{
          padding: '16px 24px 32px 24px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '10px',
            background: '#eaf7ec',
            marginBottom: '4px',
          }}>
            <Leaf size={13} color="#38b249" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#2e963c', letterSpacing: '0.02em' }}>
              FREE PICKUP ABOVE ₹350
            </span>
          </div>

          <button
            onClick={() => { closeMenu(); onOpenBooking(); }}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', justifyContent: 'center', fontSize: '15px', fontWeight: 700 }}
          >
            <span>Book a Pickup</span>
          </button>

          <a
            href="tel:+919007515150"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: '9999px',
              border: '1.5px solid #e2e8f0',
              color: '#133857',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              background: '#ffffff',
            }}
          >
            <Phone size={15} color="#38b249" />
            <span>+91 90075 15150</span>
          </a>
        </div>
      </div>

      <style jsx>{`
        /* ─── Show/hide desktop vs mobile ─────────────────── */
        @media (max-width: 900px) {
          .desktop-nav,
          .desktop-actions {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }

        /* ─── Mobile Backdrop ─────────────────────────────── */
        .mobile-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(11, 36, 56, 0.6);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
          z-index: 998;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .mobile-backdrop--open {
          opacity: 1;
          pointer-events: all;
        }

        /* ─── Mobile Drawer Panel ─────────────────────────── */
        .mobile-drawer {
          display: none;
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 85%;
          max-width: 320px;
          background: #ffffff;
          z-index: 999;
          flex-direction: column;
          box-shadow: -6px 0 36px rgba(19, 56, 87, 0.18);
          transform: translateX(100%);
          transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }
        .mobile-drawer--open {
          transform: translateX(0);
        }

        @media (max-width: 900px) {
          .mobile-backdrop {
            display: block;
          }
          .mobile-drawer {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}

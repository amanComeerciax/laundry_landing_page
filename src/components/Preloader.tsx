'use client';

import React, { useEffect, useState } from 'react';
import gsap from 'gsap';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prevent browser from restoring scroll position
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // Force scroll to top and lock
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    // Double check scroll after a tiny delay for mobile browsers
    setTimeout(() => window.scrollTo(0, 0), 50);

    // Function to run the exit animation
    const runExitAnimation = () => {
      document.body.style.overflow = '';
      gsap.to('.preloader-container', {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => setIsLoading(false)
      });
    };

    // Make sure the loader stays for at least 800ms for visual effect
    const minTimePromise = new Promise(resolve => setTimeout(resolve, 800));

    // Wait for window load
    const loadPromise = new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve(true);
      } else {
        window.addEventListener('load', () => resolve(true));
      }
    });

    // Wait for both minimum time and actual window load
    Promise.all([minTimePromise, loadPromise]).then(() => {
      runExitAnimation();
    });

    // Fallback in case load event never fires or takes too long (3.5s max)
    const fallbackTimeout = setTimeout(() => {
      if (isLoading) runExitAnimation();
    }, 3500);

    return () => clearTimeout(fallbackTimeout);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div
      className="preloader-container"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#ffffff',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      {/* Animated Logo */}
      <div style={{ position: 'relative', width: '64px', height: '64px', marginBottom: '16px', animation: 'pulse 1.5s infinite ease-in-out' }}>
        <svg width="64" height="64" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" stroke="#38b249" strokeWidth="5" fill="#133857" />
          <circle cx="50" cy="50" r="34" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="160 50" strokeLinecap="round">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="50" cy="50" r="24" fill="#0ea5e9" fillOpacity="0.1" />
          <path d="M35 52C40 48 44 56 50 52C56 48 60 56 65 52" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
          <path d="M30 10 Q 30 22 18 22 Q 30 22 30 34 Q 30 22 42 22 Q 30 22 30 10Z" fill="#38b249" />
          <path d="M48 14 Q 48 20 42 20 Q 48 20 48 26 Q 48 20 54 20 Q 48 20 48 14Z" fill="#0ea5e9" />
        </svg>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', lineHeight: 1 }}>
        <span style={{ fontSize: '28px', fontWeight: 800, color: '#38b249' }}>Glamour</span>
        <span style={{ fontSize: '28px', fontWeight: 800, color: '#133857' }}>Dry</span>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.9; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}

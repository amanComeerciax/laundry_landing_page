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
    // Force scroll to top
    window.scrollTo(0, 0);

    // Function to run the exit animation
    const runExitAnimation = () => {
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
          <circle cx="50" cy="50" r="24" fill="#0284c7" fillOpacity="0.3" stroke="#38b249" strokeWidth="3" />
          <path d="M42 22C36 10 24 12 24 12C24 12 22 24 34 30C40 33 43 28 42 22Z" fill="#38b249" />
        </svg>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', lineHeight: 1 }}>
        <span style={{ fontSize: '28px', fontWeight: 800, color: '#38b249' }}>Eco</span>
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

'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  href?: string;
  lightText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Logo({
  href = '/',
  lightText = false,
  size = 'md',
  showSubtitle = true,
  className = '',
  onClick,
}: LogoProps) {
  const iconDimensions = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;
  const fontSize = size === 'sm' ? '20px' : size === 'lg' ? '28px' : '24px';
  const subtitleSize = size === 'sm' ? '7.5px' : size === 'lg' ? '9.5px' : '8.5px';

  const content = (
    <div
      onClick={onClick}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? '8px' : '12px',
        textDecoration: 'none',
        cursor: href || onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      {/* Official Washer SVG Emblem */}
      <div
        style={{
          position: 'relative',
          width: `${iconDimensions}px`,
          height: `${iconDimensions}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg
          width={iconDimensions}
          height={iconDimensions}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="44" stroke="#133857" strokeWidth="5" fill="#f8fbfe" />
          <circle
            cx="50"
            cy="50"
            r="34"
            stroke="#0ea5e9"
            strokeWidth="4"
            strokeDasharray="160 50"
            strokeLinecap="round"
          />
          <circle cx="50" cy="50" r="24" fill="#0ea5e9" fillOpacity="0.1" />
          <path
            d="M35 52C40 48 44 56 50 52C56 48 60 56 65 52"
            stroke="#0284c7"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M30 10 Q 30 22 18 22 Q 30 22 30 34 Q 30 22 42 22 Q 30 22 30 10Z"
            fill="#38b249"
          />
          <path
            d="M48 14 Q 48 20 42 20 Q 48 20 48 26 Q 48 20 54 20 Q 48 20 48 14Z"
            fill="#0ea5e9"
          />
        </svg>
      </div>

      {/* Typography */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 1 }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: fontSize,
              fontWeight: 800,
              color: '#38b249',
              letterSpacing: '-0.02em',
            }}
          >
            Glamour
          </span>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: fontSize,
              fontWeight: 800,
              color: lightText ? '#ffffff' : '#133857',
              letterSpacing: '-0.02em',
            }}
          >
            Dry
          </span>
        </div>

        {showSubtitle && (
          <div
            style={{
              fontSize: subtitleSize,
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: lightText ? '#94a3b8' : '#536e82',
              textTransform: 'uppercase',
              marginTop: '3px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Dry Cleaning &amp; Laundry</span>
            <span style={{ color: '#38b249' }}>•</span>
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    );
  }

  return content;
}

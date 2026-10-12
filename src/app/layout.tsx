import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Preloader from "@/components/Preloader";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Glamour Dry | Professional Dry Cleaning & Eco-Friendly Laundry",
  description: "Experience professional garment care with 100% eco-friendly organic cleaning, convenient doorstep pickup and delivery for everyday clothes & delicate fabrics. Free pickup above ₹350.",
  keywords: "dry cleaning, eco friendly laundry, organic dry clean, laundry doorstep pickup, steam iron, sneaker spa, suit dry clean",
  openGraph: {
    title: "Glamour Dry | Clean More. Pay Less.",
    description: "Professional garment care with eco-friendly cleaning, doorstep pickup and reliable delivery.",
    url: "https://glamourdry.com",
    siteName: "Glamour Dry Laundry",
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        </head>
        <body className="antialiased">
          <Preloader />
          <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
          <Toaster position="top-right" toastOptions={{ duration: 4000, style: { padding: '16px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, color: '#133857' } }} />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

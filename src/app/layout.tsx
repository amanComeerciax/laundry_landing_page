import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Preloader from "@/components/Preloader";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from 'react-hot-toast';

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${outfit.variable} ${plusJakartaSans.variable}`}>
        <body className="antialiased">
          <Preloader />
          <Toaster position="top-right" toastOptions={{ duration: 4000, style: { padding: '16px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, color: '#133857' } }} />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

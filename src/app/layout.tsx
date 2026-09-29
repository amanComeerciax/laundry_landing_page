import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Preloader from "@/components/Preloader";

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
  title: "EcoDry | Professional Dry Cleaning & Eco-Friendly Laundry",
  description: "Experience professional garment care with 100% eco-friendly organic cleaning, convenient doorstep pickup and delivery for everyday clothes & delicate fabrics. Free pickup above ₹350.",
  keywords: "dry cleaning, eco friendly laundry, organic dry clean, laundry doorstep pickup, steam iron, sneaker spa, suit dry clean",
  openGraph: {
    title: "EcoDry | Clean More. Pay Less.",
    description: "Professional garment care with eco-friendly cleaning, doorstep pickup and reliable delivery.",
    url: "https://ecodrylaundry.com",
    siteName: "EcoDry Laundry",
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
    <html lang="en" className={`${outfit.variable} ${plusJakartaSans.variable}`}>
      <body className="antialiased">
        <Preloader />
        {children}
      </body>
    </html>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Truck
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const router = useRouter();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Organic Dry Cleaning',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      const data = await res.json();
      if (res.ok) {
        setFormSubmitted(true);
        toast.success('Thank you! Your inquiry has been emailed to our team.');
      } else {
        toast.error(data.error || 'Failed to send inquiry. Please try again.');
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      toast.error('Network error. Please call us directly at 6355090297.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fbfe' }}>
      <TopBar />
      <Navbar onOpenBooking={() => router.push('/book')} />

      {/* Header Banner */}
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
            <MessageCircle size={14} />
            <span>24/7 Dedicated Support</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 4.5vw, 52px)',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: '#ffffff',
            lineHeight: 1.15,
            marginBottom: '16px'
          }}>
            Contact Glamour Dry
          </h1>

          <p style={{
            fontSize: '17px',
            color: 'rgba(255, 255, 255, 0.85)',
            maxWidth: '620px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Have questions about specialized garment care, corporate partnerships, or want to schedule a custom pickup? We are here to assist!
          </p>
        </div>
      </section>

      {/* Contact Content Grid */}
      <section style={{ padding: '70px 0 90px 0', flex: 1 }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'flex-start'
          }}>
            {/* Left: Contact Info Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '32px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 8px 30px rgba(19, 56, 87, 0.04)'
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#133857', marginBottom: '24px' }}>
                  Direct Contact Channels
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Phone */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#ebf8ee', color: '#38b249', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Phone Number</h4>
                      <a href="tel:+916355090297" style={{ fontSize: '18px', fontWeight: 800, color: '#133857', textDecoration: 'none' }}>
                        +91 63550 90297
                      </a>
                      <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px' }}>Available Mon-Sun 7:00 AM - 9:00 PM</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Email Address</h4>
                      <a href="mailto:memonljku@gmail.com" style={{ fontSize: '17px', fontWeight: 800, color: '#133857', textDecoration: 'none' }}>
                        memonljku@gmail.com
                      </a>
                      <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px' }}>Replies within 2 business hours</p>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>WhatsApp Direct</h4>
                      <a href="https://wa.me/916355090297" target="_blank" rel="noopener noreferrer" style={{ fontSize: '17px', fontWeight: 800, color: '#15803d', textDecoration: 'none' }}>
                        +91 63550 90297
                      </a>
                      <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px' }}>Instant chat & live booking support</p>
                    </div>
                  </div>

                  {/* Operational Hours */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Working Hours</h4>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#133857' }}>Monday - Sunday: 7:00 AM – 9:00 PM</div>
                      <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px' }}>Doorstep pickups run 7 days a week</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick CTA */}
              <div style={{
                backgroundColor: '#16a34a',
                borderRadius: '24px',
                padding: '28px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                boxShadow: '0 12px 30px rgba(22, 163, 74, 0.25)'
              }}>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>Prefer WhatsApp?</h4>
                  <p style={{ fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.9)' }}>Chat directly with our care manager right now.</p>
                </div>
                <a
                  href="https://wa.me/916355090297"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#16a34a',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '14px',
                    textDecoration: 'none',
                    flexShrink: 0
                  }}
                >
                  Chat Now
                </a>
              </div>
            </div>

            {/* Right: Interactive Contact Form */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '40px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 8px 30px rgba(19, 56, 87, 0.04)'
            }}>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#133857', marginBottom: '8px' }}>
                Send Us a Message
              </h3>
              <p style={{ fontSize: '14.5px', color: '#64748b', marginBottom: '28px' }}>
                Fill out the form below and we will get back to you promptly.
              </p>

              {formSubmitted ? (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f0fdf4', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#133857', marginBottom: '8px' }}>Message Received!</h4>
                  <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                    Thank you, {contactForm.name}! Our representative will get in touch with you shortly at {contactForm.phone}.
                  </p>
                  <button
                    onClick={() => { setFormSubmitted(false); setContactForm({ name: '', phone: '', email: '', service: 'Organic Dry Cleaning', message: '' }); }}
                    className="btn-outline"
                    style={{ padding: '10px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 600 }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#133857', marginBottom: '6px' }}>Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={contactForm.name}
                      onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '14.5px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#133857', marginBottom: '6px' }}>Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91"
                        value={contactForm.phone}
                        onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '14.5px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#133857', marginBottom: '6px' }}>Email Address</label>
                      <input
                        type="email"
                        placeholder="you@email.com"
                        value={contactForm.email}
                        onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '14.5px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#133857', marginBottom: '6px' }}>Service of Interest</label>
                    <select
                      value={contactForm.service}
                      onChange={e => setContactForm({ ...contactForm, service: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '14.5px', backgroundColor: '#ffffff' }}
                    >
                      <option value="Organic Dry Cleaning">Organic Dry Cleaning (Suits, Sarees, Dresses)</option>
                      <option value="Wash & Steam Iron">Premium Wash & Steam Iron</option>
                      <option value="Sneaker Spa">Sneaker & Footwear Spa</option>
                      <option value="Curtains & Blankets">Curtains, Quilts & Blankets</option>
                      <option value="Corporate Laundry">Corporate / Hotel Bulk Laundry</option>
                      <option value="General Inquiry">General Query</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#133857', marginBottom: '6px' }}>Your Message or Pickup Address</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us what items you need cleaned, your location, or any questions..."
                      value={contactForm.message}
                      onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '14.5px', resize: 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginTop: '8px',
                      opacity: isSubmitting ? 0.75 : 1,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <span>{isSubmitting ? 'Sending Inquiry...' : 'Send Message'}</span>
                    <Send size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

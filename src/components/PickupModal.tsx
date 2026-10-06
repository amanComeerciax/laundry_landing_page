'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Phone, User, CheckCircle2, Sparkles, Truck, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  initialTotal?: number;
  initialItems?: string;
}

export default function PickupModal({
  isOpen,
  onClose,
  initialService = 'Organic Dry Cleaning',
  initialTotal = 0,
  initialItems = '',
}: PickupModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [service, setService] = useState(initialService);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('Morning (8:00 AM - 11:00 AM)');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    if (initialService) {
      setService(initialService);
    }
  }, [initialService]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomId = 'ECO-' + Math.floor(100000 + Math.random() * 900000);
    setBookingId(randomId);
    setStep(2);

    // Launch confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38b249', '#0284c7', '#133857', '#e0f2fe'],
      });
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    setStep(1);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(11, 36, 56, 0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#ffffff',
          borderRadius: '28px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          position: 'relative',
          animation: 'fadeIn 0.25s ease-out',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            backgroundColor: '#133857',
            color: '#ffffff',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#38b249',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}>
              <Truck size={18} />
            </span>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                Schedule Doorstep Pickup
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                Free pickup & delivery on orders above ₹350
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              color: '#ffffff',
              opacity: 0.8,
              padding: '6px',
              borderRadius: '8px',
              transition: 'opacity 0.2s',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px 24px', maxHeight: '80vh', overflowY: 'auto' }}>
          {step === 1 ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Optional Items alert if coming from calculator */}
              {initialItems && (
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #86efac',
                  borderRadius: '12px',
                  fontSize: '13px',
                  color: '#166534',
                }}>
                  <span style={{ fontWeight: 700 }}>Estimated Order: </span>
                  <span>{initialItems}</span>
                  {initialTotal > 0 && <span style={{ fontWeight: 800 }}> (Approx: ₹{initialTotal})</span>}
                </div>
              )}

              {/* Service Selection */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#133857', marginBottom: '8px', display: 'block' }}>
                  Select Primary Service
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    color: '#133857',
                    backgroundColor: '#f8fbfe',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                >
                  <option value="Organic Dry Cleaning">Organic Dry Cleaning (Suits, Sarees, Dresses)</option>
                  <option value="Premium Wash & Steam Iron">Premium Wash & Steam Iron (Everyday Wear)</option>
                  <option value="Industrial Steam Pressing">Industrial Steam Pressing (Creases Only)</option>
                  <option value="Sneaker & Leather Spa">Sneaker & Leather Footwear Spa</option>
                  <option value="Curtains & Home Linen">Curtains, Quilts & Blankets</option>
                  <option value="Full House Mix">Mixed Laundry & Dry Clean Assortment</option>
                </select>
              </div>

              {/* Date & Time Row */}
              <div className="modal-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#133857', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="#38b249" />
                    <span>Pickup Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      outline: 'none',
                      color: '#133857',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#133857', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="#38b249" />
                    <span>Preferred Slot</span>
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      color: '#133857',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <option value="Morning (8:00 AM - 11:00 AM)">Morning (8 - 11 AM)</option>
                    <option value="Afternoon (12:00 PM - 3:00 PM)">Afternoon (12 - 3 PM)</option>
                    <option value="Evening (4:00 PM - 7:00 PM)">Evening (4 - 7 PM)</option>
                    <option value="Night (7:00 PM - 9:00 PM)">Night (7 - 9 PM)</option>
                  </select>
                </div>
              </div>

              {/* Contact Details */}
              <div className="modal-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#133857', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} color="#38b249" />
                    <span>Your Full Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#133857', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} color="#38b249" />
                    <span>WhatsApp Mobile</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Address & Pincode */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#133857', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#38b249" />
                  <span>Doorstep Pickup Address & Flat No.</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Flat / Villa No., Apartment Name, Street, Landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#133857', marginBottom: '8px', display: 'block' }}>
                  Pincode
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="6-digit Pincode (e.g. 560038)"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '16px',
                  fontWeight: 800,
                  borderRadius: '14px',
                  marginTop: '8px',
                }}
              >
                <Sparkles size={18} />
                <span>Confirm Pickup Request</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                <ShieldCheck size={14} color="#38b249" />
                <span>No advance payment needed. Pay after garment inspection & delivery.</span>
              </div>
            </form>
          ) : (
            /* Step 2: Confirmation Screen */
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#ebf8ee',
                  color: '#38b249',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  boxShadow: '0 8px 24px rgba(56, 178, 73, 0.25)',
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#133857', marginBottom: '8px' }}>
                Pickup Scheduled Successfully!
              </h3>

              <p style={{ fontSize: '14px', color: '#536e82', marginBottom: '24px', lineHeight: 1.6 }}>
                Thank you <strong style={{ color: '#133857' }}>{name}</strong>! Your doorstep collection captain will arrive during your selected time slot.
              </p>

              {/* Booking Summary Box */}
              <div
                style={{
                  backgroundColor: '#f8fbfe',
                  borderRadius: '18px',
                  padding: '20px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'left',
                  marginBottom: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                  <span style={{ color: '#64748b' }}>Booking ID:</span>
                  <span style={{ fontWeight: 800, color: '#133857' }}>{bookingId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                  <span style={{ color: '#64748b' }}>Service:</span>
                  <span style={{ fontWeight: 700, color: '#38b249' }}>{service}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                  <span style={{ color: '#64748b' }}>Date & Slot:</span>
                  <span style={{ fontWeight: 600, color: '#133857' }}>{date} ({timeSlot})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                  <span style={{ color: '#64748b' }}>Address:</span>
                  <span style={{ fontWeight: 600, color: '#133857', maxWidth: '240px', textAlign: 'right' }}>
                    {address} (Pincode: {pincode})
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a
                  href={`https://wa.me/919265588226?text=Hi%20Glamour%20Dry,%20I%20have%20scheduled%20pickup%20booking%20${bookingId}%20for%20${name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{
                    padding: '13px',
                    fontSize: '14.5px',
                    fontWeight: 700,
                    borderRadius: '12px',
                    backgroundColor: '#15803d',
                  }}
                >
                  <span>Track / Chat on WhatsApp</span>
                </a>

                <button
                  onClick={handleReset}
                  className="btn-outline"
                  style={{
                    padding: '12px',
                    fontSize: '14px',
                    borderRadius: '12px',
                  }}
                >
                  <span>Close Window</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 500px) {
          .modal-two-col {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}

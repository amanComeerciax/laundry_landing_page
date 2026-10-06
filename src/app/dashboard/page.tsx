'use client';

import React, { useState, useEffect } from 'react';
import { useUser, useAuth, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  CreditCard, 
  LifeBuoy,
  Clock, 
  CheckCircle2, 
  Truck, 
  Shirt,
  ChevronRight, 
  Search,
  Plus,
  Bell,
  Star,
  Activity,
  LogOut,
  Calendar,
  Trash2,
  X,
  Leaf,
  Wind,
  Menu
} from 'lucide-react';
import Image from 'next/image';

export default function UserDashboardPage() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({ label: 'Home', address: '', phone: '', notes: '' });

  // Order Details Modal State
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<{id: string, message: string, read: boolean}[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Booking State
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: '',
    serviceName: '',
    servicePrice: 0,
    pickupDate: '',
    pickupTime: '',
    address: '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    // Handle redirect from /book
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('tab') === 'book') {
      setActiveTab('book');
    }
  }, []);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    } else if (isSignedIn) {
      // Fetch Orders
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => { if (data.success) setOrders(data.orders); })
        .catch(err => console.error(err))
        .finally(() => setIsLoadingOrders(false));
        
      // Fetch Services
      fetch('/api/services')
        .then(res => res.json())
        .then(data => { if (data.success) setServices(data.services); })
        .catch(err => console.error(err));
        
      // Fetch Addresses
      fetchAddresses();

      // Setup Socket.io connection
      const socket = io({
        path: '/socket.io/',
      });

      socket.on('connect', () => {
        socket.emit('join_user_room', user?.id);
      });

      socket.on('order_updated', (updatedOrder) => {
        const msg = `Order ${updatedOrder.orderId} status updated to: ${updatedOrder.status}`;
        // Show Toast Notification
        toast.success(msg);
        
        // Add to Notifications Bell
        setNotifications(prev => [{ id: Date.now().toString(), message: msg, read: false }, ...prev]);

        // Refetch orders to get latest status
        fetch('/api/orders')
          .then(res => res.json())
          .then(data => { if (data.success) setOrders(data.orders); });
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [isLoaded, isSignedIn, router, user?.id]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/addresses');
      const data = await res.json();
      if (data.success) setAddresses(data.addresses);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddressForm)
      });
      if (res.ok) {
        fetchAddresses();
        setIsAddressModalOpen(false);
        setNewAddressForm({ label: 'Home', address: '', phone: '', notes: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Delete this address?')) return;
    try {
      const res = await fetch(`/api/addresses?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fbfe' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#38b249', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: '#536e82', fontWeight: 600 }}>Loading your dashboard...</p>
        </div>
        <style jsx>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          customerName: user?.fullName || user?.firstName || 'Customer',
          customerEmail: user?.primaryEmailAddress?.emailAddress || 'No email',
          service: formData.serviceName || 'Wash & Fold / Dry Clean', 
          itemsSummary: 'Standard Booking',
          totalAmount: formData.servicePrice || 0 
        })
      });
      
      if (res.ok) {
        setStep(5);
        // Refresh orders
        const ordersRes = await fetch('/api/orders');
        const data = await ordersRes.json();
        if (data.success) setOrders(data.orders);
      } else {
        alert("Failed to submit order. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const bookingSteps = [
    { id: 1, name: 'Service', icon: Shirt },
    { id: 2, name: 'Schedule', icon: Calendar },
    { id: 3, name: 'Address', icon: MapPin },
    { id: 4, name: 'Confirm', icon: CheckCircle2 },
  ];

  const activeOrder = orders.find(o => o.status !== 'completed');
  const pastOrders = orders.filter(o => o.status === 'completed');
  const totalSpent = pastOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pickup': return 1;
      case 'processing': return 2;
      case 'delivery': return 3;
      case 'completed': return 4;
      default: return 1;
    }
  };

  const currentStep = getStatusStep(activeOrder?.status || 'pickup');

  // Sidebar Menu Items
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'support', label: 'Support', icon: LifeBuoy },
  ];

  return (
    <div className="dashboard-layout">
      
      {/* ---------------- SIDEBAR ---------------- */}
      <div className={`sidebar-overlay ${isMobileMenuOpen ? 'mobile-open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      <aside className={`dashboard-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#e6f7eb', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#38b249' }}>
            <SparklesIcon />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#133857', letterSpacing: '-0.5px' }}>Eco<span style={{ color: '#38b249' }}>Dry</span></h2>
        </div>

        <nav style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: activeTab === item.id ? '#38b249' : 'transparent',
                color: activeTab === item.id ? '#ffffff' : '#536e82',
                fontWeight: activeTab === item.id ? 700 : 600,
                fontSize: '15px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== item.id) {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.color = '#133857';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#536e82';
                }
              }}
            >
              <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <UserButton appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ fontWeight: 700, color: '#133857', fontSize: '14px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.firstName || 'User'}
              </p>
              <p style={{ color: '#64748b', fontSize: '12px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="dashboard-main">
        
        {/* Top Header */}
        <header className="dashboard-header" style={{ backgroundColor: '#f4f7fb', position: 'sticky', top: 0, zIndex: 5, backdropFilter: 'blur(8px)' }}>
          <div className="dashboard-header-top">
            <button className="dashboard-mobile-toggle" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#133857' }}>
              {activeTab === 'overview' && `Welcome back, ${user?.firstName}! 👋`}
              {activeTab === 'orders' && 'My Orders'}
              {activeTab === 'addresses' && 'Saved Addresses'}
              {activeTab === 'payments' && 'Payment Methods'}
              {activeTab === 'support' && 'Help & Support'}
              {activeTab === 'book' && 'Book a Pickup'}
            </h1>
            <p style={{ color: '#536e82', marginTop: '6px', fontSize: '15px' }}>
              {activeTab === 'overview' && 'Here is what’s happening with your laundry today.'}
              {activeTab === 'orders' && 'Track and manage your past and active bookings.'}
              {activeTab === 'book' && 'Schedule a new pickup right from your dashboard.'}
            </p>
            </div>
          </div>

          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) {
                  // mark all as read
                  setNotifications(prev => prev.map(n => ({...n, read: true})));
                }
              }} 
              style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#536e82', cursor: 'pointer', position: 'relative' }}
            >
              <Bell size={20} />
              {notifications.some(n => !n.read) && (
                <span style={{ position: 'absolute', top: '10px', right: '12px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid #ffffff' }}></span>
              )}
            </button>
            
            {showNotifications && (
              <div style={{ position: 'absolute', top: '56px', right: '180px', width: '320px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', zIndex: 100, overflow: 'hidden' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontWeight: 700, color: '#133857' }}>Notifications</h4>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>No new notifications</div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', backgroundColor: notif.read ? '#ffffff' : '#f0fdf4' }}>
                        <p style={{ fontSize: '14px', color: '#0f172a', fontWeight: notif.read ? 500 : 600 }}>{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <button onClick={() => { setActiveTab('book'); setStep(1); }} className="btn-primary" style={{ padding: '12px 24px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 20px rgba(56,178,73,0.25)' }}>
              <Plus size={18} /> New Booking
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Stats Row */}
              <div className="dashboard-stats-grid">
                <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#f0fdf4', color: '#22c55e', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Activity size={28} /></div>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Active Pickups</p>
                    <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>{activeOrder ? '1' : '0'}</h3>
                  </div>
                </div>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Package size={28} /></div>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Total Orders</p>
                    <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>{orders.length}</h3>
                  </div>
                </div>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Star size={28} /></div>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Reward Points</p>
                    <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>{Math.floor(totalSpent / 10)}</h3>
                  </div>
                </div>
              </div>

              {/* Eco Impact Banner */}
              <div className="eco-impact-banner">
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Leaf size={28} /> Your Eco Impact
                  </h3>
                  <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '400px', lineHeight: '1.5' }}>By choosing Glamour Dry, you've helped save water and reduce carbon emissions compared to traditional laundry services.</p>
                </div>
                <div className="eco-impact-stats">
                  <div>
                    <h4 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', marginBottom: '4px' }}>{orders.length * 15}L</h4>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)' }}>Water Saved</p>
                  </div>
                  <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.3)' }}></div>
                  <div>
                    <h4 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', marginBottom: '4px' }}>{orders.length > 0 ? (orders.length * 1.2).toFixed(1) : '0'}kg</h4>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)' }}>CO₂ Reduced</p>
                  </div>
                </div>
              </div>

              {/* Two Column Layout for Quick Actions & Recent Orders */}
              <div className="dashboard-two-col">
                {/* Quick Actions */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#133857', marginBottom: '24px' }}>Quick Actions</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <button onClick={() => { setActiveTab('book'); setStep(1); }} style={{ padding: '16px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.2s' }} className="hover-card">
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Shirt size={24} /></div>
                      <div style={{ textAlign: 'left' }}>
                        <h4 style={{ fontWeight: 700, color: '#0f172a', fontSize: '16px', marginBottom: '4px' }}>Schedule Wash & Fold</h4>
                        <p style={{ color: '#64748b', fontSize: '13px' }}>Standard 48hr delivery</p>
                      </div>
                    </button>

                    <button onClick={() => { setActiveTab('book'); setStep(1); }} style={{ padding: '16px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.2s' }} className="hover-card">
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f0fdf4', color: '#22c55e', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Wind size={24} /></div>
                      <div style={{ textAlign: 'left' }}>
                        <h4 style={{ fontWeight: 700, color: '#0f172a', fontSize: '16px', marginBottom: '4px' }}>Premium Dry Cleaning</h4>
                        <p style={{ color: '#64748b', fontSize: '13px' }}>Delicate care for special items</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Recent Orders */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#133857' }}>Recent Orders</h3>
                    <button onClick={() => setActiveTab('orders')} style={{ color: '#3b82f6', fontWeight: 700, fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
                  </div>
                  
                  {orders.length === 0 ? (
                    <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '16px' }}>
                      <p style={{ color: '#64748b', fontSize: '14px' }}>No recent orders.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.orderId} onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true); setActiveTab('orders'); }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s' }} className="hover-card">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b' }}>
                              {order.status === 'completed' ? <CheckCircle2 size={24} color="#22c55e" /> : <Clock size={24} color="#3b82f6" />}
                            </div>
                            <div>
                              <h4 style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px', marginBottom: '4px' }}>{order.service}</h4>
                              <p style={{ color: '#64748b', fontSize: '12px' }}>{new Date(order.createdAt).toLocaleDateString()} • {order.orderId}</p>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                             <span style={{ 
                                padding: '4px 10px', 
                                borderRadius: '6px', 
                                fontSize: '10px', 
                                fontWeight: 700, 
                                textTransform: 'uppercase',
                                backgroundColor: order.status === 'completed' ? '#f0fdf4' : '#eff6ff',
                                color: order.status === 'completed' ? '#166534' : '#1e40af',
                                display: 'inline-block',
                                marginBottom: '6px'
                              }}>
                                {order.status}
                              </span>
                              <p style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>₹{order.totalAmount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
             <div>
               <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                 <button style={{ padding: '10px 20px', borderRadius: '99px', backgroundColor: '#133857', color: '#ffffff', fontWeight: 600, fontSize: '14px', border: 'none' }}>All Orders</button>
                 <button style={{ padding: '10px 20px', borderRadius: '99px', backgroundColor: '#ffffff', color: '#64748b', fontWeight: 600, fontSize: '14px', border: '1px solid #e2e8f0' }}>Active</button>
                 <button style={{ padding: '10px 20px', borderRadius: '99px', backgroundColor: '#ffffff', color: '#64748b', fontWeight: 600, fontSize: '14px', border: '1px solid #e2e8f0' }}>Completed</button>
               </div>

               {orders.length === 0 ? (
                 <div style={{ padding: '60px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                   <p style={{ color: '#64748b' }}>No orders found.</p>
                 </div>
               ) : (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                   {orders.map((order) => (
                     <div key={order.orderId} onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true); }} style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s', cursor: 'pointer' }} className="hover-card">
                       <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                         <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b' }}>
                           {order.status === 'completed' ? <CheckCircle2 size={30} color="#22c55e" /> : <Clock size={30} color="#3b82f6" />}
                         </div>
                         <div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                             <h4 style={{ fontWeight: 800, color: '#0f172a', fontSize: '18px' }}>{order.service}</h4>
                             <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 700 }}>{order.orderId}</span>
                             <span style={{ 
                               padding: '4px 10px', 
                               borderRadius: '6px', 
                               fontSize: '11px', 
                               fontWeight: 700, 
                               textTransform: 'uppercase',
                               backgroundColor: order.status === 'completed' ? '#f0fdf4' : '#eff6ff',
                               color: order.status === 'completed' ? '#166534' : '#1e40af'
                             }}>
                               {order.status}
                             </span>
                           </div>
                           <p style={{ color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                             {new Date(order.createdAt).toLocaleDateString()}
                           </p>
                         </div>
                       </div>
                       
                       <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                         <div style={{ textAlign: 'right' }}>
                           <p style={{ color: '#64748b', fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>Total Amount</p>
                           <p style={{ fontWeight: 800, color: '#0f172a', fontSize: '18px' }}>₹{order.totalAmount}</p>
                         </div>
                         <button 
                           onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true); }}
                           style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'transparent', color: '#536e82', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                           onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#133857'; }}
                           onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#536e82'; }}
                         >
                           View Details
                         </button>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#133857' }}>My Saved Addresses</h3>
                <button onClick={() => setIsAddressModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#38b249', color: '#fff', borderRadius: '10px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  <Plus size={18} /> Add New
                </button>
              </div>

              {addresses.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <MapPin size={48} color="#cbd5e1" style={{ margin: '0 auto 16px auto' }} />
                  <p style={{ color: '#64748b', fontWeight: 500 }}>No saved addresses found.</p>
                </div>
              ) : (
                <div className="grid-2" style={{ gap: '16px' }}>
                  {addresses.map(addr => (
                    <div key={addr._id} style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <span style={{ padding: '4px 10px', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>{addr.label}</span>
                        <button onClick={() => handleDeleteAddress(addr._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      </div>
                      <p style={{ color: '#0f172a', fontWeight: 600, fontSize: '15px', marginBottom: '8px', lineHeight: '1.5' }}>{addr.address}</p>
                      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>📞 {addr.phone}</p>
                      {addr.notes && <p style={{ color: '#64748b', fontSize: '13px' }}><em>Note: {addr.notes}</em></p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* OTHER TABS (Placeholders) */}
          {(activeTab === 'payments' || activeTab === 'support') && (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '60px', textAlign: 'center', border: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', color: '#94a3b8' }}>
                <Activity size={36} />
              </div>
              <h4 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Coming Soon</h4>
              <p style={{ color: '#64748b', maxWidth: '300px' }}>This feature is currently under development. Check back later!</p>
            </div>
          )}

          {/* BOOKING TAB */}
          {activeTab === 'book' && (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {step < 5 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '24px', left: '0', right: '0', height: '2px', backgroundColor: '#e2e8f0', zIndex: 0 }} />
                  <div style={{ position: 'absolute', top: '24px', left: '0', height: '2px', backgroundColor: '#38b249', zIndex: 1, width: `${((step - 1) / (bookingSteps.length - 1)) * 100}%`, transition: 'width 0.4s ease' }} />
                  
                  {bookingSteps.map((s, i) => (
                    <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, gap: '8px' }}>
                      <div style={{ 
                        width: '48px', height: '48px', borderRadius: '50%', 
                        backgroundColor: step >= s.id ? '#38b249' : '#ffffff',
                        border: step >= s.id ? 'none' : '2px solid #e2e8f0',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        color: step >= s.id ? '#ffffff' : '#cbd5e1',
                        transition: 'all 0.3s ease'
                      }}>
                        <s.icon size={20} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: step >= s.id ? '#133857' : '#94a3b8' }}>
                        {s.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '40px', boxShadow: '0 12px 40px rgba(19, 56, 87, 0.05)', border: '1px solid #f1f5f9' }}>
                {step === 1 && (
                  <div className="step-content">
                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#133857', marginBottom: '24px' }}>What do you need help with?</h2>
                    
                    {services.length === 0 ? (
                      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No services available right now.</div>
                    ) : (
                      <div className="grid-2" style={{ gap: '16px', marginBottom: '32px' }}>
                        {services.map(service => (
                          <div 
                            key={service._id} 
                            onClick={() => setFormData({...formData, serviceId: service._id, serviceName: service.title, servicePrice: service.price})}
                            style={{ 
                              padding: '24px', 
                              borderRadius: '16px', 
                              border: `2px solid ${formData.serviceId === service._id ? '#38b249' : '#e2e8f0'}`, 
                              backgroundColor: formData.serviceId === service._id ? 'rgba(56,178,73,0.05)' : '#ffffff',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                              <h4 style={{ fontWeight: 700, color: '#133857', fontSize: '16px' }}>{service.title}</h4>
                              {service.popular && <span style={{ backgroundColor: '#fef3c7', color: '#d97706', fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>Popular</span>}
                            </div>
                            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>{service.description}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontWeight: 800, color: '#38b249', fontSize: '16px' }}>₹{service.price}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <button onClick={() => setStep(2)} disabled={!formData.serviceId} className="btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 700, opacity: (!formData.serviceId) ? 0.5 : 1 }}>Continue to Schedule</button>
                  </div>
                )}
                {step === 2 && (
                  <div className="step-content">
                    <button onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '24px' }}>Back</button>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#133857', marginBottom: '24px' }}>When should we arrive?</h2>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#133857', marginBottom: '8px' }}>Select Date</label>
                      <input type="date" value={formData.pickupDate} onChange={e => setFormData({...formData, pickupDate: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '16px' }} />
                    </div>
                    <div style={{ marginBottom: '32px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#133857', marginBottom: '8px' }}>Select Time Slot</label>
                      <div className="grid-2" style={{ gap: '12px' }}>
                        {['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM', '05:00 PM - 08:00 PM'].map(time => (
                          <div key={time} style={{ padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', textAlign: 'center', cursor: 'pointer', fontSize: '14.5px', fontWeight: 500, color: formData.pickupTime === time ? '#38b249' : '#536e82', borderColor: formData.pickupTime === time ? '#38b249' : '#e2e8f0', backgroundColor: formData.pickupTime === time ? 'rgba(56,178,73,0.05)' : 'transparent' }} onClick={() => setFormData({...formData, pickupTime: time})}>
                            {time}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => setStep(3)} disabled={!formData.pickupDate || !formData.pickupTime} className="btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 700, opacity: (!formData.pickupDate || !formData.pickupTime) ? 0.5 : 1 }}>Continue to Address</button>
                  </div>
                )}
                {step === 3 && (
                  <div className="step-content">
                    <button onClick={() => setStep(2)} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '24px' }}>Back</button>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#133857', marginBottom: '24px' }}>Where are we going?</h2>
                    
                    {addresses.length > 0 && (
                      <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#133857', marginBottom: '12px' }}>Select a saved address</label>
                        <div className="grid-2" style={{ gap: '12px' }}>
                          {addresses.map(addr => (
                            <div 
                              key={addr._id}
                              onClick={() => setFormData({...formData, address: addr.address, phone: addr.phone, notes: addr.notes || ''})}
                              style={{ padding: '16px', borderRadius: '12px', border: `2px solid ${formData.address === addr.address ? '#38b249' : '#e2e8f0'}`, backgroundColor: formData.address === addr.address ? 'rgba(56,178,73,0.05)' : '#ffffff', cursor: 'pointer' }}
                            >
                              <span style={{ display: 'inline-block', padding: '2px 8px', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '4px', fontSize: '11px', fontWeight: 700, marginBottom: '8px' }}>{addr.label}</span>
                              <p style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{addr.address}</p>
                              <p style={{ fontSize: '12px', color: '#64748b' }}>{addr.phone}</p>
                            </div>
                          ))}
                        </div>
                        <div style={{ textAlign: 'center', margin: '20px 0', color: '#cbd5e1', fontSize: '14px', fontWeight: 600 }}>OR ENTER NEW ADDRESS</div>
                      </div>
                    )}

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#133857', marginBottom: '8px' }}>Pickup & Delivery Address</label>
                      <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows={3} placeholder="Full address including flat no. and landmark" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '15px', resize: 'none' }} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#133857', marginBottom: '8px' }}>Phone Number</label>
                      <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '16px' }} />
                    </div>
                    <div style={{ marginBottom: '32px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#133857', marginBottom: '8px' }}>Special Instructions (Optional)</label>
                      <input type="text" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="E.g., call upon arrival" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '15px' }} />
                    </div>
                    <button onClick={() => setStep(4)} disabled={!formData.address || !formData.phone} className="btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 700, opacity: (!formData.address || !formData.phone) ? 0.5 : 1 }}>Review Booking</button>
                  </div>
                )}
                {step === 4 && (
                  <form onSubmit={handleBookingSubmit} className="step-content">
                    <button type="button" onClick={() => setStep(3)} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '24px' }}>Back</button>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#133857', marginBottom: '24px' }}>Confirm your details</h2>
                    <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '16px' }}>
                        <div><p style={{ color: '#64748b', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Date & Time</p><p style={{ fontWeight: 700, color: '#0f172a' }}>{formData.pickupDate}<br/>{formData.pickupTime}</p></div>
                        <div style={{ textAlign: 'right' }}><p style={{ color: '#64748b', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Service</p><p style={{ fontWeight: 700, color: '#0f172a' }}>{formData.serviceName}<br/><span style={{color: '#38b249'}}>₹{formData.servicePrice}</span></p></div>
                      </div>
                      <div>
                        <p style={{ color: '#64748b', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Address</p>
                        <p style={{ fontWeight: 700, color: '#0f172a', lineHeight: '1.5' }}>{formData.address}<br/>{formData.phone}</p>
                      </div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 700 }}>
                      {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                    </button>
                  </form>
                )}
                {step === 5 && (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#22c55e', margin: '0 auto 24px auto' }}><CheckCircle2 size={40} /></div>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#133857', marginBottom: '12px' }}>Booking Confirmed!</h2>
                    <p style={{ color: '#536e82', marginBottom: '32px', fontSize: '16px' }}>Your pickup has been successfully scheduled. We will send an executive at the designated time.</p>
                    
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button onClick={() => { setActiveTab('overview'); setStep(1); }} className="btn-primary" style={{ padding: '16px 32px', borderRadius: '12px', fontSize: '16px', fontWeight: 700 }}>Go to Overview</button>
                      <a 
                        href={`https://wa.me/919265588226?text=${encodeURIComponent(`Hi Glamour Dry! I just booked a pickup.\n\n*Service:* ${formData.serviceName}\n*Date & Time:* ${formData.pickupDate} at ${formData.pickupTime}\n*Address:* ${formData.address}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: '16px 32px', borderRadius: '12px', fontSize: '16px', fontWeight: 700, backgroundColor: '#25D366', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 20px rgba(37, 211, 102, 0.3)' }}
                      >
                        Send Details via WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      <style jsx>{`
        .hover-card:hover {
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
          transform: translateY(-2px);
          border-color: #cbd5e1 !important;
        }
      `}</style>
      
      {/* ADDRESS MODAL */}
      {isAddressModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Add New Address</h2>
              <button onClick={() => setIsAddressModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleAddAddress} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Label</label>
                <select required value={newAddressForm.label} onChange={e => setNewAddressForm({...newAddressForm, label: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}>
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Full Address</label>
                <textarea required value={newAddressForm.address} onChange={e => setNewAddressForm({...newAddressForm, address: e.target.value})} rows={3} placeholder="Flat, Building, Street, Landmark" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Phone Number</label>
                <input required type="tel" value={newAddressForm.phone} onChange={e => setNewAddressForm({...newAddressForm, phone: e.target.value})} placeholder="+91" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Delivery Notes (Optional)</label>
                <input type="text" value={newAddressForm.notes} onChange={e => setNewAddressForm({...newAddressForm, notes: e.target.value})} placeholder="e.g. Ring the bell twice" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsAddressModalOpen(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: '12px', backgroundColor: '#38b249', color: '#ffffff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Save Address</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {isOrderModalOpen && selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', width: '100%', maxWidth: '500px', padding: '32px', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <button 
              onClick={() => { setIsOrderModalOpen(false); setSelectedOrder(null); }}
              style={{ position: 'absolute', top: '24px', right: '24px', backgroundColor: '#f8fafc', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#133857', marginBottom: '8px' }}>Order Details</h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>{selectedOrder.orderId} • {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
            
            {/* Tracker Line */}
            {(() => {
              let modalStep = 1;
              if (selectedOrder.status === 'in_wash') modalStep = 2;
              if (selectedOrder.status === 'out_for_delivery') modalStep = 3;
              if (selectedOrder.status === 'completed') modalStep = 4;

              return (
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '40px', marginTop: '16px' }}>
                  <div style={{ position: 'absolute', top: '20px', left: '30px', right: '30px', height: '4px', backgroundColor: '#f1f5f9', zIndex: 0, borderRadius: '4px' }} />
                  <div style={{ position: 'absolute', top: '20px', left: '30px', height: '4px', backgroundColor: '#38b249', zIndex: 1, width: `${((modalStep - 1) / 3) * 100}%`, transition: 'width 0.5s ease', borderRadius: '4px' }} />
                  
                  {[
                    { step: 1, label: 'Pickup', icon: Package },
                    { step: 2, label: 'In Wash', icon: Shirt },
                    { step: 3, label: 'Delivery', icon: Truck },
                    { step: 4, label: 'Done', icon: CheckCircle2 },
                  ].map((s) => (
                    <div key={s.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, gap: '8px' }}>
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '50%', 
                        backgroundColor: modalStep >= s.step ? '#38b249' : '#ffffff',
                        border: modalStep >= s.step ? 'none' : '3px solid #f1f5f9',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        color: modalStep >= s.step ? '#ffffff' : '#94a3b8',
                        boxShadow: modalStep === s.step ? '0 0 0 6px rgba(56, 178, 73, 0.1)' : 'none',
                      }}>
                        <s.icon size={18} strokeWidth={2.5} />
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: modalStep >= s.step ? '#0f172a' : '#94a3b8', textAlign: 'center', maxWidth: '60px' }}>
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })()}
            <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Service</span>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>{selectedOrder.service}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Status</span>
                <span style={{ 
                  padding: '4px 10px', 
                  borderRadius: '6px', 
                  fontSize: '12px', 
                  fontWeight: 700, 
                  textTransform: 'uppercase',
                  backgroundColor: selectedOrder.status === 'completed' ? '#f0fdf4' : '#eff6ff',
                  color: selectedOrder.status === 'completed' ? '#166534' : '#1e40af'
                }}>
                  {selectedOrder.status}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Pickup</span>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>{selectedOrder.pickupDate} at {selectedOrder.pickupTime}</span>
              </div>
              <div style={{ borderTop: '1px dashed #cbd5e1', margin: '16px 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Total Amount</span>
                <span style={{ color: '#38b249', fontWeight: 800, fontSize: '18px' }}>₹{selectedOrder.totalAmount}</span>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Address Details</h4>
              <div style={{ padding: '16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.5' }}>
                  {selectedOrder.address}
                </p>
                {selectedOrder.notes && (
                  <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px', fontStyle: 'italic' }}>
                    Note: {selectedOrder.notes}
                  </p>
                )}
              </div>
            </div>

            <button onClick={() => { setIsOrderModalOpen(false); setSelectedOrder(null); }} className="btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 700 }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Logo Icon
function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  );
}

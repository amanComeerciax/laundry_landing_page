'use client';

import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { LayoutDashboard, Package, Clock, Users, IndianRupee, Settings, LogOut, CheckCircle2, Trash2, Edit3, X, Tags, Plus, Bell, Menu } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'customers' | 'services'>('dashboard');
  const [orders, setOrders] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit Modal State
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});

  // Service Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [serviceForm, setServiceForm] = useState({ title: '', category: 'Wash & Fold', price: 0, description: '', popular: false });

  // Notifications State
  const [notifications, setNotifications] = useState<{id: string, message: string, read: boolean}[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const initAdmin = async () => {
      try {
        const res = await fetch('/api/admin/orders');
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        
        setIsAdminAuthenticated(true);
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
        }
        setIsLoading(false);
        
        fetchServices();
        
        // Setup Socket.io connection for Admin
        const socket = io({
          path: '/socket.io/',
        });
  
        socket.on('connect', () => {
          socket.emit('join_admin_room');
        });


      socket.on('order_created', (newOrder) => {
        const msg = `New booking received: ${newOrder.orderId}`;
        toast.success(msg);
        setNotifications(prev => [{ id: Date.now().toString(), message: msg, read: false }, ...prev]);
        // Refetch orders when a new order comes in
        fetchAdminOrders();
      });
      
      socket.on('order_updated', (updatedOrder) => {
        // Refetch orders when an order is updated (by another admin)
        fetchAdminOrders();
      });

        return () => {
          socket.disconnect();
        };
      } catch (err) {
        console.error(err);
      }
    };
    
    initAdmin();
  }, [router]);

  if (!isAdminAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #cbd5e1', borderTopColor: '#38b249', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  async function fetchServices() {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.success) setServices(data.services);
    } catch (err) {
      console.error(err);
    }
  };

  async function fetchAdminOrders() {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingOrder._id, ...editForm })
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(orders.map(o => o._id === editingOrder._id ? data.order : o));
        setEditingOrder(null);
      } else {
        alert('Failed to update order');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this order?')) return;
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setOrders(orders.filter(o => o._id !== id));
      } else {
        alert('Failed to delete order');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  const saveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/admin/services';
      const method = editingService ? 'PATCH' : 'POST';
      const body = editingService ? { id: editingService._id, ...serviceForm } : serviceForm;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        fetchServices();
        setIsServiceModalOpen(false);
        setEditingService(null);
      } else {
        alert('Failed to save service');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Delete this service permanently?')) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setServices(services.filter(s => s._id !== id));
      } else {
        alert('Failed to delete service');
      }
    } catch (err) {
      console.error(err);
    }
  };



  const activeOrders = orders.filter(o => o.status !== 'completed');
  const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Derive unique customers from orders
  const customers = Array.from(new Set(orders.map(o => o.userId))).map(id => {
    const userOrders = orders.filter(o => o.userId === id);
    const lastOrder = userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    return {
      id,
      name: lastOrder.customerName || 'Unknown Customer',
      email: lastOrder.customerEmail || 'No email',
      phone: lastOrder.phone,
      totalOrders: userOrders.length,
      totalSpent: userOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      lastOrderDate: new Date(lastOrder.createdAt).toLocaleDateString()
    };
  });

  return (
    <div className="dashboard-layout">
      
      {/* Sidebar */}
      <div className={`sidebar-overlay ${isMobileMenuOpen ? 'mobile-open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      <aside className={`dashboard-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`} style={{ backgroundColor: '#133857', color: '#ffffff' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Eco<span style={{ color: '#38b249' }}>Dry</span></h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Admin Workspace</p>
        </div>
        
        <nav style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: activeTab === 'dashboard' ? 'rgba(56,178,73,0.2)' : 'transparent', color: activeTab === 'dashboard' ? '#38b249' : '#cbd5e1', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: activeTab === 'orders' ? 'rgba(56,178,73,0.2)' : 'transparent', color: activeTab === 'orders' ? '#38b249' : '#cbd5e1', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <Package size={20} /> All Orders
          </button>
          <button 
            onClick={() => { setActiveTab('customers'); setIsMobileMenuOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: activeTab === 'customers' ? 'rgba(56,178,73,0.2)' : 'transparent', color: activeTab === 'customers' ? '#38b249' : '#cbd5e1', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <Users size={20} /> Customers
          </button>
          <button 
            onClick={() => { setActiveTab('services'); setIsMobileMenuOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: activeTab === 'services' ? 'rgba(56,178,73,0.2)' : 'transparent', color: activeTab === 'services' ? '#38b249' : '#cbd5e1', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <Tags size={20} /> Services
          </button>
        </nav>
        
        <div style={{ padding: '20px 12px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#cbd5e1', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>
            <LogOut size={20} /> Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header" style={{ paddingBottom: '32px' }}>
          <div className="dashboard-header-top">
            <button className="dashboard-mobile-toggle" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'orders' && 'All Orders'}
              {activeTab === 'customers' && 'Customers'}
              {activeTab === 'services' && 'Manage Services'}
            </h1>
            <p style={{ color: '#64748b', marginTop: '4px' }}>
              {activeTab === 'dashboard' && 'Manage bookings and track operations.'}
              {activeTab === 'orders' && 'View and manage the full history of all bookings.'}
              {activeTab === 'customers' && 'View your customer base and their activity.'}
              {activeTab === 'services' && 'Create and update the services shown on the user app.'}
            </p>
            </div>
          </div>
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) {
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
              <div style={{ position: 'absolute', top: '56px', right: '0', width: '320px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', zIndex: 100, overflow: 'hidden' }}>
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

            {activeTab === 'services' && (
              <button onClick={() => { setEditingService(null); setServiceForm({ title: '', category: 'Wash & Fold', price: 0, description: '', popular: false }); setIsServiceModalOpen(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#38b249', color: '#fff', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                <Plus size={20} /> Add Service
              </button>
            )}
          </div>
        </header>

        <div className="dashboard-content">
        {activeTab === 'dashboard' && (
          <>
            {/* Stat Cards */}
        <div className="dashboard-stats-grid" style={{ marginBottom: '40px' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Active Orders</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Clock size={20} /></div>
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>{activeOrders.length}</h2>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Total Completed</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f0fdf4', color: '#22c55e', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CheckCircle2 size={20} /></div>
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>{orders.length - activeOrders.length}</h2>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Total Revenue</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><IndianRupee size={20} /></div>
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>₹{revenue}</h2>
          </div>
        </div>

        {/* Orders Table */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Recent Bookings</h2>
          </div>
          
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading orders...</div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No bookings found.</div>
          ) : (
            <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Order ID</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Date & Time</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Address & Phone</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Service</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '20px 24px', fontWeight: 700, color: '#0f172a' }}>{order.orderId}</td>
                    <td style={{ padding: '20px 24px', color: '#475569', fontSize: '14px' }}>
                      <div style={{ fontWeight: 600 }}>{order.pickupDate}</div>
                      <div style={{ fontSize: '13px', color: '#94a3b8' }}>{order.pickupTime}</div>
                    </td>
                    <td style={{ padding: '20px 24px', color: '#475569', fontSize: '14px' }}>
                      <div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.address}</div>
                      <div style={{ fontSize: '13px', color: '#94a3b8' }}>{order.phone}</div>
                    </td>
                    <td style={{ padding: '20px 24px', color: '#475569', fontSize: '14px' }}>
                      <div style={{ fontWeight: 600 }}>{order.service}</div>
                      <div style={{ fontSize: '13px', color: '#22c55e', fontWeight: 600 }}>₹{order.totalAmount}</div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        style={{ 
                          padding: '8px 12px', 
                          borderRadius: '8px', 
                          border: '1px solid #cbd5e1', 
                          backgroundColor: order.status === 'completed' ? '#f0fdf4' : order.status === 'pickup' ? '#fffbeb' : '#eff6ff',
                          color: order.status === 'completed' ? '#166534' : order.status === 'pickup' ? '#b45309' : '#1e40af',
                          fontWeight: 600,
                          fontSize: '13px',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="pickup">Pickup Scheduled</option>
                        <option value="processing">In Wash</option>
                        <option value="delivery">Out for Delivery</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                      <button 
                        onClick={() => { setEditingOrder(order); setEditForm(order); }}
                        style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: '16px' }}
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteOrder(order._id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
        </>
        )}

        {/* ALL ORDERS TAB */}
        {activeTab === 'orders' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            {isLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading orders...</div>
            ) : orders.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No bookings found.</div>
            ) : (
              <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Order ID</th>
                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Date & Time</th>
                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Address & Phone</th>
                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Service</th>
                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '20px 24px', fontWeight: 700, color: '#0f172a' }}>{order.orderId}</td>
                      <td style={{ padding: '20px 24px', color: '#475569', fontSize: '14px' }}>
                        <div style={{ fontWeight: 600 }}>{order.pickupDate}</div>
                        <div style={{ fontSize: '13px', color: '#94a3b8' }}>{order.pickupTime}</div>
                      </td>
                      <td style={{ padding: '20px 24px', color: '#475569', fontSize: '14px' }}>
                        <div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.address}</div>
                        <div style={{ fontSize: '13px', color: '#94a3b8' }}>{order.phone}</div>
                      </td>
                      <td style={{ padding: '20px 24px', color: '#475569', fontSize: '14px' }}>
                        <div style={{ fontWeight: 600 }}>{order.service}</div>
                        <div style={{ fontSize: '13px', color: '#22c55e', fontWeight: 600 }}>₹{order.totalAmount}</div>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          style={{ 
                            padding: '8px 12px', 
                            borderRadius: '8px', 
                            border: '1px solid #cbd5e1', 
                            backgroundColor: order.status === 'completed' ? '#f0fdf4' : order.status === 'pickup' ? '#fffbeb' : '#eff6ff',
                            color: order.status === 'completed' ? '#166534' : order.status === 'pickup' ? '#b45309' : '#1e40af',
                            fontWeight: 600,
                            fontSize: '13px',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          <option value="pickup">Pickup Scheduled</option>
                          <option value="processing">In Wash</option>
                          <option value="delivery">Out for Delivery</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                        <button 
                          onClick={() => { setEditingOrder(order); setEditForm(order); }}
                          style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: '16px' }}
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteOrder(order._id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            {isLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading customers...</div>
            ) : customers.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No customers found.</div>
            ) : (
              <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Customer Details</th>
                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Total Orders</th>
                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Total Spent</th>
                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Last Order Date</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '20px 24px', color: '#0f172a', fontSize: '14px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{customer.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{customer.email}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{customer.phone}</div>
                      </td>
                      <td style={{ padding: '20px 24px', fontWeight: 700, color: '#0f172a' }}>{customer.totalOrders}</td>
                      <td style={{ padding: '20px 24px', color: '#22c55e', fontWeight: 700 }}>₹{customer.totalSpent}</td>
                      <td style={{ padding: '20px 24px', color: '#475569', fontSize: '14px' }}>{customer.lastOrderDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            {services.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No services configured. Click "Add Service" to start.</div>
            ) : (
              <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Service Details</th>
                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Category</th>
                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Price</th>
                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '20px 24px', color: '#0f172a', fontSize: '14px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {service.title}
                          {service.popular && <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#fef3c7', color: '#d97706', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Popular</span>}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{service.description}</div>
                      </td>
                      <td style={{ padding: '20px 24px', fontWeight: 600, color: '#475569' }}>
                        <span style={{ padding: '6px 12px', backgroundColor: '#f1f5f9', borderRadius: '8px', fontSize: '12px' }}>{service.category}</span>
                      </td>
                      <td style={{ padding: '20px 24px', color: '#22c55e', fontWeight: 700 }}>₹{service.price}</td>
                      <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                        <button 
                          onClick={() => { setEditingService(service); setServiceForm(service); setIsServiceModalOpen(true); }}
                          style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: '16px' }}
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteService(service._id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        )}
        </div>
      </main>

      {/* EDIT MODAL */}
      {editingOrder && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Edit Order: {editingOrder.orderId}</h2>
              <button onClick={() => setEditingOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleEditSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Pickup Date</label>
                <input type="date" value={editForm.pickupDate || ''} onChange={e => setEditForm({...editForm, pickupDate: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Pickup Time</label>
                <input type="text" value={editForm.pickupTime || ''} onChange={e => setEditForm({...editForm, pickupTime: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Address</label>
                <textarea value={editForm.address || ''} onChange={e => setEditForm({...editForm, address: e.target.value})} rows={3} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Phone</label>
                <input type="text" value={editForm.phone || ''} onChange={e => setEditForm({...editForm, phone: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Total Amount (₹)</label>
                <input type="number" value={editForm.totalAmount || 0} onChange={e => setEditForm({...editForm, totalAmount: Number(e.target.value)})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setEditingOrder(null)} style={{ flex: 1, padding: '14px', borderRadius: '12px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: '12px', backgroundColor: '#38b249', color: '#ffffff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SERVICE MODAL */}
      {isServiceModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
              <button onClick={() => setIsServiceModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
            </div>
            
            <form onSubmit={saveService} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Service Title</label>
                <input required type="text" value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} placeholder="e.g. Premium Dry Cleaning" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Category</label>
                <select required value={serviceForm.category} onChange={e => setServiceForm({...serviceForm, category: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}>
                  <option value="Wash & Fold">Wash & Fold</option>
                  <option value="Dry Cleaning">Dry Cleaning</option>
                  <option value="Ironing">Ironing</option>
                  <option value="Special Care">Special Care</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Price (₹)</label>
                <input required type="number" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: Number(e.target.value)})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Description</label>
                <textarea required value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} rows={3} placeholder="Describe the service..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'none' }} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#0f172a', marginTop: '8px' }}>
                <input type="checkbox" checked={serviceForm.popular} onChange={e => setServiceForm({...serviceForm, popular: e.target.checked})} style={{ width: '20px', height: '20px' }} />
                Mark as "Popular" (Highlights it for users)
              </label>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsServiceModalOpen(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: '12px', backgroundColor: '#38b249', color: '#ffffff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

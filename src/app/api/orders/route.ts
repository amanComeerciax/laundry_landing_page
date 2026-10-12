import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { getAuth } from '@clerk/nextjs/server';
import { sendBookingNotificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const data = await req.json();
    
    // Generate a simple Order ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `GD-${randomNum}`;
    
    const newOrder = await Order.create({
      ...data,
      userId,
      orderId,
      status: 'pickup',
      paymentMethod: data.paymentMethod || 'cod',
      paymentStatus: data.paymentStatus || (data.paymentMethod === 'online' ? 'paid' : 'pending'),
      razorpayPaymentId: data.razorpayPaymentId || '',
      razorpayOrderId: data.razorpayOrderId || '',
    });

    // Call internal webhook to emit socket event
    fetch('http://localhost:3000/_internal/emit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'order_created', payload: newOrder })
    }).catch(err => console.error('Webhook error:', err));

    // Send email notification via Resend
    sendBookingNotificationEmail({
      orderId,
      customerName: data.customerName,
      customerPhone: data.phone,
      customerEmail: data.email,
      service: data.service,
      totalAmount: data.totalAmount,
      pickupDate: data.pickupDate,
      pickupTime: data.pickupTime,
      address: data.address,
      notes: data.notes,
      paymentMethod: data.paymentMethod || 'cod'
    }).catch(err => console.error('[Resend] Booking email error:', err));

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Fetch user's orders, sorted by newest first
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error: any) {
    console.error('Order fetching error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { orderId, pickupDate, pickupTime } = await req.json();

    if (!orderId || !pickupDate || !pickupTime) {
      return NextResponse.json({ error: 'orderId, pickupDate and pickupTime are required' }, { status: 400 });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId, userId },
      { $set: { pickupDate, pickupTime } },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Call internal webhook
    fetch('http://localhost:3000/_internal/emit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'order_updated', payload: updatedOrder })
    }).catch(err => console.error('Webhook error:', err));

    return NextResponse.json({ success: true, order: updatedOrder }, { status: 200 });
  } catch (error: any) {
    console.error('Order reschedule error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

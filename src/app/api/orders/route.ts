import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { sendAllBookingEmails } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const data = await req.json();

    // Validate that pickupDate is not in the past
    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (data.pickupDate && data.pickupDate < todayStr) {
      return NextResponse.json({ error: 'Pickup date cannot be in the past' }, { status: 400 });
    }

    // Resolve customer email and name (from payload, or directly from Clerk user if missing)
    let customerEmail = data.customerEmail || data.email;
    let customerName = data.customerName;

    if (!customerEmail || customerEmail === 'No email') {
      try {
        const client = typeof clerkClient === 'function' ? await (clerkClient as any)() : clerkClient;
        const clerkUser = await client.users.getUser(userId);
        if (clerkUser) {
          customerEmail = clerkUser.emailAddresses?.find((e: any) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress 
            || clerkUser.emailAddresses?.[0]?.emailAddress;
          if (!customerName || customerName === 'Customer') {
            customerName = clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : 'Customer';
          }
        }
      } catch (err) {
        console.error('[Orders API] Clerk user lookup error:', err);
      }
    }
    
    // Generate a simple Order ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `GD-${randomNum}`;
    
    const newOrder = await Order.create({
      ...data,
      userId,
      orderId,
      customerName: customerName || data.customerName || 'Customer',
      customerEmail: customerEmail || data.customerEmail || 'No email',
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

    // Send both Admin notification & Customer confirmation emails via Resend
    sendAllBookingEmails({
      orderId,
      customerName: customerName || data.customerName,
      customerPhone: data.phone,
      customerEmail: customerEmail,
      service: data.service,
      totalAmount: data.totalAmount,
      pickupDate: data.pickupDate,
      pickupTime: data.pickupTime,
      address: data.address,
      notes: data.notes,
      paymentMethod: data.paymentMethod || 'cod'
    }).then(results => {
      console.log('[Orders API] Booking email dispatch result:', results);
    }).catch(err => console.error('[Orders API] Booking email error:', err));

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

    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (pickupDate < todayStr) {
      return NextResponse.json({ error: 'Rescheduled date cannot be in the past' }, { status: 400 });
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

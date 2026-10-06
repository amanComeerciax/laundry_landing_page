import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { cookies } from 'next/headers';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (token !== 'secure_admin_session_123') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    
    // In a real app, verify if userId is an admin here
    
    // Fetch all orders
    const orders = await Order.find({}).sort({ createdAt: -1 });

    // Fetch live user data directly from Clerk
    const uniqueUserIds = Array.from(new Set(orders.map(o => o.userId)));
    let clerkUsers: any[] = [];
    
    try {
      // Support for both Clerk v4 and v5 exports
      const client = typeof clerkClient === 'function' ? await (clerkClient as any)() : clerkClient;
      if (uniqueUserIds.length > 0) {
        const userList = await client.users.getUserList({ userId: uniqueUserIds });
        clerkUsers = userList.data || userList; // Handles different Clerk SDK response structures
      }
    } catch (e) {
      console.error("Failed to fetch Clerk users:", e);
    }

    // Map Clerk data to orders
    const enrichedOrders = orders.map(order => {
      const o = order.toObject();
      const clerkUser = clerkUsers.find(u => u.id === o.userId);
      if (clerkUser) {
        o.customerName = clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : 'Customer';
        o.customerEmail = clerkUser.emailAddresses?.[0]?.emailAddress || o.customerEmail || 'No email';
      }
      return o;
    });

    return NextResponse.json({ success: true, orders: enrichedOrders }, { status: 200 });
  } catch (error: any) {
    console.error('Admin order fetching error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (token !== 'secure_admin_session_123') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    
    const body = await req.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (updatedOrder) {
      // Call internal webhook to emit socket event
      fetch('http://localhost:3000/_internal/emit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'order_updated', userId: updatedOrder.userId, payload: updatedOrder })
      }).catch(err => console.error('Webhook error:', err));
    }

    return NextResponse.json({ success: true, order: updatedOrder }, { status: 200 });
  } catch (error: any) {
    console.error('Admin order update error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (token !== 'secure_admin_session_123') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    await Order.findByIdAndDelete(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Admin order deletion error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

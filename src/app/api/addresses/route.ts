import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Address } from '@/models/Address';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const addresses = await Address.find({ userId }).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, addresses }, { status: 200 });
  } catch (error: any) {
    console.error('Address fetching error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    
    const body = await req.json();
    const newAddress = await Address.create({ ...body, userId });
    
    return NextResponse.json({ success: true, address: newAddress }, { status: 201 });
  } catch (error: any) {
    console.error('Address creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await Address.findOneAndDelete({ _id: id, userId });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Address deletion error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

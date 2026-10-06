import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Service } from '@/models/Service';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const services = await Service.find({}).sort({ category: 1, title: 1 });
    return NextResponse.json({ success: true, services }, { status: 200 });
  } catch (error: any) {
    console.error('Service fetching error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

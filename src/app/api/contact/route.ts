import { NextRequest, NextResponse } from 'next/server';
import { sendInquiryEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, service, message } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone number are required.' },
        { status: 400 }
      );
    }

    const rawPhone = String(phone || '').trim();
    const cleanPhone = rawPhone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
    if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit Indian mobile number.' },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(String(email).trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const emailResult = await sendInquiryEmail({
      name,
      phone,
      email: email || undefined,
      service: service || 'General Inquiry',
      message: message || undefined,
    });

    if (!emailResult.success) {
      console.warn('[Contact API] Email sending had an issue:', emailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry received successfully! Our team will contact you shortly.',
      emailSent: emailResult.success,
    });
  } catch (error: any) {
    console.error('[Contact API] Error handling inquiry:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

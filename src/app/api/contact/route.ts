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

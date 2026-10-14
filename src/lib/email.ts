import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const resendApiKey = process.env.RESEND_API_KEY || '';
const adminEmail = process.env.ADMIN_EMAIL || 'memonljku@gmail.com';
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Glamour Dry <onboarding@resend.dev>';
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://laundry-landing-page-kappa.vercel.app';

export const resend = new Resend(resendApiKey);

// Setup Gmail / Custom SMTP Transporter
const transporter = (smtpUser && smtpPass)
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser.trim(),
        pass: smtpPass.replace(/\s+/g, ''),
      },
    })
  : null;

/**
 * Universal email dispatcher (tries Gmail SMTP first, falls back to Resend)
 */
async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
  headers,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  headers?: Record<string, string>;
}) {
  // 1. Try Gmail SMTP (delivers to all customer emails without domain restriction)
  if (transporter && smtpUser) {
    try {
      const info = await transporter.sendMail({
        from: `"Glamour Dry" <${smtpUser}>`,
        to,
        subject,
        text: text || '',
        html,
        replyTo: replyTo || smtpUser,
        headers: {
          'X-Entity-Ref-ID': Date.now().toString(),
          ...headers,
        },
      });
      console.log(`[Email Service] Sent via Gmail SMTP to ${to} (ID: ${info.messageId})`);
      return { success: true, data: info };
    } catch (smtpError: any) {
      console.warn(`[Email Service] SMTP send failed for ${to}, falling back to Resend:`, smtpError?.message);
    }
  }

  // 2. Fallback to Resend
  if (resendApiKey) {
    try {
      const response = await resend.emails.send({
        from: fromEmail,
        to,
        replyTo: replyTo || undefined,
        subject,
        text: text || undefined,
        html,
        headers,
      });

      if (response.error) {
        console.warn(`[Email Service] Resend send notice for ${to}:`, response.error);
        return { success: false, error: response.error };
      }
      console.log(`[Email Service] Sent via Resend to ${to} (ID: ${response.data?.id})`);
      return { success: true, data: response.data };
    } catch (resendError: any) {
      console.error(`[Email Service] Resend exception for ${to}:`, resendError);
      return { success: false, error: resendError?.message || 'Failed to send email' };
    }
  }

  return { success: false, error: 'No email service configured (SMTP or Resend)' };
}

export interface InquiryData {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message?: string;
}

export interface BookingEmailData {
  orderId: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  service: string;
  totalAmount: number;
  pickupDate: string;
  pickupTime: string;
  address: string;
  notes?: string;
  paymentMethod?: string;
}

/**
 * Send customer inquiry email notification to admin
 */
export async function sendInquiryEmail(data: InquiryData) {
  try {
    const formattedDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7fb; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
          .header { background: #133857; padding: 32px 28px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
          .header p { margin: 6px 0 0; color: #94a3b8; font-size: 14px; }
          .badge { display: inline-block; background: rgba(56, 178, 73, 0.2); color: #38b249; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; margin-top: 10px; }
          .content { padding: 32px 28px; }
          .field-group { margin-bottom: 20px; }
          .field-label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-bottom: 4px; }
          .field-value { font-size: 16px; font-weight: 600; color: #0f172a; }
          .field-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-top: 6px; font-size: 14.5px; line-height: 1.6; color: #334155; }
          .btn-container { margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; gap: 12px; }
          .btn { display: inline-block; padding: 12px 22px; border-radius: 10px; font-weight: 700; font-size: 14px; text-decoration: none; text-align: center; }
          .btn-primary { background: #38b249; color: #ffffff; }
          .btn-secondary { background: #133857; color: #ffffff; }
          .footer { background: #f8fafc; padding: 20px 28px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Glamour Dry</h1>
            <p>New Customer Inquiry Received</p>
            <span class="badge">Inquiry • ${formattedDate}</span>
          </div>
          <div class="content">
            <div class="field-group">
              <div class="field-label">Customer Name</div>
              <div class="field-value">${data.name}</div>
            </div>

            <div class="field-group">
              <div class="field-label">Phone Number</div>
              <div class="field-value"><a href="tel:${data.phone}" style="color: #38b249; text-decoration: none; font-weight: 700;">${data.phone}</a></div>
            </div>

            ${data.email ? `
            <div class="field-group">
              <div class="field-label">Email Address</div>
              <div class="field-value"><a href="mailto:${data.email}" style="color: #133857; text-decoration: none;">${data.email}</a></div>
            </div>` : ''}

            ${data.service ? `
            <div class="field-group">
              <div class="field-label">Requested Service</div>
              <div class="field-value" style="color: #133857; font-weight: 700;">${data.service}</div>
            </div>` : ''}

            ${data.message ? `
            <div class="field-group">
              <div class="field-label">Customer Message / Notes</div>
              <div class="field-box">${data.message.replace(/\n/g, '<br>')}</div>
            </div>` : ''}

            <div class="btn-container">
              <a href="tel:${data.phone}" class="btn btn-primary" style="margin-right: 10px;">📞 Call Customer</a>
              ${data.email ? `<a href="mailto:${data.email}" class="btn btn-secondary">✉️ Email Customer</a>` : ''}
            </div>
          </div>
          <div class="footer">
            Glamour Dry Inquiry Notification • Sent automatically via Resend
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
New Inquiry Received - Glamour Dry
Date: ${formattedDate}

Customer Name: ${data.name}
Phone: ${data.phone}
${data.email ? `Email: ${data.email}\n` : ''}
${data.service ? `Requested Service: ${data.service}\n` : ''}
${data.message ? `Message: ${data.message}\n` : ''}
    `.trim();

    const result = await sendEmail({
      to: adminEmail,
      replyTo: data.email || undefined,
      subject: `New Inquiry from ${data.name} - Glamour Dry`,
      text,
      html,
    });

    return result;
  } catch (error: any) {
    console.error('[Email Service] Failed to send inquiry email:', error);
    return { success: false, error: error?.message || 'Failed to send email' };
  }
}

/**
 * Send booking notification email to admin
 */
export async function sendBookingNotificationEmail(data: BookingEmailData) {
  try {
    const formattedDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const cleanOrderId = data.orderId.replace(/^#/, '');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7fb; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
          .header { background: #133857; padding: 32px 28px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
          .header p { margin: 6px 0 0; color: #94a3b8; font-size: 14px; }
          .badge { display: inline-block; background: #38b249; color: #ffffff; padding: 4px 14px; border-radius: 99px; font-size: 13px; font-weight: 800; margin-top: 10px; }
          .content { padding: 32px 28px; }
          .summary-card { background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 14px; padding: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
          .order-id { font-size: 20px; font-weight: 800; color: #133857; }
          .order-amount { font-size: 22px; font-weight: 800; color: #166534; text-align: right; }
          .field-group { margin-bottom: 18px; }
          .field-label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-bottom: 4px; }
          .field-value { font-size: 15.5px; font-weight: 600; color: #0f172a; }
          .field-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; font-size: 14px; color: #334155; line-height: 1.5; }
          .footer { background: #f8fafc; padding: 20px 28px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 26px;"><span style="color: #38b249;">Glamour</span><span style="color: #ffffff;">Dry</span></h1>
            <p>Admin Notification • New Booking Received</p>
            <span class="badge">Order #${cleanOrderId}</span>
          </div>
          <div class="content">
            <div class="summary-card">
              <div>
                <div style="font-size: 12px; font-weight: 700; color: #166534; text-transform: uppercase;">Order ID</div>
                <div class="order-id">#${cleanOrderId}</div>
              </div>
              <div>
                <div style="font-size: 12px; font-weight: 700; color: #166534; text-transform: uppercase;">Total Amount</div>
                <div class="order-amount">₹${data.totalAmount}</div>
              </div>
            </div>

            <div class="field-group">
              <div class="field-label">Service</div>
              <div class="field-value">${data.service}</div>
            </div>

            <div class="field-group">
              <div class="field-label">Payment Method</div>
              <div class="field-value" style="color: ${data.paymentMethod === 'online' ? '#16a34a' : '#d97706'}; font-weight: 700;">
                ${data.paymentMethod === 'online' ? '💳 Online Payment (Razorpay - Paid)' : '💵 Cash on Delivery (COD)'}
              </div>
            </div>

            <div class="field-group">
              <div class="field-label">Pickup Schedule</div>
              <div class="field-value">📅 ${data.pickupDate} &nbsp;•&nbsp; ⏰ ${data.pickupTime}</div>
            </div>

            <div class="field-group">
              <div class="field-label">Customer Details</div>
              <div class="field-value">
                ${data.customerName || 'Customer'}<br>
                ${data.customerPhone ? `📞 <a href="tel:${data.customerPhone}" style="color: #38b249; text-decoration: none;">${data.customerPhone}</a><br>` : ''}
                ${data.customerEmail ? `✉️ <a href="mailto:${data.customerEmail}" style="color: #133857; text-decoration: none;">${data.customerEmail}</a>` : ''}
              </div>
            </div>

            <div class="field-group">
              <div class="field-label">Pickup Address</div>
              <div class="field-box">📍 ${data.address}</div>
            </div>

            ${data.notes ? `
            <div class="field-group">
              <div class="field-label">Special Notes</div>
              <div class="field-box">${data.notes}</div>
            </div>` : ''}
          </div>
          <div class="footer">
            Glamour Dry Admin Booking Notification • Received on ${formattedDate}
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
New Booking Alert - Glamour Dry
Order ID: #${cleanOrderId}
Total Amount: Rs. ${data.totalAmount} (${data.paymentMethod === 'online' ? 'Online Paid' : 'Cash on Delivery'})
Service: ${data.service}
Pickup Schedule: ${data.pickupDate} (${data.pickupTime})

Customer Name: ${data.customerName || 'Customer'}
Phone: ${data.customerPhone || 'N/A'}
Email: ${data.customerEmail || 'N/A'}
Pickup Address: ${data.address}
${data.notes ? `Special Notes: ${data.notes}\n` : ''}
Received: ${formattedDate}
    `.trim();

    const result = await sendEmail({
      to: adminEmail,
      replyTo: data.customerEmail || undefined,
      subject: `New Booking #${cleanOrderId}: ${data.service} (Rs. ${data.totalAmount})`,
      text,
      html,
    });

    return result;
  } catch (error: any) {
    console.error('[Email Service] Failed to send admin booking email:', error);
    return { success: false, error: error?.message || 'Failed to send email' };
  }
}

/**
 * Send booking confirmation email directly to the customer who booked
 */
export async function sendCustomerBookingConfirmationEmail(data: BookingEmailData) {
  try {
    if (!data.customerEmail || !data.customerEmail.includes('@') || data.customerEmail === 'No email') {
      console.log('[Resend] Skip customer email: No valid customer email provided.');
      return { success: false, error: 'No valid customer email' };
    }

    const cleanOrderId = data.orderId.replace(/^#/, '');
    const isOnline = data.paymentMethod === 'online';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7fb; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(19, 56, 87, 0.08); border: 1px solid #e2e8f0; }
          .header { background: linear-gradient(135deg, #133857 0%, #1e4b72 100%); padding: 36px 28px; text-align: center; color: #ffffff; }
          .brand-logo { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
          .brand-logo .accent { color: #38b249; }
          .header p { margin: 8px 0 0; color: #cbd5e1; font-size: 14px; font-weight: 500; }
          .status-banner { background: #f0fdf4; border-bottom: 2px solid #bbf7d0; padding: 18px 24px; text-align: center; }
          .status-badge { display: inline-flex; align-items: center; gap: 6px; background: #22c55e; color: #ffffff; padding: 6px 16px; border-radius: 99px; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
          .content { padding: 32px 28px; }
          .greeting { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
          .lead-text { font-size: 15px; color: #64748b; line-height: 1.6; margin-bottom: 24px; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 22px; margin-bottom: 20px; }
          .card-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #133857; letter-spacing: 0.8px; margin-bottom: 14px; display: flex; align-items: center; gap: 6px; }
          .details-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14.5px; }
          .details-row:last-child { border-bottom: none; }
          .row-label { color: #64748b; font-weight: 500; }
          .row-value { color: #0f172a; font-weight: 700; text-align: right; }
          .price-highlight { font-size: 20px; color: #166534; font-weight: 900; }
          .payment-pill { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; }
          .payment-online { background: #dcfce7; color: #15803d; }
          .payment-cod { background: #fef3c7; color: #b45309; }
          .steps-box { background: #ffffff; border: 1.5px dashed #cbd5e1; border-radius: 14px; padding: 18px 20px; margin: 24px 0; }
          .step-item { display: flex; gap: 12px; margin-bottom: 12px; font-size: 13.5px; line-height: 1.5; color: #334155; }
          .step-item:last-child { margin-bottom: 0; }
          .step-num { width: 22px; height: 22px; border-radius: 50%; background: #38b249; color: #fff; font-weight: 800; font-size: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
          .btn-primary { display: block; width: 100%; box-sizing: border-box; text-align: center; background: #38b249; color: #ffffff !important; padding: 16px 24px; border-radius: 12px; font-weight: 800; font-size: 15px; text-decoration: none; margin-top: 24px; box-shadow: 0 4px 14px rgba(56, 178, 73, 0.35); }
          .support-box { margin-top: 24px; padding: 16px; background: #f1f5f9; border-radius: 12px; text-align: center; font-size: 13px; color: #475569; }
          .support-box a { color: #133857; font-weight: 700; text-decoration: none; }
          .footer { background: #f8fafc; padding: 24px 28px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="brand-logo"><span class="accent">Glamour</span>Dry</h1>
            <p>Eco-Friendly Garment Care & Doorstep Laundry</p>
          </div>
          
          <div class="status-banner">
            <span class="status-badge">✓ Booking Confirmed</span>
            <div style="font-size: 16px; font-weight: 800; color: #166534; margin-top: 6px;">Order #${cleanOrderId} is Scheduled!</div>
          </div>

          <div class="content">
            <div class="greeting">Hello ${data.customerName || 'Valued Customer'},</div>
            <p class="lead-text">
              Great news! Your laundry pickup has been successfully booked with <strong>Glamour Dry</strong>. Our team is ready to pick up, clean, and deliver your clothes fresh and crisp.
            </p>

            <div class="card">
              <div class="card-title">📦 Order Summary</div>
              <div class="details-row">
                <span class="row-label">Order ID</span>
                <span class="row-value">#${cleanOrderId}</span>
              </div>
              <div class="details-row">
                <span class="row-label">Service</span>
                <span class="row-value">${data.service}</span>
              </div>
              <div class="details-row">
                <span class="row-label">Total Amount</span>
                <span class="row-value price-highlight">₹${data.totalAmount}</span>
              </div>
              <div class="details-row">
                <span class="row-label">Payment Mode</span>
                <span class="row-value">
                  <span class="payment-pill ${isOnline ? 'payment-online' : 'payment-cod'}">
                    ${isOnline ? '💳 Online Paid (Razorpay)' : '💵 Cash on Delivery'}
                  </span>
                </span>
              </div>
            </div>

            <div class="card">
              <div class="card-title">📅 Pickup Schedule & Location</div>
              <div class="details-row">
                <span class="row-label">Pickup Date</span>
                <span class="row-value">${data.pickupDate}</span>
              </div>
              <div class="details-row">
                <span class="row-label">Time Window</span>
                <span class="row-value">${data.pickupTime}</span>
              </div>
              <div class="details-row">
                <span class="row-label">Pickup Address</span>
                <span class="row-value" style="max-width: 260px; line-height: 1.4;">${data.address}</span>
              </div>
              ${data.notes ? `
              <div class="details-row">
                <span class="row-label">Instructions</span>
                <span class="row-value">${data.notes}</span>
              </div>` : ''}
            </div>

            <div class="steps-box">
              <div style="font-weight: 800; color: #133857; font-size: 13px; margin-bottom: 12px; text-transform: uppercase;">
                ✨ What Happens Next?
              </div>
              <div class="step-item">
                <div class="step-num">1</div>
                <div><strong>Doorstep Pickup:</strong> Our delivery partner arrives at your address within your selected time slot.</div>
              </div>
              <div class="step-item">
                <div class="step-num">2</div>
                <div><strong>Eco-Friendly Cleaning:</strong> Clothes are inspected, washed with organic detergents, and steam pressed.</div>
              </div>
              <div class="step-item">
                <div class="step-num">3</div>
                <div><strong>Fast Delivery:</strong> Delivered neatly folded and packed right back to your doorstep!</div>
              </div>
            </div>

            <a href="${siteUrl}/dashboard" class="btn-primary">
              Track Your Order on Dashboard →
            </a>

            <div class="support-box">
              Need to reschedule or have questions?<br>
              📞 Call/WhatsApp: <a href="tel:+916355090297">+91 63550 90297</a> &nbsp;•&nbsp; ✉️ Email: <a href="mailto:${adminEmail}">${adminEmail}</a>
            </div>
          </div>

          <div class="footer">
            Glamour Dry • Eco-Friendly Garment Care<br>
            Clean More. Pay Less. • Ahmedabad, Gujarat<br>
            <span style="font-size: 11px; color: #cbd5e1;">Sent automatically for Order #${cleanOrderId}</span>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Booking Confirmed - Glamour Dry
Order ID: #${cleanOrderId}

Hello ${data.customerName || 'Valued Customer'},

Thank you for booking with Glamour Dry! Your laundry pickup has been scheduled successfully.

ORDER SUMMARY:
- Order ID: #${cleanOrderId}
- Service: ${data.service}
- Total Amount: Rs. ${data.totalAmount} (${isOnline ? 'Online Paid' : 'Cash on Delivery'})
- Pickup Date: ${data.pickupDate}
- Pickup Time Window: ${data.pickupTime}
- Pickup Address: ${data.address}
${data.notes ? `- Special Instructions: ${data.notes}\n` : ''}

WHAT'S NEXT:
1. Pickup: Our delivery partner will arrive at your address within your selected time slot.
2. Eco-Friendly Cleaning: Clothes are inspected and washed with premium organic detergents.
3. Fast Delivery: Delivered neatly folded and packed right back to your doorstep!

Track your order anytime on your dashboard:
${siteUrl}/dashboard

Need assistance or wish to reschedule?
Phone / WhatsApp: +91 63550 90297
Email: ${adminEmail}

Glamour Dry • Eco-Friendly Garment Care • Ahmedabad, Gujarat
Sent for Order #${cleanOrderId}
    `.trim();

    const result = await sendEmail({
      to: data.customerEmail,
      replyTo: adminEmail,
      subject: `Booking Confirmed: Order #${cleanOrderId} - Glamour Dry`,
      text,
      html,
    });

    return result;
  } catch (error: any) {
    console.error('[Email Service] Failed to send customer booking email:', error);
    return { success: false, error: error?.message || 'Failed to send customer email' };
  }
}

/**
 * Master helper to send both Admin Notification and Customer Confirmation emails
 */
export async function sendAllBookingEmails(data: BookingEmailData) {
  const [adminResult, customerResult] = await Promise.allSettled([
    sendBookingNotificationEmail(data),
    sendCustomerBookingConfirmationEmail(data),
  ]);

  return {
    admin: adminResult.status === 'fulfilled' ? adminResult.value : { success: false, error: adminResult.reason },
    customer: customerResult.status === 'fulfilled' ? customerResult.value : { success: false, error: customerResult.reason },
  };
}


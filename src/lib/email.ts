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
  const isAdminRecipient = to.trim().toLowerCase() === adminEmail.trim().toLowerCase();

  // 1. If sending to Admin (memonljku@gmail.com), prioritize Resend:
  // When sending from Gmail SMTP to itself (memonljku -> memonljku), Gmail suppresses inbox notification and classifies it as Sent/Self.
  // Resend sends from an external sender (onboarding@resend.dev) so Admin gets a real Inbox notification every time!
  if (isAdminRecipient && resendApiKey) {
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

      if (!response.error) {
        console.log(`[Email Service] Sent to Admin via Resend to ${to} (ID: ${response.data?.id})`);
        return { success: true, data: response.data };
      }
      console.warn(`[Email Service] Resend admin send warning, falling back to SMTP:`, response.error);
    } catch (resendError: any) {
      console.warn(`[Email Service] Resend admin send exception, falling back to SMTP:`, resendError?.message);
    }
  }

  // 2. Try Gmail SMTP (delivers to all customer emails without domain restrictions)
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

  // 3. Fallback to Resend (for customer emails, if SMTP is unavailable)
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
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 14px; margin-bottom: 24px;">
              <tr>
                <td style="padding: 16px 20px;">
                  <div style="font-size: 12px; font-weight: 700; color: #166534; text-transform: uppercase;">Order ID</div>
                  <div style="font-size: 20px; font-weight: 800; color: #133857; margin-top: 2px;">#${cleanOrderId}</div>
                </td>
                <td style="padding: 16px 20px; text-align: right;">
                  <div style="font-size: 12px; font-weight: 700; color: #166534; text-transform: uppercase;">Total Amount</div>
                  <div style="font-size: 22px; font-weight: 800; color: #166534; margin-top: 2px;">₹${data.totalAmount}</div>
                </td>
              </tr>
            </table>

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
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Booking Confirmed: Order #${cleanOrderId}</title>
      </head>
      <body style="margin: 0; padding: 24px 16px; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1e293b;">
        <div style="max-width: 560px; margin: 0 auto;">
          
          <!-- Brand Header -->
          <div style="font-size: 22px; font-weight: 800; color: #133857; margin-bottom: 20px;">
            <span style="color: #38b249;">Glamour</span>Dry
          </div>

          <!-- Greeting -->
          <p style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #0f172a;">
            Hi ${data.customerName || 'there'},
          </p>

          <!-- Confirmation Statement -->
          <p style="margin: 0 0 18px; color: #334155;">
            Your laundry pickup has been successfully booked with <strong>Glamour Dry</strong>.
          </p>

          <!-- Booking Details Card -->
          <div style="background-color: #f8fafc; border-left: 4px solid #38b249; padding: 16px 20px; margin: 20px 0; border-radius: 6px; font-size: 14.5px; line-height: 1.7; color: #1e293b;">
            <div style="margin-bottom: 8px;"><strong>Order ID:</strong> #${cleanOrderId}</div>
            <div style="margin-bottom: 8px;"><strong>Service:</strong> ${data.service}</div>
            <div style="margin-bottom: 8px;"><strong>Pickup Date &amp; Time:</strong> ${data.pickupDate} (${data.pickupTime})</div>
            <div style="margin-bottom: 8px;"><strong>Total Amount:</strong> &#8377;${data.totalAmount} (${isOnline ? 'Online Paid via Razorpay' : 'Cash on Delivery'})</div>
            <div><strong>Pickup Address:</strong> ${data.address}</div>
            ${data.notes ? `<div style="margin-top: 8px;"><strong>Special Instructions:</strong> ${data.notes}</div>` : ''}
          </div>

          <!-- Next Steps -->
          <p style="margin: 20px 0 8px; font-weight: 700; color: #0f172a; font-size: 15px;">
            What happens next?
          </p>
          <div style="margin: 0 0 18px; color: #475569; line-height: 1.7;">
            1. Our delivery partner will arrive at your address within your selected time window.<br>
            2. Your clothes will be inspected, cleaned using eco-friendly organic detergents, and steam pressed.<br>
            3. Clean, crisp garments will be neatly packed and delivered right to your doorstep.
          </div>

          <!-- Tracking -->
          <p style="margin: 18px 0; color: #334155;">
            You can track the live status of your order anytime on your dashboard:<br>
            <a href="${siteUrl}/dashboard" style="color: #133857; font-weight: 700; text-decoration: underline;">
              ${siteUrl}/dashboard
            </a>
          </p>

          <!-- Support -->
          <p style="margin: 20px 0; color: #475569; font-size: 14px; line-height: 1.6;">
            Have questions or need to reschedule your pickup? Feel free to reply directly to this email or reach us at:<br>
            &#128222; Call/WhatsApp: <a href="tel:+916355090297" style="color: #133857; font-weight: 700; text-decoration: none;">+91 63550 90297</a> &nbsp;|&nbsp; &#9993; Email: <a href="mailto:${adminEmail}" style="color: #133857; font-weight: 700; text-decoration: none;">${adminEmail}</a>
          </p>

          <!-- Sign-off -->
          <div style="margin-top: 28px; padding-top: 18px; border-top: 1px solid #e2e8f0; color: #334155; font-size: 14px; line-height: 1.6;">
            Warm regards,<br>
            <strong>Team Glamour Dry</strong><br>
            <span style="font-size: 12.5px; color: #94a3b8;">Eco-Friendly Garment Care &bull; Ahmedabad, Gujarat</span>
          </div>

        </div>
      </body>
      </html>
    `;

    const text = `
Hi ${data.customerName || 'there'},

Your laundry pickup has been successfully booked with Glamour Dry.

BOOKING DETAILS:
- Order ID: #${cleanOrderId}
- Service: ${data.service}
- Pickup Date & Time: ${data.pickupDate} (${data.pickupTime})
- Total Amount: Rs. ${data.totalAmount} (${isOnline ? 'Online Paid via Razorpay' : 'Cash on Delivery'})
- Pickup Address: ${data.address}
${data.notes ? `- Special Instructions: ${data.notes}\n` : ''}

WHAT HAPPENS NEXT:
1. Our delivery partner will arrive at your address within your selected time window.
2. Your clothes will be inspected, cleaned using eco-friendly organic detergents, and steam pressed.
3. Clean, crisp garments will be neatly packed and delivered right to your doorstep.

Track your order live:
${siteUrl}/dashboard

Have questions or need to reschedule?
Call/WhatsApp: +91 63550 90297
Email: ${adminEmail}

Warm regards,
Team Glamour Dry
Eco-Friendly Garment Care • Ahmedabad, Gujarat
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


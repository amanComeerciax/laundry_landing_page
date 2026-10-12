import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || '';
const adminEmail = process.env.ADMIN_EMAIL || 'memonljku@gmail.com';
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Glamour Dry <onboarding@resend.dev>';

export const resend = new Resend(resendApiKey);

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

    const response = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      replyTo: data.email || undefined,
      subject: `New Inquiry from ${data.name} - Glamour Dry`,
      html,
    });

    console.log('[Resend] Inquiry email sent successfully:', response);
    return { success: true, data: response };
  } catch (error: any) {
    console.error('[Resend] Failed to send inquiry email:', error);
    return { success: false, error: error?.message || 'Failed to send email' };
  }
}

/**
 * Send booking notification email to admin
 */
export async function sendBookingNotificationEmail(data: BookingEmailData) {
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
            <h1>Glamour Dry</h1>
            <p>New Laundry Booking Received</p>
            <span class="badge">Booking: ${data.orderId.replace(/^#/, '')}</span>
          </div>
          <div class="content">
            <div class="summary-card">
              <div>
                <div style="font-size: 12px; font-weight: 700; color: #166534; text-transform: uppercase;">Order ID</div>
                <div class="order-id">${data.orderId.replace(/^#/, '')}</div>
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
            Glamour Dry Booking Notification • Received on ${formattedDate}
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      replyTo: data.customerEmail || undefined,
      subject: `New Booking ${data.orderId.replace(/^#/, '')}: ${data.service} (₹${data.totalAmount})`,
      html,
    });

    console.log('[Resend] Booking email sent successfully:', response);
    return { success: true, data: response };
  } catch (error: any) {
    console.error('[Resend] Failed to send booking email:', error);
    return { success: false, error: error?.message || 'Failed to send email' };
  }
}

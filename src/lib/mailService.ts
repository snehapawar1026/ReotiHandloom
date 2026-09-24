import nodemailer from 'nodemailer';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'reotihandloom@hotmail.com';

/**
 * Configure Nodemailer Transporter
 * Supports Gmail, Custom SMTP, or cPanel localhost MTA
 */
export function getMailTransporter() {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS || '',
      } : undefined,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Live cPanel local sendmail fallback
  try {
    return nodemailer.createTransport({
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail',
    });
  } catch {
    return nodemailer.createTransport({
      jsonTransport: true,
    });
  }
}

const defaultSender = () => process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@reotihandloom.com';

/**
 * Common HTML wrapper with Reoti Handloom Luxury Theme
 */
function wrapLuxuryEmail(title: string, subtitle: string, bodyContent: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #FAF7F2; color: #2D1214; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #FAF7F2; padding: 30px 0; }
        .main { max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #E8DFC8; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); }
        .header { background: linear-gradient(135deg, #581C1C 0%, #7B2020 50%, #581C1C 100%); color: #FFF8EE; padding: 28px 20px; text-align: center; border-bottom: 2px solid #D4AF37; }
        .header h1 { margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 1.5px; }
        .header p { margin: 6px 0 0; font-size: 11px; opacity: 0.9; text-transform: uppercase; letter-spacing: 2.5px; color: #F5E6C8; }
        .content { padding: 32px 28px; }
        .footer { background: #FDFBF8; border-top: 1px solid #E8DFC8; padding: 20px; text-align: center; font-size: 11px; color: #786C5E; line-height: 1.6; }
        .footer a { color: #581C1C; text-decoration: none; font-weight: bold; }
        .button { display: inline-block; background-color: #581C1C; color: #FFF8EE !important; text-decoration: none; padding: 13px 26px; border-radius: 8px; font-size: 13px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; border: 1px solid #D4AF37; margin: 18px 0; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="main">
          <div class="header">
            <h1>Reoti Handloom</h1>
            <p>${subtitle}</p>
          </div>
          <div class="content">
            ${bodyContent}
          </div>
          <div class="footer">
            <strong>Reoti Handloom Maheshwar</strong><br>
            Authentic Handcrafted Maheshwari Silk & Cotton Sarees<br>
            Maheshwar, Madhya Pradesh - 451224 | WhatsApp: +91 9617444445<br>
            <a href="https://reotihandloom.com">www.reotihandloom.com</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * 1. Send OTP / Password Reset Verification Email
 */
export async function sendOtpEmail(email: string, name: string, otp: string): Promise<boolean> {
  try {
    const transporter = getMailTransporter();
    const subject = `🔐 ${otp} is your Reoti Handloom Verification Code`;
    const bodyContent = `
      <p style="font-size: 16px; margin-top: 0; color: #2D1214;">Namaste <strong>${name}</strong>,</p>
      <p style="font-size: 14px; color: #4A3E3D; line-height: 1.6;">
        We received a request to reset your password for your Reoti Handloom customer account. Please use the verification code below:
      </p>
      
      <div style="background: #FFF9F0; border: 2px dashed #D4AF37; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0;">
        <div style="font-size: 11px; text-transform: uppercase; color: #8B4513; font-weight: bold; letter-spacing: 1px; margin-bottom: 6px;">Your 6-Digit Verification Code</div>
        <div style="font-family: 'Courier New', monospace; font-size: 34px; font-weight: bold; letter-spacing: 8px; color: #581C1C;">${otp}</div>
        <div style="font-size: 11px; color: #8C7B70; margin-top: 6px;">Valid for 10 minutes only • Do not share with anyone</div>
      </div>

      <p style="font-size: 12px; color: #786C5E; line-height: 1.5;">
        If you did not request this verification code, please ignore this email. Your account remains completely safe and secure.
      </p>
    `;

    const html = wrapLuxuryEmail('Reset Password Verification', 'Heritage Security Verification', bodyContent);
    await transporter.sendMail({
      from: `"Reoti Handloom" <${defaultSender()}>`,
      to: email,
      subject,
      html,
    });
    console.log(`[EMAIL SENT] OTP code sent successfully to ${email}`);
    return true;
  } catch (err: any) {
    console.error(`[EMAIL FAILED] Could not send OTP to ${email}: ${err.message}`);
    return false;
  }
}

/**
 * 2. Send Welcome Registration Email
 */
export async function sendWelcomeEmail(email: string, name: string, phone?: string): Promise<boolean> {
  try {
    const transporter = getMailTransporter();
    const subject = `✨ Welcome to the Reoti Handloom Family, ${name}!`;
    const bodyContent = `
      <p style="font-size: 16px; margin-top: 0; color: #2D1214;">Namaste <strong>${name}</strong>,</p>
      <p style="font-size: 14px; color: #4A3E3D; line-height: 1.6;">
        Welcome to <strong>Reoti Handloom</strong> — where century-old Maheshwari weaving traditions meet royal elegance. Your customer account has been created successfully!
      </p>
      
      <div style="background: #FFF9F0; border: 1px solid #E8DFC8; border-radius: 12px; padding: 20px; margin: 22px 0;">
        <h3 style="margin: 0 0 10px; font-size: 14px; color: #581C1C;">Your Account Details:</h3>
        <p style="margin: 4px 0; font-size: 13px; color: #4A3E3D;"><strong>Registered Email:</strong> ${email}</p>
        ${phone ? `<p style="margin: 4px 0; font-size: 13px; color: #4A3E3D;"><strong>Mobile Number:</strong> +91 ${phone}</p>` : ''}
        <p style="margin: 4px 0; font-size: 13px; color: #4A3E3D;"><strong>Exclusive Benefit:</strong> Free Fall & Pico + Express Delivery on all handcrafted sarees</p>
      </div>

      <div style="text-align: center; margin: 25px 0;">
        <a href="https://reotihandloom.com/products" class="button">Explore New Arrivals</a>
      </div>

      <p style="font-size: 13px; color: #786C5E; line-height: 1.5;">
        Need personalized assistance or custom weaving orders? Message us anytime on WhatsApp at <strong>+91 9617444445</strong>.
      </p>
    `;

    const html = wrapLuxuryEmail('Welcome to Reoti Handloom', 'Maheshwari Heritage Craft', bodyContent);
    await transporter.sendMail({
      from: `"Reoti Handloom" <${defaultSender()}>`,
      to: email,
      subject,
      html,
    });
    console.log(`[EMAIL SENT] Welcome email sent to ${email}`);
    return true;
  } catch (err: any) {
    console.error(`[EMAIL FAILED] Could not send welcome email to ${email}: ${err.message}`);
    return false;
  }
}

/**
 * 3. Send Password Reset Success Notification Email
 */
export async function sendPasswordResetSuccessEmail(email: string, name: string): Promise<boolean> {
  try {
    const transporter = getMailTransporter();
    const subject = `✅ Password Changed Successfully - Reoti Handloom`;
    const bodyContent = `
      <p style="font-size: 16px; margin-top: 0; color: #2D1214;">Namaste <strong>${name}</strong>,</p>
      <p style="font-size: 14px; color: #4A3E3D; line-height: 1.6;">
        This is a confirmation that your password for your Reoti Handloom account (<strong>${email}</strong>) has been updated successfully.
      </p>
      
      <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <span style="font-size: 13px; color: #166534; font-weight: bold;">✔ Account Security Status: Updated & Secure</span>
      </div>

      <p style="font-size: 12px; color: #786C5E; line-height: 1.5;">
        If you did not perform this change, please immediately reach out to our team at <strong>reotihandloom@hotmail.com</strong> or WhatsApp +91 9617444445.
      </p>
    `;

    const html = wrapLuxuryEmail('Password Updated', 'Account Security', bodyContent);
    await transporter.sendMail({
      from: `"Reoti Handloom" <${defaultSender()}>`,
      to: email,
      subject,
      html,
    });
    console.log(`[EMAIL SENT] Password reset confirmation sent to ${email}`);
    return true;
  } catch (err: any) {
    console.error(`[EMAIL FAILED] Could not send password reset confirmation to ${email}: ${err.message}`);
    return false;
  }
}

/**
 * 4. Send Order Confirmation Email to Customer
 */
export async function sendCustomerOrderConfirmationEmail(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  totalAmount: number;
  paymentMethod: string;
  items: any[];
}): Promise<boolean> {
  try {
    if (!order.customerEmail || !order.customerEmail.includes('@')) return false;

    const transporter = getMailTransporter();
    const subject = `🛍️ Order Confirmed! #${order.orderNumber} - Reoti Handloom`;

    const itemsHtml = order.items.map(item => {
      const prod = item.product || item;
      const itemTotal = (prod.price || 0) * (item.quantity || 1) + (item.hasFallPico ? (item.fallPicoPrice || 0) : 0);
      return `
        <tr style="border-bottom: 1px solid #F1E9DA;">
          <td style="padding: 10px 6px; font-size: 13px;">
            <strong>${prod.title || 'Maheshwari Handloom Saree'}</strong><br>
            <span style="font-size: 11px; color: #786C5E;">
              Qty: ${item.quantity || 1} ${item.hasFallPico ? '• Fall & Pico Included (FREE)' : ''}
            </span>
          </td>
          <td style="padding: 10px 6px; text-align: right; font-size: 13px; font-weight: bold; color: #581C1C;">
            ₹${itemTotal.toLocaleString('en-IN')}
          </td>
        </tr>
      `;
    }).join('');

    const bodyContent = `
      <p style="font-size: 16px; margin-top: 0; color: #2D1214;">Namaste <strong>${order.customerName}</strong>,</p>
      <p style="font-size: 14px; color: #4A3E3D; line-height: 1.6;">
        Thank you for choosing authentic Maheshwari heritage! We are delighted to confirm that your order <strong>#${order.orderNumber}</strong> has been received and is being carefully processed.
      </p>

      <div style="background: #FFF9F0; border: 1px solid #E8DFC8; border-radius: 12px; padding: 18px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHtml}
          <tr>
            <td style="padding: 12px 6px 0; font-size: 14px; font-weight: bold; color: #2D1214;">Total Amount:</td>
            <td style="padding: 12px 6px 0; text-align: right; font-size: 16px; font-weight: bold; color: #581C1C;">
              ₹${order.totalAmount.toLocaleString('en-IN')}
            </td>
          </tr>
          <tr>
            <td style="padding: 4px 6px; font-size: 12px; color: #786C5E;">Payment Mode:</td>
            <td style="padding: 4px 6px; text-align: right; font-size: 12px; font-weight: bold; color: #166534;">
              ${order.paymentMethod} (Confirmed)
            </td>
          </tr>
        </table>
      </div>

      <div style="background: #FAF7F2; border-left: 3px solid #D4AF37; padding: 12px 16px; margin: 20px 0; font-size: 12px; color: #4A3E3D;">
        <strong>Shipping Address:</strong><br>
        ${order.shippingAddress}<br>
        Phone: +91 ${order.customerPhone}
      </div>

      <p style="font-size: 13px; color: #786C5E; line-height: 1.5;">
        You will receive WhatsApp tracking updates as soon as your parcel is dispatched from our Maheshwar workshop.
      </p>
    `;

    const html = wrapLuxuryEmail(`Order #${order.orderNumber}`, 'Order Confirmation & Receipt', bodyContent);
    await transporter.sendMail({
      from: `"Reoti Handloom" <${defaultSender()}>`,
      to: order.customerEmail,
      subject,
      html,
    });
    console.log(`[EMAIL SENT] Order confirmation email sent to ${order.customerEmail}`);
    return true;
  } catch (err: any) {
    console.error(`[EMAIL FAILED] Could not send order confirmation to ${order.customerEmail}: ${err.message}`);
    return false;
  }
}

/**
 * 5. Send Instant Order Notification Email to Admin (reotihandloom@hotmail.com)
 */
export async function sendAdminNewOrderAlertEmail(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus?: string;
  items: any[];
}): Promise<boolean> {
  try {
    const transporter = getMailTransporter();
    const adminTargetEmail = process.env.ADMIN_EMAIL || 'reotihandloom@hotmail.com';
    const subject = `🚨 NEW ORDER RECEIVED! #${order.orderNumber} - ₹${order.totalAmount.toLocaleString('en-IN')} (${order.customerName})`;

    const itemsHtml = order.items.map((item) => {
      const prod = item.product || item;
      const itemPrice = prod.price || 0;
      const qty = item.quantity || 1;
      const itemTotal = itemPrice * qty + (item.hasFallPico ? (item.fallPicoPrice || 0) : 0);
      const rawImg = prod.image || (Array.isArray(prod.images) ? prod.images[0] : (typeof prod.images === 'string' ? JSON.parse(prod.images || '[]')[0] : ''));
      const img = rawImg ? (rawImg.startsWith('http') ? rawImg : `https://reotihandloom.com${rawImg}`) : '';

      return `
        <tr style="border-bottom: 1px solid #E8DFC8;">
          <td style="padding: 12px 8px; width: 60px;">
            ${img ? `<img src="${img}" alt="Product" style="width: 52px; height: 52px; object-fit: cover; border-radius: 8px; border: 1px solid #D4AF37;" />` : ''}
          </td>
          <td style="padding: 12px 8px; font-size: 13px; color: #2D1214;">
            <strong>${prod.title || 'Handloom Saree / Suit'}</strong><br>
            <span style="font-size: 11px; color: #786C5E;">
              Quantity: <strong>${qty}</strong> | Unit Price: ₹${itemPrice.toLocaleString('en-IN')}
              ${item.hasFallPico ? '<br><span style="color: #059669; font-weight: bold;">✔ Fall & Pico Included (FREE)</span>' : ''}
            </span>
          </td>
          <td style="padding: 12px 8px; text-align: right; font-size: 14px; font-weight: bold; color: #581C1C;">
            ₹${itemTotal.toLocaleString('en-IN')}
          </td>
        </tr>
      `;
    }).join('');

    const bodyContent = `
      <div style="background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 12px; padding: 14px; margin-bottom: 20px; text-align: center;">
        <span style="font-size: 14px; font-weight: bold; color: #92400E;">
          ⚡ Instant Store Notification: A new customer order has been placed on Reoti Handloom!
        </span>
      </div>

      <div style="background: #FFF9F0; border: 1px solid #E8DFC8; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px; font-size: 15px; color: #581C1C; border-bottom: 1px solid #E8DFC8; padding-bottom: 8px;">
          Customer & Delivery Details:
        </h3>
        <table style="width: 100%; font-size: 13px; color: #2D1214; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; width: 35%; color: #786C5E;"><strong>Customer Name:</strong></td>
            <td style="padding: 6px 0; font-weight: bold; font-size: 14px;">${order.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #786C5E;"><strong>Mobile Phone:</strong></td>
            <td style="padding: 6px 0;">
              <a href="tel:${order.customerPhone}" style="color: #581C1C; font-weight: bold; text-decoration: none;">+91 ${order.customerPhone}</a>
              &nbsp;&nbsp;
              <a href="https://wa.me/91${order.customerPhone.replace(/[^0-9]/g, '')}" style="color: #166534; font-size: 11px; font-weight: bold; background: #DCFCE7; padding: 3px 8px; border-radius: 12px; text-decoration: none;">💬 WhatsApp</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #786C5E;"><strong>Email Address:</strong></td>
            <td style="padding: 6px 0;">${order.customerEmail || 'Guest Checkout'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #786C5E; vertical-align: top;"><strong>Shipping Address:</strong></td>
            <td style="padding: 6px 0; font-weight: 500; line-height: 1.4;">${order.shippingAddress}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #786C5E;"><strong>Payment Mode:</strong></td>
            <td style="padding: 6px 0; font-weight: bold; color: #166534;">
              ${order.paymentMethod} (${order.paymentStatus || 'PAID / CONFIRMED'})
            </td>
          </tr>
        </table>
      </div>

      <div style="background: #ffffff; border: 1px solid #E8DFC8; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px; font-size: 15px; color: #581C1C;">
          Ordered Items:
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHtml}
          <tr>
            <td colspan="2" style="padding: 14px 8px 0; font-size: 15px; font-weight: bold; color: #2D1214;">Grand Total:</td>
            <td style="padding: 14px 8px 0; text-align: right; font-size: 18px; font-weight: bold; color: #581C1C;">
              ₹${order.totalAmount.toLocaleString('en-IN')}
            </td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 24px 0;">
        <a href="https://reotihandloom.com/reoti-studio-manage" class="button">
          Open Admin Panel to Manage & Dispatch
        </a>
      </div>
    `;

    const html = wrapLuxuryEmail(`New Order Alert #${order.orderNumber}`, 'Instant Store Alert', bodyContent);
    await transporter.sendMail({
      from: `"Reoti Handloom Store" <${defaultSender()}>`,
      to: adminTargetEmail,
      subject,
      html,
    });
    console.log(`[ADMIN EMAIL SENT] Instant order notification sent to ${adminTargetEmail}`);
    return true;
  } catch (err: any) {
    console.error(`[ADMIN EMAIL FAILED] Could not send order alert to admin: ${err.message}`);
    return false;
  }
}

import { getMailTransporter } from './mailService';
import nodemailer from 'nodemailer';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'reotihandloom@hotmail.com';
const ADMIN_PHONE = '9617444445';

export interface NotificationPayload {
  title: string;
  type: 'VISIT' | 'REGISTER' | 'LOGIN' | 'ORDER' | 'INQUIRY';
  details: string;
  userEmail?: string;
  userPhone?: string;
  amount?: number;
}

/**
 * Send Email Notification to Admin
 */
export async function sendAdminEmail(payload: NotificationPayload) {
  const { title, type, details, userEmail, userPhone, amount } = payload;

  const subject = `[Reoti Handloom Alert] ${title}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
      <div style="background-color: #450a0a; color: #fef3c7; padding: 16px; text-align: center; border-radius: 6px;">
        <h2 style="margin: 0; font-family: Georgia, serif;">Reoti Handloom Maheshwar</h2>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #fde68a;">Admin Activity & Event Alert</p>
      </div>

      <div style="padding: 20px 0; color: #1e293b;">
        <h3 style="color: #881337; margin-top: 0;">${title}</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 30%; border-bottom: 1px solid #f1f5f9;">Event Type:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${type}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Details:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${details}</td>
          </tr>
          ${userEmail ? `
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Customer Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${userEmail}</td>
          </tr>` : ''}
          ${userPhone ? `
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Customer Phone:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${userPhone}</td>
          </tr>` : ''}
          ${amount ? `
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Total Amount:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #9f1239;">₹${amount.toLocaleString()}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px; font-weight: bold;">Timestamp:</td>
            <td style="padding: 8px;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
          </tr>
        </table>
      </div>

      <div style="background-color: #fff7ed; border-left: 4px solid #d97706; padding: 12px; font-size: 12px; color: #78350f;">
        <strong>Admin Notice:</strong> View full customer & visitor logs at your Secret Admin Dashboard: 
        <a href="http://localhost:3000/reoti-studio-manage" style="color: #991b1b; font-weight: bold;">/reoti-studio-manage</a>
      </div>
    </div>
  `;

  console.log(`[ADMIN NOTIFICATION] Event: ${type} | ${title} | Details: ${details}`);

  try {
    const transporter = getMailTransporter();
    const sender = process.env.SMTP_FROM || process.env.SMTP_USER || 'info@reotihandloom.com';
    await transporter.sendMail({
      from: `"Reoti Handloom Alert" <${sender}>`,
      to: ADMIN_EMAIL,
      subject,
      html: htmlContent,
    });
    console.log(`[EMAIL SENT] Notification successfully sent to ${ADMIN_EMAIL}`);
  } catch (err: any) {
    console.error('[EMAIL ERROR] Failed to send email:', err.message);
  }
}

/**
 * Generate Direct WhatsApp Alert Link for Admin Number 9617444445
 */
export function getWhatsAppAlertUrl(payload: NotificationPayload): string {
  const text = encodeURIComponent(
    `🚨 *Reoti Handloom Store Alert*\n\n` +
    `📌 *Event:* ${payload.title}\n` +
    `👤 *Email:* ${payload.userEmail || 'Guest / Visitor'}\n` +
    `📞 *Phone:* ${payload.userPhone || 'N/A'}\n` +
    `📝 *Details:* ${payload.details}\n` +
    `🕒 *Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
  );
  return `https://wa.me/91${ADMIN_PHONE}?text=${text}`;
}

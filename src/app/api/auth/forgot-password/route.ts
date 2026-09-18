import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOtpEmail, sendPasswordResetSuccessEmail } from '@/lib/mailService';

// In-memory OTP cache: email -> { otp: string, expiresAt: number }
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'send-otp';
    const email = (body.email || '').toLowerCase().trim();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'A valid email address is required.' }, { status: 400 });
    }

    // Fail-safe Admin protection
    if (email === 'admin@reotihandloom.com') {
      return NextResponse.json(
        { success: false, error: 'Admin password cannot be reset via customer forgot password.' },
        { status: 403 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'No customer account found with this email address.' },
        { status: 404 }
      );
    }

    // ACTION 1: Send OTP / Verification Code to User Email
    if (action === 'send-otp') {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

      otpStore.set(email, { otp, expiresAt });

      // Send OTP to customer's registered email via mailService
      sendOtpEmail(email, user.name, otp).catch(() => {});

      await prisma.activityLog.create({
        data: {
          type: 'INQUIRY',
          title: `🔑 Password Reset OTP Sent: ${user.name}`,
          details: `Email: ${email}`,
          userEmail: email,
        },
      }).catch(() => {});

      // Secure Response: NEVER expose the OTP in JSON!
      return NextResponse.json({
        success: true,
        message: 'A 6-digit verification code has been sent to your email address.',
      });
    }

    // ACTION 2: Verify OTP and Reset Password
    if (action === 'verify-and-reset') {
      const inputOtp = (body.otp || '').trim();
      const newPassword = (body.newPassword || '').trim();

      if (!inputOtp) {
        return NextResponse.json(
          { success: false, error: 'Please enter the 6-digit verification code received on your email.' },
          { status: 400 }
        );
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: 'Password must be at least 6 characters long.' },
          { status: 400 }
        );
      }

      const cached = otpStore.get(email);
      if (!cached) {
        return NextResponse.json(
          { success: false, error: 'Verification code has expired or was not requested. Please request a new code.' },
          { status: 400 }
        );
      }

      if (Date.now() > cached.expiresAt) {
        otpStore.delete(email);
        return NextResponse.json(
          { success: false, error: 'Verification code has expired. Please request a new code.' },
          { status: 400 }
        );
      }

      if (cached.otp !== inputOtp) {
        return NextResponse.json(
          { success: false, error: 'Incorrect verification code. Please check your email and try again.' },
          { status: 400 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { email },
        data: { password: newPassword },
      });

      otpStore.delete(email);

      // Send Security Confirmation Email
      sendPasswordResetSuccessEmail(email, updatedUser.name).catch(() => {});

      await prisma.activityLog.create({
        data: {
          type: 'LOGIN',
          title: `🔑 Password Reset Completed: ${updatedUser.name}`,
          details: `Email: ${email}`,
          userEmail: email,
        },
      }).catch(() => {});

      return NextResponse.json({
        success: true,
        message: 'Your password has been reset successfully.',
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role,
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to process request' }, { status: 500 });
  }
}

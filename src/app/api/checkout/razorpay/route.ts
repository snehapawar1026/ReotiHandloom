import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'jYDDeSwNt5AbybZIynsGZ5qw';

    if (razorpay_order_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json({ success: false, error: 'Invalid Razorpay Signature' }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Razorpay Payment Signature Verified Successfully',
      paymentId: razorpay_payment_id,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

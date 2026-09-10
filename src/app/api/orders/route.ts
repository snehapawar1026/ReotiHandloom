import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      totalAmount,
      paymentMethod,
      items,
    } = body;

    if (!customerName || !customerPhone || !shippingAddress || !items || !totalAmount) {
      return NextResponse.json({ success: false, error: 'Missing required order details' }, { status: 400 });
    }

    const orderNumber = 'REOTI-' + Math.floor(100000 + Math.random() * 900000);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail: customerEmail || 'customer@reoti.com',
        customerPhone,
        shippingAddress,
        totalAmount: parseFloat(totalAmount),
        paymentMethod: paymentMethod || 'UPI',
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        status: 'PROCESSING',
        items: typeof items === 'string' ? items : JSON.stringify(items),
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

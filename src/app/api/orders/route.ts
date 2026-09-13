import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAdminEmail } from '@/lib/notifications';

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
      paymentStatus,
      transactionId,
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
        paymentStatus: paymentStatus || (paymentMethod === 'COD' ? 'PENDING' : 'PAID'),
        status: 'PROCESSING',
        items: typeof items === 'string' ? items : JSON.stringify(items),
      },
    });

    // Auto-mark ordered sarees as OUT OF STOCK
    try {
      const orderItems = typeof items === 'string' ? JSON.parse(items) : items;
      if (Array.isArray(orderItems)) {
        for (const item of orderItems) {
          const prodId = item.product?.id || item.id || item.productId;
          if (prodId) {
            await prisma.product.update({
              where: { id: prodId },
              data: {
                isOutOfStock: true,
                stock: 0,
              },
            });
          }
        }
      }
    } catch (stockErr) {
      console.error('Error updating product stock status on order:', stockErr);
    }

    // Log Activity for Store Owner / Admin Dashboard
    const title = `🛍️ New Order Received: #${orderNumber}`;
    const details = `Customer: ${customerName} (${customerPhone}) | Amount: ₹${totalAmount} | Address: ${shippingAddress}`;

    await prisma.activityLog.create({
      data: {
        type: 'ORDER',
        title,
        details,
        userEmail: customerEmail || null,
      },
    }).catch(() => {});

    sendAdminEmail({
      title,
      type: 'ORDER',
      details,
      userEmail: customerEmail || undefined,
      userPhone: customerPhone,
      amount: parseFloat(totalAmount),
    }).catch(() => {});

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


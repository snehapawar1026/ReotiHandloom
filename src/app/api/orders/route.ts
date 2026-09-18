import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAdminEmail } from '@/lib/notifications';
import { sendCustomerOrderConfirmationEmail } from '@/lib/mailService';
import { createOrderInStore, logActivityInStore, getStoreData, updateProductInStore } from '@/lib/storeManager';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (orders && orders.length > 0) {
      return NextResponse.json({ success: true, orders });
    }
  } catch (error: any) {
    console.warn('[FALLBACK] Serving orders from storeManager:', error.message);
  }

  const storeOrders = getStoreData().orders || [];
  return NextResponse.json({ success: true, orders: storeOrders });
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

    // 1. Save in storeManager
    const order = createOrderInStore(body);

    // 2. Auto-mark ordered items as OUT OF STOCK in storeManager
    try {
      const orderItems = typeof items === 'string' ? JSON.parse(items) : items;
      if (Array.isArray(orderItems)) {
        for (const item of orderItems) {
          const prodId = item.product?.id || item.id || item.productId;
          if (prodId) {
            updateProductInStore(prodId, { isOutOfStock: true, stock: 0 });
          }
        }
      }
    } catch (e) {}

    // 3. Try Prisma
    try {
      await prisma.order.create({
        data: {
          id: order.id,
          orderNumber: order.orderNumber,
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

      // Auto-mark ordered sarees as OUT OF STOCK in DB
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
            }).catch(() => {});
          }
        }
      }
    } catch (prismaErr: any) {
      console.warn('[Orders POST] Prisma notice:', prismaErr.message);
    }

    // Log Activity for Store Owner / Admin Dashboard
    const title = `🛍️ New Order Received: #${order.orderNumber}`;
    const details = `Customer: ${customerName} (${customerPhone}) | Amount: ₹${totalAmount} | Address: ${shippingAddress}`;

    logActivityInStore({
      type: 'ORDER',
      title,
      details,
      userEmail: customerEmail || null,
    });

    try {
      await prisma.activityLog.create({
        data: {
          type: 'ORDER',
          title,
          details,
          userEmail: customerEmail || null,
        },
      });
    } catch (e) {}

    // Send Email to Admin & Customer
    sendAdminEmail({
      title,
      type: 'ORDER',
      details,
      userEmail: customerEmail || undefined,
      userPhone: customerPhone,
      amount: parseFloat(totalAmount),
    }).catch(() => {});

    // Send Luxury Receipt to Customer
    try {
      const orderItems = typeof items === 'string' ? JSON.parse(items) : items;
      sendCustomerOrderConfirmationEmail({
        orderNumber: order.orderNumber,
        customerName,
        customerEmail: customerEmail || '',
        customerPhone,
        shippingAddress,
        totalAmount: parseFloat(totalAmount),
        paymentMethod: paymentMethod || 'UPI',
        items: Array.isArray(orderItems) ? orderItems : [],
      }).catch(() => {});
    } catch {}

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


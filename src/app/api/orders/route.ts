import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAdminEmail } from '@/lib/notifications';
import { sendCustomerOrderConfirmationEmail, sendAdminNewOrderAlertEmail } from '@/lib/mailService';
import {
  createOrderInStore,
  updateOrderInStore,
  deleteOrderInStore,
  getOrderByIdOrNumber,
  logActivityInStore,
  getStoreData,
  updateProductInStore,
} from '@/lib/storeManager';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get('query') || searchParams.get('orderNumber') || searchParams.get('phone') || '').trim();
  const isAdminRequest = searchParams.get('_t') !== null || searchParams.get('admin') === 'true' || searchParams.get('includeAll') === 'true';

  try {
    let orders: any[] = [];
    try {
      orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbErr) {
      orders = getStoreData().orders || [];
    }

    if (!orders || orders.length === 0) {
      orders = getStoreData().orders || [];
    }

    // Strict Filter when query is provided (e.g. for Track Order & My Orders page)
    if (query) {
      const qLower = query.toLowerCase().replace(/^#/, '').trim();
      const qDigits = query.replace(/\D/g, '');

      const matched = orders.filter((o) => {
        const oNum = (o.orderNumber || '').toLowerCase().replace(/^#/, '').trim();
        const oId = (o.id || '').toLowerCase().trim();
        const oPhone = (o.customerPhone || '').replace(/\D/g, '');
        const oEmail = (o.customerEmail || '').toLowerCase().trim();

        // 1. Exact Order Number or ID match
        if (qLower && (oNum === qLower || oId === qLower)) {
          return true;
        }

        // 2. Exact Email match
        if (qLower.includes('@') && oEmail === qLower) {
          return true;
        }

        // 3. Mobile Number match (matches last 10 digits accurately)
        if (qDigits.length >= 10) {
          const last10Order = oPhone.slice(-10);
          const last10Query = qDigits.slice(-10);
          if (last10Order && last10Query && last10Order === last10Query) {
            return true;
          }
        } else if (qDigits.length >= 6) {
          if (oPhone.includes(qDigits)) {
            return true;
          }
        }

        return false;
      });

      return NextResponse.json({ success: true, orders: matched });
    }

    // If no query and it's an admin dashboard request, return all orders
    if (isAdminRequest) {
      return NextResponse.json({ success: true, orders });
    }

    // For public guest requests without a query, return empty list for privacy
    return NextResponse.json({ success: true, orders: [] });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: true, orders: [] });
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
      userPhone: customerPhone,
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

    // Send Instant Order Alert to Admin (reotihandloom@hotmail.com)
    try {
      const orderItems = typeof items === 'string' ? JSON.parse(items) : items;
      const parsedItems = Array.isArray(orderItems) ? orderItems : [];
      
      // Send High Priority Luxury Admin Order Alert
      sendAdminNewOrderAlertEmail({
        orderNumber: order.orderNumber,
        customerName,
        customerEmail: customerEmail || '',
        customerPhone,
        shippingAddress,
        totalAmount: parseFloat(totalAmount),
        paymentMethod: paymentMethod || 'ONLINE / PREPAID',
        paymentStatus: 'PAID / CONFIRMED',
        items: parsedItems,
      }).catch((e) => console.error('[Order Alert Error]', e));

      // Also send basic admin log email
      sendAdminEmail({
        title,
        type: 'ORDER',
        details,
        userEmail: customerEmail || undefined,
        userPhone: customerPhone,
        amount: parseFloat(totalAmount),
      }).catch(() => {});

      // Send Customer Order Receipt
      sendCustomerOrderConfirmationEmail({
        orderNumber: order.orderNumber,
        customerName,
        customerEmail: customerEmail || '',
        customerPhone,
        shippingAddress,
        totalAmount: parseFloat(totalAmount),
        paymentMethod: paymentMethod || 'ONLINE / PREPAID',
        items: parsedItems,
      }).catch(() => {});
    } catch (mailErr) {
      console.error('[Order Email Processing Error]', mailErr);
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      orderNumber,
      status,
      courierPartner,
      trackingNumber,
      trackingUrl,
      estimatedDelivery,
      paymentStatus,
      notes,
      cancellationReason,
    } = body;

    const targetId = id || orderNumber;
    if (!targetId) {
      return NextResponse.json({ success: false, error: 'Order ID or Order Number required' }, { status: 400 });
    }

    const updates: any = {};
    if (status !== undefined) updates.status = status;
    if (courierPartner !== undefined) updates.courierPartner = courierPartner;
    if (trackingNumber !== undefined) updates.trackingNumber = trackingNumber;
    if (trackingUrl !== undefined) updates.trackingUrl = trackingUrl;
    if (estimatedDelivery !== undefined) updates.estimatedDelivery = estimatedDelivery;
    if (paymentStatus !== undefined) updates.paymentStatus = paymentStatus;
    if (notes !== undefined) updates.notes = notes;
    if (cancellationReason !== undefined) updates.cancellationReason = cancellationReason;

    // 1. Update in storeManager
    const updatedOrder = updateOrderInStore(targetId, updates);

    // Auto-restock products back to inventory if order is CANCELLED or RETURNED / RTO
    if (status === 'CANCELLED' || status === 'RETURNED' || status === 'RTO') {
      try {
        const orderItems = typeof updatedOrder?.items === 'string' ? JSON.parse(updatedOrder.items) : updatedOrder?.items;
        if (Array.isArray(orderItems)) {
          for (const item of orderItems) {
            const prodId = item.product?.id || item.id || item.productId;
            if (prodId) {
              updateProductInStore(prodId, { isOutOfStock: false, stock: 1 });
              await prisma.product.update({
                where: { id: prodId },
                data: { isOutOfStock: false, stock: 1 },
              }).catch(() => {});
            }
          }
        }
      } catch (e) {}
    }

    // 2. Update in Prisma
    try {
      await prisma.order.updateMany({
        where: {
          OR: [{ id: targetId }, { orderNumber: targetId }, { orderNumber: targetId.replace(/^#/, '') }],
        },
        data: updates,
      });
    } catch (e) {}

    // 3. Log Admin Activity
    const actTitle = `📦 Order #${updatedOrder?.orderNumber || targetId} Updated: ${status || 'Details changed'}`;
    const actDetails = `Status: ${updatedOrder?.status || status || 'N/A'} | Courier: ${updatedOrder?.courierPartner || 'N/A'} | Tracking: ${updatedOrder?.trackingNumber || 'N/A'}`;
    logActivityInStore({
      type: 'ORDER',
      title: actTitle,
      details: actDetails,
      isAdmin: true,
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    deleteOrderInStore(id);

    try {
      await prisma.order.deleteMany({
        where: {
          OR: [{ id }, { orderNumber: id }],
        },
      });
    } catch (e) {}

    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { getStoreData } from '@/lib/storeManager';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, phone, email, subtotal } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, error: 'Please enter a coupon code.' }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();
    const cartSubtotal = Number(subtotal) || 0;
    const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
    const cleanEmail = (email || '').trim().toLowerCase();

    // 1. FIRST-TIME ORDER COUPONS: WELCOME10, ROYAL10, FIRST10, REOTI300
    const FIRST_TIME_COUPONS = ['WELCOME10', 'ROYAL10', 'FIRST10', 'REOTI300'];
    if (FIRST_TIME_COUPONS.includes(normalizedCode)) {
      let hasPreviousOrder = false;

      // Check storeData.json orders
      const storeOrders = getStoreData().orders || [];
      if (cleanPhone || (cleanEmail && cleanEmail !== 'customer@reoti.com')) {
        const foundInStore = storeOrders.some((order: any) => {
          const ordPhone = (order.customerPhone || '').replace(/\D/g, '').slice(-10);
          const ordEmail = (order.customerEmail || '').trim().toLowerCase();
          const phoneMatch = cleanPhone && ordPhone && ordPhone === cleanPhone;
          const emailMatch = cleanEmail && ordEmail && ordEmail === cleanEmail && ordEmail !== 'customer@reoti.com';
          const isNotCancelled = order.status !== 'CANCELLED';
          return (phoneMatch || emailMatch) && isNotCancelled;
        });

        if (foundInStore) {
          hasPreviousOrder = true;
        }
      }

      // Check Prisma DB if not yet found
      if (!hasPreviousOrder && (cleanPhone || (cleanEmail && cleanEmail !== 'customer@reoti.com'))) {
        try {
          const dbOrders = await prisma.order.findMany({
            where: {
              OR: [
                ...(cleanPhone ? [{ customerPhone: { contains: cleanPhone } }] : []),
                ...(cleanEmail && cleanEmail !== 'customer@reoti.com' ? [{ customerEmail: cleanEmail }] : []),
              ],
              NOT: { status: 'CANCELLED' },
            },
          });
          if (dbOrders && dbOrders.length > 0) {
            hasPreviousOrder = true;
          }
        } catch (e) {
          // Fallback gracefully to storeData
        }
      }

      if (hasPreviousOrder) {
        return NextResponse.json({
          valid: false,
          error: 'Coupon "' + normalizedCode + '" is only valid on your first order. We noticed a previous order associated with this phone number/email.',
        });
      }

      // First time order discount calculation (10% OFF)
      const discount = Math.round(cartSubtotal * 0.1);
      return NextResponse.json({
        valid: true,
        code: normalizedCode,
        discountAmount: discount,
        discountPercent: 10,
        message: '🎉 First Order Welcome Discount applied! (10% OFF: -₹' + discount.toLocaleString() + ')',
      });
    }

    // 2. STANDARD REPEATABLE COUPONS
    if (normalizedCode === 'MAHESHWARI10' || normalizedCode === 'REOTI10') {
      const discount = Math.round(cartSubtotal * 0.1);
      return NextResponse.json({
        valid: true,
        code: normalizedCode,
        discountAmount: discount,
        discountPercent: 10,
        message: '✓ Coupon ' + normalizedCode + ' applied! (10% OFF: -₹' + discount.toLocaleString() + ')',
      });
    }

    if (normalizedCode === 'ROYAL5') {
      const discount = Math.round(cartSubtotal * 0.05);
      return NextResponse.json({
        valid: true,
        code: normalizedCode,
        discountAmount: discount,
        discountPercent: 5,
        message: '✓ Coupon ROYAL5 applied! (5% OFF: -₹' + discount.toLocaleString() + ')',
      });
    }

    if (normalizedCode === 'WEAVER100') {
      const discount = Math.min(100, cartSubtotal);
      return NextResponse.json({
        valid: true,
        code: normalizedCode,
        discountAmount: discount,
        message: '✓ Coupon WEAVER100 applied! (-₹' + discount + ')',
      });
    }

    return NextResponse.json({
      valid: false,
      error: 'Invalid coupon code "' + normalizedCode + '". Use "WELCOME10" for 10% Off on your first order.',
    });
  } catch (error: any) {
    return NextResponse.json({ valid: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

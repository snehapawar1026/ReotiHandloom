import { NextRequest, NextResponse } from 'next/server';
import { getAllLeads, createLeadInStore, updateLeadStatusInStore, deleteLeadInStore, logActivityInStore } from '@/lib/storeManager';
import { sendAdminEmail } from '@/lib/notifications';

export async function GET() {
  try {
    const leads = getAllLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, name, email, city, source, productInterest, productUrl, couponCode, notes } = body;

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Mobile / WhatsApp number is required' }, { status: 400 });
    }

    const rawIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const userAgent = req.headers.get('user-agent') || '';
    const device = /Mobile|Android|iPhone/i.test(userAgent) ? '📱 Mobile' : '💻 Desktop';

    const lead = createLeadInStore({
      phone,
      name: name || 'Interested Buyer',
      email: email || null,
      city: city || null,
      source: source || 'POPUP_OFFER',
      productInterest: productInterest || null,
      productUrl: productUrl || null,
      couponCode: couponCode || 'ROYAL10',
      notes: notes || '',
      device,
      userIp: rawIp,
    });

    const leadTitle = `🔥 New High-Intent Lead: ${name || 'Customer'} (${phone})`;
    const leadDetails = `Phone: ${phone} | City: ${city || 'India'} | Interest: ${productInterest || 'General Handloom Collection'} | Source: ${source || 'Website Offer'}`;

    // Log in Store Activity
    logActivityInStore({
      type: 'LEAD',
      title: leadTitle,
      details: leadDetails,
      userPhone: phone,
      userEmail: email || null,
      userIp: rawIp,
      location: city || 'India',
      device,
    });

    // Send Instant Admin Alert Email
    sendAdminEmail({
      title: leadTitle,
      type: 'INQUIRY',
      details: leadDetails,
      userEmail: email || undefined,
      userPhone: phone,
    }).catch(() => {});

    return NextResponse.json({ success: true, lead, couponCode: lead.couponCode });
  } catch (error: any) {
    console.error('Lead capture error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Lead ID and status are required' }, { status: 400 });
    }

    const updated = updateLeadStatusInStore(id, status, notes);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Lead ID is required' }, { status: 400 });
    }

    deleteLeadInStore(id);
    return NextResponse.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

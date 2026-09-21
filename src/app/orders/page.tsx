'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import {
  Package,
  Truck,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Star,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  MapPin,
  Sparkles,
  RotateCcw,
  Receipt,
  Phone,
  ShieldCheck,
  ChevronRight,
  X,
  Printer,
  Copy,
  FileText,
  RefreshCw,
  Calendar,
  BadgeCheck,
  HelpCircle,
  Download
} from 'lucide-react';

function OrdersPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || searchParams.get('phone') || searchParams.get('id') || '';

  const { user, addToCart, setIsCartOpen } = useShop();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED'>('ALL');

  // Interactive Live Tracking Modal State
  const [trackingModalOrder, setTrackingModalOrder] = useState<any | null>(null);

  // Official Printable Tax Invoice Modal State
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<any | null>(null);

  // Return / Exchange Modal State
  const [returnModalOrder, setReturnModalOrder] = useState<any | null>(null);
  const [returnReason, setReturnReason] = useState('Want to exchange with a different saree or color');
  const [returnNote, setReturnNote] = useState('');

  // Customer Cancellation modal state
  const [cancellingOrder, setCancellingOrder] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState('Want to choose different saree or color');
  const [cancelNote, setCancelNote] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Rating & Review modal state (Myntra style)
  const [reviewOrder, setReviewOrder] = useState<any | null>(null);
  const [reviewProduct, setReviewProduct] = useState<any | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewHoverRating, setReviewHoverRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  // Copied AWB toast state
  const [copiedAwb, setCopiedAwb] = useState(false);

  // Auto-search on mount if user is logged in or query param exists
  useEffect(() => {
    let q = initialQuery;
    if (!q && user) {
      q = user.phone || user.email || '';
    }

    if (q) {
      setSearchQuery(q);
      fetchOrders(q);
    } else {
      // Do NOT fetch all orders for unauthenticated guests (protects customer privacy)
      setOrders([]);
      setHasSearched(false);
      setIsLoading(false);
    }
  }, [user, initialQuery]);

  const fetchOrders = async (queryText: string) => {
    const cleanQ = (queryText || '').trim();
    if (!cleanQ) {
      setOrders([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const param = `?query=${encodeURIComponent(cleanQ)}`;
      const res = await fetch(`/api/orders${param}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching customer orders:', err);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(searchQuery);
  };

  const getStepActive = (status: string, step: number) => {
    const s = (status || '').toUpperCase();
    if (s === 'DELIVERED') return true;
    if (step === 1) return true; // Order Placed
    if (step === 2) return ['CONFIRMED', 'PACKED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(s);
    if (step === 3) return ['PACKED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(s);
    if (step === 4) return ['SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(s);
    if (step === 5) return ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(s);
    if (step === 6) return s === 'DELIVERED';
    return false;
  };

  const getAutoTrackingUrl = (courierName: string, trackNo: string, existingUrl?: string) => {
    if (existingUrl) return existingUrl;
    if (!trackNo) return null;
    const c = (courierName || '').toLowerCase();
    if (c.includes('anjani')) return 'https://www.shreeanjanicourier.com/';
    if (c.includes('maruti')) return 'https://track.shreemaruti.com/';
    if (c.includes('dtdc')) return `https://track.dtdc.com/ctrack/track?strRefNo=${trackNo}`;
    if (c.includes('delhivery')) return `https://www.delhivery.com/track/package/${trackNo}`;
    if (c.includes('blue')) return 'https://www.bluedart.com/tracking';
    if (c.includes('post') || c.includes('speed')) return 'https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx';
    if (c.includes('shiprocket')) return `https://shiprocket.co/tracking/${trackNo}`;
    return null;
  };

  const handleConfirmCancelOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingOrder) return;

    setIsCancelling(true);
    const fullReason = `${cancelReason}${cancelNote.trim() ? ` (${cancelNote.trim()})` : ''}`;

    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: cancellingOrder.id,
          status: 'CANCELLED',
          cancellationReason: `Cancelled by Customer: ${fullReason}`,
          notes: `Customer cancelled on My Orders page. Reason: ${fullReason}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === cancellingOrder.id
              ? { ...o, status: 'CANCELLED', cancellationReason: `Cancelled by Customer: ${fullReason}` }
              : o
          )
        );
        setActionSuccessMsg(`✓ Order #${cancellingOrder.orderNumber || cancellingOrder.id} has been cancelled successfully.`);
        setTimeout(() => setActionSuccessMsg(''), 5000);

        // Notify Maheshwar WhatsApp Desk
        const isPaid = (cancellingOrder.paymentMethod || '').toLowerCase().includes('razorpay') || cancellingOrder.paymentStatus === 'PAID';
        const refundInfo = isPaid
          ? `Refund of ₹${Number(cancellingOrder.totalAmount || 0).toLocaleString()} will be automatically processed.`
          : `Cash on Delivery Order (Zero refund required).`;

        const waMsg = encodeURIComponent(
          `Dear Reoti Handloom Team,\n\n` +
          `I have requested cancellation for my order:\n` +
          `📦 *Order ID:* #${cancellingOrder.orderNumber || cancellingOrder.id}\n` +
          `👤 *Customer Name:* ${cancellingOrder.customerName}\n` +
          `⚠️ *Reason:* ${fullReason}\n` +
          `💳 *Payment:* ${refundInfo}\n\n` +
          `Please confirm the cancellation. Thank you!`
        );

        try {
          window.open(`https://wa.me/919617444445?text=${waMsg}`, '_blank');
        } catch (e) {}

        setCancellingOrder(null);
      } else {
        alert(data.error || 'Failed to cancel order. Please contact support.');
      }
    } catch (err: any) {
      alert('Error connecting to server: ' + err.message);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleOpenReviewModal = (order: any, item: any) => {
    setReviewOrder(order);
    setReviewProduct(item.product || item);
    setReviewerName(order.customerName || user?.name || '');
    setReviewRating(5);
    setReviewComment('');
    setReviewSuccessMsg('');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewProduct || !reviewComment.trim()) {
      alert('Please write your review feedback.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const prodId = reviewProduct.id || reviewProduct.productId;
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: prodId,
          userName: reviewerName.trim() || 'Verified Handloom Connoisseur',
          userEmail: reviewOrder?.customerEmail || user?.email || null,
          rating: reviewRating,
          comment: reviewComment.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReviewSuccessMsg('🌸 Thank you for your 5-star review! Your feedback empowers our traditional Maheshwar artisans.');
        setTimeout(() => {
          setReviewOrder(null);
          setReviewProduct(null);
          setReviewSuccessMsg('');
        }, 2500);
      } else {
        alert(data.error || 'Failed to submit review');
      }
    } catch (err: any) {
      alert('Error submitting review: ' + err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Filtered orders list
  const filteredOrders = orders.filter((o) => {
    const s = (o.status || 'PROCESSING').toUpperCase();
    if (activeTab === 'ACTIVE') {
      return ['PROCESSING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(s);
    }
    if (activeTab === 'DELIVERED') {
      return s === 'DELIVERED';
    }
    if (activeTab === 'CANCELLED') {
      return s === 'CANCELLED' || s === 'RETURNED' || s === 'RTO';
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-50/70 font-sans pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-[#4A0E17] to-neutral-950 text-white py-10 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-amber-300/80 mb-3 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-amber-400/60" />
            <span className="text-amber-200 font-bold">My Orders & Tracking</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-amber-400 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>CUSTOMER ORDER FULFILLMENT HUB</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-amber-100 mt-1">
                My Orders & Real-Time Tracking
              </h1>
              <p className="text-xs text-amber-200/80 mt-1 max-w-xl">
                Track your authentic Maheshwari parcels live, download tax invoices, manage order cancellations, or write product reviews for our master weavers.
              </p>
            </div>

            {/* Quick WhatsApp Support Help */}
            <a
              href="https://wa.me/919617444445?text=Hello%20Reoti%20Handloom%2C%20I%20have%20an%20inquiry%20regarding%20my%20orders."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all self-start md:self-auto shrink-0"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Maheshwar Helpdesk</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Search & Lookup Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-amber-200/80 space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter 10-Digit Mobile Number (e.g. 9617444445) or Order ID (e.g. #REOTI-123456)..."
                className="w-full bg-amber-50/30 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-800 focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-amber-950 hover:bg-black text-amber-100 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {isLoading ? <Clock className="w-4 h-4 animate-spin text-amber-300" /> : <Search className="w-4 h-4 text-amber-300" />}
              <span>Find My Orders</span>
            </button>
          </form>

          <p className="text-[11px] text-gray-500">
            💡 <strong>Tip:</strong> Entering your 10-digit mobile number will display all orders placed by you across all collections.
          </p>
        </div>

        {/* Action Success Toast */}
        {actionSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 font-bold text-xs flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button onClick={() => setActionSuccessMsg('')} className="text-emerald-700 hover:text-emerald-950 font-black cursor-pointer">✕</button>
          </div>
        )}

        {/* Filter Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'ALL'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-amber-50/50'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>All Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'ACTIVE'
                ? 'bg-indigo-900 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-indigo-50/50'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Active & Dispatched ({orders.filter((o) => ['PROCESSING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes((o.status || '').toUpperCase())).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('DELIVERED')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'DELIVERED'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-emerald-50/50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Delivered ({orders.filter((o) => (o.status || '').toUpperCase() === 'DELIVERED').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CANCELLED')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'CANCELLED'
                ? 'bg-rose-900 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-rose-50/50'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Cancelled ({orders.filter((o) => ['CANCELLED', 'RETURNED', 'RTO'].includes((o.status || '').toUpperCase())).length})</span>
          </button>
        </div>

        {/* Orders Listing */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3 bg-white border border-amber-200/80 rounded-2xl">
            <Clock className="w-8 h-8 text-amber-700 animate-spin mx-auto" />
            <p className="font-bold text-gray-700 text-sm">Retrieving your order records & tracking status...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-14 text-center space-y-4 bg-white border border-dashed border-amber-200 rounded-2xl p-6 sm:p-8">
            <div className="w-16 h-16 bg-amber-50 text-amber-800 rounded-full flex items-center justify-center mx-auto border border-amber-200">
              {hasSearched ? <Package className="w-8 h-8 text-amber-700" /> : <Search className="w-8 h-8 text-amber-700" />}
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="font-serif font-bold text-base text-gray-900">
                {hasSearched ? 'No Orders Found' : 'Private & Secure Order Lookup'}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {hasSearched
                  ? `We could not find any order matching "${searchQuery}". Please verify your 10-digit mobile number or Order ID and try again.`
                  : 'Enter your 10-digit mobile number or Order ID in the search box above to view your personalized order history and live shipment tracking.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              {!user && (
                <Link
                  href="/login?redirect=orders"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-950 hover:bg-black text-amber-100 font-bold text-xs rounded-xl shadow-xs transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>Sign In for 1-Click Order History</span>
                </Link>
              )}

              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-gray-800 font-bold text-xs rounded-xl border border-gray-300 transition-all"
              >
                <span>Explore Handloom Sarees</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-800" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              let orderItems: any[] = [];
              try {
                orderItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items || [];
              } catch (e) {}

              const orderStatus = (order.status || 'PROCESSING').toUpperCase();
              const isCod = (order.paymentMethod || '').toUpperCase().includes('COD') || (order.paymentMethod || '').toUpperCase().includes('CASH') || order.paymentStatus === 'PENDING_COD';
              const isPaid = order.paymentStatus === 'PAID';
              const courier = order.courierPartner || 'Reoti Handloom Express';
              const trackingNumber = order.trackingNumber || '';
              const trackingUrl = getAutoTrackingUrl(courier, trackingNumber, order.trackingUrl);
              const orderId = order.orderNumber || order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:border-amber-400 transition-all font-sans"
                >
                  {/* Order Top Header Strip (Myntra/Amazon style) */}
                  <div className="bg-gradient-to-r from-amber-50 via-stone-50 to-amber-50 px-4 sm:px-6 py-3.5 border-b border-amber-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="p-2 bg-amber-950 text-amber-100 rounded-xl font-bold font-mono text-xs shadow-xs">
                        #{orderId}
                      </div>
                      <div>
                        <span className="font-mono text-gray-500 text-[11px] block">
                          Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="font-extrabold text-gray-900 text-xs sm:text-sm">
                          {order.customerName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Payment Status Badge */}
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                        isCod
                          ? isPaid
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-amber-100 text-amber-950 border-amber-400'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}>
                        {isCod
                          ? isPaid
                            ? '💵 COD (Paid ✓)'
                            : `💵 COD (Pay ₹${Number(order.totalAmount).toLocaleString()} on Delivery)`
                          : `💳 Paid Online (₹${Number(order.totalAmount).toLocaleString()})`}
                      </span>

                      {/* Status Badge */}
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                        orderStatus === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : orderStatus === 'CANCELLED' || orderStatus === 'RETURNED'
                          ? 'bg-rose-100 text-rose-900 border-rose-300'
                          : orderStatus === 'SHIPPED' || orderStatus === 'IN_TRANSIT' || orderStatus === 'OUT_FOR_DELIVERY'
                          ? 'bg-blue-100 text-blue-900 border-blue-300'
                          : 'bg-amber-100 text-amber-950 border-amber-300'
                      }`}>
                        {orderStatus === 'CANCELLED' ? '❌ Cancelled' : orderStatus === 'RETURNED' ? '↩️ Returned / RTO' : orderStatus.replace(/_/g, ' ')}
                      </span>

                      {/* Header Quick Buttons */}
                      <button
                        type="button"
                        onClick={() => setTrackingModalOrder(order)}
                        className="px-3 py-1 bg-amber-900 hover:bg-black text-amber-100 font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer text-[11px] shadow-xs"
                      >
                        <Truck className="w-3 h-3 text-amber-300" />
                        <span>Track Parcel</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setInvoiceModalOrder(order)}
                        className="px-2.5 py-1 bg-white hover:bg-stone-100 text-gray-700 border border-gray-300 font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer text-[11px]"
                      >
                        <FileText className="w-3 h-3 text-amber-800" />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* Visual Shipment Progress Bar (If not cancelled) */}
                  {orderStatus !== 'CANCELLED' && orderStatus !== 'RETURNED' && (
                    <div className="px-4 sm:px-6 py-4 bg-amber-50/30 border-b border-amber-100/60">
                      <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold">
                        {/* Step 1: Placed */}
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold mb-1 shadow-2xs ${
                            getStepActive(orderStatus, 1) ? 'bg-emerald-700 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            ✓
                          </div>
                          <span className={getStepActive(orderStatus, 1) ? 'text-emerald-950 font-extrabold' : 'text-gray-400'}>
                            Order Placed
                          </span>
                        </div>

                        {/* Step 2: Confirmed & Packed */}
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold mb-1 shadow-2xs ${
                            getStepActive(orderStatus, 2) ? 'bg-emerald-700 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {getStepActive(orderStatus, 2) ? '✓' : '2'}
                          </div>
                          <span className={getStepActive(orderStatus, 2) ? 'text-emerald-950 font-extrabold' : 'text-gray-400'}>
                            Confirmed & Packed
                          </span>
                        </div>

                        {/* Step 3: Dispatched */}
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold mb-1 shadow-2xs ${
                            getStepActive(orderStatus, 4) ? 'bg-emerald-700 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {getStepActive(orderStatus, 4) ? '✓' : '3'}
                          </div>
                          <span className={getStepActive(orderStatus, 4) ? 'text-emerald-950 font-extrabold' : 'text-gray-400'}>
                            Dispatched
                          </span>
                        </div>

                        {/* Step 4: Delivered */}
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold mb-1 shadow-2xs ${
                            getStepActive(orderStatus, 6) ? 'bg-emerald-700 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {getStepActive(orderStatus, 6) ? '✓' : '4'}
                          </div>
                          <span className={getStepActive(orderStatus, 6) ? 'text-emerald-950 font-extrabold' : 'text-gray-400'}>
                            Delivered
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cancelled Banner */}
                  {(orderStatus === 'CANCELLED' || orderStatus === 'RETURNED') && (
                    <div className="p-4 bg-rose-50 border-b border-rose-200 text-rose-950 text-xs space-y-1">
                      <div className="flex items-center gap-2 font-bold text-rose-900">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span>This order was cancelled</span>
                      </div>
                      {order.cancellationReason && (
                        <p className="text-[11px] text-rose-800">
                          <strong>Reason:</strong> {order.cancellationReason}
                        </p>
                      )}
                      <p className="text-[11px] text-rose-700 leading-relaxed">
                        {isCod
                          ? '💵 Cash on Delivery Order: Zero payment was charged. No refund required.'
                          : '💳 Full refund will be automatically credited to your original payment method in 3-5 business days.'}
                      </p>
                    </div>
                  )}

                  {/* Main Card Body */}
                  <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Items Breakdown (7 Cols) */}
                    <div className="lg:col-span-7 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                          Ordered Items ({orderItems.length || 1})
                        </span>
                        {order.estimatedDelivery && (
                          <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <Calendar className="w-3 h-3 text-emerald-600" />
                            <span>{orderStatus === 'DELIVERED' ? 'Delivered' : `Arriving: ${order.estimatedDelivery}`}</span>
                          </span>
                        )}
                      </div>

                      <div className="space-y-3">
                        {orderItems.length > 0 ? (
                          orderItems.map((item: any, idx: number) => {
                            const prod = item.product || item;
                            const title = prod?.title || 'Authentic Maheshwari Handloom Saree';
                            const slug = prod?.slug || '';
                            const img = prod?.image || (prod?.images ? (typeof prod.images === 'string' ? JSON.parse(prod.images)[0] : prod.images[0]) : '/uploads/saree_1789221965397_lf0kg.jpeg');
                            const price = item.price || prod?.price || order.totalAmount;
                            const qty = item.quantity || 1;

                            return (
                              <div
                                key={idx}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-stone-50 rounded-xl border border-gray-200/80 hover:border-amber-300 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-16 h-18 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0">
                                    <img src={img} alt={title} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="text-xs space-y-0.5">
                                    {slug ? (
                                      <Link href={`/products/${slug}`} className="font-bold text-gray-900 hover:text-[#581C1C] transition-colors line-clamp-1">
                                        {title}
                                      </Link>
                                    ) : (
                                      <h5 className="font-bold text-gray-900 line-clamp-1">{title}</h5>
                                    )}
                                    <p className="text-[11px] text-gray-500">
                                      Qty: <span className="font-bold text-gray-900">{qty}</span> • Price: <span className="font-bold text-rose-800">₹{Number(price).toLocaleString()}</span>
                                    </p>
                                    <div className="flex items-center gap-1.5 pt-0.5">
                                      <span className="text-[10px] text-amber-900 font-serif italic bg-amber-100/60 px-1.5 py-0.2 rounded border border-amber-200/60">
                                        Pure Handloom
                                      </span>
                                      <span className="text-[10px] text-gray-500">Maheshwar Origin</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Item Quick Actions (Buy Again & Review) */}
                                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                  {/* Buy Again Button */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      addToCart(prod, { hasFallPico: Boolean(item.hasFallPico) });
                                      setIsCartOpen(true);
                                    }}
                                    className="px-3 py-1.5 bg-white hover:bg-amber-50 text-gray-800 border border-gray-300 hover:border-amber-700 font-bold text-[11px] rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <RefreshCw className="w-3 h-3 text-amber-800" />
                                    <span>Buy Again</span>
                                  </button>

                                  {/* Review CTA if Delivered */}
                                  {orderStatus === 'DELIVERED' && (
                                    <button
                                      type="button"
                                      onClick={() => handleOpenReviewModal(order, item)}
                                      className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-[11px] rounded-lg border border-amber-300 transition-all flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs"
                                    >
                                      <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                                      <span>Rate & Review</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600 font-medium">
                            Authentic Handloom Saree • Total: ₹{Number(order.totalAmount).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delivery Destination & Courier Details (5 Cols) */}
                    <div className="lg:col-span-5 space-y-3.5 text-xs bg-amber-50/40 p-4 rounded-xl border border-amber-200/80">
                      {/* Destination */}
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-950 flex items-center gap-1 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-600" />
                          <span>Delivery Address</span>
                        </span>
                        <p className="text-gray-800 font-medium text-[11px] leading-relaxed">
                          {order.shippingAddress || 'Maheshwar, Madhya Pradesh'}
                        </p>
                        <p className="font-mono font-bold text-gray-900 text-[11px] mt-1">
                          Contact: +91 {order.customerPhone}
                        </p>
                      </div>

                      {/* Courier & Tracking Details Box */}
                      <div className="pt-2 border-t border-amber-200 space-y-2 text-[11px]">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Logistics Partner:</span>
                          <span className="font-bold text-gray-900">{courier}</span>
                        </div>

                        {trackingNumber ? (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 font-medium">AWB Tracking No:</span>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-amber-950 bg-white px-2 py-0.5 rounded border border-amber-300">
                                  {trackingNumber}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(trackingNumber);
                                    setCopiedAwb(true);
                                    setTimeout(() => setCopiedAwb(false), 2000);
                                  }}
                                  className="p-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 cursor-pointer"
                                  title="Copy Tracking Number"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 font-medium">Estimated Delivery:</span>
                              <span className="font-bold text-emerald-800">{order.estimatedDelivery || '3-5 Business Days'}</span>
                            </div>
                          </>
                        ) : (
                          <div className="p-2.5 bg-amber-100/50 rounded-lg border border-amber-200 text-[11px] text-amber-900 space-y-0.5">
                            <p className="font-bold">⚡ Workshop Preparation Active</p>
                            <p className="text-[10px] text-amber-950/80">Dispatches within 24 hours via Express Air Courier from Maheshwar.</p>
                          </div>
                        )}

                        {/* Interactive Primary Track Parcel Button */}
                        <div className="pt-1 flex flex-col gap-1.5">
                          <button
                            type="button"
                            onClick={() => setTrackingModalOrder(order)}
                            className="w-full py-2 bg-gradient-to-r from-amber-950 via-[#581C1C] to-neutral-950 hover:from-black hover:to-black text-amber-100 font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
                          >
                            <Truck className="w-4 h-4 text-amber-300" />
                            <span>Track Parcel & Live Journey</span>
                          </button>

                          {trackingUrl && (
                            <a
                              href={trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-1.5 bg-white hover:bg-stone-100 text-gray-800 border border-gray-300 font-bold rounded-xl text-center transition-all flex items-center justify-center gap-1 cursor-pointer text-[11px]"
                            >
                              <span>Direct Courier Website Tracking</span>
                              <ExternalLink className="w-3 h-3 text-amber-700" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Action Links (Cancel, Return, Invoice, WhatsApp) */}
                      <div className="pt-2 border-t border-amber-200 space-y-1.5">
                        <div className="grid grid-cols-2 gap-2">
                          {/* Invoice Button */}
                          <button
                            type="button"
                            onClick={() => setInvoiceModalOrder(order)}
                            className="w-full py-1.5 bg-white hover:bg-stone-50 text-gray-800 border border-gray-300 font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer text-[11px]"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-800" />
                            <span>Tax Invoice</span>
                          </button>

                          {/* Cancellation Option (before dispatch) */}
                          {['PROCESSING', 'CONFIRMED', 'PACKED'].includes(orderStatus) ? (
                            <button
                              type="button"
                              onClick={() => setCancellingOrder(order)}
                              className="w-full py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer text-[11px]"
                            >
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Cancel Order</span>
                            </button>
                          ) : orderStatus === 'DELIVERED' ? (
                            /* Return / Exchange (after delivery) */
                            <button
                              type="button"
                              onClick={() => setReturnModalOrder(order)}
                              className="w-full py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer text-[11px]"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-amber-800" />
                              <span>Return / Swap</span>
                            </button>
                          ) : (
                            <span className="w-full py-1.5 bg-blue-50 text-blue-900 border border-blue-200 font-bold rounded-lg text-center text-[10px] flex items-center justify-center">
                              In Courier Transit
                            </span>
                          )}
                        </div>

                        {/* WhatsApp Support Query */}
                        <a
                          href={`https://wa.me/919617444445?text=${encodeURIComponent(`Namaste Reoti Handloom! I need help regarding my Order #${orderId} (${order.customerName}).`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp Maheshwar Support</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Copy AWB Toast */}
      {copiedAwb && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-amber-100 px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 border border-amber-400/40 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Tracking AWB copied to clipboard!</span>
        </div>
      )}

      {/* MODAL 1: Live Parcel Tracking Modal (Amazon/Myntra Style) */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-amber-300 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-950 via-[#581C1C] to-neutral-950 p-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-400/20 rounded-xl border border-amber-400/30">
                  <Truck className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-amber-100">
                    Live Parcel Journey & Tracking
                  </h4>
                  <p className="text-[11px] text-amber-200/80">
                    Order #{trackingModalOrder.orderNumber || trackingModalOrder.id} • {trackingModalOrder.customerName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTrackingModalOrder(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs font-sans">
              {/* Courier & AWB Summary Card */}
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">Logistics Partner</span>
                    <span className="text-sm font-extrabold text-gray-900">
                      {trackingModalOrder.courierPartner || 'Shree Anjani / Delhivery Express'}
                    </span>
                  </div>

                  {trackingModalOrder.trackingNumber ? (
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">AWB / Consignment No</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-extrabold text-amber-950 bg-white px-2.5 py-0.5 rounded border border-amber-300 text-xs">
                          {trackingModalOrder.trackingNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(trackingModalOrder.trackingNumber);
                            setCopiedAwb(true);
                            setTimeout(() => setCopiedAwb(false), 2000);
                          }}
                          className="p-1 rounded bg-amber-200 hover:bg-amber-300 text-amber-900 cursor-pointer"
                          title="Copy AWB"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-amber-800 block">Dispatch Status</span>
                      <span className="text-xs font-bold text-emerald-800">Packing in Maheshwar Loom</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-amber-200/80 flex flex-wrap items-center justify-between text-[11px]">
                  <span className="text-gray-600">
                    Estimated Delivery: <strong className="text-emerald-800">{trackingModalOrder.estimatedDelivery || '3-5 Business Days'}</strong>
                  </span>
                  <span className="text-gray-600">
                    Destination: <strong className="text-gray-900">{trackingModalOrder.shippingAddress?.split(',').slice(-2).join(', ') || 'Madhya Pradesh'}</strong>
                  </span>
                </div>

                {/* Direct Courier Website Tracking Button */}
                {getAutoTrackingUrl(trackingModalOrder.courierPartner, trackingModalOrder.trackingNumber, trackingModalOrder.trackingUrl) && (
                  <div className="pt-2">
                    <a
                      href={getAutoTrackingUrl(trackingModalOrder.courierPartner, trackingModalOrder.trackingNumber, trackingModalOrder.trackingUrl)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-amber-950 hover:bg-black text-amber-100 font-bold rounded-xl text-center transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs text-xs"
                    >
                      <span>Open Live Tracking on {trackingModalOrder.courierPartner || 'Courier'} Portal</span>
                      <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                    </a>
                  </div>
                )}
              </div>

              {/* Detailed 6-Step Visual Timeline */}
              <div className="space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-700 block">
                  Shipment Milestones & Quality Journey
                </span>

                {(() => {
                  const s = (trackingModalOrder.status || 'PROCESSING').toUpperCase();
                  const orderDate = new Date(trackingModalOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

                  const steps = [
                    {
                      title: 'Order Placed & Payment Verified',
                      desc: `Order #${trackingModalOrder.orderNumber || trackingModalOrder.id} logged in system. Payment: ${trackingModalOrder.paymentMethod || 'Confirmed'}.`,
                      time: `${orderDate}`,
                      done: true,
                    },
                    {
                      title: 'Master Weaver Quality Inspection',
                      desc: 'Authentic Maheshwari loom fabric, zari border, and weaving integrity inspected by master artisan.',
                      time: ['CONFIRMED', 'PACKED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(s) ? 'Quality Passed' : 'In Progress',
                      done: ['CONFIRMED', 'PACKED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(s),
                    },
                    {
                      title: 'Heritage Packaging & Silk Seal',
                      desc: 'Carefully wrapped with protective butter paper inside a royal Reoti Handloom package.',
                      time: ['PACKED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(s) ? 'Package Sealed' : 'Awaiting Packing',
                      done: ['PACKED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(s),
                    },
                    {
                      title: `Handed Over to ${trackingModalOrder.courierPartner || 'Courier Partner'}`,
                      desc: trackingModalOrder.trackingNumber ? `Dispatched with AWB Tracking: ${trackingModalOrder.trackingNumber}` : 'Courier pickup scheduled from Maheshwar center.',
                      time: ['SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(s) ? 'Dispatched' : 'Pending Handover',
                      done: ['SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(s),
                    },
                    {
                      title: 'In Transit / Out for Delivery',
                      desc: 'Parcel moving swiftly towards your doorstep via fastest express courier route.',
                      time: ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(s) ? 'In Transit' : 'Pending',
                      done: ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(s),
                    },
                    {
                      title: 'Delivered Safely to Customer',
                      desc: 'Handed over in pristine handloom condition to recipient.',
                      time: s === 'DELIVERED' ? 'Delivered ✓' : 'Expected 3-5 Days',
                      done: s === 'DELIVERED',
                    },
                  ];

                  return (
                    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-amber-200">
                      {steps.map((st, i) => (
                        <div key={i} className="relative">
                          <div
                            className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shadow-xs ${
                              st.done ? 'bg-emerald-700 text-white ring-4 ring-emerald-100' : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            {st.done ? '✓' : i + 1}
                          </div>
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <h5 className={`font-bold text-xs ${st.done ? 'text-gray-900' : 'text-gray-400'}`}>
                                {st.title}
                              </h5>
                              <span className={`text-[10px] font-mono font-bold ${st.done ? 'text-emerald-700' : 'text-gray-400'}`}>
                                {st.time}
                              </span>
                            </div>
                            <p className={`text-[11px] mt-0.5 ${st.done ? 'text-gray-600' : 'text-gray-400'}`}>
                              {st.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Support Query */}
              <div className="p-3 bg-stone-50 rounded-xl border border-gray-200 flex items-center justify-between gap-2">
                <div className="text-[11px] text-gray-600">
                  <span>Questions about your shipment?</span>
                </div>
                <a
                  href={`https://wa.me/919617444445?text=${encodeURIComponent(`Namaste Reoti Handloom! I am checking tracking for Order #${trackingModalOrder.orderNumber || trackingModalOrder.id}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Support</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Official Printable Tax Invoice Modal */}
      {invoiceModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-300 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-neutral-900 px-5 py-3.5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h4 className="font-serif font-bold text-sm text-amber-100">
                  Official GST Tax Invoice & Receipt
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInvoiceModalOrder(null)}
                  className="p-1 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Sheet */}
            <div className="p-6 sm:p-8 overflow-y-auto font-sans text-xs text-gray-900 space-y-6 print:p-0">
              {/* Brand Header */}
              <div className="flex items-start justify-between border-b-2 border-amber-900/40 pb-4">
                <div>
                  <h2 className="font-serif font-black text-2xl text-[#581C1C] tracking-tight">
                    Reoti Handloom
                  </h2>
                  <p className="text-[10px] text-gray-600 italic">Authentic Maheshwari Handloom Sarees & Suits</p>
                  <p className="text-[10px] text-gray-600 mt-1">
                    Fort Road, Near Ahilya Fort, Maheshwar, MP - 451224<br />
                    GSTIN: 23AABCR1234F1Z8 | Contact: +91 9617444445
                  </p>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-950 font-mono font-bold text-[10px] rounded border border-amber-300">
                    TAX INVOICE
                  </span>
                  <p className="font-mono font-bold text-sm text-gray-900">
                    #{invoiceModalOrder.orderNumber || invoiceModalOrder.id}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Date: {new Date(invoiceModalOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Customer & Order Metadata */}
              <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-gray-200 text-[11px]">
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Billed & Shipped To:</span>
                  <p className="font-bold text-gray-900">{invoiceModalOrder.customerName}</p>
                  <p className="text-gray-700 leading-relaxed">{invoiceModalOrder.shippingAddress}</p>
                  <p className="font-mono font-semibold text-gray-900 mt-1">Mobile: +91 {invoiceModalOrder.customerPhone}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Order Details:</span>
                  <p><span className="text-gray-500">Payment Mode:</span> <strong className="text-gray-900">{invoiceModalOrder.paymentMethod || 'Prepaid'}</strong></p>
                  <p><span className="text-gray-500">Payment Status:</span> <strong className="text-emerald-800">{invoiceModalOrder.paymentStatus || 'PAID'}</strong></p>
                  <p><span className="text-gray-500">Logistics Partner:</span> <strong className="text-gray-900">{invoiceModalOrder.courierPartner || 'Handloom Express'}</strong></p>
                  {invoiceModalOrder.trackingNumber && (
                    <p><span className="text-gray-500">AWB Tracking:</span> <strong className="font-mono text-amber-950">{invoiceModalOrder.trackingNumber}</strong></p>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-amber-950 text-amber-100 font-bold text-[11px]">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Handloom Product Description</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Total (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {(() => {
                      let items: any[] = [];
                      try {
                        items = typeof invoiceModalOrder.items === 'string' ? JSON.parse(invoiceModalOrder.items) : invoiceModalOrder.items || [];
                      } catch (e) {}

                      if (items.length === 0) {
                        return (
                          <tr>
                            <td className="p-3">1</td>
                            <td className="p-3 font-semibold">Authentic Maheshwari Handloom Saree</td>
                            <td className="p-3 text-center">1</td>
                            <td className="p-3 text-right">₹{Number(invoiceModalOrder.totalAmount).toLocaleString()}</td>
                            <td className="p-3 text-right font-bold">₹{Number(invoiceModalOrder.totalAmount).toLocaleString()}</td>
                          </tr>
                        );
                      }

                      return items.map((it: any, i: number) => {
                        const p = it.product || it;
                        const price = it.price || p.price || invoiceModalOrder.totalAmount;
                        const qty = it.quantity || 1;
                        const total = price * qty;
                        return (
                          <tr key={i} className="hover:bg-amber-50/30">
                            <td className="p-3 text-gray-500">{i + 1}</td>
                            <td className="p-3">
                              <p className="font-bold text-gray-900">{p.title || 'Maheshwari Saree'}</p>
                              <p className="text-[10px] text-gray-500 font-serif italic">HSN: 5208 • 100% Authentic Handloom Silk-Cotton</p>
                            </td>
                            <td className="p-3 text-center font-bold">{qty}</td>
                            <td className="p-3 text-right font-mono">₹{Number(price).toLocaleString()}</td>
                            <td className="p-3 text-right font-mono font-bold text-gray-900">₹{Number(total).toLocaleString()}</td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Price Calculation Summary */}
              <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{Number(invoiceModalOrder.totalAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (5% Included):</span>
                    <span className="font-mono">₹{Math.round(Number(invoiceModalOrder.totalAmount) * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Insured Shipping:</span>
                    <span className="font-bold text-emerald-800">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-[#581C1C] border-t-2 border-amber-900/40 pt-2">
                    <span>Total Paid / Payable:</span>
                    <span className="font-mono">₹{Number(invoiceModalOrder.totalAmount).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Official Seal & Notes */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-500">
                <div>
                  <p className="font-bold text-gray-700">Authenticity Guarantee</p>
                  <p>Certified pure Maheshwari loom craft with Silk Mark assurance.</p>
                </div>
                <div className="text-right">
                  <div className="inline-block px-3 py-1 rounded border border-amber-300 bg-amber-50 text-amber-900 font-serif font-bold italic">
                    Reoti Handloom Authorized
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Return / Exchange Request Modal */}
      {returnModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-amber-300 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-950 via-[#581C1C] to-neutral-950 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-300" />
                <h4 className="font-serif font-bold text-sm text-amber-100">
                  Return or Exchange Request
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setReturnModalOrder(null)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs font-sans">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <p className="font-bold text-amber-950">
                  Order #{returnModalOrder.orderNumber || returnModalOrder.id}
                </p>
                <p className="text-[11px] text-amber-900">
                  🌸 7-Day Easy Exchange Policy: We ensure 100% customer happiness with free exchanges or hassle-free doorstep returns.
                </p>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Reason for Return / Exchange *
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-2.5 bg-white text-gray-900 font-medium outline-none focus:ring-2 focus:ring-amber-800"
                >
                  <option value="Want to exchange with a different saree or color">Want to exchange with a different saree or color</option>
                  <option value="Fabric / Drape inquiry">Fabric / Drape inquiry</option>
                  <option value="Received incorrect product or shade">Received incorrect product or shade</option>
                  <option value="Defect or transit issue">Defect or transit issue</option>
                  <option value="Other reason">Other reason</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Additional Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Which color or saree would you like to exchange with?"
                  value={returnNote}
                  onChange={(e) => setReturnNote(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-amber-800 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setReturnModalOrder(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const fullReason = `${returnReason}${returnNote.trim() ? ` (${returnNote.trim()})` : ''}`;
                    const waMsg = encodeURIComponent(
                      `Namaste Reoti Handloom Team,\n\n` +
                      `I would like to request a Return / Exchange for my order:\n` +
                      `📦 *Order ID:* #${returnModalOrder.orderNumber || returnModalOrder.id}\n` +
                      `👤 *Customer Name:* ${returnModalOrder.customerName}\n` +
                      `⚠️ *Reason:* ${fullReason}\n\n` +
                      `Please guide me on the pickup / exchange procedure. Thank you!`
                    );
                    window.open(`https://wa.me/919617444445?text=${waMsg}`, '_blank');
                    setReturnModalOrder(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-950 hover:bg-black text-amber-100 font-extrabold shadow-sm cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Submit to Maheshwar Desk</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Customer Cancel Order Modal */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-rose-300 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-950 to-neutral-950 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-300" />
                <h4 className="font-serif font-bold text-sm text-rose-100">
                  Cancel Order #{cancellingOrder.orderNumber || cancellingOrder.id}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setCancellingOrder(null)}
                className="text-white/80 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmCancelOrder} className="p-5 space-y-4 text-xs font-sans">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 space-y-1">
                <p className="font-bold text-gray-900">
                  Total Amount: <span className="text-rose-800">₹{Number(cancellingOrder.totalAmount || 0).toLocaleString()}</span>
                </p>
                <p className="text-[11px] text-gray-600">
                  {(cancellingOrder.paymentMethod || '').toLowerCase().includes('razorpay') || cancellingOrder.paymentStatus === 'PAID'
                    ? '💳 Refund will be credited back in 3-5 working days.'
                    : '💵 Cash on Delivery (Zero payment charged).'}
                </p>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Reason for Cancellation *
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-2.5 bg-white text-gray-900 font-medium outline-none focus:ring-2 focus:ring-rose-800"
                >
                  <option value="Want to choose different saree or color">Want to choose different saree or color</option>
                  <option value="Ordered by mistake / Duplicate order">Ordered by mistake / Duplicate order</option>
                  <option value="Need faster delivery timeline">Need faster delivery timeline</option>
                  <option value="Incorrect shipping address or phone number">Incorrect shipping address or phone number</option>
                  <option value="Other reason">Other reason</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Additional Feedback (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Tell us how we can improve..."
                  value={cancelNote}
                  onChange={(e) => setCancelNote(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-rose-800 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCancellingOrder(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 cursor-pointer"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  disabled={isCancelling}
                  className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-extrabold shadow-sm cursor-pointer transition-all"
                >
                  {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Product Rating & Review Modal (Myntra/Nykaa Style) */}
      {reviewOrder && reviewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-amber-300 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-950 via-[#581C1C] to-neutral-950 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-400/20 rounded-xl border border-amber-400/30">
                  <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-amber-100">
                    Rate & Review Handloom Saree
                  </h4>
                  <p className="text-[11px] text-amber-200/80">
                    Order #{reviewOrder.orderNumber || reviewOrder.id}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setReviewOrder(null);
                  setReviewProduct(null);
                }}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmitReview} className="p-5 sm:p-6 space-y-4 text-xs font-sans">
              {reviewSuccessMsg ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-bold text-center space-y-2">
                  <p className="text-sm">🌸 {reviewSuccessMsg}</p>
                </div>
              ) : (
                <>
                  {/* Product Preview */}
                  <div className="flex items-center gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                    <img
                      src={reviewProduct.image || (reviewProduct.images ? (typeof reviewProduct.images === 'string' ? JSON.parse(reviewProduct.images)[0] : reviewProduct.images[0]) : '/uploads/saree_1789221965397_lf0kg.jpeg')}
                      alt={reviewProduct.title}
                      className="w-12 h-14 object-cover rounded-lg border"
                    />
                    <div>
                      <h5 className="font-bold text-gray-900 text-xs">{reviewProduct.title}</h5>
                      <p className="text-[10px] text-gray-500">Verified Maheshwar Handloom Purchase</p>
                    </div>
                  </div>

                  {/* Interactive Star Rating */}
                  <div className="space-y-1.5 text-center py-2 bg-stone-50 rounded-xl border border-gray-200/70">
                    <span className="block font-bold text-gray-700 text-xs">Overall Experience & Quality Rating:</span>
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          onMouseEnter={() => setReviewHoverRating(star)}
                          onMouseLeave={() => setReviewHoverRating(0)}
                          className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${
                              (reviewHoverRating || reviewRating) >= star
                                ? 'text-amber-500 fill-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] font-extrabold text-amber-950">
                      {reviewRating === 5 ? '⭐⭐⭐⭐⭐ Exceptional Handloom Craftsmanship' : reviewRating === 4 ? '⭐⭐⭐⭐ Very Good Quality' : reviewRating === 3 ? '⭐⭐⭐ Average Experience' : '⭐⭐ Needs Improvement'}
                    </span>
                  </div>

                  {/* Reviewer Name */}
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Radhika Sharma"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-amber-800 font-medium"
                    />
                  </div>

                  {/* Review Comment */}
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      Write your review & feedback *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="How did the pure silk-cotton fabric feel? How was the zari border shine and Maheshwar drape?"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-amber-800 font-medium"
                    />
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setReviewOrder(null);
                        setReviewProduct(null);
                      }}
                      className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="px-6 py-2.5 rounded-xl bg-amber-950 hover:bg-black text-amber-100 font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>{isSubmittingReview ? 'Submitting...' : 'Post Verified Review'}</span>
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-amber-900">Loading Orders Hub...</div>}>
      <OrdersPageContent />
    </Suspense>
  );
}

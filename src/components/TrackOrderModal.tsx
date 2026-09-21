'use client';

import React, { useState } from 'react';
import { X, Search, Truck, Package, Clock, CheckCircle2, ArrowRight, AlertCircle, XCircle } from 'lucide-react';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({ isOpen, onClose }) => {
  const [orderQuery, setOrderQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showCustomerCancelForm, setShowCustomerCancelForm] = useState(false);
  const [customerCancelReason, setCustomerCancelReason] = useState('Want to choose different saree or color');
  const [customerCancelNote, setCustomerCancelNote] = useState('');
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);
  const [customerCancelSuccess, setCustomerCancelSuccess] = useState('');

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setIsSearching(true);
    setErrorMsg('');
    setCustomerCancelSuccess('');
    setShowCustomerCancelForm(false);
    setOrderResult(null);

    try {
      const res = await fetch(`/api/orders?query=${encodeURIComponent(orderQuery.trim())}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.orders && data.orders.length > 0) {
          const matched = data.orders[0];
          let parsedItems = [];
          try {
            parsedItems = typeof matched.items === 'string' ? JSON.parse(matched.items) : matched.items || [];
          } catch (e) {}

          const courierName = matched.courierPartner || 'Reoti Handloom Express';
          const trackNo = matched.trackingNumber || '';
          let autoUrl = matched.trackingUrl || null;

          if (!autoUrl && trackNo) {
            const c = courierName.toLowerCase();
            if (c.includes('anjani')) {
              autoUrl = `https://www.shreeanjanicourier.com/`;
            } else if (c.includes('maruti')) {
              autoUrl = `https://track.shreemaruti.com/`;
            } else if (c.includes('dtdc')) {
              autoUrl = `https://track.dtdc.com/ctrack/track?strRefNo=${trackNo}`;
            } else if (c.includes('delhivery')) {
              autoUrl = `https://www.delhivery.com/track/package/${trackNo}`;
            } else if (c.includes('blue')) {
              autoUrl = `https://www.bluedart.com/tracking`;
            } else if (c.includes('post') || c.includes('speed')) {
              autoUrl = `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx`;
            } else if (c.includes('shiprocket')) {
              autoUrl = `https://shiprocket.co/tracking/${trackNo}`;
            }
          }

          setOrderResult({
            id: matched.orderNumber || matched.id,
            customerName: matched.customerName,
            status: matched.status || 'PROCESSING',
            date: new Date(matched.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            trackingId: trackNo || 'Pending Allocation',
            courier: courierName,
            trackingUrl: autoUrl,
            estimatedDelivery: matched.estimatedDelivery || '3-5 Business Days',
            totalAmount: matched.totalAmount,
            shippingAddress: matched.shippingAddress,
            cancellationReason: matched.cancellationReason || matched.notes || null,
            paymentMethod: matched.paymentMethod || 'RAZORPAY_ONLINE',
            paymentStatus: matched.paymentStatus || 'PAID',
            items: parsedItems,
          });
        } else {
          setErrorMsg(`No order found for "${orderQuery.trim()}". Please check your Order ID or phone number.`);
        }
      } else {
        setErrorMsg('Unable to retrieve tracking information. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to tracking server. Please check your connection.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCustomerCancelOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderResult) return;

    setIsCancellingOrder(true);
    try {
      const fullReason = `${customerCancelReason}${customerCancelNote.trim() ? ` (${customerCancelNote.trim()})` : ''}`;
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderResult.id,
          status: 'CANCELLED',
          cancellationReason: `Cancelled by Customer: ${fullReason}`,
          notes: `Customer cancelled on Track Order page. Reason: ${fullReason}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderResult((prev: any) => ({
          ...prev,
          status: 'CANCELLED',
          cancellationReason: `Cancelled by Customer: ${fullReason}`,
        }));
        setShowCustomerCancelForm(false);
        setCustomerCancelSuccess('Your order has been cancelled successfully.');

        // Open WhatsApp alert to inform Maheshwar Desk directly
        const isPaid = (orderResult.paymentMethod || '').toLowerCase().includes('razorpay') || orderResult.paymentStatus === 'PAID';
        const refundMsg = isPaid
          ? `Refund of ₹${Number(orderResult.totalAmount || 0).toLocaleString()} will be credited back to original source.`
          : `Cash on Delivery Order.`;

        const msg = encodeURIComponent(
          `Dear Reoti Handloom Team,\n\n` +
          `I have requested to cancel my order on your website:\n` +
          `📦 *Order ID:* #${orderResult.id}\n` +
          `👤 *Customer Name:* ${orderResult.customerName}\n` +
          `⚠️ *Reason:* ${fullReason}\n` +
          `💳 *Payment:* ${refundMsg}\n\n` +
          `Please process my cancellation and confirm. Thank you!`
        );

        try {
          window.open(`https://wa.me/919617444445?text=${msg}`, '_blank');
        } catch (e) {}
      } else {
        alert(data.error || 'Failed to cancel order. Please contact support.');
      }
    } catch (err) {
      alert('Error connecting to server. Please WhatsApp support at +91 96174 44445.');
    } finally {
      setIsCancellingOrder(false);
    }
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-amber-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-rose-950 to-neutral-950 p-5 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-amber-200/80 hover:text-white bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest mb-1">
            <Truck className="w-4 h-4" />
            <span>Real-Time Shipment Tracking</span>
          </div>

          <h3 className="font-serif font-extrabold text-xl sm:text-2xl text-amber-100">
            Track Your Handloom Order
          </h3>
          <p className="text-xs text-amber-200/80 mt-1">
            Enter your Order ID (e.g. #REOTI-648694) or registered Mobile Number.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          <form onSubmit={handleTrack} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                required
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="e.g. REOTI-648694 or 9617444445"
                className="w-full border border-gray-200 rounded-xl py-3 pl-4 pr-12 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-700 bg-amber-50/30"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="absolute right-2 top-2 bottom-2 px-3 bg-amber-950 text-amber-100 rounded-lg hover:bg-black transition-colors flex items-center justify-center cursor-pointer"
              >
                {isSearching ? <Clock className="w-4 h-4 animate-spin text-amber-300" /> : <Search className="w-4 h-4 text-amber-300" />}
              </button>
            </div>
          </form>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold text-center">
              {errorMsg}
            </div>
          )}

          {/* Results Display */}
          {orderResult && (
            <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-4 space-y-3.5 text-xs animate-in fade-in">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-2.5">
                <div>
                  <span className="font-serif font-bold text-amber-950 text-sm">Order #{orderResult.id}</span>
                  {orderResult.customerName && (
                    <p className="text-[11px] text-gray-600 font-sans">Customer: {orderResult.customerName}</p>
                  )}
                </div>
                <span className={`font-extrabold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider ${
                  orderResult.status === 'DELIVERED'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : orderResult.status === 'CANCELLED'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : orderResult.status === 'SHIPPED' || orderResult.status === 'IN_TRANSIT' || orderResult.status === 'OUT_FOR_DELIVERY'
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  {orderResult.status === 'CANCELLED' ? '❌ CANCELLED' : orderResult.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* If Order is Cancelled: Show dedicated cancellation explanation */}
              {orderResult.status === 'CANCELLED' ? (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 space-y-2 text-rose-950">
                  <div className="flex items-center gap-2 font-bold text-rose-900 text-xs">
                    <span className="text-base">⚠️</span>
                    <span>This order was cancelled</span>
                  </div>
                  {orderResult.cancellationReason && (
                    <p className="text-[11px] text-rose-800">
                      <span className="font-bold">Reason:</span> {orderResult.cancellationReason}
                    </p>
                  )}
                  <p className="text-[11px] text-rose-700 leading-relaxed">
                    {(() => {
                      const isCod = (orderResult.paymentMethod || '').toUpperCase().includes('COD') || (orderResult.paymentMethod || '').toUpperCase().includes('CASH') || orderResult.paymentStatus === 'PENDING_COD';
                      if (isCod) {
                        return '💵 Cash on Delivery Order: No payment was charged. Zero refund required.';
                      }
                      return '💳 Full refund of ₹' + Number(orderResult.totalAmount || 0).toLocaleString() + ' will be automatically credited back to your original payment method within 3-5 business days.';
                    })()}
                  </p>
                  <div className="pt-1">
                    <a
                      href={`https://wa.me/919617444445?text=${encodeURIComponent(`Hi Reoti Handloom, I have a query regarding my cancelled Order #${orderResult.id}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-800 text-white rounded-lg text-[11px] font-bold hover:bg-rose-900 transition-colors shadow-2xs"
                    >
                      <span>💬 Chat with Maheshwar Support on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  {/* Progress Steps Visualizer */}
                  <div className="py-2 px-1">
                    <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold">
                      {/* Step 1: Placed */}
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold mb-1 ${
                          getStepActive(orderResult.status, 1) ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          ✓
                        </div>
                        <span className={getStepActive(orderResult.status, 1) ? 'text-emerald-900 font-extrabold' : 'text-gray-400'}>
                          Order Placed
                        </span>
                      </div>

                      {/* Step 2: Confirmed / Packed */}
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold mb-1 ${
                          getStepActive(orderResult.status, 2) ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {getStepActive(orderResult.status, 2) ? '✓' : '2'}
                        </div>
                        <span className={getStepActive(orderResult.status, 2) ? 'text-emerald-900 font-extrabold' : 'text-gray-400'}>
                          Confirmed & Packed
                        </span>
                      </div>

                      {/* Step 3: Shipped / In Transit */}
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold mb-1 ${
                          getStepActive(orderResult.status, 4) ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {getStepActive(orderResult.status, 4) ? '✓' : '3'}
                        </div>
                        <span className={getStepActive(orderResult.status, 4) ? 'text-emerald-900 font-extrabold' : 'text-gray-400'}>
                          Dispatched
                        </span>
                      </div>

                      {/* Step 4: Delivered */}
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold mb-1 ${
                          getStepActive(orderResult.status, 6) ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {getStepActive(orderResult.status, 6) ? '✓' : '4'}
                        </div>
                        <span className={getStepActive(orderResult.status, 6) ? 'text-emerald-900 font-extrabold' : 'text-gray-400'}>
                          Delivered
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Shipment Details Box */}
                  <div className="bg-white rounded-xl p-3 border border-amber-200/80 space-y-2 text-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Payment Mode:</span>
                      {(() => {
                        const isCod = (orderResult.paymentMethod || '').toUpperCase().includes('COD') || (orderResult.paymentMethod || '').toUpperCase().includes('CASH') || orderResult.paymentStatus === 'PENDING_COD';
                        return (
                          <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            isCod ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}>
                            {isCod ? `💵 Cash on Delivery (Pay ₹${Number(orderResult.totalAmount).toLocaleString()})` : `💳 Online Paid (₹${Number(orderResult.totalAmount).toLocaleString()})`}
                          </span>
                        );
                      })()}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Courier Partner:</span>
                      <span className="font-bold text-gray-900">{orderResult.courier}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Tracking / AWB Number:</span>
                      <span className="font-mono font-bold text-amber-950 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {orderResult.trackingId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Estimated Delivery:</span>
                      <span className="font-bold text-emerald-800">{orderResult.estimatedDelivery}</span>
                    </div>
                    {orderResult.trackingUrl && (
                      <div className="pt-1 text-right">
                        <a
                          href={orderResult.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-rose-800 hover:text-rose-950 font-bold underline inline-flex items-center gap-1"
                        >
                          <span>Track on Courier Website &rarr;</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Customer Self-Cancellation / In-Transit Lock */}
                  {['PROCESSING', 'CONFIRMED', 'PACKED'].includes(orderResult.status) && (
                    <div className="bg-rose-50/50 border border-rose-200/80 rounded-xl p-3 space-y-2">
                      {!showCustomerCancelForm ? (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-900 text-xs">Need to cancel this order?</p>
                            <p className="text-[10px] text-gray-500">You can cancel before shipment dispatch.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowCustomerCancelForm(true)}
                            className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            Cancel Order
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleCustomerCancelOrder} className="space-y-2.5 pt-1">
                          <div className="flex items-center justify-between border-b border-rose-200 pb-1.5">
                            <span className="font-bold text-rose-950 text-xs flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Reason for Cancelling Order</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowCustomerCancelForm(false)}
                              className="text-gray-400 hover:text-gray-600 text-xs"
                            >
                              ✕
                            </button>
                          </div>

                          <div>
                            <select
                              value={customerCancelReason}
                              onChange={(e) => setCustomerCancelReason(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg p-2 text-xs bg-white text-gray-900 font-medium outline-none focus:ring-1 focus:ring-rose-700"
                            >
                              <option value="Want to choose different saree or color">Want to choose different saree or color</option>
                              <option value="Ordered by mistake / Duplicate order">Ordered by mistake / Duplicate order</option>
                              <option value="Need faster delivery timeline">Need faster delivery timeline</option>
                              <option value="Incorrect shipping address or contact number">Incorrect shipping address or contact number</option>
                              <option value="Other reason">Other reason</option>
                            </select>
                          </div>

                          <div>
                            <input
                              type="text"
                              placeholder="Any specific feedback or instructions (Optional)..."
                              value={customerCancelNote}
                              onChange={(e) => setCustomerCancelNote(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg p-2 text-xs bg-white text-gray-900 outline-none focus:ring-1 focus:ring-rose-700"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setShowCustomerCancelForm(false)}
                              className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-100 cursor-pointer"
                            >
                              Keep Order
                            </button>
                            <button
                              type="submit"
                              disabled={isCancellingOrder}
                              className="px-3.5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                            >
                              {isCancellingOrder ? 'Cancelling...' : 'Confirm Cancellation'}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}

                  {['SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(orderResult.status) && (
                    <div className="p-2.5 bg-blue-50/80 border border-blue-200 rounded-xl text-[11px] text-blue-950 space-y-0.5">
                      <p className="font-bold flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-blue-700" />
                        <span>Order is in-transit with {orderResult.courier}</span>
                      </p>
                      <p className="text-[10px] text-blue-800">
                        Since your parcel has already been dispatched with our logistics partner, self-cancellation is closed. If you still wish to cancel, you may reject the parcel upon delivery or reach out to our Maheshwar customer support desk on WhatsApp.
                      </p>
                    </div>
                  )}
                </>
              )}

              {customerCancelSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold text-center">
                  {customerCancelSuccess}
                </div>
              )}

              {/* Items in Order */}
              {orderResult.items && orderResult.items.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Ordered Sarees / Items:</span>
                  <div className="space-y-1.5">
                    {orderResult.items.map((item: any, idx: number) => {
                      const title = item.product?.title || item.title || 'Pure Maheshwari Saree';
                      const img = item.product?.image || item.image || '/uploads/saree_1789221965397_lf0kg.jpeg';
                      return (
                        <div key={idx} className="flex items-center gap-2.5 bg-white p-2 rounded-lg border border-gray-100">
                          <img src={img} alt={title} className="w-10 h-12 object-cover rounded border" />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-xs truncate">{title}</p>
                            <p className="text-[11px] text-gray-500">Qty: {item.quantity || 1} • ₹{(item.price || item.product?.price || 0).toLocaleString()}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Help */}
          <div className="pt-2 text-center text-[11px] text-gray-500 border-t border-gray-100">
            Need live assistance? WhatsApp support at{' '}
            <a
              href="https://wa.me/919617444445?text=Hi%20Reoti%20Handloom%2C%20I%20need%20help%20tracking%20my%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-700 font-bold hover:underline"
            >
              +91 96174 44445
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

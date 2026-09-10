'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ShieldCheck,
  Truck,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Building,
} from 'lucide-react';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalCartPrice,
    totalOriginalPrice,
    totalDiscount,
  } = useShop();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Checkout modal states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'MAHESHWARI10') {
      const discount = Math.round(totalCartPrice * 0.1);
      setAppliedDiscount(discount);
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid Coupon Code. Try "MAHESHWARI10"');
    }
  };

  const finalPayable = Math.max(0, totalCartPrice - appliedDiscount);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !shippingAddress || !pincode) {
      alert('Please fill in all address details');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          shippingAddress: `${shippingAddress}, ${city} - ${pincode}`,
          totalAmount: finalPayable,
          paymentMethod,
          items: cart,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderSuccess(data.order);
        clearCart();
      } else {
        alert('Order failed: ' + data.error);
      }
    } catch (err: any) {
      alert('Order failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Overlay Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-amber-50">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-serif font-extrabold text-amber-950 uppercase tracking-wide">
                SHOPPING BAG
              </h2>
              <span className="text-xs bg-amber-800 text-white font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)} Items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {orderSuccess ? (
              <div className="text-center py-12 px-4 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900">
                  Order Placed Successfully!
                </h3>
                <p className="text-xs text-gray-600">
                  Thank you for shopping with Reoti Handloom. Your Maheshwari Saree is being prepared by our weavers.
                </p>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-left text-xs space-y-1">
                  <p className="font-bold text-amber-950">Order Number: #{orderSuccess.orderNumber}</p>
                  <p>Customer: {orderSuccess.customerName}</p>
                  <p>Phone: {orderSuccess.customerPhone}</p>
                  <p>Payment: {orderSuccess.paymentMethod} ({orderSuccess.paymentStatus})</p>
                  <p className="font-bold text-rose-700 pt-1">Total Paid: ₹{orderSuccess.totalAmount.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => {
                    setOrderSuccess(null);
                    setIsCheckoutOpen(false);
                    setIsCartOpen(false);
                  }}
                  className="w-full bg-amber-900 text-white font-bold text-xs py-3 rounded-md shadow hover:bg-amber-950"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            ) : isCheckoutOpen ? (
              /* Checkout Form View */
              <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <h3 className="font-bold text-sm text-gray-900">Shipping & Delivery Address</h3>
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="text-rose-700 font-bold underline"
                  >
                    Back to Bag
                  </button>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-amber-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit number"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Email ID</label>
                    <input
                      type="email"
                      placeholder="Optional"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Street Address / House No. *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Complete delivery address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-amber-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">City / District *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Indore / Bhopal"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      placeholder="6-digit pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="pt-2 border-t border-gray-200">
                  <label className="block font-bold text-gray-900 mb-2">Select Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-2.5 rounded border flex flex-col items-center gap-1 font-bold ${
                        paymentMethod === 'UPI'
                          ? 'border-amber-800 bg-amber-50 text-amber-950'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>UPI / GPay</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CARD')}
                      className={`p-2.5 rounded border flex flex-col items-center gap-1 font-bold ${
                        paymentMethod === 'CARD'
                          ? 'border-amber-800 bg-amber-50 text-amber-950'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <Building className="w-4 h-4" />
                      <span>Card / Net</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('COD')}
                      className={`p-2.5 rounded border flex flex-col items-center gap-1 font-bold ${
                        paymentMethod === 'COD'
                          ? 'border-amber-800 bg-amber-50 text-amber-950'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                      <span>Cash on Delivery</span>
                    </button>
                  </div>
                </div>

                <div className="bg-amber-100 p-3 rounded text-amber-950 font-semibold text-[11px] flex items-center justify-between">
                  <span>Payable Amount:</span>
                  <span className="font-extrabold text-sm">₹{finalPayable.toLocaleString()}</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-rose-700 hover:bg-rose-800 text-white font-bold text-sm py-3 rounded uppercase tracking-wider shadow transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Processing Order...' : `CONFIRM & PAY ₹${finalPayable.toLocaleString()}`}
                </button>
              </form>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 bg-rose-50 text-rose-300 rounded-full flex items-center justify-center mx-auto">
                  <Tag className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-800">Your Bag is Empty</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Explore our authentic Maheshwari Sarees collection and add your favorite handloom items!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-amber-900 text-white font-bold text-xs rounded hover:bg-amber-950"
                >
                  START SHOPPING
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3">
                  {cart.map(({ product, quantity }) => {
                    const parsedImages = JSON.parse(product.images || '[]');
                    const imgUrl = parsedImages[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c';
                    return (
                      <div
                        key={product.id}
                        className="flex gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg relative"
                      >
                        <div className="w-20 h-24 relative rounded overflow-hidden shrink-0 bg-gray-200">
                          <img
                            src={imgUrl}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between text-xs">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-gray-900 line-clamp-1 pr-4">
                                {product.title}
                              </h4>
                              <button
                                onClick={() => removeFromCart(product.id)}
                                className="text-gray-400 hover:text-rose-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-[10px] text-amber-800 font-semibold mt-0.5">
                              {product.fabric} • {product.weaveType}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300 rounded bg-white">
                              <button
                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                className="p-1 text-gray-600 hover:bg-gray-100"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2.5 font-bold text-xs">{quantity}</span>
                              <button
                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                className="p-1 text-gray-600 hover:bg-gray-100"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <span className="font-bold text-rose-700 text-sm">
                                ₹{(product.price * quantity).toLocaleString()}
                              </span>
                              <span className="text-[10px] text-gray-400 line-through block">
                                ₹{(product.originalPrice * quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Coupon Code Section */}
                <div className="pt-2">
                  <div className="p-3 bg-rose-50/50 border border-rose-200 rounded-lg space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-rose-900 font-bold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Apply Promo Coupon</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Try 'MAHESHWARI10'"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 border border-rose-200 rounded px-2 py-1 text-xs uppercase font-semibold uppercase focus:outline-none"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="bg-rose-700 text-white font-bold text-xs px-3 py-1 rounded hover:bg-rose-800"
                      >
                        APPLY
                      </button>
                    </div>
                    {couponApplied && (
                      <p className="text-[11px] text-emerald-700 font-bold">
                        ✓ Coupon Applied! Extra 10% Off Saved (₹{appliedDiscount})
                      </p>
                    )}
                    {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
                  </div>
                </div>

                {/* Price Breakup */}
                <div className="border-t border-gray-200 pt-3 space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Total MRP</span>
                    <span>₹{totalOriginalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount on MRP</span>
                    <span>- ₹{totalDiscount.toLocaleString()}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Coupon Discount</span>
                      <span>- ₹{appliedDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className="text-emerald-600 font-bold">FREE</span>
                  </div>
                  <div className="border-t border-dashed border-gray-300 pt-2 flex justify-between font-bold text-sm text-gray-900">
                    <span>Total Amount Payable</span>
                    <span className="text-rose-700">₹{finalPayable.toLocaleString()}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer CTA */}
          {!orderSuccess && !isCheckoutOpen && cart.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-white">
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs py-3.5 rounded uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

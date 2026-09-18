'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import {
  ShoppingBag,
  ShieldCheck,
  Lock,
  Truck,
  CheckCircle2,
  Tag,
  CreditCard,
  Building,
  HelpCircle,
  Search,
  ChevronDown,
  ArrowRight,
  Heart,
  ChevronLeft,
  Sparkles,
  AlertCircle,
  Minus,
  Plus,
  ArrowLeft,
  Award,
  Check,
} from 'lucide-react';
import { PaymentGatewayModal } from '@/components/PaymentGatewayModal';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Chandigarh',
  'Jammu & Kashmir',
  'Ladakh',
  'Puducherry',
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    user,
    clearCart,
    totalCartPrice,
    totalOriginalPrice,
    totalDiscount,
    setIsCartOpen,
  } = useShop();

  // Contact State
  const [email, setEmail] = useState('');
  const [newsOffers, setNewsOffers] = useState(true);

  // Delivery State
  const [country, setCountry] = useState('India');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Madhya Pradesh');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [saveInfo, setSaveInfo] = useState(true);

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'PHONEPE' | 'COD'>('RAZORPAY');

  // Billing Address State
  const [billingSame, setBillingSame] = useState(true);
  const [billingFirstName, setBillingFirstName] = useState('');
  const [billingLastName, setBillingLastName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('Madhya Pradesh');
  const [billingPincode, setBillingPincode] = useState('');
  const [billingPhone, setBillingPhone] = useState('');

  // Weaver Tip State
  const [tipEnabled, setTipEnabled] = useState(false);
  const [tipPercent, setTipPercent] = useState<number | null>(null);
  const [customTipAmount, setCustomTipAmount] = useState<number>(0);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Modal / Submit States
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [formError, setFormError] = useState('');

  // Auto-fill logged in user info
  useEffect(() => {
    if (user) {
      if (!email && user.email) setEmail(user.email);
      if (!phone && user.phone) setPhone(user.phone);
      if (!firstName && user.name) {
        const parts = user.name.trim().split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
      }
    }
  }, [user]);

  // Tip Calculations
  const calculatedTip = tipEnabled
    ? tipPercent !== null
      ? Math.round((totalCartPrice * tipPercent) / 100)
      : customTipAmount
    : 0;

  // Final Total Calculation
  const subtotal = totalCartPrice;
  const shippingCharge = 0; // Free Insured Loom Shipping
  const finalTotal = Math.max(0, subtotal - appliedDiscount + calculatedTip + shippingCharge);

  // Coupon Handler
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const normalizedCode = couponCode.trim().toUpperCase();
    if (normalizedCode === 'MAHESHWARI10' || normalizedCode === 'REOTI10') {
      const disc = Math.round(subtotal * 0.1);
      setAppliedDiscount(disc);
      setCouponApplied(true);
      setCouponError('');
    } else if (normalizedCode === 'ROYAL5') {
      const disc = Math.round(subtotal * 0.05);
      setAppliedDiscount(disc);
      setCouponApplied(true);
      setCouponError('');
    } else if (normalizedCode === 'WEAVER100') {
      const disc = Math.min(100, subtotal);
      setAppliedDiscount(disc);
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try "MAHESHWARI10" for 10% Off');
    }
  };

  const handleSelectTipPercent = (pct: number | null) => {
    setTipEnabled(pct !== null);
    setTipPercent(pct);
    setCustomTipAmount(0);
  };

  const handleCustomTipChange = (delta: number) => {
    setTipEnabled(true);
    setTipPercent(null);
    setCustomTipAmount((prev) => Math.max(0, prev + delta));
  };

  // Form Submit Handler
  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email && !phone) {
      setFormError('Please provide your email address or mobile number in Contact details.');
      return;
    }

    if (!lastName || !address || !city || !pincode || !phone) {
      setFormError('Please fill in all required shipping address fields.');
      return;
    }

    if (!billingSame && (!billingLastName || !billingAddress || !billingCity || !billingPincode)) {
      setFormError('Please complete all required billing address fields.');
      return;
    }

    // If COD selected directly, finalize order
    if (paymentMethod === 'COD') {
      handleFinalizeOrder({
        paymentMethod: 'Cash on Delivery (COD)',
        transactionId: 'COD-' + Date.now().toString().slice(-6),
        paymentStatus: 'PENDING_COD',
      });
      return;
    }

    // Open Payment Gateway Modal
    setIsGatewayOpen(true);
  };

  const handleFinalizeOrder = async (paymentData: {
    paymentMethod: string;
    transactionId: string;
    paymentStatus: string;
  }) => {
    setIsGatewayOpen(false);
    setIsSubmitting(true);
    setFormError('');

    const customerFullName = `${firstName} ${lastName}`.trim() || user?.name || 'Valued Patron';
    const fullShippingAddress = `${address}${apartment ? ', ' + apartment : ''}, ${city}, ${state} - ${pincode}, ${country}`;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerFullName,
          customerPhone: phone,
          customerEmail: email || 'patron@reotihandloom.com',
          shippingAddress: fullShippingAddress,
          totalAmount: finalTotal,
          paymentMethod: paymentData.paymentMethod,
          paymentStatus: paymentData.paymentStatus,
          transactionId: paymentData.transactionId,
          items: cart,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderSuccess(data.order);
        clearCart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setFormError('Order creation failed: ' + (data.error || 'Please try again.'));
      }
    } catch (err: any) {
      setFormError('Error placing order: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // 1. Order Success Screen (Royal Heritage Theme)
  // -------------------------------------------------------------
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] font-sans flex flex-col justify-between">
        {/* Top Royal Maroon Header */}
        <header className="bg-gradient-to-r from-[#380A11] via-[#4A0E17] to-[#2B060B] border-b border-amber-500/30 py-4 px-6 shadow-md text-amber-100">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full border border-amber-400/80 p-0.5 overflow-hidden bg-amber-100/20 shadow-inner">
                <img
                  src="/logo.jpg"
                  alt="Reoti Handloom"
                  className="w-full h-full object-cover object-top rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-base sm:text-lg tracking-widest text-amber-200">
                  REOTI HANDLOOM
                </span>
                <span className="text-[9px] uppercase tracking-widest text-amber-400 font-bold">
                  Maheshwar Loom Heritage
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-black/20 px-3 py-1.5 rounded-full border border-amber-500/30">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="font-bold">Order Confirmed</span>
            </div>
          </div>
        </header>

        {/* Success Card */}
        <main className="flex-1 max-w-2xl mx-auto w-full p-4 sm:p-8 my-auto">
          <div className="bg-white border border-amber-200/90 rounded-3xl p-6 sm:p-10 shadow-xl text-center space-y-6">
            <div className="w-18 h-18 bg-amber-100/60 text-[#4A0E17] border-2 border-amber-300 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-extrabold text-[#4A0E17] bg-amber-100/80 px-3.5 py-1 rounded-full uppercase tracking-wider border border-amber-300">
                ✨ Traditional Maheshwar Loom Order Placed
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-amber-950 pt-2">
                Thank You for Supporting Handloom!
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Your order <strong className="text-amber-950 font-black">#{orderSuccess.orderNumber}</strong> has been allocated to our master artisans in Maheshwar for quality inspection and traditional heritage packing.
              </p>
            </div>

            {/* Order Details Receipt */}
            <div className="bg-[#FAF7F2] border border-amber-200/90 rounded-2xl p-4 sm:p-6 text-left text-xs space-y-2.5 text-gray-800">
              <div className="flex justify-between border-b border-amber-200/70 pb-2.5">
                <span className="font-semibold text-gray-600">Order Reference:</span>
                <span className="font-extrabold text-[#4A0E17] text-sm">#{orderSuccess.orderNumber}</span>
              </div>
              <div className="flex justify-between border-b border-amber-200/70 pb-2.5">
                <span className="font-semibold text-gray-600">Customer Name:</span>
                <span className="font-bold text-gray-900">{orderSuccess.customerName}</span>
              </div>
              <div className="flex justify-between border-b border-amber-200/70 pb-2.5">
                <span className="font-semibold text-gray-600">Contact Details:</span>
                <span className="font-medium text-gray-900">{orderSuccess.customerPhone} {orderSuccess.customerEmail ? `• ${orderSuccess.customerEmail}` : ''}</span>
              </div>
              <div className="flex justify-between border-b border-amber-200/70 pb-2.5">
                <span className="font-semibold text-gray-600">Loom Delivery Destination:</span>
                <span className="font-medium text-gray-900 text-right max-w-xs">{orderSuccess.shippingAddress}</span>
              </div>
              <div className="flex justify-between border-b border-amber-200/70 pb-2.5">
                <span className="font-semibold text-gray-600">Payment Option:</span>
                <span className="font-bold text-gray-900">{orderSuccess.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm sm:text-base">
                <span className="font-serif font-extrabold text-amber-950">Total Amount:</span>
                <span className="font-black text-[#4A0E17]">₹{orderSuccess.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Next Step CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="flex-1 py-3.5 bg-gradient-to-r from-[#4A0E17] to-[#380A11] hover:from-[#380A11] hover:to-black text-amber-100 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all text-center border border-amber-500/40"
              >
                RETURN TO HOME
              </Link>
              <Link
                href="/products"
                className="flex-1 py-3.5 border-2 border-[#4A0E17] hover:bg-amber-50 text-[#4A0E17] font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all text-center"
              >
                EXPLORE MORE COLLECTIONS
              </Link>
            </div>
          </div>
        </main>

        <footer className="py-4 text-center text-[11px] text-gray-500 border-t border-amber-200 bg-white">
          © {new Date().getFullYear()} Reoti Handloom Maheshwar • Ahilya Fort Craftsmanship.
        </footer>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. Empty Checkout Bag State
  // -------------------------------------------------------------
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] font-sans flex flex-col justify-between">
        <header className="bg-gradient-to-r from-[#380A11] via-[#4A0E17] to-[#2B060B] border-b border-amber-500/30 py-4 px-6 text-amber-100">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-amber-400/80 p-0.5 overflow-hidden bg-amber-100/20">
                <img src="/logo.jpg" alt="Reoti Handloom" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-base tracking-widest text-amber-200">
                  REOTI HANDLOOM
                </span>
                <span className="text-[9px] uppercase tracking-wider text-amber-400 font-semibold">
                  Direct Loom • Maheshwar
                </span>
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 max-w-md mx-auto w-full p-6 my-auto text-center space-y-4">
          <div className="w-16 h-16 bg-amber-100/80 text-[#4A0E17] rounded-full flex items-center justify-center mx-auto border border-amber-300">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-amber-950">Your Bag is Empty</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Please choose a handcrafted Maheshwari saree or unstitched suit from our loom catalog to begin checkout.
          </p>
          <Link
            href="/products"
            className="inline-block px-7 py-3.5 bg-gradient-to-r from-[#4A0E17] to-[#380A11] text-amber-100 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md border border-amber-400/40 hover:scale-102 transition-transform"
          >
            EXPLORE HANDLOOM SAREES
          </Link>
        </main>

        <footer className="py-4 text-center text-[11px] text-gray-500 border-t border-amber-200 bg-white">
          © {new Date().getFullYear()} Reoti Handloom Maheshwar.
        </footer>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. Main Luxury Checkout Page
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans text-gray-900 antialiased">
      {/* Top Bespoke Brand Header */}
      <header className="sticky top-0 z-30 bg-[#4A0E17] text-amber-100 border-b border-amber-400/30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          
          {/* Brand Logo & Tagline */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border-2 border-amber-400 p-0.5 overflow-hidden bg-amber-100/20 shadow group-hover:scale-105 transition-transform shrink-0">
              <img
                src="/logo.jpg"
                alt="Reoti Handloom Logo"
                className="w-full h-full object-cover object-top rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-base sm:text-lg tracking-widest text-amber-100 leading-none group-hover:text-white transition-colors">
                REOTI HANDLOOM
              </span>
              <span className="text-[9px] uppercase tracking-widest text-amber-300 font-bold mt-1">
                Direct Loom • Maheshwar
              </span>
            </div>
          </Link>

          {/* Center/Right Trust Badge & Return Link */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-200 bg-black/25 px-3 py-1.5 rounded-full border border-amber-500/30">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold tracking-wide">256-Bit SSL Encrypted Checkout</span>
            </div>

            <Link
              href="/products"
              className="flex items-center gap-1.5 text-xs font-bold text-amber-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
              title="Return to store"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden min-[480px]:inline">Continue Shopping</span>
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-amber-200"
                title="View bag"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-[#4A0E17]">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main 2-Column Luxury Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-75px)]">
        
        {/* Left Column: Form Details (Cols: 7) */}
        <div className="lg:col-span-7 px-4 sm:px-8 lg:px-10 py-8 lg:border-r border-amber-200/70 space-y-6">
          
          <form onSubmit={handleSubmitCheckout} className="space-y-6">
            
            {/* Step 1: Contact Information Card */}
            <div className="bg-white border border-amber-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#4A0E17] text-amber-200 font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h2 className="font-serif font-extrabold text-base sm:text-lg text-amber-950">
                    Contact Information
                  </h2>
                </div>

                {!user ? (
                  <Link
                    href="/login"
                    className="text-xs font-bold text-[#4A0E17] hover:text-rose-700 underline"
                  >
                    Already have an account? Sign In
                  </Link>
                ) : (
                  <span className="text-xs text-gray-600 font-medium flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Patron: <strong className="text-amber-950">{user.name || user.email}</strong></span>
                  </span>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email or WhatsApp Mobile *
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address for order receipt"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-xs sm:text-sm focus:border-[#4A0E17] focus:ring-2 focus:ring-amber-500/20 outline-none transition-all placeholder:text-gray-400 font-medium bg-[#FFFDF9]"
                />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-gray-600 pt-1">
                <input
                  type="checkbox"
                  checked={newsOffers}
                  onChange={(e) => setNewsOffers(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#4A0E17] focus:ring-amber-500 accent-[#4A0E17]"
                />
                <span>Send me exclusive Maheshwar weave drops, festive discounts & care tips</span>
              </label>
            </div>

            {/* Step 2: Delivery Address Card */}
            <div className="bg-white border border-amber-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-amber-100">
                <span className="w-6 h-6 rounded-full bg-[#4A0E17] text-amber-200 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h2 className="font-serif font-extrabold text-base sm:text-lg text-amber-950">
                  Loom Delivery Destination
                </h2>
              </div>

              {/* Country */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Country / Region
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-xs sm:text-sm bg-[#FFFDF9] font-semibold text-gray-900 focus:border-[#4A0E17] outline-none"
                >
                  <option value="India">India (All States & UTs)</option>
                </select>
              </div>

              {/* First & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="First Name (optional)"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 text-xs sm:text-sm focus:border-[#4A0E17] focus:ring-2 focus:ring-amber-500/20 outline-none placeholder:text-gray-400 font-medium bg-[#FFFDF9]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Surname / Last Name *"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 text-xs sm:text-sm focus:border-[#4A0E17] focus:ring-2 focus:ring-amber-500/20 outline-none placeholder:text-gray-400 font-medium bg-[#FFFDF9]"
                  />
                </div>
              </div>

              {/* Address Line 1 */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="House / Flat No., Building Name, Street / Area *"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-xs sm:text-sm focus:border-[#4A0E17] focus:ring-2 focus:ring-amber-500/20 outline-none placeholder:text-gray-400 font-medium bg-[#FFFDF9]"
                />
              </div>

              {/* Apartment / Landmark */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Landmark / Suite (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Nearby Landmark, Apartment name, etc."
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 text-xs sm:text-sm focus:border-[#4A0E17] focus:ring-2 focus:ring-amber-500/20 outline-none placeholder:text-gray-400 font-medium bg-[#FFFDF9]"
                />
              </div>

              {/* City, State, PIN code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="City / Town *"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 text-xs sm:text-sm focus:border-[#4A0E17] focus:ring-2 focus:ring-amber-500/20 outline-none placeholder:text-gray-400 font-medium bg-[#FFFDF9]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    State *
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 text-xs sm:text-sm bg-[#FFFDF9] focus:border-[#4A0E17] outline-none font-medium"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="6-digit PIN *"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 text-xs sm:text-sm focus:border-[#4A0E17] focus:ring-2 focus:ring-amber-500/20 outline-none placeholder:text-gray-400 font-medium bg-[#FFFDF9]"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Mobile Number (for Courier & Tracking updates) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 text-xs sm:text-sm focus:border-[#4A0E17] focus:ring-2 focus:ring-amber-500/20 outline-none placeholder:text-gray-400 font-medium bg-[#FFFDF9]"
                  />
                  <span className="text-[10px] text-gray-400 font-bold absolute right-3.5 top-3.5 uppercase">
                    +91 India
                  </span>
                </div>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-gray-600 pt-1">
                <input
                  type="checkbox"
                  checked={saveInfo}
                  onChange={(e) => setSaveInfo(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#4A0E17] focus:ring-amber-500 accent-[#4A0E17]"
                />
                <span>Save this address for fast checkout on my next order</span>
              </label>
            </div>

            {/* Step 3: Insured Loom Shipping Banner */}
            <div className="bg-[#FAF7F2] border-2 border-amber-300/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#4A0E17] flex items-center justify-center shrink-0 border border-amber-300">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-serif font-extrabold text-xs sm:text-sm text-amber-950 block">
                    Insured Direct Loom Express Delivery
                  </span>
                  <span className="text-[11px] text-gray-600 block">
                    Handpacked in Maheshwar • Dispatched via Express Courier with Transit Protection
                  </span>
                </div>
              </div>
              <span className="font-serif font-black text-xs sm:text-sm text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider shrink-0 border border-emerald-300">
                COMPLIMENTARY
              </span>
            </div>

            {/* Step 4: Payment Method Selection */}
            <div className="bg-white border border-amber-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#4A0E17] text-amber-200 font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h2 className="font-serif font-extrabold text-base sm:text-lg text-amber-950">
                    Payment Method
                  </h2>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Secure
                </span>
              </div>

              <div className="border border-amber-200 rounded-xl overflow-hidden divide-y divide-amber-100">
                
                {/* Option 1: Razorpay Secure (UPI / Cards / NetBanking) */}
                <div
                  className={`p-4 transition-all cursor-pointer ${
                    paymentMethod === 'RAZORPAY' ? 'bg-amber-50/70 border-l-4 border-l-[#4A0E17]' : 'bg-white hover:bg-slate-50'
                  }`}
                  onClick={() => setPaymentMethod('RAZORPAY')}
                >
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'RAZORPAY'}
                        onChange={() => setPaymentMethod('RAZORPAY')}
                        className="w-4 h-4 text-[#4A0E17] focus:ring-amber-500 accent-[#4A0E17]"
                      />
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-gray-900 block">
                          Razorpay Secure
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Instant UPI (GPay, PhonePe, Paytm), All Debit/Credit Cards & NetBanking
                        </span>
                      </div>
                    </label>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-900 font-extrabold text-[10px] rounded border border-emerald-300">UPI</span>
                      <span className="px-1.5 py-0.5 bg-blue-900 text-white font-extrabold text-[10px] rounded">VISA</span>
                      <span className="px-1.5 py-0.5 bg-red-700 text-white font-extrabold text-[10px] rounded">MC</span>
                      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 font-extrabold text-[10px] rounded border border-amber-300">+20</span>
                    </div>
                  </div>

                  {paymentMethod === 'RAZORPAY' && (
                    <div className="mt-3 p-3 bg-white border border-amber-300 rounded-xl text-xs text-amber-950 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Zero extra transaction fees. Instant confirmation with SMS & WhatsApp invoice.</span>
                    </div>
                  )}
                </div>

                {/* Option 2: PhonePe PG */}
                <div
                  className={`p-4 transition-all cursor-pointer ${
                    paymentMethod === 'PHONEPE' ? 'bg-amber-50/70 border-l-4 border-l-[#4A0E17]' : 'bg-white hover:bg-slate-50'
                  }`}
                  onClick={() => setPaymentMethod('PHONEPE')}
                >
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'PHONEPE'}
                        onChange={() => setPaymentMethod('PHONEPE')}
                        className="w-4 h-4 text-[#4A0E17] focus:ring-amber-500 accent-[#4A0E17]"
                      />
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-gray-900 block">
                          PhonePe PG
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Direct PhonePe App, BHIM UPI & Wallets
                        </span>
                      </div>
                    </label>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2 py-0.5 bg-purple-700 text-white font-extrabold text-[10px] rounded-sm">
                        PhonePe
                      </span>
                    </div>
                  </div>
                </div>

                {/* Option 3: Cash On Delivery */}
                <div
                  className={`p-4 transition-all cursor-pointer ${
                    paymentMethod === 'COD' ? 'bg-amber-50/70 border-l-4 border-l-[#4A0E17]' : 'bg-white hover:bg-slate-50'
                  }`}
                  onClick={() => setPaymentMethod('COD')}
                >
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="w-4 h-4 text-[#4A0E17] focus:ring-amber-500 accent-[#4A0E17]"
                      />
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-gray-900 block">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Pay in cash or UPI when your handloom parcel arrives at your doorstep
                        </span>
                      </div>
                    </label>
                    <Truck className="w-5 h-5 text-gray-500" />
                  </div>
                </div>

              </div>
            </div>

            {/* Step 5: Support Maheshwar Weavers Patronage Tip Card */}
            <div className="bg-gradient-to-br from-[#FAF7F2] to-[#FFF9F2] border border-amber-300 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-200 text-[#4A0E17] flex items-center justify-center font-bold text-xs shrink-0">
                    🙏
                  </div>
                  <h3 className="font-serif font-extrabold text-sm sm:text-base text-amber-950">
                    Add Weaver Tip
                  </h3>
                </div>
                <span className="text-[10px] font-bold bg-amber-200/80 text-[#4A0E17] px-2.5 py-0.5 rounded-full border border-amber-300">
                  Artisan Welfare
                </span>
              </div>

              {/* Checkbox Toggle */}
              <label className="flex items-start sm:items-center gap-2.5 cursor-pointer select-none text-xs font-semibold text-gray-800">
                <input
                  type="checkbox"
                  checked={tipEnabled}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setTipEnabled(isChecked);
                    if (!isChecked) {
                      setTipPercent(null);
                      setCustomTipAmount(0);
                    } else if (tipPercent === null && customTipAmount === 0) {
                      setTipPercent(10);
                    }
                  }}
                  className="w-4 h-4 mt-0.5 sm:mt-0 rounded border-gray-300 text-[#4A0E17] focus:ring-amber-500 accent-[#4A0E17] shrink-0"
                />
                <span className="leading-snug">
                  Show your support for the Weavers of Maheshwar at <strong className="text-[#4A0E17]">Reoti Handloom</strong>
                </span>
              </label>

              {/* Preset Tip Percentage Buttons */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {[10, 20, 30].map((pct) => {
                  const amt = Math.round((subtotal * pct) / 100);
                  const isSelected = tipEnabled && tipPercent === pct;
                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleSelectTipPercent(pct)}
                      className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#4A0E17] bg-[#4A0E17] text-amber-100 shadow-sm ring-2 ring-amber-500/20'
                          : 'border-amber-200 bg-white hover:border-amber-400 text-gray-800'
                      }`}
                    >
                      <span className="block font-bold text-xs">{pct}%</span>
                      <span className={`block text-[10px] font-semibold ${isSelected ? 'text-amber-200' : 'text-gray-500'}`}>
                        ₹{amt.toLocaleString()}
                      </span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => handleSelectTipPercent(null)}
                  className={`p-2.5 sm:p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                    !tipEnabled || (tipPercent === null && customTipAmount === 0)
                      ? 'border-gray-800 bg-gray-800 text-white shadow-xs'
                      : 'border-amber-200 bg-white hover:border-amber-400 text-gray-700'
                  }`}
                >
                  None
                </button>
              </div>

              {/* Custom Tip Amount Controls */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 flex items-center border border-amber-200 rounded-xl bg-white px-3 py-2 text-xs">
                  <span className="text-gray-500 mr-2 font-medium">Custom tip:</span>
                  <span className="font-extrabold text-amber-950">₹{customTipAmount}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCustomTipChange(-50)}
                  disabled={customTipAmount <= 0}
                  className="p-2 border border-amber-200 bg-white rounded-xl hover:bg-amber-50 disabled:opacity-40 cursor-pointer text-amber-950"
                  title="Decrease tip"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCustomTipChange(50)}
                  className="p-2 border border-amber-200 bg-white rounded-xl hover:bg-amber-50 cursor-pointer text-amber-950"
                  title="Increase tip"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTipEnabled(true);
                    setTipPercent(null);
                    setCustomTipAmount((prev) => (prev === 0 ? 100 : prev));
                  }}
                  className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-[#4A0E17] font-bold text-xs rounded-xl border border-amber-300 cursor-pointer"
                >
                  Add tip
                </button>
              </div>

              {/* Unique Thank You & Artisan Appreciation Message */}
              <div className="pt-2.5 border-t border-amber-200/70">
                <div className="p-3.5 bg-amber-100/70 border border-amber-300 rounded-xl text-xs text-amber-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#4A0E17]">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>✨ Thank you, we appreciate it! 🙏</span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                    Your kind patronage {calculatedTip > 0 ? (
                      <>of <strong>₹{calculatedTip.toLocaleString()}</strong> </>
                    ) : ''}directly supports our master artisan weaver families in Maheshwar, keeping India&apos;s royal loom heritage thriving.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 6: Billing Address Selection */}
            <div className="bg-white border border-amber-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
              <h3 className="font-serif font-extrabold text-base text-amber-950">
                Billing Address
              </h3>
              
              <div className="border border-amber-200 rounded-xl overflow-hidden divide-y divide-amber-100">
                <div
                  className={`p-3.5 transition-colors cursor-pointer ${billingSame ? 'bg-amber-50/60' : 'bg-white'}`}
                  onClick={() => setBillingSame(true)}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="billingSame"
                      checked={billingSame}
                      onChange={() => setBillingSame(true)}
                      className="w-4 h-4 text-[#4A0E17] focus:ring-amber-500 accent-[#4A0E17]"
                    />
                    <span className="font-bold text-xs sm:text-sm text-gray-900">
                      Same as shipping destination
                    </span>
                  </label>
                </div>

                <div
                  className={`p-3.5 transition-colors cursor-pointer ${!billingSame ? 'bg-amber-50/60' : 'bg-white'}`}
                  onClick={() => setBillingSame(false)}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="billingSame"
                      checked={!billingSame}
                      onChange={() => setBillingSame(false)}
                      className="w-4 h-4 text-[#4A0E17] focus:ring-amber-500 accent-[#4A0E17]"
                    />
                    <span className="font-bold text-xs sm:text-sm text-gray-900">
                      Use a separate billing address
                    </span>
                  </label>

                  {!billingSame && (
                    <div
                      className="mt-3.5 space-y-3 pt-3 border-t border-amber-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="First name (optional)"
                          value={billingFirstName}
                          onChange={(e) => setBillingFirstName(e.target.value)}
                          className="w-full border border-gray-300 rounded-xl p-2.5 text-xs focus:border-[#4A0E17] outline-none bg-[#FFFDF9]"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Last name *"
                          value={billingLastName}
                          onChange={(e) => setBillingLastName(e.target.value)}
                          className="w-full border border-gray-300 rounded-xl p-2.5 text-xs focus:border-[#4A0E17] outline-none bg-[#FFFDF9]"
                        />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Billing Address *"
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl p-2.5 text-xs focus:border-[#4A0E17] outline-none bg-[#FFFDF9]"
                      />
                      <div className="grid grid-cols-3 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="City *"
                          value={billingCity}
                          onChange={(e) => setBillingCity(e.target.value)}
                          className="w-full border border-gray-300 rounded-xl p-2.5 text-xs focus:border-[#4A0E17] outline-none bg-[#FFFDF9]"
                        />
                        <select
                          value={billingState}
                          onChange={(e) => setBillingState(e.target.value)}
                          className="w-full border border-gray-300 rounded-xl p-2.5 text-xs bg-[#FFFDF9] focus:border-[#4A0E17] outline-none font-medium"
                        >
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="PIN code *"
                          value={billingPincode}
                          onChange={(e) => setBillingPincode(e.target.value)}
                          className="w-full border border-gray-300 rounded-xl p-2.5 text-xs focus:border-[#4A0E17] outline-none bg-[#FFFDF9]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error Banner */}
            {formError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold flex items-center gap-2.5 shadow-sm">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Primary Action Button (Royal Maroon & Gold) */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4.5 bg-gradient-to-r from-[#4A0E17] via-[#5C131E] to-[#380A11] hover:from-[#380A11] hover:to-black text-amber-100 font-extrabold text-sm sm:text-base uppercase tracking-widest rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 border border-amber-400/40"
              >
                <Lock className="w-5 h-5 text-amber-300" />
                <span>
                  {isSubmitting
                    ? 'Confirming Order...'
                    : paymentMethod === 'COD'
                    ? `Place COD Order • ₹${finalTotal.toLocaleString()}`
                    : `Pay Securely • ₹${finalTotal.toLocaleString()}`}
                </span>
              </button>

              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-gray-500 font-medium pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Certified Craftmark
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-amber-700" />
                  Free Express Delivery
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#4A0E17]" />
                  Direct Loom Pricing
                </span>
              </div>
            </div>

          </form>

          {/* Minimalist Policies Footer */}
          <footer className="pt-8 border-t border-amber-200/80 flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2 text-[11px] text-[#4A0E17] font-semibold">
            <Link href="/policies/return-policy" className="hover:underline">Refund Policy</Link>
            <Link href="/policies/shipping-policy" className="hover:underline">Shipping Policy</Link>
            <Link href="/policies/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <Link href="/policies/terms" className="hover:underline">Terms & Conditions</Link>
            <Link href="/contact" className="hover:underline">Artisan Helpline</Link>
          </footer>

        </div>

        {/* Right Column: Order Summary (Cols: 5 - Sticky on Desktop) */}
        <div className="lg:col-span-5 bg-white/70 lg:bg-[#FAF7F2]/80 backdrop-blur-xs px-4 sm:px-8 py-8 border-t lg:border-t-0 border-amber-200/70 space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-amber-200">
            <h3 className="font-serif font-extrabold text-base text-amber-950">
              Loom Bag Summary ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
            </h3>
            <Link
              href="/products"
              className="text-xs font-bold text-[#4A0E17] hover:underline"
            >
              Edit Bag
            </Link>
          </div>

          {/* Items List */}
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {cart.map(({ product, quantity, hasFallPico, fallPicoPrice }) => {
              let parsedImages: string[] = [];
              try {
                parsedImages = JSON.parse(product.images || '[]');
              } catch (e) {
                parsedImages = [];
              }
              const imgUrl = parsedImages[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c';
              const unitPico = hasFallPico ? (fallPicoPrice || 200) : 0;
              const itemTotal = (product.price + unitPico) * quantity;

              return (
                <div
                  key={`${product.id}_${hasFallPico ? 'fall' : 'std'}`}
                  className="flex items-center gap-3.5 text-xs bg-white p-3 rounded-2xl border border-amber-200/80 shadow-2xs"
                >
                  {/* Thumbnail Image with Quantity Badge */}
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-amber-50 border border-amber-300 shrink-0">
                    <img src={imgUrl} alt={product.title} className="w-full h-full object-cover" />
                    <span className="absolute -top-1 -right-1 bg-[#4A0E17] text-amber-200 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow border border-white">
                      {quantity}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-amber-950 line-clamp-2 text-xs leading-snug">
                      {product.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {product.color} • {product.fabric}
                    </p>
                    {hasFallPico && (
                      <span className="mt-1 inline-flex items-center gap-1 bg-amber-100 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                        <Check className="w-3 h-3 text-[#4A0E17]" /> Fall & Pico (₹200)
                      </span>
                    )}
                  </div>

                  <div className="text-right font-black text-amber-950 text-xs sm:text-sm">
                    ₹{itemTotal.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Coupon Discount Input Box */}
          <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2 border-t border-amber-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Discount code (e.g. MAHESHWARI10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 border border-amber-300 rounded-xl p-2.5 text-xs uppercase font-bold focus:border-[#4A0E17] outline-none bg-white placeholder:normal-case placeholder:font-normal"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#4A0E17] hover:bg-[#380A11] text-amber-100 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>

            {couponError && (
              <p className="text-[11px] text-rose-600 font-bold">{couponError}</p>
            )}

            {couponApplied && (
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Coupon Applied Successfully!</span>
                </span>
                <span>-₹{appliedDiscount.toLocaleString()}</span>
              </div>
            )}
          </form>

          {/* Financial Breakdown Table */}
          <div className="space-y-2.5 pt-2 border-t border-amber-200 text-xs sm:text-sm">
            <div className="flex justify-between text-gray-700">
              <span>Loom Items Subtotal</span>
              <span className="font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-gray-700">
              <span className="flex items-center gap-1">
                <span>Insured Express Shipping</span>
              </span>
              <span className="font-bold text-emerald-700 uppercase text-xs">FREE</span>
            </div>

            {couponApplied && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Promotional Discount</span>
                <span>-₹{appliedDiscount.toLocaleString()}</span>
              </div>
            )}

            {calculatedTip > 0 && (
              <div className="flex justify-between text-[#4A0E17] font-semibold">
                <span>Weaver Patronage Tip</span>
                <span>+₹{calculatedTip.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between items-baseline pt-3.5 border-t-2 border-amber-300">
              <div>
                <span className="text-base font-serif font-black text-amber-950 block">
                  Total Payable
                </span>
                <span className="text-[10px] text-gray-500 font-medium">
                  Inclusive of all taxes & door-to-door insurance
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 mr-1 font-bold">INR</span>
                <span className="text-xl sm:text-2xl font-black text-[#4A0E17]">
                  ₹{finalTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Authenticity Pledge Card */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl space-y-2 text-xs text-amber-950">
            <div className="flex items-center gap-2 font-serif font-extrabold text-xs text-amber-950">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Maheshwari Handloom Guarantee</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Every saree in your order is genuine handloom, crafted on authentic Maheshwar pit-looms. We stand behind our weaves with a 7-day hassle-free replacement guarantee.
            </p>
          </div>

        </div>

      </div>

      {/* Payment Gateway Modal (Razorpay / UPI / Card / COD) */}
      <PaymentGatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        amount={finalTotal}
        customerDetails={{
          name: `${firstName} ${lastName}`.trim() || user?.name || 'Patron',
          phone,
          email,
          address: `${address}${apartment ? ', ' + apartment : ''}, ${city}, ${state} - ${pincode}`,
        }}
        onPaymentSuccess={handleFinalizeOrder}
      />
    </div>
  );
}

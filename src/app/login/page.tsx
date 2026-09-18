'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Heart, 
  LogOut, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight,
  Package
} from 'lucide-react';

export const dynamic = 'force-dynamic';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams ? searchParams.get('redirect') : null;

  const { user, setUser, logout, setIsCartOpen } = useShop();


  // Step: 'email' | 'password' (existing user) | 'register' (new user) | 'forgot' (reset password)
  const [step, setStep] = useState<'email' | 'password' | 'register' | 'forgot'>('email');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [subscribeNews, setSubscribeNews] = useState(true);

  // Forgot Password State
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  // Step 1: Check Email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.exists) {
          setName(data.name || '');
          if (data.phone) setPhone(data.phone);
          setStep('password');
        } else {
          setStep('register');
        }
      } else {
        setStep('password');
      }
    } catch {
      setStep('password');
    } finally {
      setLoading(false);
    }
  };

  // Fast Login / Continue with Shop (Guest Shopping Access)
  const handleFastShopLogin = async () => {
    setError('');
    const cleanEmail = email.trim().toLowerCase();
    
    if (cleanEmail && cleanEmail.includes('@')) {
      setLoading(true);
      try {
        const res = await fetch('/api/auth/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail }),
        });
        const data = await res.json();
        if (data.exists) {
          setName(data.name || '');
          if (data.phone) setPhone(data.phone);
          setStep('password');
        } else {
          setStep('register');
        }
      } catch {
        setStep('password');
      } finally {
        setLoading(false);
      }
    } else {
      // Direct Guest Access: Continue directly to shop / cart without mandatory login
      if (redirectTarget === 'cart') {
        setIsCartOpen(true);
        router.push('/');
      } else {
        router.push('/products');
      }
    }
  };

  // Step 2: Login Existing User
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        if (data.user.role === 'admin') {
          router.push('/reoti-studio-manage');
        } else if (redirectTarget === 'cart') {
          setIsCartOpen(true);
          router.push('/');
        } else {
          router.push('/');
        }
      } else {
        setError(data.error || 'Incorrect password. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Register New Customer
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          phone: phone.trim() || undefined,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        if (redirectTarget === 'cart') {
          setIsCartOpen(true);
        }
        router.push('/');
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Step: Initiate Forgot Password
  const handleInitiateForgotPassword = async () => {
    setError('');
    setForgotMessage('');
    setOtp('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), action: 'send-otp' }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('forgot');
        setForgotMessage(data.message || `A 6-digit verification code has been sent to ${email.trim().toLowerCase()}.`);
      } else {
        setError(data.error || 'Failed to initiate password reset.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  // Step: Resend Verification Code
  const handleResendOtp = async () => {
    setError('');
    setForgotMessage('');
    setOtp('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), action: 'send-otp' }),
      });
      const data = await res.json();
      if (data.success) {
        setForgotMessage(data.message || `A new 6-digit verification code has been sent to ${email.trim().toLowerCase()}.`);
      } else {
        setError(data.error || 'Failed to resend code.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };


  // Step: Verify & Reset Password Submit
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setForgotMessage('');

    if (!otp.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          action: 'verify-and-reset',
          otp: otp.trim(),
          newPassword,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        if (redirectTarget === 'cart') {
          setIsCartOpen(true);
        }
        router.push('/');
      } else {
        setError(data.error || 'Failed to reset password.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  // If user is already logged in, show their Account Profile Dashboard
  if (user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 font-sans bg-[#FAF7F2]">
        <div className="w-full max-w-[450px] bg-white border border-[#E8DFC8] rounded-3xl shadow-xl p-6 sm:p-9 space-y-6 relative overflow-hidden">
          
          {/* Bespoke Royal Customer Crest & Greeting */}
          <div className="flex flex-col items-center text-center space-y-2 pb-1">
            <Link href="/" className="inline-block hover:scale-105 transition-transform">
              <div className="relative">
                {/* Royal Monogram Medallion */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#581C1C] via-[#7B2020] to-[#3B1111] border-2 border-[#D4AF37] shadow-lg flex items-center justify-center ring-4 ring-amber-200/50">
                  <span className="font-serif font-black text-2xl text-[#FBF4E4] tracking-wider drop-shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'R'}
                  </span>
                </div>
                {/* Gold Crown Badge */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#D4AF37] border-2 border-white flex items-center justify-center shadow">
                  <Sparkles className="w-3.5 h-3.5 text-[#581C1C]" />
                </div>
              </div>
            </Link>

            {/* Brand Title & Flourish */}
            <div className="space-y-0.5 pt-1">
              <span className="font-serif font-black text-xl tracking-tight text-[#581C1C]">
                Reoti Handloom
              </span>
              <div className="flex items-center justify-center gap-2 pt-0.5">
                <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                <span className="text-[10px] text-[#D4AF37]">✦</span>
                <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#D4AF37]" />
              </div>
            </div>

            {/* Customer Greeting */}
            <div className="space-y-1 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-[#E8DFC8]">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Signed In Customer</span>
              </div>
              <h1 className="text-2xl font-serif font-extrabold text-[#2D1214]">
                Namaste, {user.name}!
              </h1>
              <p className="text-xs text-gray-600 font-medium truncate max-w-[320px]">
                {user.email} {user.phone ? `• +91 ${user.phone}` : ''}
              </p>
            </div>
          </div>

          {/* Quick Actions List */}
          <div className="space-y-2.5 pt-2">
            {user.role === 'admin' && (
              <Link
                href="/reoti-studio-manage"
                className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-[#581C1C] via-[#7B2020] to-[#581C1C] text-amber-100 shadow hover:opacity-95 transition-opacity border border-amber-400/30"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                  <div className="text-left">
                    <div className="text-xs font-bold font-serif">Seller Admin Studio</div>
                    <div className="text-[10px] text-amber-200/80">Manage products, orders & stock</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-300" />
              </Link>
            )}

            <Link
              href="/products"
              className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:border-[#581C1C] hover:bg-amber-50/40 transition-all text-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100/60 flex items-center justify-center text-amber-900">
                  <Sparkles className="w-4 h-4 text-[#581C1C]" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-900">Explore Handloom Collection</div>
                  <div className="text-[10px] text-gray-500">Shop authentic Maheshwari sarees & suits</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              href="/wishlist"
              className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:border-rose-300 hover:bg-rose-50/40 transition-all text-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-100/60 flex items-center justify-center text-rose-700">
                  <Heart className="w-4 h-4 text-rose-700" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-900">Saved Wishlist</div>
                  <div className="text-[10px] text-gray-500">View items saved for later</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <button
              type="button"
              onClick={() => {
                logout();
                setStep('email');
                setEmail('');
                setPassword('');
              }}
              className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 text-rose-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Account</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <Link href="/" className="text-xs text-amber-950 font-medium hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 font-sans bg-[#FAF7F2]">
      <div className="w-full max-w-[430px] bg-white border border-[#E8DFC8] rounded-3xl shadow-xl p-6 sm:p-9 space-y-6 relative overflow-hidden">

        {/* Bespoke Royal Brand Crest Monogram */}
        <div className="flex flex-col items-center text-center space-y-2 pb-1">
          <Link href="/" className="inline-block hover:scale-105 transition-transform group">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#581C1C] via-[#7B2020] to-[#3B1111] border-2 border-[#D4AF37] shadow-lg flex items-center justify-center ring-4 ring-amber-200/50 mx-auto">
              <span className="font-serif font-black text-2xl text-[#FBF4E4] tracking-widest pl-1 drop-shadow-sm">
                RH
              </span>
            </div>
          </Link>

          <div className="space-y-0.5 pt-1">
            <span className="font-serif font-black text-2xl tracking-tight text-[#581C1C]">
              Reoti Handloom
            </span>
            <div className="flex items-center justify-center gap-2 pt-0.5">
              <span className="h-[1px] w-10 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <span className="text-[10px] text-[#D4AF37]">✦</span>
              <span className="h-[1px] w-10 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>
            <p className="text-[11px] font-sans font-medium text-amber-950/70 pt-0.5">
              Authentic Maheshwari Heritage
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl leading-relaxed animate-fade-in">
            {error}
          </div>
        )}

        {/* STEP 1: Enter Email (Reoti Handloom Brand Styling) */}
        {step === 'email' && (
          <div className="space-y-4">
            {/* Primary Action: Continue with Shop (Royal Maroon & Gold Theme) */}
            <button
              type="button"
              onClick={handleFastShopLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#581C1C] via-[#7B2020] to-[#581C1C] hover:from-[#3B1111] hover:to-[#3B1111] active:scale-[0.99] text-amber-100 font-serif font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-xs sm:text-sm tracking-widest uppercase border border-amber-400/30 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Continue with Reoti Shop</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="w-full border-t border-[#E8DFC8]"></div>
              <span className="absolute px-3 bg-white text-[11px] font-serif font-semibold text-amber-900/60 uppercase tracking-widest">
                or
              </span>
            </div>

            {/* Email Form with Arrow Inside Input */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="relative">
                <input
                  id="customer-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your email address"
                  required
                  autoFocus
                  className="w-full px-4 py-3.5 pr-12 border-2 border-[#D4AF37]/60 hover:border-[#581C1C] focus:border-[#581C1C] rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#581C1C] text-xs sm:text-sm font-medium transition-colors bg-amber-50/20"
                />
                <button
                  type="submit"
                  disabled={loading}
                  aria-label="Continue with email"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-[#581C1C] hover:bg-[#3B1111] text-amber-100 flex items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Newsletter / News & Offers Checkbox */}
              <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  checked={subscribeNews}
                  onChange={(e) => setSubscribeNews(e.target.checked)}
                  className="w-4 h-4 rounded text-[#581C1C] border-[#D4AF37] focus:ring-0 cursor-pointer accent-[#581C1C]"
                />
                <span className="font-medium text-[11px] sm:text-xs text-gray-600">
                  Email me with exclusive festive offers & handloom stories
                </span>
              </label>
            </form>
          </div>
        )}

        {/* STEP 2A: Existing User Password */}
        {step === 'password' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fade-in">
            {/* Selected Email Pill */}
            <div className="flex items-center justify-between bg-amber-50/60 border border-[#E8DFC8] px-3.5 py-2.5 rounded-xl text-xs">
              <span className="font-medium text-amber-950 truncate">{email}</span>
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setPassword('');
                  setError('');
                }}
                className="text-[#581C1C] font-bold hover:underline ml-2 cursor-pointer"
              >
                Change
              </button>
            </div>

            {name && (
              <p className="text-xs font-semibold text-gray-700">
                Welcome back, <span className="text-[#581C1C] font-serif font-bold">{name}</span>!
              </p>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700">Password</label>
                <button
                  type="button"
                  onClick={handleInitiateForgotPassword}
                  disabled={loading}
                  className="text-[11px] text-[#581C1C] hover:text-[#3B1111] font-bold hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoFocus
                  className="w-full px-4 py-3 border border-gray-300 focus:border-[#581C1C] focus:ring-1 focus:ring-[#581C1C] rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none text-xs sm:text-sm font-medium pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-[#581C1C]" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#581C1C] hover:bg-[#3B1111] active:scale-[0.99] text-amber-100 font-serif font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-xs sm:text-sm tracking-wider uppercase border border-amber-400/30 cursor-pointer"
            >
              {loading ? 'Signing in...' : 'Sign In to Account'}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep('register');
                  setError('');
                }}
                className="text-xs text-gray-500 hover:text-[#581C1C] hover:underline cursor-pointer"
              >
                Need to create a new account instead?
              </button>
            </div>
          </form>
        )}

        {/* STEP 2C: Forgot Password / Reset Password Form */}
        {step === 'forgot' && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4 animate-fade-in">
            {/* Selected Email Pill */}
            <div className="flex items-center justify-between bg-amber-50/60 border border-[#E8DFC8] px-3.5 py-2.5 rounded-xl text-xs">
              <span className="font-medium text-amber-950 truncate">{email}</span>
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setOtp('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setError('');
                  setForgotMessage('');
                }}
                className="text-[#581C1C] font-bold hover:underline ml-2 cursor-pointer"
              >
                Change
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="text-sm font-bold text-gray-900 font-serif">Reset Password</h2>
              <p className="text-[11px] text-gray-500">
                Enter the verification code and your new password.
              </p>
            </div>

            {/* Success / OTP Info Alert */}
            {forgotMessage && (
              <div className="bg-amber-50/90 border border-[#D4AF37]/50 text-amber-950 text-xs font-medium px-4 py-3 rounded-xl leading-relaxed flex items-start gap-2.5 animate-fade-in">
                <span className="text-base">📧</span>
                <div>
                  <div className="font-bold text-[#581C1C]">Check Your Email</div>
                  <div className="text-[11px] text-amber-900/80 mt-0.5">{forgotMessage} Check your inbox and spam/junk folder.</div>
                </div>
              </div>
            )}

            {/* 6-Digit OTP */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700">Verification Code (OTP) *</label>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-[11px] text-[#581C1C] font-bold hover:underline cursor-pointer"
                >
                  Resend Code
                </button>
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                maxLength={6}
                required
                autoFocus
                className="w-full px-4 py-3 border border-gray-300 focus:border-[#581C1C] focus:ring-1 focus:ring-[#581C1C] rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none text-center text-sm font-bold tracking-widest bg-amber-50/20"
              />
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">New Password *</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:border-[#581C1C] focus:ring-1 focus:ring-[#581C1C] rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none text-xs sm:text-sm font-medium pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4 text-[#581C1C]" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Confirm New Password *</label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                className="w-full px-4 py-3 border border-gray-300 focus:border-[#581C1C] focus:ring-1 focus:ring-[#581C1C] rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none text-xs sm:text-sm font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#581C1C] hover:bg-[#3B1111] active:scale-[0.99] text-amber-100 font-serif font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-xs sm:text-sm tracking-wider uppercase border border-amber-400/30 cursor-pointer"
            >
              {loading ? 'Updating Password...' : 'Save Password & Sign In'}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep('password');
                  setError('');
                  setForgotMessage('');
                }}
                className="text-xs text-gray-500 hover:text-[#581C1C] hover:underline cursor-pointer"
              >
                ← Back to Password Sign In
              </button>
            </div>
          </form>
        )}


        {/* STEP 2B: New Customer Registration */}
        {step === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fade-in">
            {/* Selected Email Pill */}
            <div className="flex items-center justify-between bg-amber-50/60 border border-[#E8DFC8] px-3.5 py-2.5 rounded-xl text-xs">
              <span className="font-medium text-amber-950 truncate">{email}</span>
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setPassword('');
                  setError('');
                }}
                className="text-[#581C1C] font-bold hover:underline ml-2 cursor-pointer"
              >
                Change
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
                autoFocus
                className="w-full px-4 py-3 border border-gray-300 focus:border-[#581C1C] focus:ring-1 focus:ring-[#581C1C] rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none text-xs sm:text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Mobile Number (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="For WhatsApp order tracking updates"
                className="w-full px-4 py-3 border border-gray-300 focus:border-[#581C1C] focus:ring-1 focus:ring-[#581C1C] rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none text-xs sm:text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Set Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:border-[#581C1C] focus:ring-1 focus:ring-[#581C1C] rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none text-xs sm:text-sm font-medium pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-[#581C1C]" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#581C1C] hover:bg-[#3B1111] active:scale-[0.99] text-amber-100 font-serif font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-xs sm:text-sm tracking-wider uppercase border border-amber-400/30 cursor-pointer"
            >
              {loading ? 'Creating Account...' : 'Create Account & Continue'}
            </button>
          </form>
        )}

        {/* Footer Legal Terms */}
        <div className="pt-2 text-center space-y-3">
          <p className="text-[11px] text-gray-500 font-normal leading-relaxed">
            By continuing, you agree to our{' '}
            <Link href="/policies/shipping-policy" className="underline hover:text-[#581C1C]">
              Terms of service
            </Link>
          </p>

          <div>
            <Link href="/policies/return-policy" className="text-xs text-gray-600 hover:text-[#581C1C] hover:underline font-medium">
              Privacy policy
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs font-serif font-bold text-amber-950/60 font-sans">Loading Reoti Sign In...</div>}>
      <LoginContent />
    </Suspense>
  );
}

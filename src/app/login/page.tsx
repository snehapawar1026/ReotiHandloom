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
  Package,
  User,
  Lock,
  Mail,
  Phone,
  RotateCcw
} from 'lucide-react';

export const dynamic = 'force-dynamic';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams ? searchParams.get('redirect') : null;

  const { user, setUser, logout, setIsCartOpen } = useShop();

  // Mode: 'login' | 'signup' | 'forgot'
  const [activeMode, setActiveMode] = useState<'login' | 'signup' | 'forgot'>('login');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password States
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<'request' | 'verify'>('request');
  const [forgotMessage, setForgotMessage] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        if (data.user.role === 'admin') {
          router.push('/reoti-studio-manage');
        } else if (redirectTarget === 'cart') {
          setIsCartOpen(true);
          router.push('/');
        } else if (redirectTarget === 'orders') {
          router.push('/orders');
        } else {
          router.push('/');
        }
      } else {
        setError(data.error || 'Invalid email or password. Please try again or create a new account.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up Submit
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
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
          email: cleanEmail,
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
        setError(data.error || 'Account creation failed. An account with this email may already exist.');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setForgotMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, action: 'send-otp' }),
      });
      const data = await res.json();

      if (data.success) {
        setForgotStep('verify');
        setForgotMessage(data.message || 'Verification code sent to your email.');
      } else {
        setError(data.error || 'Failed to send reset code. Please check your email.');
      }
    } catch (err: any) {
      setError(err.message || 'Error requesting reset code.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setForgotMessage('');

    if (!otp.trim()) {
      setError('Please enter the verification code.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
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
        router.push('/');
      } else {
        setError(data.error || 'Failed to reset password.');
      }
    } catch (err: any) {
      setError(err.message || 'Error resetting password.');
    } finally {
      setLoading(false);
    }
  };

  // If user is already logged in: Show Account Profile Dashboard
  if (user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 font-sans bg-[#FAF7F2]">
        <div className="w-full max-w-[450px] bg-white border border-[#E8DFC8] rounded-3xl shadow-xl p-6 sm:p-9 space-y-6 relative overflow-hidden">
          
          {/* Royal Customer Crest */}
          <div className="flex flex-col items-center text-center space-y-2 pb-1">
            <Link href="/" className="inline-block hover:scale-105 transition-transform">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#581C1C] via-[#7B2020] to-[#3B1111] border-2 border-[#D4AF37] shadow-lg flex items-center justify-center ring-4 ring-amber-200/50">
                  <span className="font-serif font-black text-2xl text-[#FBF4E4] tracking-wider drop-shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'R'}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#D4AF37] border-2 border-white flex items-center justify-center shadow">
                  <Sparkles className="w-3.5 h-3.5 text-[#581C1C]" />
                </div>
              </div>
            </Link>

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

          {/* Quick Actions */}
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
              href="/orders"
              className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:border-amber-700 hover:bg-amber-50/50 transition-all text-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100/60 flex items-center justify-center text-amber-900">
                  <RotateCcw className="w-4 h-4 text-[#581C1C]" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-900">My Orders & Tracking</div>
                  <div className="text-[10px] text-gray-500">View real-time shipments & receipts</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              href="/products"
              className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:border-[#581C1C] hover:bg-amber-50/40 transition-all text-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100/60 flex items-center justify-center text-amber-900">
                  <Sparkles className="w-4 h-4 text-[#581C1C]" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-900">Explore Handloom Sarees</div>
                  <div className="text-[10px] text-gray-500">Shop pure Maheshwari sarees & suits</div>
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
                setActiveMode('login');
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
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-10 font-sans bg-[#FAF7F2]">
      <div className="w-full max-w-[440px] bg-white border border-[#E8DFC8] rounded-3xl shadow-xl p-6 sm:p-8 space-y-6 relative overflow-hidden">

        {/* Brand Crest Header */}
        <div className="flex flex-col items-center text-center space-y-2 pb-1">
          <Link href="/" className="inline-block hover:scale-105 transition-transform group">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#581C1C] via-[#7B2020] to-[#3B1111] border-2 border-[#D4AF37] shadow-lg flex items-center justify-center ring-4 ring-amber-200/50 mx-auto">
              <span className="font-serif font-black text-xl text-[#FBF4E4] tracking-widest pl-0.5 drop-shadow-sm">
                RH
              </span>
            </div>
          </Link>

          <div className="space-y-0.5 pt-0.5">
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

        {/* Continue with Reoti Shop Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              if (redirectTarget === 'cart') {
                setIsCartOpen(true);
                router.push('/');
              } else if (redirectTarget === 'orders') {
                router.push('/orders');
              } else {
                router.push('/products');
              }
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#4A1515] via-[#5C1B1B] to-[#4A1515] hover:from-[#3B1111] hover:to-[#3B1111] text-[#FBF4E4] border border-[#D4AF37]/40 shadow-md hover:shadow-lg font-serif font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Continue with Reoti Shop</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-amber-200/80 w-full" />
            <span className="bg-white px-3 text-[10px] uppercase font-bold tracking-widest text-amber-900/60">
              OR
            </span>
            <div className="border-t border-amber-200/80 w-full" />
          </div>
        </div>

        {/* Primary Tabs: Sign In / Login vs Create Account / Sign Up */}
        {activeMode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 bg-amber-50/80 rounded-2xl border border-amber-200/80 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveMode('login');
                setError('');
              }}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'login'
                  ? 'bg-[#581C1C] text-amber-100 shadow-sm'
                  : 'text-gray-600 hover:text-amber-950'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In (Login)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode('signup');
                setError('');
              }}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'signup'
                  ? 'bg-[#581C1C] text-amber-100 shadow-sm'
                  : 'text-gray-600 hover:text-amber-950'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Account (Sign Up)</span>
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold px-3.5 py-2.5 rounded-xl leading-relaxed animate-in fade-in">
            {error}
          </div>
        )}

        {/* Forgot Message */}
        {forgotMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3.5 py-2.5 rounded-xl leading-relaxed animate-in fade-in">
            {forgotMessage}
          </div>
        )}

        {/* TAB 1: Sign In / Login Form */}
        {activeMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in fade-in text-xs">
            <div>
              <label className="block text-gray-700 font-bold mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-xl font-medium text-xs focus:ring-2 focus:ring-[#581C1C] focus:border-transparent outline-none bg-amber-50/20 text-gray-900"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-gray-700 font-bold">Password *</label>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('forgot');
                    setForgotStep('request');
                    setError('');
                    setForgotMessage('');
                  }}
                  className="text-[11px] text-rose-800 hover:text-rose-950 font-semibold hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-9 pr-10 py-3 border border-gray-300 rounded-xl font-medium text-xs focus:ring-2 focus:ring-[#581C1C] focus:border-transparent outline-none bg-amber-50/20 text-gray-900"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#581C1C] via-[#7B2020] to-[#581C1C] hover:from-[#3B1111] hover:to-[#3B1111] text-amber-100 font-bold py-3.5 rounded-xl shadow-md transition-all text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{loading ? 'Signing In...' : 'Sign In to Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <p className="text-[11px] text-gray-600">
                New to Reoti Handloom?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('signup');
                    setError('');
                  }}
                  className="font-bold text-[#581C1C] hover:underline cursor-pointer"
                >
                  Create an Account (Sign Up)
                </button>
              </p>
            </div>
          </form>
        )}

        {/* TAB 2: Sign Up / Create Account Form */}
        {activeMode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5 animate-in fade-in text-xs">
            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Sharma"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl font-medium text-xs focus:ring-2 focus:ring-[#581C1C] focus:border-transparent outline-none bg-amber-50/20 text-gray-900"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Mobile Number (For Order Tracking & WhatsApp Updates)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="10-digit mobile number (e.g. 9617444445)"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl font-medium text-xs focus:ring-2 focus:ring-[#581C1C] focus:border-transparent outline-none bg-amber-50/20 text-gray-900"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl font-medium text-xs focus:ring-2 focus:ring-[#581C1C] focus:border-transparent outline-none bg-amber-50/20 text-gray-900"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Create Password (Min 6 Characters) *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Create secure password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-xl font-medium text-xs focus:ring-2 focus:ring-[#581C1C] focus:border-transparent outline-none bg-amber-50/20 text-gray-900"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#581C1C] via-[#7B2020] to-[#581C1C] hover:from-[#3B1111] hover:to-[#3B1111] text-amber-100 font-bold py-3.5 rounded-xl shadow-md transition-all text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              <span>{loading ? 'Creating Account...' : 'Create My Account (Sign Up)'}</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </button>

            <div className="text-center pt-2">
              <p className="text-[11px] text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('login');
                    setError('');
                  }}
                  className="font-bold text-[#581C1C] hover:underline cursor-pointer"
                >
                  Sign In (Login)
                </button>
              </p>
            </div>
          </form>
        )}

        {/* TAB 3: Forgot Password Form */}
        {activeMode === 'forgot' && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-serif font-bold text-sm text-[#581C1C]">Reset Password</h3>
              <button
                type="button"
                onClick={() => {
                  setActiveMode('login');
                  setError('');
                  setForgotMessage('');
                }}
                className="text-[11px] font-bold text-gray-500 hover:text-gray-800"
              >
                ← Back to Login
              </button>
            </div>

            {forgotStep === 'request' ? (
              <form onSubmit={handleRequestOtp} className="space-y-3.5">
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Enter your registered email address. We will send a 6-digit verification code to reset your password.
                </p>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#581C1C] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#581C1C] hover:bg-[#3B1111] text-amber-100 font-bold py-3 rounded-xl shadow-xs transition-all text-xs"
                >
                  {loading ? 'Sending Code...' : 'Send Verification Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">6-Digit Verification Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-mono font-bold tracking-widest text-center"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">New Password (Min 6 chars) *</label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Confirm New Password *</label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-xs transition-all text-xs"
                >
                  {loading ? 'Resetting Password...' : 'Save New Password & Sign In'}
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-amber-900">Loading Member Portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}

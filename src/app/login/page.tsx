'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { ShieldCheck, Lock, Mail, Phone, User, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, user } = useShop();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          if (data.user.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/');
          }
        } else {
          setError(data.error || 'Login failed');
        }
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, phone }),
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          router.push('/');
        } else {
          setError(data.error || 'Registration failed');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 font-sans">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-rose-950 text-white p-6 text-center relative">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 p-0.5 mx-auto bg-amber-100 mb-2">
            <img src="/logo.jpg" alt="Reoti Handloom" className="w-full h-full object-cover object-top rounded-full" />
          </div>
          <h1 className="font-serif font-extrabold text-xl tracking-tight text-amber-100">
            Reoti Handloom Account
          </h1>
          <p className="text-[11px] text-amber-200/80 italic mt-0.5">
            Something &quot;more&quot; in Maheshwari Handloom
          </p>
        </div>

        {/* Tab Switcher: Customer Login / Register */}
        <div className="flex border-b border-gray-200 bg-amber-50/50">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              mode === 'login'
                ? 'bg-white text-rose-700 border-b-2 border-rose-700'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Customer Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              mode === 'register'
                ? 'bg-white text-rose-700 border-b-2 border-rose-700'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {user ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-gray-900">
                Welcome, {user.name}!
              </h3>
              <p className="text-xs text-gray-500">{user.email}</p>

              <div className="flex gap-2 justify-center pt-2">
                {user.role === 'admin' && (
                  <button
                    onClick={() => router.push('/admin')}
                    className="px-4 py-2 bg-amber-950 text-white font-bold text-xs rounded hover:bg-black"
                  >
                    Open Seller Admin Panel
                  </button>
                )}
                <button
                  onClick={() => setUser(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-bold text-xs rounded hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
              
              {/* Registration Full Name */}
              {mode === 'register' && (
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Full Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 pl-9 text-xs focus:ring-1 focus:ring-rose-600"
                    />
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-gray-700 font-bold mb-1">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 pl-9 text-xs focus:ring-1 focus:ring-rose-600"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Mobile Number (Registration) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Mobile Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 pl-9 text-xs focus:ring-1 focus:ring-rose-600"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-gray-700 font-bold mb-1">Password *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 pl-9 text-xs focus:ring-1 focus:ring-rose-600"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              {error && (
                <p className="text-xs font-bold text-rose-600 bg-rose-50 p-2 rounded border border-rose-200">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-md transition-transform active:scale-98"
              >
                {loading
                  ? 'Verifying Credentials...'
                  : mode === 'login'
                  ? 'LOGIN TO REOTI HANDLOOM'
                  : 'CREATE MY ACCOUNT'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

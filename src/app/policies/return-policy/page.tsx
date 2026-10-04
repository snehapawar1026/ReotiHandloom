import React from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Truck,
  ArrowRightLeft,
  CalendarCheck,
  Coins,
  PackageCheck,
  Scissors,
  Package,
  MessageCircle,
  FileCheck2,
  PhoneCall,
  CheckCircle2,
  HelpCircle,
  Clock,
  ArrowRight,
  Award,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ReturnPolicyPage() {
  const points = [
    {
      num: '01',
      title: '7 Days Return Window',
      text: 'Returns must be requested within',
      highlight: '7 days of receiving the order',
      highlightColor: 'text-rose-700 bg-rose-50 border-rose-200',
      icon: CalendarCheck,
      iconColor: 'bg-rose-100 text-rose-800 border-rose-200',
    },
    {
      num: '02',
      title: 'Return Shipping Fee',
      text: 'A flat',
      highlight: '₹150 return shipping charge',
      highlightColor: 'text-amber-950 bg-amber-100 border-amber-200',
      textAfter: 'will be applicable for reverse pickup logistics.',
      icon: Coins,
      iconColor: 'bg-amber-100 text-amber-900 border-amber-200',
    },
    {
      num: '03',
      title: 'Product Condition',
      text: 'The product must be',
      highlight: 'unused, unworn, and in its original condition',
      highlightColor: 'text-emerald-900 bg-emerald-50 border-emerald-200',
      textAfter: 'with all authentic handloom tags and original packaging intact.',
      icon: PackageCheck,
      iconColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    },
    {
      num: '04',
      title: 'Customization / Fall & Pico',
      text: 'Sarees tailored with complimentary',
      highlight: 'Fall & Pico binding upon customer selection cannot be returned or exchanged',
      highlightColor: 'text-rose-900 bg-rose-50 border-rose-200',
      textAfter: 'once the customized work is completed.',
      icon: Scissors,
      iconColor: 'bg-rose-100 text-rose-800 border-rose-200',
    },
    {
      num: '05',
      title: 'Safe Packing for Transit',
      text: 'The product should be',
      highlight: 'securely and properly packed',
      highlightColor: 'text-amber-950 bg-amber-50 border-amber-200',
      textAfter: 'by the customer for safe return journey to our Maheshwar workshop.',
      icon: Package,
      iconColor: 'bg-amber-100 text-amber-900 border-amber-200',
    },
    {
      num: '06',
      title: 'Easy WhatsApp / Account Request',
      text: 'To initiate a return or refund, customers must submit a request through their',
      highlight: 'account section',
      highlightColor: 'text-amber-950 bg-amber-100 border-amber-200',
      textAfter: 'and inform our support team via WhatsApp at +91 9617444445.',
      isWhatsApp: true,
      icon: MessageCircle,
      iconColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    },
    {
      num: '07',
      title: 'Verification & Refund Credit',
      text: 'Refunds are subject to',
      highlight: 'verification and the applicable return conditions',
      highlightColor: 'text-indigo-950 bg-indigo-50 border-indigo-200',
      textAfter: 'and credited directly via UPI / Bank within 2–5 working days.',
      icon: FileCheck2,
      iconColor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] via-[#F6F1E8] to-[#FAF7F2] py-8 sm:py-14 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 mb-8 font-medium">
          <Link href="/" className="hover:text-amber-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
          <span>Policies</span>
          <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-amber-950 font-bold">Return & Refund Policy</span>
        </nav>

        {/* Hero Banner with Royal Crest */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/40 text-amber-900 text-xs font-bold uppercase tracking-widest mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
            <span>100% Genuine Handloom Promise</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#2A080C] tracking-tight">
            Return / Refund Policy
          </h1>

          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="h-0.5 w-12 bg-gradient-to-r from-transparent to-amber-500" />
            <p className="text-sm sm:text-base font-serif italic font-bold text-amber-950/80">
              Reoti Handloom Maheshwar • 7 Days Hassle-Free Returns & Exchange
            </p>
            <span className="h-0.5 w-12 bg-gradient-to-l from-transparent to-amber-500" />
          </div>
        </div>

        {/* Main Royal Card */}
        <div className="bg-white/95 backdrop-blur-sm border-2 border-amber-200/90 rounded-3xl shadow-2xl shadow-amber-950/10 p-6 sm:p-10 space-y-8 relative overflow-hidden">
          
          {/* Top Decorative Gold Border */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 via-rose-700 to-amber-600" />

          {/* Intro Box - Clean & Elegant */}
          <div className="relative overflow-hidden bg-gradient-to-r from-amber-50/80 via-[#FFFDF9] to-amber-50/30 p-6 sm:p-7 rounded-2xl border border-amber-200/80 border-l-4 border-l-amber-700 shadow-xs">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-700" />
                <span>Customer Happiness Promise</span>
              </div>

              <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-medium">
                At <strong className="text-[#2A080C] font-black font-serif text-base sm:text-lg">Reoti Handloom</strong>, we want you to be happy with your purchase. If you are not satisfied with your order, eligible products can be returned within{' '}
                <span className="inline-block px-2.5 py-0.5 rounded-lg font-bold text-rose-800 bg-rose-50 border border-rose-200 shadow-2xs">
                  7 days of delivery
                </span>
                , subject to the conditions mentioned below. Refunds will be processed within{' '}
                <span className="inline-block px-2.5 py-0.5 rounded-lg font-bold text-amber-950 bg-amber-100/90 border border-amber-300/80 shadow-2xs">
                  2–5 working days
                </span>{' '}
                after the returned product has been received and inspected, and the customer will be notified via email or WhatsApp.
              </p>
            </div>
          </div>

          {/* Terms & Conditions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-6 rounded-full bg-amber-800" />
                <h2 className="font-serif font-black text-xl sm:text-2xl text-[#2A080C] tracking-tight">
                  Terms & Conditions for Returns:
                </h2>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                7 Simple Guidelines
              </span>
            </div>

            {/* Structured Points List */}
            <div className="space-y-3 pt-1">
              {points.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div
                    key={idx}
                    className="group flex items-start gap-4 p-4 rounded-2xl bg-[#FCFAF7] hover:bg-gradient-to-r hover:from-amber-50/90 hover:to-white border border-amber-100/90 hover:border-amber-300 hover:shadow-md transition-all duration-200"
                  >
                    {/* Icon Badge */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${p.iconColor} shadow-2xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Point Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-800/80">
                          {p.title}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-800 font-medium leading-relaxed">
                        {p.text}{' '}
                        <span className={`inline-block px-1.5 py-0.2 font-bold rounded-md border ${p.highlightColor}`}>
                          {p.highlight}
                        </span>
                        {p.textAfter && ` ${p.textAfter}`}
                        {p.isWhatsApp && (
                          <>
                            {' '}
                            <a
                              href="https://wa.me/919617444445"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-bold text-emerald-700 underline hover:text-emerald-800 ml-1"
                            >
                              <MessageCircle className="w-3.5 h-3.5 inline" />
                              <span>+91 9617444445</span>
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="pt-2 text-xs sm:text-sm text-gray-500 italic border-t border-amber-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>For any questions regarding returns or refunds, please contact our customer support team.</span>
          </p>

          {/* 100% Quality Guarantee Certificate Box */}
          <div className="relative overflow-hidden p-6 sm:p-7 bg-gradient-to-r from-rose-50/90 via-amber-50/70 to-rose-50/90 border-2 border-rose-300/80 rounded-2xl shadow-sm flex items-start gap-4 sm:gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B2635] to-[#4A151D] text-amber-200 flex items-center justify-center shrink-0 shadow-lg shadow-rose-950/20 border border-amber-300/40">
              <Award className="w-7 h-7" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-rose-900 bg-rose-200/70 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                <span>Authentic Handloom Seal</span>
              </div>
              <h3 className="font-serif font-black text-base sm:text-lg text-[#8B2635]">
                100% Quality & Peace of Mind Guarantee
              </h3>
              <p className="text-xs sm:text-sm text-rose-950 font-medium leading-relaxed">
                Every Maheshwari Saree undergoes multi-tier quality check by our master weavers in Maheshwar prior to dispatch.
              </p>
            </div>
          </div>

        </div>

        {/* Customer Support Action Banner */}
        <div className="mt-8 bg-gradient-to-r from-[#24080B] via-[#3B1117] to-[#24080B] text-amber-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-2xl shadow-black/20 border-2 border-amber-500/30">
          <div className="space-y-1.5 max-w-md">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-900/60 px-3 py-0.5 rounded-full border border-amber-600/30">
              <PhoneCall className="w-3 h-3" />
              <span>Weaver Support Desk</span>
            </div>
            <h3 className="font-serif font-black text-xl sm:text-2xl text-white">
              Need help initiating a return?
            </h3>
            <p className="text-xs sm:text-sm text-amber-200/85 font-medium leading-relaxed">
              Message our customer assistance team directly on WhatsApp for quick pickup & refund updates.
            </p>
          </div>

          <a
            href="https://wa.me/919617444445?text=Hello%20Reoti%20Handloom%2C%20I%20want%20to%20initiate%20a%20return%2Fexchange%20request."
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:shadow-emerald-950/50 transition-all active:scale-95 shrink-0 flex items-center justify-center gap-2.5 group"
          >
            <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>CONTACT SUPPORT (+91 9617444445)</span>
          </a>
        </div>

      </div>
    </div>
  );
}

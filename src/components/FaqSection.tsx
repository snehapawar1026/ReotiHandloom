'use client';

import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Who founded Maheshwari sarees and what is their historical origin?',
    answer:
      'Maheshwari sarees were originated around 1770 under the royal patronage of Rajmata Ahilyabai Holkar in the sacred fort town of Maheshwar along the Narmada river. Queen Ahilyabai personally invited master weavers from Surat and South India to design lightweight, royal garments featuring motifs inspired by the architectural stone carvings of Maheshwar Fort (such as Chatai, Chameli, and Eent) and the gentle ripples of the Narmada river.',
  },
  {
    question: 'What makes authentic Maheshwari Handloom Sarees unique and famous?',
    answer:
      'Authentic Maheshwari sarees are celebrated for their feather-light breathability (under 400 grams), signature reversible Zari borders (Bugdi / Karvat) that look equally flawless on either side, fine natural Mulberry silk in the warp with combed cotton in the weft, and a subtle royal lustrous sheen that remains cool in summer and regal for festive occasions.',
  },
  {
    question: 'How to identify 100% genuine Maheshwari Handloom vs fake powerloom sarees?',
    answer:
      'Genuine handloom sarees feature subtle loom pin marks (Kanni) along the selvedge from the wooden pit loom, a clean reversible border without messy loose floats on the reverse side, and a soft, organic drape. Powerloom synthetic copies feel slippery or stiff and have machine-cut straight heat-sealed edges.',
  },
  {
    question: 'Where can I buy original Maheshwari Sarees directly from weavers?',
    answer:
      'You can buy 100% certified authentic handloom sarees directly from Reoti Handloom (founded in 1960 by Shri Lakshminarayan Ambekar) at our heritage workshop on 73 Laxmibai Marg, Maheshwar (MP), or online at https://reotihandloom.com with Free Express Delivery across India and Cash on Delivery (COD) options.',
  },
  {
    question: 'How should I care for and maintain my Maheshwari silk-cotton saree?',
    answer:
      'We recommend dry cleaning for the first 2-3 washes to lock in the sheen and rich dyes. For subsequent washes, hand wash gently in cold water using a mild silk-friendly liquid detergent (like Ezee). Always dry flat in shade and store wrapped in pure breathable muslin or cotton saree covers to prevent metallic Zari oxidation.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section
      itemScope
      itemType="https://schema.org/FAQPage"
      className="py-8 sm:py-12 bg-[#FAF7F2]/60 border-t border-[#E8DFC8]/60 font-sans"
    >
      {/* Schema.org FAQPage Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section Header - Clean & Minimalist */}
        <div className="text-center mb-6 sm:mb-8">
          <span className="text-[10px] sm:text-xs font-bold text-[#8B263E] uppercase tracking-[0.25em] block mb-1">
            AUTHENTIC WEAVE & BUYER GUIDE
          </span>
          <h2 className="text-xl sm:text-3xl font-serif font-extrabold text-[#2D1214] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-lg mx-auto">
            Everything you need to know about authentic Maheshwari handloom heritage and craftsmanship.
          </p>
        </div>

        {/* Minimalist Hairline Accordion List */}
        <div className="divide-y divide-[#E8DFC8]/80 border-t border-b border-[#E8DFC8]/80">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
                className="py-1"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left py-3 sm:py-3.5 flex items-center justify-between gap-3 cursor-pointer select-none group"
                  aria-expanded={isOpen}
                >
                  <h3
                    itemProp="name"
                    className={`font-serif font-bold text-xs sm:text-sm transition-colors pr-2 leading-snug ${
                      isOpen ? 'text-[#8B263E]' : 'text-gray-900 group-hover:text-[#8B263E]'
                    }`}
                  >
                    {faq.question}
                  </h3>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'rotate-180 bg-[#581C1C] text-amber-100'
                        : 'bg-amber-100/60 text-[#581C1C] group-hover:bg-amber-200/80'
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                    className="pb-3.5 pt-0 text-xs sm:text-sm text-gray-700 leading-relaxed font-sans animate-fadeIn"
                  >
                    <p itemProp="text" className="text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Subtle WhatsApp Help Link - 1 Line Compact */}
        <div className="mt-5 text-center">
          <a
            href="https://wa.me/919617444445?text=Hello%20Reoti%20Handloom%2C%20I%20have%20a%20question%20about%20Maheshwari%20sarees."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-emerald-800 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Have a specific question?</span>
            <span className="font-bold text-[#581C1C] underline">Chat directly on WhatsApp →</span>
          </a>
        </div>
      </div>
    </section>
  );
}

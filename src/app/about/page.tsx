'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Star,
  Award,
  Heart,
  FileCheck,
  Crown,
  Users,
  CheckCircle2,
} from 'lucide-react';

export default function AboutPage() {
  const heritageGallery = [
    {
      id: 'govt_cert_1996',
      tag: 'GOVERNMENT RECOGNITION',
      headingMain: 'M.P. STATE TEXTILE CORP',
      headingHighlight: 'GOVT CERTIFICATE (1996)',
      description: 'Official certificate from M.P. State Textile Corporation Ltd. dated 06-11-1996 awarded to Shri Ashok Ambekar (Pro-Reoti Maheshwar) for Best Selected Saree in state competition.',
      quote: 'Recognized for authentic Maheshwari weave excellence.',
      image: '/heritage/govt_cert_1996.jpg',
      badge: 'Govt Certificate 1996',
    },
    {
      id: 'vip_visit_1',
      tag: 'VIP & CELEBRITY VISIT',
      headingMain: 'HONORING CELEBRITY DIGNITARIES',
      headingHighlight: 'HEMA MALINI AT REOTI LOOMS',
      description: 'Veteran actress & VIP Dignitary inspecting authentic Reoti Maheshwari Sarees directly with master weavers on traditional handlooms.',
      quote: 'Crafting royal sarees worn & cherished by dignitaries.',
      image: '/heritage/vip_visit_1.jpg',
      badge: 'VIP Visit',
    },
    {
      id: 'vip_visit_2',
      tag: 'HERITAGE EXHIBITION',
      headingMain: 'PRESENTING EXCLUSIVE',
      headingHighlight: 'ROYAL MAHESHWAR SILK ZARI SAREES',
      description: 'Presenting exclusive handwoven Maheshwari silk sarees with pure gold/silver zari borders to distinguished patrons & art connoisseurs.',
      quote: 'Preserving Holkar dynasty weaving traditions.',
      image: '/heritage/vip_visit_2.jpg',
      badge: 'Exclusive Showing',
    },
    {
      id: 'vip_visit_3',
      tag: 'PATRON FELICITATIONS',
      headingMain: 'CRAFTING LIVING TRADITION',
      headingHighlight: 'FOR DISTINGUISHED PATRONS',
      description: 'Felicitating distinguished guests with handmade Maheshwari sarees woven on 5th generation heritage looms straight from Narmada ghats.',
      quote: 'Direct from weaver hands to royal wardrobes.',
      image: '/heritage/vip_visit_3.jpg',
      badge: 'VIP Showcase',
    },
    {
      id: 'govt_cert_photo_1996',
      tag: 'MASTERWORK RECORD',
      headingMain: 'AWARD WINNING SAREE',
      headingHighlight: '1996 STATE COMPETITION MASTERPIECE',
      description: 'Official photograph snippet of the award-winning Maheshwari saree selected by M.P. State Govt Textile Corporation.',
      quote: '100% authentic handloom craftsmanship.',
      image: '/heritage/govt_cert_photo_1996.jpg',
      badge: 'Historic Masterpiece',
    },
  ];

  return (
    <div className="bg-amber-50/20 font-sans pb-16">
      
      {/* 1. Preserved Top Dark Maroon Hero Banner */}
      <section className="bg-gradient-to-r from-amber-950 via-rose-950 to-neutral-950 text-amber-100 py-12 sm:py-16 px-4 text-center relative overflow-hidden border-b border-amber-800/50">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-900/60 border border-amber-700/60 px-3.5 py-1 rounded-full text-xs font-bold text-amber-300 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Maharani Ahilyabai Holkar Heritage</span>
          </div>

          <h1 className="font-serif font-extrabold text-3xl sm:text-5xl text-amber-100 tracking-tight">
            About Reoti Handloom Maheshwar
          </h1>
          
          <p className="text-xs sm:text-sm text-amber-200/80 max-w-2xl mx-auto leading-relaxed font-medium">
            Crafting authentic Maheshwari Sarees straight from Narmada ghat looms with 5th generation weaver craftsmanship.
          </p>
        </div>
      </section>

      {/* 2. Main Reoti Story Layout (Matching Reference Screenshot) */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        
        {/* Section Heading */}
        <div className="border-b border-amber-200/80 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="font-serif font-extrabold text-3xl sm:text-5xl text-[#2D1214] tracking-wide flex items-center gap-2">
              <span>The Reoti Heritage Saga: Royal Maheshwar Weaves</span>
              <span className="text-[#E52E4E]">✨</span>
            </h2>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B263E] bg-rose-50 px-3.5 py-1 rounded-full border border-rose-200 self-start sm:self-center shrink-0">
              Reoti Heritage Story
            </span>
          </div>
        </div>

        {/* Large Centered Ahilyabai Maheshwari Legacy Banner Image */}
        <div className="w-full h-[320px] sm:h-[480px] lg:h-[540px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-amber-200 bg-neutral-950">
          <img
            src="/uploads/maheshwari_legacy_banner.png"
            onError={(e) => {
              (e.target as HTMLElement).setAttribute('src', '/studio/studio_1.jpg');
            }}
            alt="Maharani Ahilyabai Holkar & Master Weavers at Work on Maheshwari Handloom Loom"
            className="w-full h-full object-cover object-center brightness-105"
          />
        </div>

        {/* Story Text Paragraphs */}
        <div className="space-y-6 text-gray-800 text-xs sm:text-sm sm:leading-relaxed font-medium max-w-4xl">
          <p>
            We are a team of Renowned Master Weavers and skilled artisans committed to reviving the age-old art of Maheshwari handloom weaving. Our vision is to bring the rich heritage of Maheshwari Weaving directly from Narmada ghat looms to every corner of India and across the globe.
          </p>

          <p>
            We believe that traditional handloom weaving is not just an art form but a way of life. Every product we create is a celebration of our rich cultural heritage and a tribute to the skill and ingenuity of our weavers. Our commitment to quality shines through every Maheshwari saree we create. It&apos;s the mark of authenticity and skilled craftsmanship.
          </p>

          <p>
            We believe in preserving the art of handweaving, ensuring that every Maheshwari saree is a testament to our cultural heritage and Holkar dynasty weaving traditions.
          </p>

          <p>
            When you wear a Reoti Maheshwari saree, you carry a piece of tradition and sustainability. It&apos;s a symbol of royal elegance, lightweight comfort, and conscious fashion.
          </p>

          <p>
            Thank you for choosing Reoti Handloom Maheshwar, and we look forward to sharing our passion for traditional Maheshwari weaving culture with you.
          </p>
        </div>

        {/* 5. Historical Heritage, VIP Visits & Govt Recognitions Gallery */}
        <section className="pt-8 space-y-8 border-t border-amber-200/80">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-rose-100 border border-rose-200 px-3 py-1 rounded-full text-xs font-bold text-rose-900 uppercase tracking-widest">
              <Crown className="w-3.5 h-3.5 text-rose-700" />
              <span>Legacy & Recognitions</span>
            </div>
            <h2 className="font-serif font-extrabold text-2xl sm:text-4xl text-[#2D1214]">
              Government Recognition & VIP Heritage Gallery
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-2xl">
              Authentic historical records, M.P. State Govt Textile Corporation certificates from 1996, and VIP dignitary visits at Reoti Handloom Maheshwar.
            </p>
          </div>

          {/* Frameless Luxury Editorial Split Rows (Image Left/Text Right <-> Image Right/Text Left) */}
          <div className="space-y-16 sm:space-y-24 py-6">
            {heritageGallery.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
                >
                  {/* Frameless Image Column */}
                  <div
                    className={`lg:col-span-6 ${
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[460px] rounded-2xl overflow-hidden shadow-xl group bg-amber-950/20">
                      <img
                        src={item.image}
                        alt={item.headingMain}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 bg-amber-950/90 text-amber-200 text-xs font-bold px-3.5 py-1.5 rounded-full border border-amber-500/40 backdrop-blur-md shadow-lg">
                        {item.badge}
                      </div>
                    </div>
                  </div>

                  {/* Editorial Text Column */}
                  <div
                    className={`lg:col-span-6 space-y-5 ${
                      isEven ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    {/* Dash Tag Accent */}
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-[2px] bg-amber-800/80"></span>
                      <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-900/90">
                        {item.tag}
                      </span>
                    </div>

                    {/* Editorial Two-Tone Heading */}
                    <h3 className="font-serif text-2xl sm:text-4xl lg:text-[40px] font-extrabold text-[#2D1214] leading-[1.15] tracking-tight">
                      <span className="block">{item.headingMain}</span>
                      <span className="block font-serif font-normal italic text-amber-800 mt-1">
                        {item.headingHighlight}
                      </span>
                    </h3>

                    {/* Subtle Divider Line */}
                    <div className="w-16 h-[2px] bg-amber-200/80"></div>

                    {/* Paragraph */}
                    <p className="text-xs sm:text-sm lg:text-base text-gray-700 font-medium leading-relaxed">
                      {item.description}
                    </p>

                    {/* Quote / Heritage Stamp */}
                    <div className="pt-4 border-t border-amber-200/60 flex items-start gap-3">
                      <span className="text-2xl text-amber-800 leading-none select-none font-serif">“</span>
                      <div>
                        <p className="text-xs sm:text-sm font-serif italic text-amber-950 font-semibold">
                          {item.quote}
                        </p>
                        <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                          Verified Official Reoti Handloom Heritage Record
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. Reoti Values 3-Card Grid Section */}
        <section className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Authentic Heritage */}
            <div className="bg-white border border-amber-200/80 rounded-2xl p-6 sm:p-7 shadow-md hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-100/80 text-rose-800 flex items-center justify-center border border-amber-200">
                <ShieldCheck className="w-6 h-6 text-rose-700" />
              </div>
              <h3 className="font-serif font-bold text-xl text-amber-950">
                Authentic Heritage
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Every saree is woven using centuries-old techniques inspired by Ahilya Fort architecture and royal Maheshwar motifs.
              </p>
            </div>

            {/* Card 2: Artisan Empowerment */}
            <div className="bg-white border border-amber-200/80 rounded-2xl p-6 sm:p-7 shadow-md hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-100/80 text-rose-800 flex items-center justify-center border border-amber-200">
                <Award className="w-6 h-6 text-rose-700" />
              </div>
              <h3 className="font-serif font-bold text-xl text-amber-950">
                Artisan Empowerment
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                By buying directly from Reoti Handloom, you support traditional Maheshwar weaver families and preserve living Indian craft.
              </p>
            </div>

            {/* Card 3: Quality Guarantee */}
            <div className="bg-white border border-amber-200/80 rounded-2xl p-6 sm:p-7 shadow-md hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-100/80 text-rose-800 flex items-center justify-center border border-amber-200">
                <Heart className="w-6 h-6 text-rose-700" />
              </div>
              <h3 className="font-serif font-bold text-xl text-amber-950">
                Quality Guarantee
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Strict quality inspection for weave density, pure zari luster, and soft fabric finish before every order is shipped.
              </p>
            </div>

          </div>
        </section>

        {/* 4. Bottom Ratings & Trust Badges Section */}
        <div className="pt-8 border-t border-amber-200/80 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center">
          
          {/* Google Reviews Badge */}
          <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="font-extrabold text-xs text-gray-900 ml-1">4.8 / 5.0</span>
            </div>
            <p className="text-xs text-gray-600 font-bold">331+ Verified Google Reviews</p>
          </div>

          {/* Craftmark Badge */}
          <div className="flex items-center gap-2 border-l border-r border-amber-200 px-6 py-1">
            <ShieldCheck className="w-6 h-6 text-rose-700 shrink-0" />
            <div className="text-left">
              <p className="font-serif font-extrabold text-xs text-amber-950 uppercase tracking-wider">100% Certified</p>
              <p className="text-[11px] text-gray-600 font-medium">Craftmark & Handloom Mark</p>
            </div>
          </div>

          {/* Loom Guarantee */}
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-700 shrink-0" />
            <div className="text-left">
              <p className="font-serif font-extrabold text-xs text-amber-950 uppercase tracking-wider">Direct Loom Price</p>
              <p className="text-[11px] text-gray-600 font-medium">Straight from Maheshwar Weavers</p>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}


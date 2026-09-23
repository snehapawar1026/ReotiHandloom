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

      {/* 2. Main Reoti Story Layout (Full Responsive Max Width) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
        
        {/* Section Heading (Centered) */}
        <div className="border-b border-amber-200/80 pb-6 text-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B263E] bg-rose-50 px-4 py-1 rounded-full border border-rose-200">
              Reoti Heritage Story
            </span>
            <h2 className="font-serif font-extrabold text-3xl sm:text-5xl text-[#2D1214] tracking-wide inline-flex items-center justify-center gap-2">
              <span>The Reoti Heritage Saga: Royal Maheshwar Weaves</span>
              <span className="text-[#E52E4E]">✨</span>
            </h2>
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

        {/* Story Text Paragraphs (Centered / Editorial Layout) */}
        <div className="space-y-6 text-gray-800 text-sm sm:text-base sm:leading-relaxed font-medium max-w-4xl mx-auto text-center">
          <p className="text-base sm:text-lg font-serif text-amber-950 font-semibold leading-relaxed">
            Welcome to Reoti Handloom, where tradition, craftsmanship, and heritage come together in every weave.
          </p>

          <p>
            Our journey began in 1960 with a simple vision—to preserve the rich tradition of authentic Maheshwari Handloom Sarees while delivering exceptional quality and craftsmanship. What started as a family tradition has grown into a legacy that has been proudly carried forward for three generations.
          </p>

          <p>
            The foundation of Reoti Handloom was laid by <strong className="font-semibold text-amber-950">Shri Lakshminarayan Ambekar</strong>, whose dedication to the art of Maheshwari weaving established a reputation for authenticity, honesty, and excellence. His passion for handloom and commitment to quality became the guiding principles of our family business.
          </p>

          <p>
            The legacy was then strengthened by the second generation, <strong className="font-semibold text-amber-950">Shri Ashok Ambekar</strong>, who continued to uphold these values while expanding the family&apos;s reach and earning the trust of customers across India. His dedication ensured that every saree represented the finest craftsmanship and timeless elegance that Maheshwari handloom is known for.
          </p>

          <p>
            Today, the third generation, <strong className="font-semibold text-amber-950">Shivam Ambekar</strong>, proudly carries this heritage forward with a vision of connecting the beauty of traditional Maheshwari sarees with modern customers around the world. While staying true to our roots, we embrace contemporary styles, making our collections suitable for weddings, festive celebrations, special occasions, and everyday elegance.
          </p>

          <p>
            Every saree at Reoti Handloom is a celebration of Indian craftsmanship. Woven by skilled artisans using traditional techniques passed down through generations, our Maheshwari sarees are known for their lightweight comfort, elegant borders, distinctive motifs, and luxurious silk-cotton texture. Each piece reflects countless hours of dedication, precision, and artistic excellence.
          </p>

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 text-amber-950 text-left my-4">
            <h4 className="font-serif font-bold text-base sm:text-lg text-[#8B263E] mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Our Authentic Weaving Collections</span>
            </h4>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
              Our collection includes a wide range of authentic Maheshwari Sarees, including Silk Cotton Maheshwari Sarees, Pure Silk Maheshwari Sarees, Resham Maheshwari Sarees, Tissue Maheshwari Sarees, Buti Sarees, Karvat Border Sarees, Diamond Border Sarees, festive collections, and exclusive handcrafted designs. Every creation is carefully selected to ensure unmatched quality, elegance, and authenticity.
            </p>
          </div>

          <p>
            At Reoti Handloom, we believe that a saree is more than just a garment—it is a story, an emotion, and a symbol of India&apos;s rich cultural heritage. Every weave carries the dedication of artisans and the legacy of a family that has devoted more than six decades to preserving the timeless beauty of Maheshwari handloom.
          </p>

          <p>
            Our commitment goes beyond selling sarees. We strive to support traditional weaving communities, promote authentic handloom craftsmanship, and deliver an exceptional shopping experience built on trust, quality, and customer satisfaction.
          </p>

          <p>
            Today, Reoti Handloom proudly serves customers across India and around the world, bringing the elegance of Maheshwari handloom to every wardrobe while preserving the traditions that began in 1960.
          </p>

          <p className="font-serif italic text-base sm:text-lg text-[#8B263E] font-semibold pt-2">
            “For us, every saree is not just handcrafted—it is woven with history, heritage, and generations of passion.”
          </p>
        </div>

        {/* Our Legacy: Three Generations */}
        <section className="pt-6">
          <div className="text-center space-y-2 mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B263E] bg-rose-50 px-4 py-1 rounded-full border border-rose-200">
              6 Decades of Excellence
            </span>
            <h3 className="font-serif font-extrabold text-2xl sm:text-4xl text-[#2D1214]">
              Our Legacy: Three Generations of Master Weavers
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1st Generation */}
            <div className="bg-white border-2 border-amber-200/90 rounded-2xl p-6 sm:p-7 shadow-md hover:shadow-lg transition-all space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-900 text-amber-200 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
                1st Gen • Est. 1960
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center border border-amber-300 font-serif font-bold text-lg">
                1
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-amber-800 font-bold">First Generation</p>
                <h4 className="font-serif font-extrabold text-xl text-amber-950 mt-0.5">Shri Lakshminarayan Ambekar</h4>
                <p className="text-xs text-rose-800 font-semibold">Founder (1960)</p>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-medium pt-1">
                Laid the foundation of Reoti Handloom with dedication to authentic Maheshwari weaving, establishing a reputation for honesty and craftsmanship.
              </p>
            </div>

            {/* 2nd Generation */}
            <div className="bg-white border-2 border-amber-200/90 rounded-2xl p-6 sm:p-7 shadow-md hover:shadow-lg transition-all space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-rose-900 text-rose-100 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
                2nd Gen • Awarded
              </div>
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-900 flex items-center justify-center border border-rose-300 font-serif font-bold text-lg">
                2
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-rose-800 font-bold">Second Generation</p>
                <h4 className="font-serif font-extrabold text-xl text-amber-950 mt-0.5">Shri Ashok Ambekar</h4>
                <p className="text-xs text-rose-800 font-semibold">Master Weaver & Custodian</p>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-medium pt-1">
                Carried the family legacy forward with dedication, quality, and trust—earning state government awards and expanding trust across India.
              </p>
            </div>

            {/* 3rd Generation */}
            <div className="bg-white border-2 border-amber-200/90 rounded-2xl p-6 sm:p-7 shadow-md hover:shadow-lg transition-all space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-950 text-amber-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
                3rd Gen • Present
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center border border-amber-300 font-serif font-bold text-lg">
                3
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-amber-800 font-bold">Third Generation</p>
                <h4 className="font-serif font-extrabold text-xl text-amber-950 mt-0.5">Shivam Ambekar</h4>
                <p className="text-xs text-rose-800 font-semibold">Global Vision & Innovation</p>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-medium pt-1">
                Continuing the tradition by blending timeless craftsmanship with modern elegance for patrons across India and across the globe.
              </p>
            </div>
          </div>
        </section>

        {/* Our Promise & Mission Banner */}
        <section className="bg-gradient-to-br from-amber-950 via-rose-950 to-neutral-950 text-amber-100 rounded-3xl p-8 sm:p-12 shadow-xl border border-amber-700/60 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-900/80 border border-amber-600 px-4 py-1 rounded-full text-xs font-bold text-amber-300 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Our Heritage Commitment</span>
            </div>

            <h3 className="font-serif font-extrabold text-2xl sm:text-4xl text-amber-50">
              Our Promise to You
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left pt-2">
              <div className="flex items-start gap-3 bg-amber-900/40 border border-amber-700/50 p-4 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-amber-100">Authentic Maheshwari Handloom Sarees</span>
              </div>
              <div className="flex items-start gap-3 bg-amber-900/40 border border-amber-700/50 p-4 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-amber-100">Three Generations of Experience</span>
              </div>
              <div className="flex items-start gap-3 bg-amber-900/40 border border-amber-700/50 p-4 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-amber-100">Premium Quality Craftsmanship</span>
              </div>
              <div className="flex items-start gap-3 bg-amber-900/40 border border-amber-700/50 p-4 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-amber-100">Trusted by Customers Since 1960</span>
              </div>
              <div className="flex items-start gap-3 bg-amber-900/40 border border-amber-700/50 p-4 rounded-xl sm:col-span-2 lg:col-span-2">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-amber-100">Timeless Designs with Modern Elegance</span>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-700/50">
              <p className="font-serif font-bold text-base sm:text-xl text-amber-200">
                Reoti Handloom – Three Generations of Trust, Tradition & Timeless Maheshwari Sarees. Since 1960.
              </p>
            </div>
          </div>
        </section>

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
                  {/* Frameless Image Column (Full Un-cropped View) */}
                  <div
                    className={`lg:col-span-6 ${
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[500px] rounded-2xl overflow-hidden shadow-md group bg-amber-950/5 border border-amber-200/60 flex items-center justify-center p-2 sm:p-4">
                      <img
                        src={item.image}
                        alt={item.headingMain}
                        className="w-full h-full object-contain drop-shadow-md group-hover:scale-[1.02] transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-amber-950/90 text-amber-200 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/40 backdrop-blur-md shadow">
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


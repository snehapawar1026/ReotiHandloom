import type { Metadata } from 'next';
import Script from 'next/script';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ShopProvider } from '@/context/ShopContext';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { PushNotificationPrompt } from '@/components/PushNotificationPrompt';
import { TrustQualityWidget } from '@/components/TrustQualityWidget';
import { VisitorTracker } from '@/components/VisitorTracker';
import { SmartLeadCaptureModal } from '@/components/SmartLeadCaptureModal';
import { ImageProtection } from '@/components/ImageProtection';
import { GlobalErrorTracker } from '@/components/GlobalErrorTracker';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://reotihandloom.com'),
  title: {
    default: 'Maheshwari Sarees माहेश्वरी साड़ियाँ - Reoti Handloom',
    template: '%s | Reoti Handloom Maheshwar',
  },
  description:
    'Buy 100% authentic handcrafted Maheshwari Sarees, Silk-Cotton, Pure Silk, Tissue Zari & Garbha Reshami directly from 3rd generation master weavers in Maheshwar since 1960. Free Express Delivery & Cash on Delivery across India.',
  keywords: [
    'Maheshwari Sarees',
    'maheshwari saree',
    'maheshwari silk sarees',
    'maheshwari sarees',
    'maheshwari cotton silk saree',
    'pure maheshwari silk saree',
    'maheshwari silk suit',
    'maheshwari silk suits',
    'maheshwari silk dress material online',
    'maheshwari dress',
    'reshmi saree',
    'garbha reshami silk saree',
    'checks sarees',
    'checked saree',
    'silver border saree',
    'chanderi silk saree',
    'pure chanderi silk sarees',
    'pure chanderi saree',
    'chanderi katan silk saree',
    'bagh print saree',
    'bagh suits',
    'maheshwari saree origin',
    'handloom maheshwari sarees',
    'maheshwari handloom sarees',
    'महेश्वरी साड़ी',
    'गहेश्वरी साड़ी',
    'Maheshwari Sarees Online',
    'Buy Maheshwari Sarees Online',
    'Authentic Maheshwari Handloom Sarees',
    'Pure Silk Maheshwari Sarees',
    'Silk Cotton Maheshwari Sarees',
    'Garbha Reshami Silk Saree',
    'Tissue Zari Maheshwari Saree',
    'Direct From Maheshwar Weavers',
    'Maheshwari Handloom Saree Manufacturer',
    'Reoti Handloom Maheshwar',
    'Reoti Handloom',
    'Bugdi Border Saree',
    'Narmada Border Saree',
    'Original Maheshwari Sarees with Price',
    'Handloom Sarees Cash on Delivery',
    'GI Certified Maheshwar Handloom',
    'Rani Ahilyabai Holkar Maheshwari Sarees',
  ],
  authors: [{ name: 'Reoti Handloom Maheshwar', url: 'https://reotihandloom.com' }],
  creator: 'Reoti Handloom',
  publisher: 'Reoti Handloom Maheshwar',
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  icons: {
    icon: [
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/rh-logo.png', type: 'image/png' },
    ],
    shortcut: '/favicon-48x48.png',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Reoti Handloom | Authentic Maheshwari Sarees Direct From Weavers',
    description:
      'Direct from 3rd generation master weavers in Maheshwar since 1960. 100% pure silk & cotton handcrafted sarees with reversible zari border. Free Express Shipping.',
    url: 'https://reotihandloom.com',
    siteName: 'Reoti Handloom',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://reotihandloom.com/uploads/maheshwari_legacy_banner.png',
        width: 1200,
        height: 630,
        alt: 'Reoti Handloom Authentic Maheshwari Sarees',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reoti Handloom | Authentic Maheshwari Sarees Online Store',
    description: 'Shop authentic handcrafted Maheshwari sarees directly from master weavers in Maheshwar.',
    images: ['https://reotihandloom.com/uploads/maheshwari_legacy_banner.png'],
  },
  alternates: {
    canonical: 'https://reotihandloom.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': ['ClothingStore', 'Store', 'LocalBusiness', 'Organization'],
  '@id': 'https://reotihandloom.com/#organization',
  name: 'Reoti Handloom',
  legalName: 'Reoti Handloom Maheshwar',
  url: 'https://reotihandloom.com',
  logo: 'https://reotihandloom.com/rh-logo.png',
  image: 'https://reotihandloom.com/uploads/maheshwari_legacy_banner.png',
  description:
    'Authentic Maheshwari Handloom Sarees, Silk-Cotton, Pure Silk, Tissue Zari, and Suits handcrafted by 3rd generation master weavers since 1960 in Maheshwar, Madhya Pradesh.',
  foundingDate: '1960',
  founder: {
    '@type': 'Person',
    name: 'Shri Lakshminarayan Ambekar',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Mahatma Gandhi Marg',
    addressLocality: 'Maheshwar',
    addressRegion: 'Madhya Pradesh',
    postalCode: '451224',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 22.1764,
    longitude: 75.5866,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '21:00',
    },
  ],
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Credit Card, Debit Card, UPI, Net Banking, Razorpay',
  telephone: '+919617444445',
  email: 'reotihandloom@hotmail.com',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '342',
    bestRating: '5',
    worstRating: '1',
  },
  sameAs: [
    'https://www.instagram.com/reoti_handloom',
    'https://instagram.com/reoti_handloom',
    'https://in.pinterest.com/reotihandloom',
  ],
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://reotihandloom.com/products?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'History & Origin: Who founded Maheshwari sarees and when?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Maheshwari sarees were founded around 1770 by the visionary queen Rajmata Ahilyabai Holkar of the Holkar dynasty in Maheshwar, Madhya Pradesh. She invited traditional master weavers from Surat and Malwa to design royal gifts and garments for visiting royalty and dignitaries using architectural motifs from the Maheshwar Fort and sacred Narmada river.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is special about authentic Maheshwari Sarees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Maheshwari sarees are famous for their feather-light breathability (under 400 grams), reversible Zari borders (Bugdi / Karvat) that look identical on both sides, fine Mulberry silk warp with combed cotton weft, and royal architectural motifs like Chatai (mat), Chameli (jasmine), and Eent (brick pattern).',
      },
    },
    {
      '@type': 'Question',
      name: 'Where can I buy original Maheshwari Handloom Sarees directly from weavers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can buy 100% authentic certified Maheshwari Handloom Sarees directly from Reoti Handloom (Est. 1960) at 73 Laxmibai Marg, Maheshwar (MP) and online on https://reotihandloom.com with free delivery and Cash on Delivery across India.',
      },
    },
    {
      '@type': 'Question',
      name: 'How to identify genuine Maheshwari Handloom vs fake powerloom sarees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Authentic handloom sarees feature subtle loom pin marks (Kanni) along the selvedge, clean reversible border finishing without loose back floats, organic breathability, and natural Mulberry silk sheen.',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <head>
        <meta name="p:domain_verify" content="37dae2c939e0e05ddb5fe0687309a246" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
        {/* Google Analytics GA4 */}
        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-KXC0XN60C8"
        />
        <Script
          id="google-analytics-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KXC0XN60C8', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-gray-900 font-sans antialiased">
        <ShopProvider>
          <GlobalErrorTracker />
          <Navbar />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingWhatsApp />
          <TrustQualityWidget />
          {/* <PushNotificationPrompt /> - disabled as requested, can re-enable in future */}
          <VisitorTracker />
          <SmartLeadCaptureModal />
          <ImageProtection />
        </ShopProvider>
      </body>
    </html>
  );
}


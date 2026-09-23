import type { Metadata } from 'next';
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
    default: 'Reoti Handloom | Authentic Maheshwari Sarees Online Store',
    template: '%s | Reoti Handloom',
  },
  description:
    'Shop 100% authentic handcrafted Maheshwari Sarees, Silk-Cotton, Pure Silk, Tissue Zari & Garbha Reshami directly from 3rd generation master weavers in Maheshwar. Free express delivery across India and worldwide shipping.',
  keywords: [
    'Reoti Handloom',
    'Reoti Handloom Maheshwar',
    'Maheshwari Sarees',
    'Maheshwari Handloom Sarees',
    'Pure Silk Maheshwari Sarees',
    'Silk Cotton Maheshwari Sarees',
    'Garbha Reshami Silk Saree',
    'Tissue Zari Maheshwari',
    'Maheshwar Saree Online',
    'Authentic Handloom Sarees India',
    'Bugdi Border Saree',
    'Narmada Border Saree',
    'Maheshwari Saree Manufacturer',
    'Handloom Sarees Cash on Delivery',
    'Buy Maheshwari Sarees Online',
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
    title: 'Reoti Handloom | Authentic Maheshwari Sarees Online Store',
    description:
      'Something "more" in Maheshwari Handloom. Direct from 3rd generation master weavers in Maheshwar since 1960. 100% pure silk & cotton.',
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
    title: 'Reoti Handloom | Authentic Maheshwari Sarees',
    description: 'Shop authentic handcrafted Maheshwari sarees directly from weavers in Maheshwar.',
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
  '@type': ['Organization', 'LocalBusiness', 'Store'],
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
    addressLocality: 'Maheshwar',
    addressRegion: 'Madhya Pradesh',
    postalCode: '451224',
    addressCountry: 'IN',
  },
  priceRange: '₹₹',
  telephone: '+919179991226',
  email: 'reotihandloom@hotmail.com',
  sameAs: [
    'https://www.instagram.com/reoti_handloom',
    'https://instagram.com/reoti_handloom',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-gray-900 font-sans antialiased">
        <ShopProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingWhatsApp />
          <TrustQualityWidget />
          <PushNotificationPrompt />
          <VisitorTracker />
          <SmartLeadCaptureModal />
        </ShopProvider>
      </body>
    </html>
  );
}


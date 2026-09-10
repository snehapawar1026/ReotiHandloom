import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ShopProvider } from '@/context/ShopContext';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';

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
  title: 'Reoti Handloom | Authentic Maheshwari Sarees Online Store',
  description: 'Shop authentic handcrafted Maheshwari sarees directly from Maheshwar fort artisans. Silk-Cotton, Pure Silk, Tissue Zari, and Chatai Border Sarees.',
  keywords: ['Reoti Handloom', 'Maheshwari Sarees', 'Pure Silk Sarees', 'Silk Cotton Sarees', 'Maheshwar Handloom', 'Tissue Zari Saree'],
  openGraph: {
    title: 'Reoti Handloom | Authentic Maheshwari Sarees',
    description: 'Something "more" in Maheshwari Handloom. Direct from Maheshwar weavers.',
    url: 'https://reotihandloom.com',
    siteName: 'Reoti Handloom',
    locale: 'en_IN',
    type: 'website',
  },
  alternates: {
    canonical: 'https://reotihandloom.com',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-gray-900 font-sans antialiased">
        <ShopProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </ShopProvider>
      </body>
    </html>
  );
}

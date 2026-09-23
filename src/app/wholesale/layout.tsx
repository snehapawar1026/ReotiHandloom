import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wholesale & Bulk Maheshwari Sarees Direct from Manufacturer | Reoti Handloom',
  description:
    'Direct manufacturer wholesale pricing on authentic handwoven Maheshwari silk-cotton sarees, suits, and dupattas. Low minimum order quantities, custom dye & weave orders, and worldwide express shipping.',
  keywords: [
    'Maheshwari Sarees Wholesale',
    'Bulk Maheshwari Handloom Manufacturer',
    'Wholesale Silk Cotton Sarees Maheshwar',
    'B2B Handloom Sarees Supplier',
    'Buy Bulk Handloom Sarees Direct From Loom',
  ],
  alternates: {
    canonical: 'https://reotihandloom.com/wholesale',
  },
  openGraph: {
    title: 'Wholesale Maheshwari Sarees Direct from Manufacturer | Reoti Handloom',
    description: 'Direct manufacturer wholesale prices on authentic Maheshwari sarees with worldwide shipping.',
    url: 'https://reotihandloom.com/wholesale',
    siteName: 'Reoti Handloom',
    type: 'website',
  },
};

export default function WholesaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

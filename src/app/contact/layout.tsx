import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us & Visit Our Maheshwar Looms | Reoti Handloom',
  description:
    'Visit Reoti Handloom in Maheshwar, MP or get in touch for custom saree orders, master weaver consultations, wholesale inquiries, and dedicated customer support.',
  keywords: [
    'Contact Reoti Handloom',
    'Visit Maheshwar Handloom Looms',
    'Reoti Handloom Phone Number',
    'Reoti Handloom Address Maheshwar',
    'Buy Directly from Weavers Maheshwar',
  ],
  alternates: {
    canonical: 'https://reotihandloom.com/contact',
  },
  openGraph: {
    title: 'Contact Reoti Handloom | Maheshwar Looms',
    description: 'Connect with our master weavers in Maheshwar for authentic handloom sarees.',
    url: 'https://reotihandloom.com/contact',
    siteName: 'Reoti Handloom',
    type: 'website',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

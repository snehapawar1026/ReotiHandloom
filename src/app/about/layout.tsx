import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Three Generations of Authentic Maheshwari Weavers Since 1960',
  description:
    'Discover the 60-year royal heritage of Reoti Handloom Maheshwar. Founded in 1960 by Shri Lakshminarayan Ambekar, crafting authentic Maheshwari Sarees on traditional wooden pit looms on the banks of Maa Narmada.',
  keywords: [
    'About Reoti Handloom',
    'Maheshwari Handloom History',
    'Lakshminarayan Ambekar',
    'Ashok Ambekar',
    'Shivam Ambekar',
    'Maheshwar Weavers',
    'Holkar Dynasty Weaving',
    'State Award 1996 Handloom',
    'Authentic Maheshwari Saree Manufacturer',
  ],
  alternates: {
    canonical: 'https://reotihandloom.com/about',
  },
  openGraph: {
    title: 'About Reoti Handloom | Three Generations of Master Weavers',
    description:
      'Woven with history, heritage, and generations of passion in Maheshwar since 1960. 100% authentic handloom craftsmanship.',
    url: 'https://reotihandloom.com/about',
    siteName: 'Reoti Handloom',
    type: 'website',
    images: [
      {
        url: 'https://reotihandloom.com/uploads/maheshwari_legacy_banner.png',
        width: 1200,
        height: 630,
        alt: 'Reoti Handloom Legacy & Master Weavers',
      },
    ],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Handloom Heritage & Saree Care Blog | Reoti Handloom Maheshwar',
  description:
    'Discover stories of ancient Maheshwari weaving, Narmada ghat traditions, identifying pure mulberry silk, reversible Bugdi border guides, and expert saree care advice.',
  keywords: [
    'Maheshwari Handloom Blog',
    'How to Identify Real Maheshwari Saree',
    'Silk Cotton Saree Care Tips',
    'Bugdi Border History Maheshwar',
    'Handloom Weaving Stories',
  ],
  alternates: {
    canonical: 'https://reotihandloom.com/blogs',
  },
  openGraph: {
    title: 'Handloom Heritage & Saree Care Blog | Reoti Handloom',
    description: 'Stories and expert guides on authentic Maheshwari handloom sarees and royal weaving heritage.',
    url: 'https://reotihandloom.com/blogs',
    siteName: 'Reoti Handloom',
    type: 'website',
  },
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

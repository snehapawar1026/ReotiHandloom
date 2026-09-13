'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BlockedAdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Block access to /admin completely and redirect to homepage
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center font-sans text-center px-4">
      <h1 className="text-4xl font-serif font-extrabold text-gray-900 mb-2">404 - Page Not Found</h1>
      <p className="text-sm text-gray-600 mb-6">The page you are looking for does not exist.</p>
    </div>
  );
}

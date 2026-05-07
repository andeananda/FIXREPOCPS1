'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const session = localStorage.getItem('voip_session');
    if (!session) {
      router.push('/login');
    }
  }, [router]);

  if (!isMounted) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#f0ece8', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
'use client';

import { useRouter } from 'next/navigation';
import { Phone, MessageSquare, Info } from 'lucide-react';

const menuItems = [
  {
    name: 'Dial Pad',
    href: '/dashboard/dialpad',
    icon: Phone,
  },
  {
    name: 'Call Log',
    href: '/dashboard/log',
    icon: MessageSquare,
  },
  {
    name: 'About',
    href: '/dashboard/about',
    icon: Info,
  },
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 120px)', // sisakan tinggi navbar + footer
        background: '#f0ece8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}
    >
      {/* Card container dark navy */}
      <div
        style={{
          background: 'linear-gradient(160deg, #1e2a3a 0%, #16202e 100%)',
          borderRadius: '28px',
          padding: '56px 60px',
          display: 'flex',
          gap: '32px',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
        }}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.href)}
              style={{
                background: '#ddd8d0',
                border: 'none',
                borderRadius: '20px',
                width: '140px',
                height: '140px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                cursor: 'pointer',
                transition: 'all 0.18s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = '#c8c2ba';
                el.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = '#ddd8d0';
                el.style.transform = 'scale(1)';
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96)';
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
              }}
            >
              <Icon
                size={44}
                color="#1e2a3a"
                strokeWidth={1.8}
              />
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1e2a3a',
                  letterSpacing: '0.01em',
                }}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
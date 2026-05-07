'use client';

import { usePathname } from 'next/navigation';

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/dialpad': 'Dial Pad',
  '/dashboard/call-log': 'Call Log',
  '/dashboard/about': 'About',
};

export default function Footer() {
  const pathname = usePathname();
  const label = routeLabels[pathname] ?? '';

  return (
    <footer
      style={{
        background: '#1e2a3a',
        color: 'rgba(255,255,255,0.85)',
        fontSize: '14px',
        fontWeight: 500,
        padding: '16px 32px',
        letterSpacing: '0.01em',
        userSelect: 'none',
        marginTop: 'auto',
      }}
    >
      {label}
    </footer>
  );
}

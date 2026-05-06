'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('voip_session');
    router.push('/login');
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Dial Pad', href: '/dashboard/dialpad' },
    { name: 'Call Log', href: '/dashboard/log' },
    { name: 'About', href: '/dashboard/about' },
  ];

  return (
    <nav
      style={{
        background: '#1e2a3a',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <Link
        href="/dashboard"
        style={{
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '16px',
          textDecoration: 'none',
          letterSpacing: '0.01em',
          whiteSpace: 'nowrap',
        }}
      >
        VoIP App
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              style={{
                color: isActive ? '#1e2a3a' : 'rgba(255,255,255,0.75)',
                background: isActive ? '#ffffff' : 'transparent',
                borderRadius: '999px',
                padding: '6px 16px',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                textDecoration: 'none',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {link.name}
            </Link>
          );
        })}

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#f87171',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            padding: '6px 16px',
            borderRadius: '999px',
            marginLeft: '8px',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(248,113,113,0.1)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')
          }
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
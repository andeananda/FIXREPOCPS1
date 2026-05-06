'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Phone, PhoneCall, List, Info, LogOut } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('voip_session');
    router.push('/login');
  };

  const navLinks = [
    { name: 'Dial Pad', href: '/dashboard/dialpad', icon: Phone },
    { name: 'Call', href: '/dashboard/call', icon: PhoneCall },
    { name: 'Call Log', href: '/dashboard/log', icon: List },
    { name: 'About', href: '/dashboard/about', icon: Info },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <PhoneCall className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">VoIP<span className="text-blue-600">Connect</span></span>
            </Link>
            
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive 
                        ? 'border-blue-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile nav (simplified) */}
      <div className="sm:hidden flex overflow-x-auto border-t border-gray-100 bg-gray-50 p-2 gap-2 hide-scrollbar">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

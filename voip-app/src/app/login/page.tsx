'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react'; 

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem('voip_session');
    if (session) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call our example API
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('voip_session', JSON.stringify({
          phone: phoneNumber,
          password: password, 
          token: data.token
        }));
        router.push('/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1F3B] relative flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#272B4B] opacity-50 blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#272B4B] opacity-50 blur-3xl"></div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Container Kartu Form */}
        <div className="bg-[#F4EFE6] py-10 px-6 shadow-2xl sm:rounded-[2rem] sm:px-12 w-[400px] mx-auto">
          
          {/* Ikon Avatar Profile */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-[#1B1F3B] flex items-center justify-center">
              <User className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Input Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-[11px] font-bold text-gray-600 tracking-wider uppercase mb-1">
                Phone Number
              </label>
              <div className="flex gap-2">
                <div className="w-16 flex items-center justify-center bg-[#E2DDD3] border border-[#D1CBBF] rounded-lg text-sm text-gray-700 font-medium">
                  +62
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 block w-full px-4 py-3 bg-[#E2DDD3] border border-[#D1CBBF] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B1F3B] focus:border-[#1B1F3B] sm:text-sm placeholder-gray-400 text-gray-800"
                  placeholder="08XXXXXXXXXX"
                />
              </div>
            </div>


            <div>
              <label htmlFor="password" className="block text-[11px] font-bold text-gray-600 tracking-wider uppercase mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-[#E2DDD3] border border-[#D1CBBF] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B1F3B] focus:border-[#1B1F3B] sm:text-sm placeholder-gray-400 text-gray-800"
                placeholder="Enter password"
              />
            </div>

            {/* buton login  */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-semibold text-white bg-[#1B1F3B] hover:bg-[#121528] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B1F3B] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Phone, Delete } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DialPad() {
  const [number, setNumber] = useState('');
  const router = useRouter();

  const handlePress = (digit: string) => {
    setNumber(prev => prev + digit);
  };

  const handleDelete = () => {
    setNumber(prev => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (number.trim()) {
      router.push(`/dashboard/call?target=${encodeURIComponent(number)}`);
    }
  };

  const padButtons = [
    { digit: '1', letters: '' },
    { digit: '2', letters: 'ABC' },
    { digit: '3', letters: 'DEF' },
    { digit: '4', letters: 'GHI' },
    { digit: '5', letters: 'JKL' },
    { digit: '6', letters: 'MNO' },
    { digit: '7', letters: 'PQRS' },
    { digit: '8', letters: 'TUV' },
    { digit: '9', letters: 'WXYZ' },
    { digit: '*', letters: '' },
    { digit: '0', letters: '+' },
    { digit: '#', letters: '' },
  ];

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-[#f0ece8]">
      {/* Card utama — dark navy sesuai desain */}
      <div
        style={{
          background: 'linear-gradient(160deg, #1e2a3a 0%, #16202e 100%)',
          borderRadius: '24px',
          padding: '32px 28px 28px',
          width: '320px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
        }}
      >
        {/* Input nomor */}
        <div
          style={{
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '28px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <input
            type="text"
            readOnly
            value={number}
            placeholder="Enter number......"
            className="w-full bg-transparent outline-none text-center tracking-widest"
            style={{
              color: number ? '#ffffff' : 'rgba(255,255,255,0.35)',
              fontSize: number ? '22px' : '14px',
              fontWeight: 400,
              letterSpacing: number ? '0.15em' : '0.05em',
              caretColor: 'transparent',
            }}
          />
        </div>

        {/* Grid tombol */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          {padButtons.map((btn) => (
            <button
              key={btn.digit}
              onClick={() => handlePress(btn.digit)}
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                height: '64px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.15s, transform 0.1s',
                gap: '2px',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.13)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)';
              }}
              onMouseDown={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.94)';
              }}
              onMouseUp={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              <span
                style={{
                  color: '#ffffff',
                  fontSize: '20px',
                  fontWeight: 500,
                  lineHeight: 1,
                }}
              >
                {btn.digit}
              </span>
              {btn.letters && (
                <span
                  style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '9px',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                  }}
                >
                  {btn.letters}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Baris bawah: Call + Delete */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          {/* Tombol Call */}
          <button
            onClick={handleCall}
            disabled={!number}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: number ? '#22c55e' : 'rgba(34,197,94,0.35)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: number ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s, transform 0.15s',
              boxShadow: number ? '0 4px 20px rgba(34,197,94,0.4)' : 'none',
            }}
            onMouseEnter={e => {
              if (number) (e.currentTarget as HTMLButtonElement).style.background = '#16a34a';
            }}
            onMouseLeave={e => {
              if (number) (e.currentTarget as HTMLButtonElement).style.background = '#22c55e';
            }}
            onMouseDown={e => {
              if (number) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.93)';
            }}
            onMouseUp={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            }}
          >
            <Phone
              size={26}
              color="#ffffff"
              fill="#ffffff"
              strokeWidth={0}
            />
          </button>

          {/* Tombol Delete */}
          <button
            onClick={handleDelete}
            onContextMenu={(e) => { e.preventDefault(); setNumber(''); }}
            disabled={!number}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: number ? 'pointer' : 'not-allowed',
              opacity: number ? 1 : 0.3,
              transition: 'opacity 0.2s, background 0.15s',
            }}
            onMouseEnter={e => {
              if (number) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            <Delete size={22} color="rgba(255,255,255,0.6)" />
          </button>
        </div>
      </div>
    </div>
  );
}

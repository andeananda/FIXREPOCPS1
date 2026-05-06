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
    <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="p-8 pb-4">
        <div className="h-20 flex flex-col justify-end items-center mb-6 border-b border-gray-100 pb-4">
          <input
            type="text"
            readOnly
            value={number}
            className="w-full text-center text-4xl font-light text-gray-800 tracking-wider bg-transparent outline-none truncate"
            placeholder="Enter number"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {padButtons.map((btn) => (
            <button
              key={btn.digit}
              onClick={() => handlePress(btn.digit)}
              className="w-16 h-16 mx-auto rounded-full flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 group"
            >
              <span className="text-2xl text-gray-800 font-medium group-active:scale-95">{btn.digit}</span>
              {btn.letters && <span className="text-[10px] text-gray-400 font-medium mt-[-2px]">{btn.letters}</span>}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center px-4">
          <div className="w-16"></div> {/* Spacer */}
          
          <button
            onClick={handleCall}
            disabled={!number}
            className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 active:bg-green-700 flex items-center justify-center shadow-lg shadow-green-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            <Phone className="w-7 h-7 text-white fill-current" />
          </button>
          
          <div className="w-16 flex justify-center">
            <button
              onClick={handleDelete}
              onContextMenu={(e) => { e.preventDefault(); setNumber(''); }} 
              disabled={!number}
              className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Delete className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

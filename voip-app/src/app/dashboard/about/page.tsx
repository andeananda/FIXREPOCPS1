import { Server, Shield, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-12 w-full max-w-4xl mx-auto px-4">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-[#1B1F3B] tracking-tight">About VoIPConnect</h1>
        <p className="mt-4 text-xl text-gray-600">
          A modern, WebRTC-based SIP client integrated with Kamailio.
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Card: Kamailio */}
        <div className="bg-[#FFFFFF] p-8 rounded-[2rem] shadow-sm border border-[#D1CBBF] flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-[#F4EFE6] rounded-full flex items-center justify-center mb-6">
            <Server className="w-7 h-7 text-[#1B1F3B]" />
          </div>
          <h3 className="text-lg font-bold text-[#1B1F3B] mb-2">Kamailio Backend</h3>
          <p className="text-gray-500 text-sm">Robust SIP routing and session management powered by the open-source Kamailio server.</p>
        </div>
        
        {/* Card: WebRTC */}
        <div className="bg-[#FFFFFF] p-8 rounded-[2rem] shadow-sm border border-[#D1CBBF] flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-[#F4EFE6] rounded-full flex items-center justify-center mb-6">
            <Zap className="w-7 h-7 text-[#1B1F3B]" />
          </div>
          <h3 className="text-lg font-bold text-[#1B1F3B] mb-2">WebRTC & SIP.js</h3>
          <p className="text-gray-500 text-sm">Real-time, low latency voice communication directly in your browser using modern WebRTC standards.</p>
        </div>
        
        {/* Card: Secure */}
        <div className="bg-[#FFFFFF] p-8 rounded-[2rem] shadow-sm border border-[#D1CBBF] flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-[#F4EFE6] rounded-full flex items-center justify-center mb-6">
            <Shield className="w-7 h-7 text-[#1B1F3B]" />
          </div>
          <h3 className="text-lg font-bold text-[#1B1F3B] mb-2">Secure</h3>
          <p className="text-gray-500 text-sm">Encrypted communications using WSS (WebSocket Secure) and secure session descriptions.</p>
        </div>
      </div>
      
      {/* Architecture Box: Menggunakan warna Biru Gelap sesuai Dashboard */}
      <div className="bg-[#1B1F3B] rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-[#F4EFE6]">Architecture Overview</h2>
        <p className="mb-4 text-gray-300">
          This dashboard uses Next.js App Router for the frontend. User sessions are managed locally, and voice 
          calls are handled entirely client-side using `sip.js`.
        </p>
        <div className="h-px bg-gray-700 w-full my-6"></div>
        <p className="text-gray-300 italic text-sm">
          When you make a call, SIP.js establishes a WebSocket connection to the Kamailio server (`wss://sip.example.com:4443`). 
          Kamailio then routes the SIP INVITE to the target user.
        </p>
      </div>
    </div>
  );
}
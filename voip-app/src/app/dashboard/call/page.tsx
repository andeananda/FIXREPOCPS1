'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PhoneOff, Mic, MicOff, Volume2, User } from 'lucide-react';
import { SessionState } from 'sip.js';
import { makeCall, hangupCall, initSipUserAgent, SIP_SERVER } from '@/lib/sip';

function CallContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const target = searchParams.get('target');

  const [callState, setCallState] = useState<string>('Initializing...');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState === 'In Call') {
      timer = setInterval(() => setDuration(d => d + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  useEffect(() => {
    let mounted = true;

    const startCallFlow = async () => {
      try {
        if (!target) {
          setCallState('No target specified');
          return;
        }

        const session = localStorage.getItem('voip_session');
        if (!session) {
          router.push('/login');
          return;
        }

        const { phone, password } = JSON.parse(session);
        
        setCallState('Registering...');
        await initSipUserAgent(phone, password);
                
        if (!mounted) return;
        setCallState('Calling...');
        setSessionActive(true);

        await makeCall(target, (state) => {
          if (!mounted) return;
          switch (state) {
            case SessionState.Establishing:
              setCallState('Calling...');
              break;
            case SessionState.Established:
              setCallState('In Call');
              break;
            case SessionState.Terminating:
            case SessionState.Terminated:
              setCallState('Call Ended');
              setSessionActive(false);
              setTimeout(() => {
                if (mounted) router.push('/dashboard');
              }, 2000);
              break;
            default:
              break;
          }
        });
      } catch (err) {
        console.error('Call failed', err);
        if (mounted) {
          setCallState('Failed');
          setSessionActive(false);
        }
      }
    };

    startCallFlow();

    return () => {
      mounted = false;
      hangupCall().catch(console.error);
    };
  }, [target, router]);

  const handleHangup = async () => {
    await hangupCall();
    setCallState('Call Ended');
    setSessionActive(false);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 max-w-md mx-auto w-full">
      <div className="w-full bg-[#F4EFE6] rounded-[2.5rem] shadow-2xl overflow-hidden border border-[#D1CBBF] flex flex-col h-[550px]">
        
        <div className="flex-1 flex flex-col items-center pt-14 px-6">
          <div className="w-28 h-28 rounded-full bg-[#1B1F3B] flex items-center justify-center shadow-lg mb-6 relative">
            <User className="w-14 h-14 text-white" />
            {(callState === 'Calling...' || callState === 'Registering...') && (
              <span className="absolute w-full h-full rounded-full border-4 border-[#1B1F3B] animate-ping opacity-30"></span>
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-[#1B1F3B] mb-2 truncate max-w-full">
            {target || 'Unknown'}
          </h2>
          <p className="text-gray-500 text-sm font-medium mb-1">
            {target ? `sip:${target}@${SIP_SERVER}` : ''}
          </p>
          
          <div className="mt-6 flex flex-col items-center">
            <span className={`text-sm uppercase tracking-widest font-bold px-4 py-1.5 rounded-full ${
              callState === 'In Call' ? 'bg-green-600 text-white' :
              callState === 'Call Ended' || callState === 'Failed' ? 'bg-red-600 text-white' :
              'bg-[#1B1F3B] text-white'
            }`}>
              {callState}
            </span>
            
            {callState === 'In Call' && (
              <span className="text-4xl font-mono text-[#1B1F3B] mt-6 tabular-nums">
                {formatDuration(duration)}
              </span>
            )}
          </div>
        </div>

        <div className="h-44 bg-[#1B1F3B] px-8 py-6 flex items-center justify-around rounded-t-[3rem]">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            disabled={!sessionActive}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isMuted ? 'bg-[#F4EFE6] text-[#1B1F3B]' : 'bg-white/10 text-white hover:bg-white/20'
            } disabled:opacity-30`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          
          <button 
            onClick={handleHangup}
            className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 flex items-center justify-center shadow-xl shadow-red-900/40 transition-all hover:scale-110 group"
          >
            <PhoneOff className="w-8 h-8 text-white fill-current group-hover:scale-110 transition-transform" />
          </button>
          
          <button 
            disabled={!sessionActive}
            className="w-14 h-14 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all disabled:opacity-30"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      <p className="mt-6 text-gray-500 text-xs font-medium uppercase tracking-tighter opacity-50">
        Secure VoIP Connection Established
      </p>
    </div>
  );
}

export default function CallPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex justify-center items-center text-[#1B1F3B]">Loading Call Module...</div>}>
      <CallContent />
    </Suspense>
  );
}
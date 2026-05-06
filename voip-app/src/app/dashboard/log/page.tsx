'use client';

import { useState, useEffect } from 'react';
import { PhoneOutgoing, PhoneIncoming, PhoneMissed, Clock, Calendar } from 'lucide-react';

interface CallLog {
  id: string;
  target: string;
  direction: 'inbound' | 'outbound';
  status: 'completed' | 'missed' | 'failed';
  duration: number; // seconds
  timestamp: string;
}

export default function CallLogPage() {
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/call-log');
        const data = await res.json();
        if (data.success) {
          setLogs(data.logs);
        }
      } catch (err) {
        console.error('Failed to fetch call logs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="py-8 w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Call Histrory</h1>
        <p className="mt-2 text-gray-500">View your recent inbound and outbound calls</p>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading call history...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No calls yet</h3>
            <p className="mt-1 text-gray-500">Your call history will appear here.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {logs.map((log) => (
              <li key={log.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between sm:px-6">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    log.status === 'missed' ? 'bg-red-100 text-red-600' :
                    log.direction === 'inbound' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {log.status === 'missed' ? <PhoneMissed className="w-5 h-5" /> :
                     log.direction === 'inbound' ? <PhoneIncoming className="w-5 h-5" /> :
                     <PhoneOutgoing className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {log.target}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 gap-3 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(log.timestamp)}
                      </span>
                      {log.status === 'completed' && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(log.duration)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    log.status === 'completed' ? 'bg-green-100 text-green-800' :
                    log.status === 'missed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {log.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

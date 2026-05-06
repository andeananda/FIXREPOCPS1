'use client';

import { useState, useEffect } from 'react';
import { Clock, PhoneIncoming, PhoneOutgoing, XCircle, CheckCircle } from 'lucide-react';

interface CallLog {
  id: number;
  target: string;
  direction: string;
  status: string;
  duration: number;
  timestamp: string;
}

export default function LogPage() {
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
      } catch (error) {
        console.error("Gagal mengambil log:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Call History</h1>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          Real-time from MariaDB
        </span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading call logs...</div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
          <p className="text-gray-500">No call history found in Kamailio server.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Extension</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Duration</th>
                <th className="px-6 py-4 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {log.direction === 'inbound' ? 
                      <PhoneIncoming className="w-5 h-5 text-blue-500" /> : 
                      <PhoneOutgoing className="w-5 h-5 text-indigo-500" />
                    }
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{log.target}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {log.status === 'completed' ? 
                        <CheckCircle className="w-4 h-4 text-green-500" /> : 
                        <XCircle className="w-4 h-4 text-red-400" />
                      }
                      <span className="capitalize">{log.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{log.duration}s</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(log.timestamp).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
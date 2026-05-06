'use client';

import { useState, useEffect } from 'react';
import { PhoneOutgoing, PhoneIncoming, PhoneMissed } from 'lucide-react';

interface CallLog {
  id: string;
  target: string;
  direction: 'inbound' | 'outbound';
  status: 'completed' | 'missed' | 'failed';
  duration: number; // seconds
  timestamp: string;
}

type FilterType = 'all' | 'missed' | 'received' | 'ended';

export default function CallLogPage() {
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

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
    if (seconds === 0) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
  };

  const getStatusLabel = (log: CallLog) => {
    if (log.status === 'missed') return 'Missed';
    if (log.status === 'failed') return 'Failed';
    if (log.direction === 'inbound') return 'Received';
    return 'Call Ended';
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    if (filter === 'missed') return log.status === 'missed';
    if (filter === 'received') return log.direction === 'inbound' && log.status === 'completed';
    if (filter === 'ended') return log.status === 'completed' || log.status === 'failed';
    return true;
  });

  const totalCalls = logs.length;
  const missedCalls = logs.filter((l) => l.status === 'missed').length;
  const receivedCalls = logs.filter(
    (l) => l.direction === 'inbound' && l.status === 'completed'
  ).length;

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'missed', label: 'Missed' },
    { key: 'received', label: 'Received' },
    { key: 'ended', label: 'Ended' },
  ];

  return (
    <div className="min-h-screen bg-[#f0ece8] py-10 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Judul */}
        <h1
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '42px',
            fontWeight: 400,
            color: '#1a1a1a',
            marginBottom: '28px',
            letterSpacing: '-0.5px',
          }}
        >
          Call Log
        </h1>

        {/* Summary Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          {/* Total Calls */}
          <div
            style={{
              background: '#e8e0d8',
              borderRadius: '16px',
              padding: '20px 24px',
            }}
          >
            <p style={{ fontSize: '13px', color: '#6b6560', marginBottom: '8px', fontWeight: 500 }}>
              Total Calls
            </p>
            <p style={{ fontSize: '36px', fontWeight: 600, color: '#1a1a1a', lineHeight: 1 }}>
              {loading ? '—' : totalCalls}
            </p>
          </div>

          {/* Missed */}
          <div
            style={{
              background: '#e8e0d8',
              borderRadius: '16px',
              padding: '20px 24px',
            }}
          >
            <p style={{ fontSize: '13px', color: '#6b6560', marginBottom: '8px', fontWeight: 500 }}>
              Missed
            </p>
            <p style={{ fontSize: '36px', fontWeight: 600, color: '#dc2626', lineHeight: 1 }}>
              {loading ? '—' : missedCalls}
            </p>
          </div>

          {/* Received */}
          <div
            style={{
              background: '#e8e0d8',
              borderRadius: '16px',
              padding: '20px 24px',
            }}
          >
            <p style={{ fontSize: '13px', color: '#6b6560', marginBottom: '8px', fontWeight: 500 }}>
              Received
            </p>
            <p style={{ fontSize: '36px', fontWeight: 600, color: '#16a34a', lineHeight: 1 }}>
              {loading ? '—' : receivedCalls}
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '8px 20px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: filter === f.key ? '#1e2a3a' : '#ddd5cb',
                color: filter === f.key ? '#ffffff' : '#4a4540',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Tabel */}
        <div
          style={{
            background: '#e8e2da',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          {/* Header tabel */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
              padding: '16px 28px',
              borderBottom: '1px solid rgba(0,0,0,0.08)',
            }}
          >
            {['Name', 'Number', 'Time', 'Duration', 'Info'].map((col) => (
              <span
                key={col}
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#3a3530',
                  textAlign: 'center',
                }}
              >
                {col}
              </span>
            ))}
          </div>

          {/* Isi tabel */}
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
              Loading call history...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div style={{ padding: '64px', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  background: '#d4cdc5',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <PhoneMissed size={24} color="#9ca3af" />
              </div>
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#3a3530' }}>No calls found</p>
              <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>
                Your call history will appear here.
              </p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {filteredLogs.map((log, idx) => (
                <li
                  key={log.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                    padding: '18px 28px',
                    alignItems: 'center',
                    borderBottom:
                      idx < filteredLogs.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                    background: 'transparent',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLLIElement).style.background =
                      'rgba(255,255,255,0.35)')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLLIElement).style.background = 'transparent')
                  }
                >
                  {/* Name */}
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#1a1a1a',
                      textAlign: 'center',
                    }}
                  >
                    {log.direction === 'inbound' ? 'Incoming' : log.target}
                  </span>

                  {/* Number */}
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#1a1a1a',
                      textAlign: 'center',
                    }}
                  >
                    {log.target}
                  </span>

                  {/* Time */}
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#1a1a1a',
                      textAlign: 'center',
                    }}
                  >
                    {formatTime(log.timestamp)}
                  </span>

                  {/* Duration */}
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#1a1a1a',
                      textAlign: 'center',
                    }}
                  >
                    {log.status === 'missed' ? '-' : formatDuration(log.duration)}
                  </span>

                  {/* Info */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color:
                          log.status === 'missed'
                            ? '#dc2626'
                            : log.direction === 'inbound'
                            ? '#16a34a'
                            : '#1a1a1a',
                      }}
                    >
                      {getStatusLabel(log)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

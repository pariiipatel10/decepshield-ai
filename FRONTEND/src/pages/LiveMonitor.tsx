import { useState, useEffect } from 'react';
import { Activity, Filter, Download } from 'lucide-react';
import { format } from 'date-fns';

// Minimal starting data
const MOCK_LOGS = [
  {
    id: `log-init`,
    timestamp: new Date().toISOString(),
    sourceIp: `192.168.1.45`,
    country: 'Unknown',
    attackType: 'System Initialized',
    protocol: 'SYSTEM',
    riskScore: 0,
  }
];

const LiveMonitor = () => {
  const [logs, setLogs] = useState(MOCK_LOGS);

  // Simulate incoming real-time logs
  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        sourceIp: `10.0.0.${Math.floor(Math.random() * 255)}`,
        country: ['RU', 'CN', 'US', 'BR', 'IR'][Math.floor(Math.random() * 5)],
        attackType: ['SQL Injection', 'Brute Force', 'Port Scan', 'XSS'][Math.floor(Math.random() * 4)],
        protocol: ['TCP', 'UDP', 'HTTP', 'SSH'][Math.floor(Math.random() * 4)],
        riskScore: Math.floor(Math.random() * 100),
      };
      setLogs(prev => [newLog, ...prev].slice(0, 20)); // Keep minimal history
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (score: number) => {
    if (score === 0) return 'text-[var(--color-primary)] bg-[var(--color-primary-alpha-10)] border-[var(--color-primary-alpha-30)]';
    if (score >= 80) return 'text-[var(--color-tertiary)] bg-[var(--color-tertiary-alpha-10)] border-[var(--color-tertiary-alpha-20)]';
    if (score >= 50) return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text-main)] flex items-center gap-2">
            <Activity className="text-[var(--color-primary)]" /> Live Attack Monitor
          </h2>
          <p className="text-[var(--color-text-muted)]">Real-time stream of intercepted malicious activities</p>
        </div>
        <div className="flex gap-3">
          <button className="glass-panel px-4 py-2 flex items-center gap-2 text-sm hover:bg-[var(--color-bg-hover)] transition-colors">
            <Filter size={16} /> Filters
          </button>
          <button className="glass-panel px-4 py-2 flex items-center gap-2 text-sm hover:bg-[var(--color-bg-hover)] transition-colors">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="overflow-x-auto shrink-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border-glass)] bg-[var(--color-bg-card)]">
                <th className="p-4 font-medium text-[var(--color-text-muted)] text-sm whitespace-nowrap">TIMESTAMP</th>
                <th className="p-4 font-medium text-[var(--color-text-muted)] text-sm whitespace-nowrap">SOURCE IP</th>
                <th className="p-4 font-medium text-[var(--color-text-muted)] text-sm whitespace-nowrap">GEO</th>
                <th className="p-4 font-medium text-[var(--color-text-muted)] text-sm whitespace-nowrap">ATTACK TYPE</th>
                <th className="p-4 font-medium text-[var(--color-text-muted)] text-sm whitespace-nowrap">PROTOCOL</th>
                <th className="p-4 font-medium text-[var(--color-text-muted)] text-sm whitespace-nowrap">RISK SCORE</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="overflow-y-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse">
             <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-[var(--color-border-glass)] hover:bg-[var(--color-bg-hover)] transition-colors font-mono text-sm">
                  <td className="p-4 text-[var(--color-text-muted)] whitespace-nowrap">
                    {format(new Date(log.timestamp), 'HH:mm:ss.SSS')}
                  </td>
                  <td className="p-4 text-[var(--color-text-main)] whitespace-nowrap">{log.sourceIp}</td>
                  <td className="p-4 text-[var(--color-text-muted)]">{log.country}</td>
                  <td className="p-4 text-[var(--color-secondary)] whitespace-nowrap">{log.attackType}</td>
                  <td className="p-4 text-[var(--color-text-muted)]">{log.protocol}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded border ${getRiskColor(log.riskScore)}`}>
                      {log.riskScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LiveMonitor;

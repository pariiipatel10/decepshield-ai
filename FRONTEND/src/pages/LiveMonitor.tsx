import { useState, useEffect, useContext } from 'react';
import { Activity, Filter, Download } from 'lucide-react';
import { format } from 'date-fns';
import api, { API_BASE_URL } from '../services/api';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

const LiveMonitor = () => {
  const { token } = useContext(AuthContext) || {};
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    // 1. Fetch recent incidents
    const fetchIncidents = async () => {
      try {
        const res = await api.get('/api/incidents');
        setLogs(res.data.incidents || []);
      } catch (error) {
        console.error('Failed to fetch initial incidents:', error);
      }
    };
    
    if (token) fetchIncidents();

    // 2. Connect to Socket.IO for real-time updates
    const socket = io(API_BASE_URL);
    
    socket.on('new_incident', (incident) => {
      setLogs(prev => [incident, ...prev].slice(0, 50)); // Keep last 50
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const getRiskColor = (severity: string) => {
    if (severity === 'Critical') return 'text-[var(--color-tertiary)] bg-[var(--color-tertiary-alpha-10)] border-[var(--color-tertiary-alpha-20)]';
    if (severity === 'High') return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    if (severity === 'Medium') return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    return 'text-[var(--color-primary)] bg-[var(--color-primary-alpha-10)] border-[var(--color-primary-alpha-30)]';
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
                <th className="p-4 font-medium text-[var(--color-text-muted)] text-sm whitespace-nowrap">TARGET</th>
                <th className="p-4 font-medium text-[var(--color-text-muted)] text-sm whitespace-nowrap">ATTACK TYPE</th>
                <th className="p-4 font-medium text-[var(--color-text-muted)] text-sm whitespace-nowrap">SEVERITY</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="overflow-y-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse">
             <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[var(--color-text-muted)] italic">
                    Waiting for real-time attacks... (Run the simulator script to see live data)
                  </td>
                </tr>
              ) : logs.map((log) => (
                <tr key={log._id || log.id} className="border-b border-[var(--color-border-glass)] hover:bg-[var(--color-bg-hover)] transition-colors font-mono text-sm">
                  <td className="p-4 text-[var(--color-text-muted)] whitespace-nowrap">
                    {log.timestamp ? format(new Date(log.timestamp), 'HH:mm:ss.SSS') : 'N/A'}
                  </td>
                  <td className="p-4 text-[var(--color-text-main)] whitespace-nowrap">{log.ip}</td>
                  <td className="p-4 text-[var(--color-text-muted)]">{log.target}</td>
                  <td className="p-4 text-[var(--color-secondary)] whitespace-nowrap">{log.type}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded border ${getRiskColor(log.severity)}`}>
                      {log.severity}
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

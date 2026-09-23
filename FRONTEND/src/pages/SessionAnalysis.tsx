import { useState, useEffect, useContext } from 'react';
import { Terminal, Code, Cpu, Database, Network } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const SessionAnalysis = () => {
  const { token } = useContext(AuthContext) || {};
  const [activeSession, setActiveSession] = useState<any>(null);
  const [terminalLogs, setTerminalLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const sessionsRes = await api.get('/api/sessions');
        
        if (sessionsRes.data.length > 0) {
          const session = sessionsRes.data[0];
          setActiveSession(session);
          
          const terminalRes = await api.get(`/api/sessions/${session.sessionId}/terminal`);
          setTerminalLogs(terminalRes.data);
        }
      } catch (err) {
        console.error('Failed to fetch session analysis data', err);
      }
    };
    if (token) fetchSessionData();
  }, [token]);

  if (!activeSession) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[var(--color-text-main)] flex items-center gap-2">
          <Terminal className="text-[var(--color-primary)]" /> Session Analysis
        </h2>
        <div className="glass-panel p-12 text-center text-[var(--color-text-muted)]">
          No attacker sessions found to analyze. Run the attack simulator.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="shrink-0">
        <h2 className="text-2xl font-bold text-[var(--color-text-main)] flex items-center gap-2">
          <Terminal className="text-[var(--color-primary)]" /> Session Analysis
        </h2>
        <p className="text-[var(--color-text-muted)]">Deep dive into a specific attacker's interaction with the honeypot</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-4">Session Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-[var(--color-border-glass)] pb-2">
                <span className="text-[var(--color-text-muted)] text-sm">Session ID</span>
                <span className="text-[var(--color-text-main)] text-sm font-mono">{activeSession.sessionId}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--color-border-glass)] pb-2">
                <span className="text-[var(--color-text-muted)] text-sm">Attacker IP</span>
                <span className="text-[var(--color-text-main)] text-sm font-mono">{activeSession.attackerIp}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--color-border-glass)] pb-2">
                <span className="text-[var(--color-text-muted)] text-sm">Target Honeypot</span>
                <span className="text-[var(--color-text-main)] text-sm">{activeSession.targetHoneypot}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-[var(--color-text-muted)] text-sm">Started</span>
                <span className="text-[var(--color-text-main)] text-sm">{new Date(activeSession.startTime).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 border-l-4 border-l-[var(--color-primary)]">
            <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-2 flex items-center gap-2">
              <Cpu size={20} className="text-[var(--color-primary)]" /> AI Summary
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              {activeSession.aiSummary || 'AI Analysis is pending...'}
            </p>
          </div>
          
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-4">Files Accessed</h3>
            <ul className="space-y-2 font-mono text-sm">
              {activeSession.filesAccessed && activeSession.filesAccessed.length > 0 ? (
                activeSession.filesAccessed.map((f: any, i: number) => (
                  <li key={i} className={`flex items-center gap-2 transition-colors cursor-pointer ${
                    f.type === 'script' ? 'text-green-400 hover:text-green-300' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                  }`}>
                    {f.type === 'script' ? <Code size={14} /> : <Database size={14} />} {f.path}
                  </li>
                ))
              ) : (
                <li className="text-[var(--color-text-muted)] italic">No files accessed yet.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2 glass-panel flex flex-col h-[800px]">
          <div className="p-4 border-b border-[var(--color-border-glass)] bg-[var(--color-bg-card)] flex justify-between items-center shrink-0">
            <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase flex items-center gap-2">
              <Network size={16} /> Interactive Terminal Log
            </h3>
            <button className="text-xs px-3 py-1 bg-[var(--color-bg-active)] hover:bg-[var(--color-bg-active-hover)] rounded text-[var(--color-text-main)] transition-colors">
              Raw Format
            </button>
          </div>
          
          <div className="p-6 font-mono text-sm overflow-y-auto custom-scrollbar flex-1 bg-[var(--color-bg-base)]">
            {terminalLogs.map((log: any, i: number) => (
              <div key={i} className="mb-4">
                <div className="text-green-400 mb-1">{log.user}@vps-server:~# {log.command}</div>
                {log.response && (
                  <div className="text-[var(--color-text-muted)] whitespace-pre-wrap">{log.response}</div>
                )}
              </div>
            ))}
            
            <div className="text-green-400 mb-2 animate-pulse">root@vps-server:~# █</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionAnalysis;

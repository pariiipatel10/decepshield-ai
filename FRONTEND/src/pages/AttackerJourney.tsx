import { useState, useEffect, useContext } from 'react';
import { Footprints, Search, Radar, Unlock, Database, FastForward, ShieldOff } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const STAGE_ORDER = ['recon', 'scanning', 'enumeration', 'exploitation', 'persistence', 'privilege', 'exfiltration'];

const STAGE_ICONS: Record<string, any> = {
  'recon': <Search size={24} />,
  'scanning': <Radar size={24} />,
  'enumeration': <FastForward size={24} />,
  'exploitation': <Unlock size={24} />,
  'persistence': <ShieldOff size={24} />,
  'privilege': <Unlock size={24} />,
  'exfiltration': <Database size={24} />
};

const STAGE_NAMES: Record<string, string> = {
  'recon': 'Reconnaissance',
  'scanning': 'Scanning',
  'enumeration': 'Enumeration',
  'exploitation': 'Exploitation',
  'persistence': 'Persistence',
  'privilege': 'Privilege Esc.',
  'exfiltration': 'Data Exfiltration'
};

const AttackerJourney = () => {
  const { token } = useContext(AuthContext) || {};
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/sessions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSessions(res.data);
        if (res.data.length > 0) {
          setActiveSessionId(res.data[0].sessionId);
        }
      } catch (err) {
        console.error('Failed to fetch sessions', err);
      }
    };
    if (token) fetchSessions();
  }, [token]);

  const activeSession = sessions.find(s => s.sessionId === activeSessionId) || null;
  const currentPhaseIndex = activeSession ? STAGE_ORDER.indexOf(activeSession.currentPhase) : -1;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text-main)] flex items-center gap-2">
          <Footprints className="text-[var(--color-primary)]" /> Attacker Journey
        </h2>
        <p className="text-[var(--color-text-muted)]">Visualizing the attack kill chain for active sessions</p>
      </div>

      {sessions.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {sessions.map(s => (
            <button
              key={s.sessionId}
              onClick={() => setActiveSessionId(s.sessionId)}
              className={`px-4 py-2 rounded text-sm whitespace-nowrap transition-colors ${
                activeSessionId === s.sessionId 
                  ? 'bg-[var(--color-primary-alpha-20)] border border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'bg-[var(--color-bg-card)] border border-[var(--color-border-glass)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)]'
              }`}
            >
              Session: {s.sessionId} ({s.attackerIp})
            </button>
          ))}
        </div>
      )}

      {!activeSession ? (
         <div className="glass-panel p-12 text-center text-[var(--color-text-muted)]">
            No active attacker sessions recorded yet. Run the attack simulator.
         </div>
      ) : (
        <>
          <div className="glass-panel p-8 overflow-x-auto">
            <div className="min-w-[800px] relative">
              {/* Timeline connecting line */}
              <div className="absolute top-8 left-0 right-0 h-1 bg-[var(--color-bg-active)] -z-10"></div>
              <div 
                className="absolute top-8 left-0 h-1 bg-[var(--color-primary)] shadow-custom-shadow-primary -z-10 transition-all duration-1000"
                style={{ width: `${Math.max(0, (currentPhaseIndex / (STAGE_ORDER.length - 1)) * 100)}%` }}
              ></div>

              <div className="flex justify-between items-start">
                {STAGE_ORDER.map((stageId, idx) => {
                  const isActive = idx <= currentPhaseIndex;
                  const isCurrent = idx === currentPhaseIndex;
                  
                  return (
                    <motion.div 
                      key={stageId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex flex-col items-center w-32 relative"
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
                        isActive 
                          ? 'bg-[var(--color-primary-alpha-10)] text-[var(--color-primary)] border-2 border-[var(--color-primary)] shadow-[0_0_15px_var(--color-primary-alpha-40)]' 
                          : 'bg-[rgba(0,0,0,0.5)] text-[var(--color-text-muted)] border-2 border-[var(--color-border-glass)]'
                      }`}>
                        {STAGE_ICONS[stageId]}
                      </div>
                      <h4 className={`text-sm font-bold text-center ${isActive ? 'text-[var(--color-text-main)]' : 'text-[var(--color-text-muted)]'}`}>
                        {STAGE_NAMES[stageId]}
                      </h4>
                      
                      {isCurrent && (
                        <div className="mt-4 p-2 bg-[var(--color-primary-alpha-10)] border border-[var(--color-primary-alpha-30)] rounded text-xs text-[var(--color-primary)] font-mono text-center">
                          Active Phase
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="glass-panel p-6">
              <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-4">AI Phase Summary</h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-4">
                {activeSession.aiSummary || 'No AI summary available for this phase.'}
              </p>
              {activeSession.phaseDetails?.rawPayload && (
                <div className="bg-[rgba(0,0,0,0.5)] p-4 rounded-lg font-mono text-sm text-green-400 overflow-x-auto">
                  {activeSession.phaseDetails.rawPayload}
                </div>
              )}
            </div>
            
            <div className="glass-panel p-6">
              <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-4">Deception Tactics Active</h3>
              <ul className="space-y-3">
                {activeSession.activeTactics && activeSession.activeTactics.length > 0 ? (
                  activeSession.activeTactics.map((tactic: any, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                      <div>
                        <p className="text-sm text-[var(--color-text-main)] font-medium">{tactic.name}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{tactic.description}</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-[var(--color-text-muted)] italic">No active tactics engaged yet.</li>
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AttackerJourney;

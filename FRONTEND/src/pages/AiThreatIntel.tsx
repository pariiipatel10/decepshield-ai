import { useState, useEffect, useContext } from 'react';
import { BrainCircuit, Crosshair, AlertTriangle, Fingerprint, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

const AiThreatIntel = () => {
  const { token } = useContext(AuthContext) || {};
  const [intelList, setIntelList] = useState<any[]>([]);

  useEffect(() => {
    const fetchIntel = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/threat-intel', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIntelList(res.data.filter((i: any) => i.status === 'Active') || []);
      } catch (err) {
        console.error('Failed to fetch threat intel', err);
      }
    };
    if (token) fetchIntel();

    const socket = io('http://localhost:3001');
    socket.on('intel:new', (newIntel) => {
      if (newIntel.status === 'Active') {
        setIntelList(prev => [newIntel, ...prev]);
      }
    });

    socket.on('intel:updated', (updatedIntel) => {
      if (updatedIntel.status !== 'Active') {
         setIntelList(prev => prev.filter(item => item._id !== updatedIntel._id));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const handleAction = async (id: string, action: string) => {
    try {
      await axios.patch(`http://localhost:3001/api/threat-intel/${id}`, 
        { status: action }, 
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setIntelList(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error('Failed to update intel status', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text-main)] flex items-center gap-2">
          <BrainCircuit className="text-[var(--color-primary)]" /> AI Threat Intelligence
        </h2>
        <p className="text-[var(--color-text-muted)]">Automated classification, intent prediction, and response recommendations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {intelList.map((intel, idx) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ delay: idx * 0.05 }}
              key={intel._id} 
              className="glass-panel p-6 border-l-4 border-l-[var(--color-secondary)]"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-1">{intel.classification}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`px-2 py-0.5 rounded border ${
                      intel.severity === 'Critical' ? 'bg-[var(--color-tertiary-alpha-10)] text-[var(--color-tertiary)] border-[var(--color-tertiary-alpha-30)]' :
                      intel.severity === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                      'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {intel.severity} Severity
                    </span>
                    <span className="text-[var(--color-text-muted)]">Confidence:</span>
                    <span className="text-[var(--color-primary)] font-bold">{intel.confidence}%</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-[var(--color-primary-alpha-10)] flex items-center justify-center custom-shadow-primary border border-[var(--color-primary-alpha-30)]">
                  <BrainCircuit size={24} className="text-[var(--color-primary)]" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[var(--color-bg-card)] p-4 rounded-lg border border-[var(--color-border-glass)]">
                  <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase flex items-center gap-2 mb-2">
                    <Crosshair size={14} /> MITRE ATT&CK Mapping
                  </h4>
                  <p className="text-sm text-[var(--color-text-main)] font-mono">{intel.mitreId}: {intel.mitreName}</p>
                </div>

                <div className="bg-[var(--color-bg-card)] p-4 rounded-lg border border-[var(--color-border-glass)]">
                  <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase flex items-center gap-2 mb-2">
                    <Fingerprint size={14} /> Behavior Pattern
                  </h4>
                  <p className="text-sm text-[var(--color-text-main)]">{intel.pattern}</p>
                </div>

                <div className="bg-[var(--color-secondary-alpha-10)] p-4 rounded-lg border border-[var(--color-secondary-alpha-30)]">
                  <h4 className="text-xs font-bold text-[var(--color-secondary)] uppercase flex items-center gap-2 mb-2">
                    <ShieldCheck size={14} /> Recommended Action
                  </h4>
                  <p className="text-sm text-[var(--color-text-main)]">{intel.recommendation}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  onClick={() => handleAction(intel._id, 'Dismissed')}
                  className="px-4 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-hover)] rounded transition-colors"
                >
                  Dismiss
                </button>
                <button 
                  onClick={() => handleAction(intel._id, 'Mitigated')}
                  className="px-4 py-2 text-sm bg-[var(--color-primary-alpha-10)] border border-[var(--color-primary-alpha-30)] text-[var(--color-primary)] hover:bg-[var(--color-primary-alpha-20)] rounded transition-colors"
                >
                  Apply Mitigation
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {intelList.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="col-span-1 lg:col-span-2 glass-panel p-12 flex flex-col items-center justify-center text-center border-dashed"
          >
            <ShieldCheck size={48} className="text-[var(--color-secondary)] mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">All Threats Mitigated</h3>
            <p className="text-[var(--color-text-muted)]">The AI Engine has not detected any unhandled critical threats.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AiThreatIntel;

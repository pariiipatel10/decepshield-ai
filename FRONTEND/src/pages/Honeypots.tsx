import { useState } from 'react';
import { Server, Play, Square, Trash2, Plus, Terminal, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_HONEYPOTS = [
  { id: 1, name: 'Fake SSH Server', type: 'SSH', port: 22, status: 'Running', attacks: 1240 },
  { id: 2, name: 'Legacy FTP', type: 'FTP', port: 21, status: 'Stopped', attacks: 0 },
  { id: 3, name: 'Admin Portal', type: 'HTTP', port: 8080, status: 'Running', attacks: 5832 },
  { id: 4, name: 'Vulnerable DB', type: 'MySQL', port: 3306, status: 'Running', attacks: 892 },
];

const Honeypots = () => {
  const [honeypots, setHoneypots] = useState(MOCK_HONEYPOTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHp, setNewHp] = useState({ name: '', type: 'SSH', port: '22' });

  const toggleStatus = (id: number) => {
    setHoneypots(honeypots.map(hp => 
      hp.id === id ? { ...hp, status: hp.status === 'Running' ? 'Stopped' : 'Running' } : hp
    ));
  };

  const deleteHoneypot = (id: number) => {
    setHoneypots(honeypots.filter(hp => hp.id !== id));
  };

  const deployHoneypot = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      name: newHp.name || `Fake ${newHp.type} Service`,
      type: newHp.type,
      port: parseInt(newHp.port) || 0,
      status: 'Running',
      attacks: 0
    };
    setHoneypots([...honeypots, newEntry]);
    setIsModalOpen(false);
    setNewHp({ name: '', type: 'SSH', port: '22' });
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text-main)] flex items-center gap-2">
            <Server className="text-[var(--color-primary)]" /> Honeypot Management
          </h2>
          <p className="text-[var(--color-text-muted)]">Deploy and manage decoy services to attract and monitor attackers</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--color-primary-alpha-10)] border border-[var(--color-primary-alpha-50)] hover:bg-[var(--color-primary-alpha-20)] text-[var(--color-primary)] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors custom-shadow-primary"
        >
          <Plus size={18} /> Deploy New Honeypot
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {honeypots.map((hp, idx) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2, delay: Math.min(idx * 0.05, 0.2) }}
              key={hp.id} 
              className="glass-panel p-6 relative overflow-hidden group border-[var(--color-border-glass)] border hover:border-[var(--color-primary-alpha-30)] transition-colors"
            >
              <div className={`absolute top-0 left-0 w-full h-1 ${hp.status === 'Running' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-[var(--color-tertiary)]'}`}></div>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[var(--color-text-main)]">{hp.name}</h3>
                  <span className="text-xs text-[var(--color-text-muted)] font-mono">{hp.type} | Port {hp.port}</span>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold border ${
                  hp.status === 'Running' 
                    ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                    : 'bg-[var(--color-tertiary-alpha-10)] text-[var(--color-tertiary)] border-[var(--color-tertiary-alpha-30)]'
                }`}>
                  {hp.status}
                </div>
              </div>

              <div className="bg-[var(--color-bg-base)] rounded-lg p-3 mb-6 border border-[var(--color-border-glass)] relative overflow-hidden">
                <ShieldAlert className="absolute -bottom-4 -right-4 text-[var(--color-primary-alpha-5)]" size={64} />
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Total Attacks Captured</p>
                <p className="text-2xl font-mono text-[var(--color-secondary)] custom-text-shadow-primary relative z-10">{hp.attacks.toLocaleString()}</p>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => toggleStatus(hp.id)}
                  className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-colors border ${
                    hp.status === 'Running'
                      ? 'border-[var(--color-tertiary-alpha-30)] hover:bg-[var(--color-tertiary-alpha-20)] text-[var(--color-tertiary)]'
                      : 'border-green-500/30 hover:bg-green-500/10 text-green-400'
                  }`}
                >
                  {hp.status === 'Running' ? <><Square size={14} /> Stop</> : <><Play size={14} /> Start</>}
                </button>
                
                <button 
                  onClick={() => alert(`Opening interactive terminal for ${hp.name}...`)}
                  className="w-10 h-10 rounded-md border border-[var(--color-border-glass)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                >
                  <Terminal size={16} />
                </button>

                <button 
                  onClick={() => deleteHoneypot(hp.id)}
                  className="w-10 h-10 rounded-md border border-[var(--color-tertiary-alpha-30)] flex items-center justify-center text-[var(--color-tertiary)] hover:bg-[var(--color-tertiary-alpha-20)] hover:text-white transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Deploy Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel w-full max-w-md p-6 relative z-10 border border-[var(--color-primary-alpha-30)] shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[var(--color-text-main)] flex items-center gap-2">
                  <Plus className="text-[var(--color-primary)]" /> Deploy Honeypot
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={deployHoneypot} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm text-[var(--color-text-muted)]">Honeypot Name (Optional)</label>
                  <input 
                    type="text" 
                    value={newHp.name}
                    onChange={(e) => setNewHp({...newHp, name: e.target.value})}
                    placeholder="e.g. Finance DB Decoy"
                    className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-glass)] rounded-md p-2 text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm text-[var(--color-text-muted)]">Service Type</label>
                    <select 
                      value={newHp.type}
                      onChange={(e) => setNewHp({...newHp, type: e.target.value, port: e.target.value === 'SSH' ? '22' : e.target.value === 'HTTP' ? '80' : e.target.value === 'FTP' ? '21' : '3306'})}
                      className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-glass)] rounded-md p-2 text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                    >
                      <option value="SSH">SSH</option>
                      <option value="HTTP">HTTP</option>
                      <option value="FTP">FTP</option>
                      <option value="MySQL">MySQL</option>
                      <option value="Redis">Redis</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-[var(--color-text-muted)]">Listen Port</label>
                    <input 
                      type="number" 
                      value={newHp.port}
                      onChange={(e) => setNewHp({...newHp, port: e.target.value})}
                      className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-glass)] rounded-md p-2 text-[var(--color-text-main)] font-mono focus:outline-none focus:border-[var(--color-primary)]"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-hover)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-[var(--color-primary-alpha-10)] text-[var(--color-primary)] border border-[var(--color-primary-alpha-50)] rounded hover:bg-[var(--color-primary-alpha-20)] hover:shadow-[0_0_15px_var(--color-primary-alpha-30)] transition-all font-bold"
                  >
                    Deploy
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Honeypots;

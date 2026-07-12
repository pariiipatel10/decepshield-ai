import { Footprints, Search, Radar, Unlock, Database, FastForward, ShieldOff } from 'lucide-react';
import { motion } from 'framer-motion';

const STAGES = [
  { id: 'recon', name: 'Reconnaissance', icon: <Search size={24} />, active: true, desc: 'Information gathering' },
  { id: 'scanning', name: 'Scanning', icon: <Radar size={24} />, active: true, desc: 'Port & vulnerability scanning' },
  { id: 'enumeration', name: 'Enumeration', icon: <FastForward size={24} />, active: true, desc: 'Identifying users & shares' },
  { id: 'exploitation', name: 'Exploitation', icon: <Unlock size={24} />, active: true, desc: 'Gaining initial access' },
  { id: 'persistence', name: 'Persistence', icon: <ShieldOff size={24} />, active: false, desc: 'Maintaining access' },
  { id: 'privilege', name: 'Privilege Esc.', icon: <Unlock size={24} />, active: false, desc: 'Gaining admin rights' },
  { id: 'exfiltration', name: 'Data Exfiltration', icon: <Database size={24} />, active: false, desc: 'Stealing data' },
];

const AttackerJourney = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text-main)] flex items-center gap-2">
          <Footprints className="text-[var(--color-primary)]" /> Attacker Journey
        </h2>
        <p className="text-[var(--color-text-muted)]">Visualizing the attack kill chain for active sessions</p>
      </div>

      <div className="glass-panel p-8 mt-12 overflow-x-auto">
        <div className="min-w-[800px] relative">
          {/* Timeline connecting line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-[var(--color-bg-active)] -z-10"></div>
          <div className="absolute top-8 left-0 w-1/2 h-1 bg-[var(--color-secondary)] shadow-[0_0_10px_#b026ff] -z-10 transition-all duration-1000"></div>

          <div className="flex justify-between items-start">
            {STAGES.map((stage, idx) => (
              <motion.div 
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center w-32 relative"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
                  stage.active 
                    ? 'bg-[var(--color-secondary-alpha-20)] text-[var(--color-secondary)] border-2 border-[var(--color-neon-purple)] neon-border-purple shadow-[0_0_15px_#b026ff]' 
                    : 'bg-[rgba(0,0,0,0.5)] text-[var(--color-text-muted)] border-2 border-[var(--color-border-glass)]'
                }`}>
                  {stage.icon}
                </div>
                <h4 className={`text-sm font-bold text-center ${stage.active ? 'text-[var(--color-text-main)]' : 'text-[var(--color-text-muted)]'}`}>
                  {stage.name}
                </h4>
                <p className="text-xs text-center text-[var(--color-text-muted)] mt-2 px-2">
                  {stage.desc}
                </p>
                
                {stage.active && (
                  <div className="mt-4 p-2 bg-[var(--color-secondary-alpha-10)] border border-[var(--color-secondary-alpha-30)] rounded text-xs text-[var(--color-secondary)] font-mono text-center">
                    Detected
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-4">Current Phase Details: Exploitation</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            The attacker is currently attempting to exploit a known vulnerability in the fake HTTP service. They have bypassed the initial honeypot login using SQL injection and are attempting to upload a web shell.
          </p>
          <div className="bg-[rgba(0,0,0,0.5)] p-4 rounded-lg font-mono text-sm text-green-400 overflow-x-auto">
            POST /api/v1/upload HTTP/1.1<br/>
            Host: 10.0.0.45<br/>
            Content-Type: multipart/form-data; boundary=---12345<br/>
            <br/>
            ---12345<br/>
            Content-Disposition: form-data; name="file"; filename="shell.php"<br/>
            Content-Type: application/x-php
          </div>
        </div>
        
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-4">Deception Tactics Active</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
              <div>
                <p className="text-sm text-[var(--color-text-main)] font-medium">Tarpitting</p>
                <p className="text-xs text-[var(--color-text-muted)]">Slowing down network responses to delay the upload process.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
              <div>
                <p className="text-sm text-[var(--color-text-main)] font-medium">Fake File System</p>
                <p className="text-xs text-[var(--color-text-muted)]">Redirecting the shell upload to an isolated, monitored directory.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AttackerJourney;

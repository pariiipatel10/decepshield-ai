import { FileText, Download, BarChart2, Briefcase, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const MOCK_BAR_DATA = [
  { name: 'SQLi', count: 420 },
  { name: 'XSS', count: 380 },
  { name: 'Brute Force', count: 850 },
  { name: 'RCE', count: 120 },
  { name: 'Path Trav.', count: 210 },
];

const MOCK_PIE_DATA = [
  { name: 'Critical', value: 15, color: '#ef4444' }, // red-500
  { name: 'High', value: 35, color: '#f97316' }, // orange-500
  { name: 'Medium', value: 120, color: '#eab308' }, // yellow-500
  { name: 'Low', value: 380, color: '#ff2a85' }, // neon-pink
];

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text-main)] flex items-center gap-2">
            <FileText className="text-[var(--color-primary)]" /> Automated Reports
          </h2>
          <p className="text-[var(--color-text-muted)]">Generate compliance, executive, and technical threat reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 border-t-4 border-t-[var(--color-primary)] flex flex-col">
          <div className="w-12 h-12 rounded-full bg-[var(--color-primary-alpha-10)] flex items-center justify-center mb-4">
            <Briefcase size={24} className="text-[var(--color-primary)]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-2">Executive Summary</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-6 flex-1">
            High-level overview of attack trends, risk exposure, and ROI of deceptive defenses for C-suite.
          </p>
          <button className="w-full bg-[var(--color-primary-alpha-10)] border border-[var(--color-primary-alpha-30)] hover:bg-[var(--color-primary-alpha-20)] text-[var(--color-primary)] px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors">
            <Download size={16} /> Generate PDF
          </button>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 border-t-4 border-t-[var(--color-tertiary)] flex flex-col">
          <div className="w-12 h-12 rounded-full bg-[var(--color-tertiary-alpha-10)] flex items-center justify-center mb-4">
            <BarChart2 size={24} className="text-[var(--color-tertiary)]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-2">Technical Analysis</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-6 flex-1">
            Detailed metrics on exploited CVEs, top attacker IPs, payloads used, and honeypot interaction logs.
          </p>
          <button className="w-full bg-[var(--color-tertiary-alpha-10)] border border-[var(--color-tertiary-alpha-30)] hover:bg-[var(--color-tertiary-alpha-20)] text-[var(--color-tertiary)] px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors">
            <Download size={16} /> Generate PDF
          </button>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 border-t-4 border-t-[var(--color-secondary)] flex flex-col">
          <div className="w-12 h-12 rounded-full bg-[var(--color-secondary-alpha-10)] flex items-center justify-center mb-4">
            <BrainCircuit size={24} className="text-[var(--color-secondary)]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-2">Threat Intel Feed</h3>
          <p className="text-sm text-[var(--color-text-muted)] mb-6 flex-1">
            STIX/TAXII compatible export of identified IOCs (Indicators of Compromise) and attacker TTPs.
          </p>
          <button className="w-full bg-[var(--color-secondary-alpha-10)] border border-[var(--color-secondary-alpha-30)] hover:bg-[var(--color-secondary-alpha-20)] text-[var(--color-secondary)] px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors">
            <FileText size={16} /> Export JSON
          </button>
        </motion.div>
      </div>

      <div className="glass-panel p-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[var(--color-text-main)]">Report Preview: Q3 Threat Landscape</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-[var(--color-bg-active)] hover:bg-[var(--color-bg-active-hover)] rounded text-xs text-[var(--color-text-main)] transition-colors">This Week</button>
            <button className="px-3 py-1 bg-[var(--color-primary-alpha-20)] border border-[var(--color-primary-alpha-40)] rounded text-xs text-[var(--color-primary)] transition-colors">This Quarter</button>
          </div>
        </div>
        
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border-glass)] rounded-lg p-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
            <FileText size={300} />
          </div>
          
          <div className="flex justify-between items-start mb-8 relative z-10 border-b border-[var(--color-border-glass)] pb-6">
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text-main)] tracking-wider mb-2">DecepShield AI</h1>
              <p className="text-[var(--color-secondary)] font-medium">Quarterly Threat Intelligence Report</p>
            </div>
            <div className="text-right">
              <p className="text-[var(--color-text-main)] font-mono text-sm mb-1">Generated: 2026-07-12</p>
              <p className="text-[var(--color-tertiary)] font-mono text-xs border border-[var(--color-tertiary-alpha-30)] bg-[var(--color-tertiary-alpha-10)] px-2 py-1 rounded inline-block">CONFIDENTIAL</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div>
              <h4 className="text-[var(--color-text-main)] font-bold mb-4 flex items-center gap-2">
                <BarChart2 size={18} className="text-[var(--color-primary)]" /> Top Attack Vectors
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_BAR_DATA} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                    <XAxis type="number" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                    <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.8)', fontSize: 12}} width={80} />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      contentStyle={{ backgroundColor: 'rgba(20, 20, 30, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    />
                    <Bar dataKey="count" fill="var(--color-neon-blue)" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h4 className="text-[var(--color-text-main)] font-bold mb-4 flex items-center gap-2">
                <BrainCircuit size={18} className="text-[var(--color-secondary)]" /> Incident Severity Distribution
              </h4>
              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={MOCK_PIE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {MOCK_PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(20, 20, 30, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                  <span className="text-2xl font-bold text-[var(--color-text-main)]">550</span>
                  <span className="text-xs text-[var(--color-text-muted)]">Total Events</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-[var(--color-border-glass)] pt-6 relative z-10">
             <h4 className="text-[var(--color-text-main)] font-bold mb-4">Key Findings</h4>
             <ul className="space-y-3">
               <li className="flex gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-tertiary)] mt-2 shrink-0"></div>
                 <p className="text-sm text-[var(--color-text-muted)]">
                   <strong className="text-[var(--color-text-main)]">Critical Spike in Credential Stuffing:</strong> We observed a 340% increase in distributed brute force attacks targeting the SSH honeypot originating from previously unknown botnet IPs.
                 </p>
               </li>
               <li className="flex gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0"></div>
                 <p className="text-sm text-[var(--color-text-muted)]">
                   <strong className="text-[var(--color-text-main)]">Zero-Day Probing:</strong> Advanced persistent threats (APTs) attempted to exploit a simulated vulnerability in the legacy web portal, resulting in the successful capture of 3 novel payloads.
                 </p>
               </li>
               <li className="flex gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-2 shrink-0"></div>
                 <p className="text-sm text-[var(--color-text-muted)]">
                   <strong className="text-[var(--color-text-main)]">Defense ROI:</strong> DecepShield successfully diverted 92% of automated scanning away from production assets, saving an estimated 14 hours of SOC analyst investigation time.
                 </p>
               </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

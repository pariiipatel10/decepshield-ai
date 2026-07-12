import { useState, useEffect } from 'react';
import { Bell, ShieldAlert, User, X } from 'lucide-react';

const TopBar = () => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [role, setRole] = useState('SecOps Lead');

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  return (
    <header className="h-20 glass-panel mt-4 mr-4 mb-4 ml-0 flex items-center justify-between px-8 relative z-20">
      <div className="flex items-center gap-4">
        <div className="px-4 py-1.5 rounded-full bg-[var(--color-primary-alpha-10)] border border-[var(--color-primary-alpha-30)] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></div>
          <span className="text-sm font-medium custom-text-shadow-primary">System Active</span>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-[var(--color-secondary-alpha-10)] border border-[var(--color-secondary-alpha-30)] flex items-center gap-2">
          <ShieldAlert size={14} className="text-[var(--color-secondary)]" />
          <span className="text-sm font-medium text-[var(--color-secondary)]">AI Engine: Normal</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6 relative">
        <button 
          onClick={() => setIsNotifOpen(!isNotifOpen)}
          className="relative text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors focus:outline-none z-50"
        >
          <Bell size={24} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold text-white border border-[var(--color-bg-base)]">3</span>
        </button>

        {isNotifOpen && (
          <div className="absolute top-12 right-0 mt-4 w-80 glass-panel shadow-2xl rounded-lg overflow-hidden border border-[var(--color-border-glass)] animate-in slide-in-from-top-2 z-50">
            <div className="p-4 border-b border-[var(--color-border-glass)] bg-[var(--color-bg-active)] flex justify-between items-center">
              <h3 className="font-bold text-[var(--color-text-main)]">Notifications</h3>
              <button onClick={() => setIsNotifOpen(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]">
                <X size={16} />
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto custom-scrollbar bg-[var(--color-bg-base)]">
              <div className="p-4 border-b border-[var(--color-border-glass)] hover:bg-[var(--color-bg-hover)] cursor-pointer transition-colors">
                <p className="text-sm text-[var(--color-primary)] font-bold mb-1">High Risk Attack Blocked</p>
                <p className="text-xs text-[var(--color-text-muted)]">SQL Injection attempt stopped on Honeypot #4.</p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-2">Just now</p>
              </div>
              <div className="p-4 border-b border-[var(--color-border-glass)] hover:bg-[var(--color-bg-hover)] cursor-pointer transition-colors">
                <p className="text-sm text-[var(--color-secondary)] font-bold mb-1">AI Model Updated</p>
                <p className="text-xs text-[var(--color-text-muted)]">Threat signature database synchronized successfully.</p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-2">2 hours ago</p>
              </div>
              <div className="p-4 hover:bg-[var(--color-bg-hover)] cursor-pointer transition-colors">
                <p className="text-sm text-[var(--color-text-main)] font-bold mb-1">System Report Ready</p>
                <p className="text-xs text-[var(--color-text-muted)]">Your weekly threat intelligence report is available.</p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-2">1 day ago</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pl-6 border-l border-[var(--color-border-glass)]">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-[var(--color-text-main)]">{role}</p>
            <p className="text-xs text-[var(--color-text-muted)]">Active Session</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[var(--color-bg-active)] flex items-center justify-center border border-[var(--color-border-glass)] cursor-pointer hover:bg-[var(--color-bg-hover)] transition-colors" onClick={() => {
            // cycle roles for testing
            const roles = ['Administrator', 'SecOps Lead', 'Security Analyst'];
            const next = roles[(roles.indexOf(role) + 1) % roles.length];
            setRole(next);
            localStorage.setItem('userRole', next);
          }}>
            <User size={20} className="text-[var(--color-text-main)]" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;

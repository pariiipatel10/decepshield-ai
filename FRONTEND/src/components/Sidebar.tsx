import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Activity, 
  BrainCircuit, 
  Footprints, 
  Terminal, 
  FileSearch, 
  FileText, 
  Settings,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Honeypots', path: '/honeypots', icon: <ShieldAlert size={20} /> },
    { name: 'Live Attack Monitor', path: '/live-monitor', icon: <Activity size={20} /> },
    { name: 'AI Threat Intel', path: '/ai-threat-intel', icon: <BrainCircuit size={20} /> },
    { name: 'Attacker Journey', path: '/attacker-journey', icon: <Footprints size={20} /> },
    { name: 'Session Analysis', path: '/session-analysis', icon: <Terminal size={20} /> },
    { name: 'Evidence', path: '/evidence', icon: <FileSearch size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 glass-panel h-[calc(100vh-2rem)] my-4 ml-4 flex flex-col justify-between overflow-hidden">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="p-6 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] custom-shadow-primary flex items-center justify-center">
            <ShieldAlert size={20} className="text-black" />
          </div>
          <h1 className="text-xl font-bold custom-text-shadow-primary tracking-wider">DecepShield AI</h1>
        </div>
        
        <nav className="px-4 mt-2 flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1 pb-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-[var(--color-primary-alpha-10)] text-[var(--color-primary)] border-l-2 border-[var(--color-neon-blue)] shrink-0' 
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-main)] shrink-0'
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-[var(--color-border-glass)]">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-tertiary)] transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

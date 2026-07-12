import { ShieldAlert, Activity, Users, Server, ShieldOff, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { time: '00:00', attacks: 120 },
  { time: '04:00', attacks: 300 },
  { time: '08:00', attacks: 150 },
  { time: '12:00', attacks: 450 },
  { time: '16:00', attacks: 200 },
  { time: '20:00', attacks: 600 },
  { time: '24:00', attacks: 250 },
];

const StatCard = ({ title, value, icon, color }: { title: string, value: string, icon: any, color: string }) => (
  <div className="glass-panel p-6 relative overflow-hidden group">
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-${color}-500/10 blur-2xl group-hover:bg-${color}-500/20 transition-all`}></div>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[var(--color-text-muted)] text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-[var(--color-text-main)]">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-[var(--color-bg-hover)] border border-[var(--color-border-glass)] text-${color}-400`}>
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text-main)]">Security Overview</h2>
          <p className="text-[var(--color-text-muted)]">Real-time threat intelligence and honeypot status</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 glass-panel flex items-center gap-2">
            <span className="text-[var(--color-text-muted)] text-sm">Threat Score:</span>
            <span className="text-xl font-bold text-[var(--color-tertiary)]">84/100</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Attacks (24h)" value="14,205" icon={<ShieldOff size={24} className="text-[var(--color-tertiary)]" />} color="red" />
        <StatCard title="Active Attackers" value="342" icon={<Users size={24} className="text-yellow-400" />} color="yellow" />
        <StatCard title="High Risk Alerts" value="28" icon={<AlertTriangle size={24} className="text-orange-400" />} color="orange" />
        <StatCard title="Active Honeypots" value="12" icon={<Server size={24} className="text-[var(--color-primary)]" />} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-6 flex items-center gap-2">
            <Activity size={20} className="text-[var(--color-secondary)]" />
            Attack Volume Timeline
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-neon-purple)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-neon-purple)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(20, 20, 30, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--color-neon-blue)' }}
                />
                <Area type="monotone" dataKey="attacks" stroke="var(--color-neon-purple)" fillOpacity={1} fill="url(#colorAttacks)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col">
          <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-6 flex items-center gap-2">
            <ShieldAlert size={20} className="text-[var(--color-tertiary)]" />
            Latest High-Risk Incidents
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--color-border-glass)] hover:bg-[var(--color-bg-hover)] transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-[var(--color-tertiary)] bg-[var(--color-tertiary-alpha-10)] px-2 py-0.5 rounded border border-[var(--color-tertiary-alpha-20)]">SQL Injection</span>
                  <span className="text-xs text-[var(--color-text-muted)]">2m ago</span>
                </div>
                <p className="text-sm text-[var(--color-text-main)] font-medium mb-1">Multiple auth bypass attempts</p>
                <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
                  <span>IP: 192.168.1.{100 + i}</span>
                  <span>Target: Fake DB</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

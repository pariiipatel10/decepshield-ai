import { useState, useEffect, useContext } from 'react';
import { ShieldAlert, Activity, Users, Server, ShieldOff, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: any, color: string }) => (
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
  const { token } = useContext(AuthContext) || {};
  const [stats, setStats] = useState({
    totalAttacks: 0,
    activeAttackers: 0,
    highRiskAlerts: 0,
    threatScore: 0,
    activeHoneypots: 0
  });
  const [chartData, setChartData] = useState([]);
  const [incidents, setIncidents] = useState([]);

  const simulateAttack = async () => {
    try {
      const types = ['SQL Injection', 'Brute Force', 'DDoS Attempt', 'Port Scan', 'Unauthorized Access'];
      const targets = ['Fake Database', 'Web Honeypot', 'SSH Decoy', 'FTP Server'];
      const severities = ['High', 'Medium', 'Low'];
      
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomTarget = targets[Math.floor(Math.random() * targets.length)];
      const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
      const randomIP = `192.168.1.${Math.floor(Math.random() * 255)}`;

      await axios.post('http://localhost:3001/api/incidents', {
        type: randomType,
        ip: randomIP,
        target: randomTarget,
        severity: randomSeverity
      });
    } catch (error) {
      console.error('Failed to simulate attack:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get('http://localhost:3001/api/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const hpRes = await axios.get('http://localhost:3001/api/honeypots', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const activeCount = hpRes.data.filter((h: any) => h.status === 'Running').length;
        setStats({ ...statsRes.data, activeHoneypots: activeCount });

        const incRes = await axios.get('http://localhost:3001/api/incidents', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIncidents(incRes.data.incidents || []);
        setChartData(incRes.data.chartData || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    if (token) {
      fetchData();
      // Poll every 2 seconds for ultra-responsive updates
      const interval = setInterval(fetchData, 2000);
      return () => clearInterval(interval);
    }
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text-main)]">Security Overview</h2>
          <p className="text-[var(--color-text-muted)]">Real-time threat intelligence and honeypot status</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={simulateAttack}
            className="px-4 py-2 bg-[var(--color-primary-alpha-20)] hover:bg-[var(--color-primary-alpha-30)] border border-[var(--color-primary-alpha-50)] text-[var(--color-primary)] font-bold rounded-lg transition-all flex items-center gap-2"
          >
            <ShieldAlert size={18} />
            Simulate Attack
          </button>
          <div className="px-4 py-2 glass-panel flex items-center gap-2">
            <span className="text-[var(--color-text-muted)] text-sm">Threat Score:</span>
            <span className="text-xl font-bold text-[var(--color-tertiary)]">{stats.threatScore}/100</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Attacks (24h)" value={stats.totalAttacks} icon={<ShieldOff size={24} className="text-[var(--color-tertiary)]" />} color="red" />
        <StatCard title="Active Attackers" value={stats.activeAttackers} icon={<Users size={24} className="text-yellow-400" />} color="yellow" />
        <StatCard title="High Risk Alerts" value={stats.highRiskAlerts} icon={<AlertTriangle size={24} className="text-orange-400" />} color="orange" />
        <StatCard title="Active Honeypots" value={stats.activeHoneypots} icon={<Server size={24} className="text-[var(--color-primary)]" />} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-6 flex items-center gap-2">
            <Activity size={20} className="text-[var(--color-secondary)]" />
            Attack Volume Timeline
          </h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
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
            ) : (
              <p className="text-[var(--color-text-muted)] italic">No attack data recorded yet.</p>
            )}
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col">
          <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-6 flex items-center gap-2">
            <ShieldAlert size={20} className="text-[var(--color-tertiary)]" />
            Latest High-Risk Incidents
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
            {incidents.length > 0 ? (
              incidents.map((incident: any, i) => (
                <div key={incident.id || i} className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--color-border-glass)] hover:bg-[var(--color-bg-hover)] transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${incident.severity === 'High' ? 'text-[var(--color-tertiary)] bg-[var(--color-tertiary-alpha-10)] border-[var(--color-tertiary-alpha-20)]' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                      {incident.type}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)]">{incident.time}</span>
                  </div>
                  <p className="text-sm text-[var(--color-text-main)] font-medium mb-1">Target: {incident.target}</p>
                  <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
                    <span>IP: {incident.ip}</span>
                    <span className={incident.severity === 'High' ? 'text-red-400' : 'text-yellow-400'}>{incident.severity} Risk</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[var(--color-text-muted)] italic text-center mt-8">No incidents reported.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Key, Moon, Sun, Save, Copy, Plus, Trash2 } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'Production SIEM Integration', key: 'sk_live_9f8e7d...', lastUsed: '2 hours ago' },
    { id: 2, name: 'Dev Testing', key: 'sk_test_1a2b3c...', lastUsed: '3 days ago' }
  ]);
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'dark');

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <div className="space-y-6 flex flex-col">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text-main)] flex items-center gap-2">
          <SettingsIcon className="text-[var(--color-primary)]" /> Platform Settings
        </h2>
        <p className="text-[var(--color-text-muted)]">Configure integrations, alerts, and AI behavior</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 glass-panel p-4 flex flex-col gap-2 shrink-0 h-fit">
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-[var(--color-primary-alpha-10)] text-[var(--color-primary)] border-l-2 border-[var(--color-neon-blue)]' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-main)]'}`}
          >
            <Bell size={18} /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'ai' ? 'bg-[var(--color-primary-alpha-10)] text-[var(--color-primary)] border-l-2 border-[var(--color-neon-blue)]' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-main)]'}`}
          >
            <Shield size={18} /> AI & Rules
          </button>
          <button 
            onClick={() => setActiveTab('apikeys')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'apikeys' ? 'bg-[var(--color-primary-alpha-10)] text-[var(--color-primary)] border-l-2 border-[var(--color-neon-blue)]' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-main)]'}`}
          >
            <Key size={18} /> API Keys
          </button>
          <button 
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'appearance' ? 'bg-[var(--color-primary-alpha-10)] text-[var(--color-primary)] border-l-2 border-[var(--color-neon-blue)]' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-main)]'}`}
          >
            <Moon size={18} /> Appearance
          </button>
        </div>

        <div className="flex-1 glass-panel p-6 md:p-8">
          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-xl font-bold text-[var(--color-text-main)] border-b border-[var(--color-border-glass)] pb-2">Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border-glass)]">
                  <div>
                    <h4 className="text-[var(--color-text-main)] font-medium">Critical Alerts</h4>
                    <p className="text-sm text-[var(--color-text-muted)]">Immediate notification for severity &gt; 90</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-[var(--color-bg-active)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border-glass)]">
                  <div>
                    <h4 className="text-[var(--color-text-main)] font-medium">Email Integration</h4>
                    <p className="text-sm text-[var(--color-text-muted)]">Send daily summary reports</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-[var(--color-bg-active)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                  </label>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-main)]">Slack Webhook URL</label>
                  <input type="text" className="w-full bg-[rgba(0,0,0,0.5)] border border-[var(--color-border-glass)] rounded-lg px-4 py-2 text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-neon-blue)] font-mono text-sm" placeholder="https://hooks.slack.com/services/..."/>
                </div>
              </div>
              
              <button className="mt-8 bg-[var(--color-primary-alpha-10)] border border-[var(--color-primary-alpha-50)] hover:bg-[var(--color-primary-alpha-20)] text-[var(--color-primary)] px-6 py-2 rounded flex items-center gap-2 transition-colors">
                <Save size={16} /> Save Changes
              </button>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-xl font-bold text-[var(--color-text-main)] border-b border-[var(--color-border-glass)] pb-2">AI & Behavior Rules</h3>
              <p className="text-[var(--color-text-muted)]">Settings for the ML pipeline and automated responses.</p>
              
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border-glass)]">
                  <div>
                    <h4 className="text-[var(--color-text-main)] font-medium">Auto-Tarpitting</h4>
                    <p className="text-sm text-[var(--color-text-muted)]">Automatically slow down connections for identified scanners</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-[var(--color-bg-active)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-secondary)]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border-glass)]">
                  <div>
                    <h4 className="text-[var(--color-text-main)] font-medium">Auto-Block Malicious IPs</h4>
                    <p className="text-sm text-[var(--color-text-muted)]">Update firewall rules automatically when confidence &gt; 95%</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-[var(--color-bg-active)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-secondary)]"></div>
                  </label>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <label className="text-sm font-medium text-[var(--color-text-main)]">AI Confidence Threshold (%)</label>
                <input type="range" min="50" max="100" defaultValue="85" className="w-full accent-[var(--color-neon-purple)]" />
                <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
                  <span>50% (Aggressive)</span>
                  <span>100% (Conservative)</span>
                </div>
              </div>
              
              <button className="mt-8 bg-[var(--color-secondary-alpha-10)] border border-[var(--color-secondary-alpha-50)] hover:bg-[var(--color-secondary-alpha-20)] text-[var(--color-secondary)] px-6 py-2 rounded flex items-center gap-2 transition-colors">
                <Save size={16} /> Save AI Rules
              </button>
            </div>
          )}
          
          {activeTab === 'apikeys' && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex justify-between items-center border-b border-[var(--color-border-glass)] pb-2">
                <h3 className="text-xl font-bold text-[var(--color-text-main)]">API Keys</h3>
                <button className="bg-[var(--color-primary-alpha-10)] border border-[var(--color-primary-alpha-30)] hover:bg-[var(--color-primary-alpha-20)] text-[var(--color-primary)] px-3 py-1.5 rounded flex items-center gap-2 transition-colors text-sm">
                  <Plus size={16} /> Generate Key
                </button>
              </div>
              <p className="text-[var(--color-text-muted)] text-sm">Manage API keys used to access DecepShield AI data externally.</p>
              
              <div className="space-y-4">
                {apiKeys.map(key => (
                  <div key={key.id} className="p-4 bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border-glass)] flex justify-between items-center">
                    <div>
                      <h4 className="text-[var(--color-text-main)] font-medium">{key.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-[var(--color-text-muted)] text-xs bg-[var(--color-bg-hover)] px-2 py-1 rounded">{key.key}</code>
                        <button className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors" title="Copy Key"><Copy size={14} /></button>
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] mt-2">Last used: {key.lastUsed}</p>
                    </div>
                    <button 
                      onClick={() => setApiKeys(apiKeys.filter(k => k.id !== key.id))}
                      className="text-[var(--color-tertiary)] hover:bg-[var(--color-tertiary-alpha-10)] p-2 rounded transition-colors"
                      title="Revoke Key"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-xl font-bold text-[var(--color-text-main)] border-b border-[var(--color-border-glass)] pb-2">Appearance Settings</h3>
              <p className="text-[var(--color-text-muted)]">Customize the look and feel of your dashboard.</p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button 
                  onClick={() => toggleTheme('dark')}
                  className={`p-6 rounded-xl flex flex-col items-center gap-3 border-2 transition-all ${theme === 'dark' ? 'border-[var(--color-primary)] bg-[var(--color-primary-alpha-5)]' : 'border-[var(--color-border-glass)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-glass)]'}`}
                >
                  <Moon size={32} className={theme === 'dark' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'} />
                  <span className={`font-bold ${theme === 'dark' ? 'text-[var(--color-text-main)]' : 'text-[var(--color-text-muted)]'}`}>Dark Cyber Mode</span>
                </button>
                <button 
                  onClick={() => toggleTheme('light')}
                  className={`p-6 rounded-xl flex flex-col items-center gap-3 border-2 transition-all ${theme === 'light' ? 'border-[var(--color-primary)] bg-[var(--color-primary-alpha-5)]' : 'border-[var(--color-border-glass)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-glass)]'}`}
                >
                  <Sun size={32} className={theme === 'light' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'} />
                  <span className={`font-bold ${theme === 'light' ? 'text-[var(--color-text-main)]' : 'text-[var(--color-text-muted)]'}`}>Light Mode</span>
                </button>
              </div>

              <div className="mt-8 flex items-center justify-between p-4 bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border-glass)]">
                  <div>
                    <h4 className="text-[var(--color-text-main)] font-medium">Disable Animations</h4>
                    <p className="text-sm text-[var(--color-text-muted)]">Turn off the animated background node network for better performance</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-[var(--color-bg-active)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                  </label>
                </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;

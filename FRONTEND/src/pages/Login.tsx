import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfa, setMfa] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--color-bg-base)]">
      <AnimatedBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 glass-panel relative z-10 mx-4"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            animate={{ 
              boxShadow: ['0 0 10px rgba(255,42,133,0.3)', '0 0 30px rgba(255,42,133,0.6)', '0 0 10px rgba(255,42,133,0.3)'],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 rounded-full bg-[var(--color-primary-alpha-10)] border border-[var(--color-primary-alpha-50)] flex items-center justify-center mb-4"
          >
            <ShieldAlert size={32} className="text-[var(--color-primary)]" />
          </motion.div>
          <h1 className="text-3xl font-bold custom-text-shadow-primary tracking-widest uppercase">DecepShield AI</h1>
          <p className="text-[var(--color-text-muted)] mt-2 font-mono text-sm">Secure Authentication Gateway</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {step === 1 ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-muted)] flex items-center gap-2">
                  <Mail size={16} /> Email Address
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--color-bg-card)] border border-[var(--color-border-glass)] rounded-lg px-4 py-3 text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono"
                  placeholder="admin@decepshield.ai"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-muted)] flex items-center gap-2">
                  <ShieldAlert size={16} /> Role / Position
                </label>
                <select 
                  onChange={(e) => localStorage.setItem('userRole', e.target.value)}
                  className="w-full bg-[var(--color-bg-card)] border border-[var(--color-border-glass)] rounded-lg px-4 py-3 text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono appearance-none"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>Select your position...</option>
                  <option value="SecOps Lead">SecOps Lead</option>
                  <option value="Security Analyst">Security Analyst</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Read-Only Viewer">Read-Only Viewer</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-muted)] flex items-center gap-2">
                  <Lock size={16} /> Password
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[rgba(0,0,0,0.5)] border border-[var(--color-border-glass)] rounded-lg px-4 py-3 text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors font-mono"
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  required
                />
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-[var(--color-text-muted)] flex items-center gap-2">
                <Lock size={16} /> MFA Code
              </label>
              <input 
                type="text" 
                value={mfa}
                onChange={(e) => setMfa(e.target.value)}
                className="w-full bg-[rgba(0,0,0,0.5)] border border-[var(--color-border-glass)] rounded-lg px-4 py-3 text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors text-center text-2xl tracking-[0.5em] font-mono"
                placeholder="000000"
                maxLength={6}
                required
              />
              <p className="text-xs text-center text-[var(--color-text-muted)] mt-4">
                Enter the 6-digit code from your authenticator app
              </p>
            </motion.div>
          )}

          <button 
            type="submit"
            className="w-full bg-[var(--color-primary-alpha-10)] border border-[var(--color-primary-alpha-50)] hover:bg-[var(--color-primary-alpha-20)] text-[var(--color-primary)] font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 custom-shadow-primary"
          >
            {step === 1 ? 'Verify Credentials' : 'Authenticate'}
            <ArrowRight size={20} />
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-[var(--color-border-glass)] text-center">
          <p className="text-xs text-[var(--color-text-muted)] opacity-50 font-mono">
            UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED. <br/>
            ALL ACTIVITIES ARE MONITORED BY AI ENGINE.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

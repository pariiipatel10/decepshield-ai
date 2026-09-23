import { useState, useEffect, useContext } from 'react';
import {
  ShieldAlert, Lock, Mail, ArrowRight, Shield, UserPlus, LogIn,
  CheckSquare, Square, Eye, EyeOff,
  Radar, FileSearch, BarChart3, Zap, Database, Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import { AuthContext } from '../context/AuthContext';
import api, { API_BASE_URL } from '../services/api';

/* ─── SSO Provider Config ─── */
const SSO_PROVIDERS = [
  {
    id: 'Google',
    label: 'Continue with Google',
    color: '#4285F4',
    bgHover: 'rgba(66, 133, 244, 0.12)',
    border: 'rgba(66, 133, 244, 0.3)',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
  },
  {
    id: 'GitHub',
    label: 'Continue with GitHub',
    color: '#a78bfa',
    bgHover: 'rgba(167, 139, 250, 0.12)',
    border: 'rgba(167, 139, 250, 0.3)',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ color: '#a78bfa' }}>
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
  {
    id: 'Discord',
    label: 'Continue with Discord',
    color: '#5865F2',
    bgHover: 'rgba(88, 101, 242, 0.12)',
    border: 'rgba(88, 101, 242, 0.3)',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="#5865F2">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/>
      </svg>
    ),
  },
];

const ROLES = [
  'Administrator',
  'SecOps Lead',
  'Security Analyst',
  'Threat Hunter',
  'Incident Responder',
  'Auditor',
  'Executive / Guest',
];

/* ─── Feature cards for left panel ─── */
const FEATURES = [
  { icon: <Radar size={20} />,        title: 'Honeypot Deployment',     desc: 'Deploy intelligent decoy servers that mimic real infrastructure to attract and trap attackers.' },
  { icon: <Zap size={20} />,          title: 'Real-Time Alerts',        desc: 'Instant notifications when a threat actor interacts with any deployed honeypot or decoy service.' },
  { icon: <FileSearch size={20} />,   title: 'Evidence Management',     desc: 'Securely capture, store, and export forensic evidence including payloads, logs, and session data.' },
  { icon: <BarChart3 size={20} />,    title: 'Automated Reports',       desc: 'Generate executive summaries and technical analysis PDFs with one click for your security team.' },
  { icon: <Database size={20} />,     title: 'Attack Intelligence',     desc: 'AI-powered analysis of attacker TTPs, IP reputation, geolocation, and behavioral patterns.' },
  { icon: <Network size={20} />,      title: 'Session Replay',          desc: 'Replay full attacker sessions to understand their journey through your decoy infrastructure.' },
];

/* ─── Component ─── */
const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Security Analyst');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Removed SSO Modal State since we now use real OAuth redirects

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const auth = useContext(AuthContext);

  // Load saved email credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('decepshield_email');
    const savedPassword = localStorage.getItem('decepshield_password');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  /* ─── Email Login / Register ─── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (rememberMe) {
        localStorage.setItem('decepshield_email', email);
        localStorage.setItem('decepshield_password', password);
      } else {
        localStorage.removeItem('decepshield_email');
        localStorage.removeItem('decepshield_password');
      }

      if (isRegistering) {
        await api.post('/api/auth/register', { email, password, role });
        setSuccess('Registration successful! Logging you in…');
        const loginRes = await api.post('/api/auth/login', { email, password });
        if (loginRes.data?.token && auth) {
          setTimeout(() => auth.login(loginRes.data.user, loginRes.data.token), 1000);
        }
      } else {
        const response = await api.post('/api/auth/login', { email, password });
        if (response.data?.token && auth) {
          auth.login(response.data.user, response.data.token);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ─── SSO Click (Redirect to Backend OAuth) ─── */
  const handleSSOClick = (provider: typeof SSO_PROVIDERS[0]) => {
    // Redirect to the real OAuth route
    window.location.href = `${API_BASE_URL}/api/auth/${provider.id.toLowerCase()}`;
  };

  /* ═══════════════════════════ RENDER ═══════════════════════════ */
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[var(--color-bg-base)]">
      <AnimatedBackground />

      <div className="w-full max-w-[1280px] px-4 lg:px-10 relative z-10 flex flex-col lg:flex-row gap-10 items-stretch my-6 lg:my-10">

        {/* ═══════ LEFT PANEL — Branding & Features ═══════ */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full lg:w-[55%] flex flex-col justify-center py-6 lg:py-10 lg:pr-10"
        >
          {/* Logo + Title */}
          <div className="flex items-center gap-4 mb-8">
            <motion.div
              animate={{ boxShadow: ['0 0 12px var(--color-primary-alpha-30)', '0 0 28px var(--color-primary-alpha-50)', '0 0 12px var(--color-primary-alpha-30)'] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-14 h-14 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-primary-alpha-50)] flex items-center justify-center shrink-0"
            >
              <ShieldAlert size={28} className="text-[var(--color-primary)]" />
            </motion.div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold custom-text-shadow-primary tracking-wide uppercase leading-none">
                DecepShield AI
              </h1>
              <p className="text-[var(--color-text-muted)] text-sm font-medium tracking-widest uppercase mt-1">
                Cyber Threat Deception Platform
              </p>
            </div>
          </div>

          {/* Tagline */}
          <h2 className="text-lg lg:text-xl font-light text-[var(--color-text-main)] leading-relaxed mb-3">
            An intelligent cybersecurity dashboard that deploys <span className="text-[var(--color-primary)] font-semibold">honeypot decoys</span> to
            attract attackers, captures forensic evidence in real-time, and generates actionable threat intelligence reports.
          </h2>

          <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-8">
            Built for Security Operations Centers (SOC) to proactively detect, analyze, and respond to cyber threats
            before they reach production infrastructure.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border-glass)] hover:border-[var(--color-primary-alpha-30)] transition-colors"
              >
                <div className="mt-0.5 p-2 rounded-lg bg-[var(--color-primary-alpha-10)] text-[var(--color-primary)] shrink-0">
                  {feat.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--color-text-main)] leading-tight">{feat.title}</h4>
                  <p className="text-xs text-[var(--color-text-muted)] leading-snug mt-0.5">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tech badges */}
          <div className="flex flex-wrap gap-2 mt-8">
            {['React', 'Node.js', 'JWT Auth', 'REST API', 'Real-Time Monitoring', 'PDF Export'].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary-alpha-10)] border border-[var(--color-primary-alpha-20)]">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ═══════ RIGHT PANEL — Auth Form ═══════ */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="w-full lg:w-[45%] flex items-center"
        >
          <div className="glass-panel w-full max-w-[440px] mx-auto p-7 lg:p-9 border-t-4 border-[var(--color-primary)] shadow-[0_0_60px_rgba(0,0,0,0.4)]">

            {/* Tab Toggle */}
            <div className="flex bg-[rgba(0,0,0,0.3)] rounded-lg p-1 mb-7 border border-[var(--color-border-glass)]">
              <button type="button" onClick={() => { setIsRegistering(false); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all ${!isRegistering ? 'bg-[var(--color-primary-alpha-20)] text-[var(--color-primary)] shadow-sm border border-[var(--color-primary-alpha-30)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'}`}
              >
                <LogIn size={15} /> Sign In
              </button>
              <button type="button" onClick={() => { setIsRegistering(true); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all ${isRegistering ? 'bg-[var(--color-primary-alpha-20)] text-[var(--color-primary)] shadow-sm border border-[var(--color-primary-alpha-30)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'}`}
              >
                <UserPlus size={15} /> Register
              </button>
            </div>

            {/* Heading */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-[var(--color-text-main)] mb-1">
                {isRegistering ? 'Create Your Account' : 'Welcome Back'}
              </h3>
              <p className="text-[var(--color-text-muted)] text-sm">
                {isRegistering ? 'Set up a new operator identity' : 'Sign in to access the command center'}
              </p>
            </div>

            {/* SSO Buttons (Sign-In only) */}
            {!isRegistering && (
              <div className="space-y-2 mb-5">
                {SSO_PROVIDERS.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSSOClick(p)}
                    className="w-full py-2.5 px-4 rounded-lg border text-sm font-semibold flex items-center gap-3 transition-all duration-200"
                    style={{
                      borderColor: p.border,
                      background: 'transparent',
                      color: 'var(--color-text-main)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = p.bgHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {p.icon}
                    {p.label}
                  </button>
                ))}

                <div className="flex items-center gap-4 py-3">
                  <div className="h-px flex-1 bg-[var(--color-border-glass)]" />
                  <span className="text-[var(--color-text-muted)] text-[11px] font-semibold uppercase tracking-widest">or sign in with email</span>
                  <div className="h-px flex-1 bg-[var(--color-border-glass)]" />
                </div>
              </div>
            )}

            {/* Error / Success */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mb-4 p-3 bg-red-900/30 border border-red-500/40 rounded-lg text-red-200 text-sm text-center">
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mb-4 p-3 bg-green-900/30 border border-green-500/40 rounded-lg text-green-200 text-sm text-center">
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <Mail size={13} /> Email
                </label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[rgba(0,0,0,0.25)] border border-[var(--color-border-glass)] rounded-lg px-4 py-3 text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary-alpha-30)] transition-all font-mono text-sm"
                  placeholder="operator@decepshield.ai" required
                />
              </div>

              {/* Role (Register only) */}
              <AnimatePresence mode="popLayout">
                {isRegistering && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                      <Shield size={13} /> Role
                    </label>
                    <select value={role} onChange={e => setRole(e.target.value)}
                      className="w-full bg-[rgba(0,0,0,0.25)] border border-[var(--color-border-glass)] rounded-lg px-4 py-3 text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-all font-mono appearance-none text-sm"
                      required
                    >
                      {ROLES.map(r => <option key={r} value={r} className="bg-[var(--color-bg-base)]">{r}</option>)}
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <Lock size={13} /> Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full bg-[rgba(0,0,0,0.25)] border border-[var(--color-border-glass)] rounded-lg px-4 py-3 pr-11 text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary-alpha-30)] transition-all font-mono tracking-widest text-sm"
                    placeholder="••••••••" required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                {rememberMe
                  ? <CheckSquare size={17} className="text-[var(--color-primary)]" />
                  : <Square size={17} className="text-[var(--color-text-muted)]" />
                }
                <span className="text-sm text-[var(--color-text-muted)] select-none">Remember my login</span>
              </div>

              {/* Submit */}
              <button
                type="submit" disabled={loading || !!success}
                className={`w-full mt-2 ${(loading || success) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--color-primary-alpha-20)]'} bg-[var(--color-primary-alpha-10)] border border-[var(--color-primary-alpha-50)] text-[var(--color-primary)] font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 custom-shadow-primary text-sm`}
              >
                {loading ? 'Authenticating…' : (isRegistering ? 'Create Identity' : 'Secure Login')}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-7 pt-5 border-t border-[var(--color-border-glass)] text-center">
              <p className="text-[10px] text-[var(--color-text-muted)] opacity-60 font-mono uppercase tracking-[0.2em] leading-relaxed">
                AES-256 Encrypted · SOC 2 Compliant<br />
                Unauthorized access will be logged & reported
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* URL Error Message Handling */}
      {new URLSearchParams(window.location.search).get('error') && (
        <div className="fixed top-4 right-4 bg-red-900 border border-red-500 text-red-100 px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce">
          Authentication failed. Please try again.
        </div>
      )}
    </div>
  );
};

export default Login;

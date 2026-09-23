import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Honeypots from './pages/Honeypots';
import LiveMonitor from './pages/LiveMonitor';
import AiThreatIntel from './pages/AiThreatIntel';
import AttackerJourney from './pages/AttackerJourney';
import SessionAnalysis from './pages/SessionAnalysis';
import Evidence from './pages/Evidence';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/honeypots" element={<Honeypots />} />
              <Route path="/live-monitor" element={<LiveMonitor />} />
              <Route path="/ai-threat-intel" element={<AiThreatIntel />} />
              <Route path="/attacker-journey" element={<AttackerJourney />} />
              <Route path="/session-analysis" element={<SessionAnalysis />} />
              <Route path="/evidence" element={<Evidence />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;


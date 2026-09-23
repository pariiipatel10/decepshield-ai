const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

// Fix for Windows DNS failing on MongoDB SRV lookups
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config(); // Load environment variables FIRST

const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const session = require('express-session');
const passport = require('./config/passport');
const { protect, protectOrIngestKey } = require('./middleware/auth');
const User = require('./models/User');
const Incident = require('./models/Incident');
const Evidence = require('./models/Evidence');
const Honeypot = require('./models/Honeypot');
const AiThreatIntel = require('./models/AiThreatIntel');
const AttackerSession = require('./models/AttackerSession');
const TerminalLog = require('./models/TerminalLog');
const Settings = require('./models/Settings');
const ApiKey = require('./models/ApiKey');

const app = express();

// Frontend origin, used for CORS and for OAuth redirects back to the dashboard.
// Defaults to the local Vite dev server; set FRONTEND_URL in production (e.g. your
// Vercel URL).
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

// Session is required for some Passport strategies even if we use JWT later
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});

// Wire up MongoDB Change Streams -> Socket.io broadcasts. Works the same whether
// we're connected to a real replica set (Atlas) or the local in-memory replica set.
const attachChangeStreams = () => {
  const AiThreatIntel = require('./models/AiThreatIntel');
  const AttackerSession = require('./models/AttackerSession');

  try {
    const intelStream = AiThreatIntel.watch();
    intelStream.on('change', (change) => {
      if (change.operationType === 'insert') {
        io.emit('intel:new', change.fullDocument);
      }
    });
    intelStream.on('error', (err) => console.log('Intel Stream Error (expected if not Replica Set):', err.message));

    const sessionStream = AttackerSession.watch();
    sessionStream.on('change', (change) => {
      if (change.operationType === 'insert' || change.operationType === 'update') {
        io.emit('session:updated', change.fullDocument);
      }
    });
    sessionStream.on('error', (err) => console.log('Session Stream Error (expected if not Replica Set):', err.message));
  } catch (watchErr) {
    console.log('MongoDB Change Streams skipped.');
  }
};

// Setup MongoDB Connection. If MONGO_URI is set (e.g. a MongoDB Atlas connection
// string), connect to that real, persistent database -- this is what production /
// deployed environments should use. Otherwise fall back to an ephemeral in-memory
// replica set for local development, matching the previous behaviour.
const connectDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      console.log('Connecting to MongoDB via MONGO_URI...');
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to MongoDB (persistent) successfully!');
      attachChangeStreams();
      return;
    }

    console.log('MONGO_URI not set - starting an in-memory Replica Set for local development...');
    console.log('(Data will NOT persist across restarts. Set MONGO_URI to a MongoDB Atlas connection string for a real deployment.)');
    const mongoServer = await MongoMemoryServer.create({ replSet: { count: 1, storageEngine: 'wiredTiger' } });
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
    console.log('Connected to In-Memory MongoDB successfully!');
    attachChangeStreams();
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
};
connectDB();

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name, avatar: user.avatar },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// --- AUTH ROUTES --- //

// Basic request validation for local auth. Keeps obviously bad input
// (missing/malformed email, too-short password) from ever reaching the DB.
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

const registerValidation = [
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Local Auth
app.post('/api/auth/register', registerValidation, handleValidation, async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'User already exists' });
    
    await User.create({ email, password, role, provider: 'local' });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', loginValidation, handleValidation, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user);
      res.json({ token, user: { email: user.email, role: user.role, name: user.name, avatar: user.avatar } });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// OAuth Callback handler
const handleOAuthRedirect = (req, res) => {
  if (!req.user) return res.redirect(`${FRONTEND_URL}/?error=auth_failed`);
  const token = generateToken(req.user);
  // Redirect to frontend with token in URL (Frontend will parse and store it)
  res.redirect(`${FRONTEND_URL}/?token=${token}`);
};

// Google OAuth
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/api/auth/google/callback', passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/?error=google_failed` }), handleOAuthRedirect);

// GitHub OAuth
app.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/api/auth/github/callback', passport.authenticate('github', { failureRedirect: `${FRONTEND_URL}/?error=github_failed` }), handleOAuthRedirect);

// Discord OAuth
app.get('/api/auth/discord', passport.authenticate('discord'));
app.get('/api/auth/discord/callback', passport.authenticate('discord', { failureRedirect: `${FRONTEND_URL}/?error=discord_failed` }), handleOAuthRedirect);


// --- HONEYPOT ROUTES --- //
const { startHoneypot, stopHoneypot } = require('./services/honeypotManager');

app.get('/api/honeypots', protect, async (req, res) => {
  try {
    const honeypots = await Honeypot.find().sort('-createdAt');
    res.json(honeypots);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch honeypots' });
  }
});

app.post('/api/honeypots', protect, async (req, res) => {
  try {
    const honeypot = await Honeypot.create(req.body);
    
    if (honeypot.status === 'Running') {
      startHoneypot(honeypot._id.toString(), honeypot.type, honeypot.port);
    }
    
    res.status(201).json(honeypot);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create honeypot' });
  }
});

app.patch('/api/honeypots/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const honeypot = await Honeypot.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    if (!honeypot) return res.status(404).json({ error: 'Not found' });
    
    if (status === 'Running') {
      startHoneypot(honeypot._id.toString(), honeypot.type, honeypot.port);
    } else {
      stopHoneypot(honeypot._id.toString());
    }
    
    res.json(honeypot);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update honeypot status' });
  }
});

app.delete('/api/honeypots/:id', protect, async (req, res) => {
  try {
    stopHoneypot(req.params.id);
    await Honeypot.findByIdAndDelete(req.params.id);
    res.json({ message: 'Honeypot deleted and stopped' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete honeypot' });
  }
});

// --- INCIDENT & STATS ROUTES --- //
app.get('/api/stats', protect, async (req, res) => {
  try {
    const totalAttacks = await Incident.countDocuments();
    const highRiskAlerts = await Incident.countDocuments({ severity: 'High' });
    const activeAttackers = await AttackerSession.countDocuments();
    
    // Estimate threat score based on high risk ratio (0-100)
    let threatScore = 0;
    if (totalAttacks > 0) {
      threatScore = Math.min(100, Math.floor((highRiskAlerts / totalAttacks) * 100) + 10);
    }

    res.json({
      totalAttacks,
      activeAttackers,
      highRiskAlerts,
      threatScore
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/incidents', protect, async (req, res) => {
  try {
    // Get last 20 incidents
    const incidents = await Incident.find().sort('-timestamp').limit(20);
    
    // Generate real chart data by aggregating incidents over the last 6 hours
    const chartData = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getTime() - (i * 60 * 60 * 1000));
      const end = new Date(now.getTime() - ((i - 1) * 60 * 60 * 1000));
      
      const count = await Incident.countDocuments({
        timestamp: { $gte: start, $lt: end }
      });
      
      chartData.push({
        time: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        attacks: count
      });
    }
    
    res.json({ incidents, chartData });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

app.post('/api/incidents', protectOrIngestKey, async (req, res) => {
  // Endpoint for real honeypot listeners (services/honeypotManager.js) and the
  // dashboard's "Simulate Attack" demo button to push incident data. Guarded
  // by protectOrIngestKey so it can't be hit by arbitrary internet traffic.
  const { type, ip, target, severity } = req.body;
  try {
    const newIncident = await Incident.create({ type, ip, target, severity });
    
    // Fetch updated stats to broadcast
    const totalAttacks = await Incident.countDocuments();
    const highRiskAlerts = await Incident.countDocuments({ severity: 'High' });
    const activeAttackers = await AttackerSession.countDocuments();
    const threatScore = Math.min(100, Math.floor((highRiskAlerts / (totalAttacks || 1)) * 100) + 10);

    const systemStats = { totalAttacks, activeAttackers, highRiskAlerts, threatScore };

    io.emit('new_incident', newIncident);
    io.emit('stats_update', systemStats);

    res.status(201).json({ message: 'Incident logged', incident: newIncident });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log incident' });
  }
});

// --- REPORTS ROUTES --- //
app.get('/api/reports', protect, async (req, res) => {
  try {
    const typeAggregation = await Incident.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);
    const severityAggregation = await Incident.aggregate([
      { $group: { _id: "$severity", count: { $sum: 1 } } }
    ]);

    const barData = typeAggregation.map(item => ({ name: item._id, value: item.count }));
    const pieData = severityAggregation.map(item => ({ name: item._id, value: item.count }));

    // Generate dynamic real-time key findings from AiThreatIntel
    const recentIntel = await AiThreatIntel.find().sort('-timestamp').limit(3);
    const keyFindings = recentIntel.map(intel => ({
      title: intel.classification,
      description: `Detected a ${intel.severity} severity threat mapped to MITRE ${intel.mitreId} (${intel.mitreName}). ${intel.pattern}`
    }));

    // Fallback if no intel is available
    if (keyFindings.length === 0) {
      keyFindings.push({
        title: 'System Baseline Normal',
        description: 'No advanced persistent threats or critical ML-flagged anomalies detected in the current reporting period.'
      });
    }

    res.json({ barData, pieData, keyFindings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// --- EVIDENCE ROUTES --- //
app.get('/api/evidence', protect, async (req, res) => {
  try {
    const evidenceList = await Evidence.find().sort('-timestamp');
    res.json(evidenceList);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch evidence' });
  }
});

app.post('/api/evidence', protect, async (req, res) => {
  try {
    const { type, name, size, hash } = req.body;
    const newEvidence = await Evidence.create({
      type: type || 'LOG',
      name: name || `captured_artifact_${Date.now()}.log`,
      size: size || '1.2 MB',
      hash: hash || [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
    });
    res.status(201).json(newEvidence);
  } catch (err) {
    res.status(500).json({ error: 'Failed to log evidence' });
  }
});

app.delete('/api/evidence/:id', protect, async (req, res) => {
  try {
    await Evidence.findByIdAndDelete(req.params.id);
    res.json({ message: 'Evidence deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete evidence' });
  }
});

// --- ADVANCED MODULES ROUTES --- //
app.get('/api/threat-intel', protect, async (req, res) => {
  try {
    const intel = await AiThreatIntel.find().sort('-createdAt');
    res.json(intel);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch threat intel' });
  }
});

app.patch('/api/threat-intel/:id', protect, async (req, res) => {
  try {
    const intel = await AiThreatIntel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    io.emit('intel:updated', intel);
    res.json(intel);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update threat intel' });
  }
});

app.get('/api/sessions', protect, async (req, res) => {
  try {
    const sessions = await AttackerSession.find().sort('-startTime');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

app.get('/api/sessions/:sessionId', protect, async (req, res) => {
  try {
    const session = await AttackerSession.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

app.get('/api/sessions/:sessionId/terminal', protect, async (req, res) => {
  try {
    const logs = await TerminalLog.find({ sessionId: req.params.sessionId }).sort('timestamp');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch terminal logs' });
  }
});

app.get('/api/settings', protect, async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.user._id });
    if (!settings) settings = await Settings.create({ userId: req.user._id });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', protect, async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { userId: req.user._id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

io.on('connection', (socket) => {
  socket.emit('system_status', { status: 'Connected to DecepShield AI core' });
  
  socket.on('join:session_room', (sessionId) => {
    socket.join(`session_${sessionId}`);
  });
  
  socket.on('leave:session_room', (sessionId) => {
    socket.leave(`session_${sessionId}`);
  });
});

// Initialize Gemini AI Threat Detection Loop
const { analyzeTrafficWithGemini } = require('./services/aiEngine');
// Run the AI engine every 30 seconds to analyze new traffic
setInterval(analyzeTrafficWithGemini, 30 * 1000);

const PORT = process.env.PORT || 3001;
server.listen(PORT, async () => {
  console.log(`API Server running on port ${PORT}`);
  
  // Restart any running honeypots on server startup
  const HoneypotModel = require('./models/Honeypot');
  const runningHoneypots = await HoneypotModel.find({ status: 'Running' });
  runningHoneypots.forEach(hp => {
    console.log(`[Auto-Start] Resuming honeypot ${hp.type} on port ${hp.port}`);
    startHoneypot(hp._id.toString(), hp.type, hp.port);
  });
});
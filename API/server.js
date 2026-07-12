const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Mock Database Connection
// In a real scenario, uncomment to connect to MongoDB
/*
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/decepshield', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
*/

// REST APIs

// 1. Auth Mock
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // Mock validation
  if (email && password) {
    res.json({ token: 'mock-jwt-token-12345', user: { email, role: 'admin' } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// 2. Honeypots Mock
const mockHoneypots = [
  { id: 1, name: 'Fake SSH Server', type: 'SSH', port: 22, status: 'Running', attacks: 1240 },
  { id: 2, name: 'Legacy FTP', type: 'FTP', port: 21, status: 'Stopped', attacks: 0 },
];

app.get('/api/honeypots', (req, res) => {
  res.json(mockHoneypots);
});

app.post('/api/honeypots', (req, res) => {
  const newHp = { id: Date.now(), ...req.body, status: 'Running', attacks: 0 };
  mockHoneypots.push(newHp);
  res.json(newHp);
});

// 3. Stats Mock
app.get('/api/stats', (req, res) => {
  res.json({
    totalAttacks: 14205,
    activeAttackers: 342,
    highRiskAlerts: 28,
    threatScore: 84
  });
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('Frontend connected to Socket.io:', socket.id);
  
  socket.emit('system_status', { status: 'Connected to DecepShield AI core' });
  
  // Simulate live attack events every 5 seconds
  const interval = setInterval(() => {
    socket.emit('new_attack', {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      sourceIp: `10.0.0.${Math.floor(Math.random() * 255)}`,
      country: ['RU', 'CN', 'US', 'BR', 'IR'][Math.floor(Math.random() * 5)],
      attackType: ['SQL Injection', 'Brute Force', 'Port Scan', 'XSS'][Math.floor(Math.random() * 4)],
      protocol: ['TCP', 'UDP', 'HTTP', 'SSH'][Math.floor(Math.random() * 4)],
      riskScore: Math.floor(Math.random() * 100),
    });
  }, 5000);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    clearInterval(interval);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});
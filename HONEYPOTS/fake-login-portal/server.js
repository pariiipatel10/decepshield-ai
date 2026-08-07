const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve the fake login HTML page
app.use(express.static(path.join(__dirname, 'public')));

// The vulnerable login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const attackerIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  console.log(`[HONEYPOT ALERT] Login attempt from ${attackerIp} | User: ${username} | Pass: ${password}`);

  // Determine if it's a generic brute force or an SQL injection
  let attackType = 'Brute Force Attempt';
  let severity = 'Medium';
  
  if (username.includes("'") || username.includes("OR 1=1") || password.includes("DROP")) {
    attackType = 'SQL Injection Attempt';
    severity = 'High';
  }

  // 1. Secretly forward this attack telemetry to the DecepShield AI Backend
  try {
    await axios.post('http://localhost:3001/api/incidents', {
      type: attackType,
      ip: attackerIp === '::1' ? '192.168.1.105' : attackerIp, // mock IP if localhost
      target: 'Fake Employee Portal (Port 8080)',
      severity: severity
    });
    console.log('-> Telemetry successfully sent to DecepShield AI Backend.');
  } catch (error) {
    console.error('-> Failed to connect to DecepShield AI Backend:', error.message);
  }

  // 2. Play dumb and return a generic error to the attacker
  // We add an artificial delay to slow down automated scanners (tarpitting)
  setTimeout(() => {
    res.status(401).send('Invalid employee credentials. This incident has been logged.');
  }, 2000);
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Fake Employee Portal (Honeypot) running on port ${PORT}`);
  console.log(`Warning: This is a decoy service. All traffic is monitored.`);
});

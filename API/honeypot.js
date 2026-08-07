require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Import MongoDB models from the existing API directory
const Incident = require('./models/Incident');
const AttackerSession = require('./models/AttackerSession');
const TerminalLog = require('./models/TerminalLog');
const AiThreatIntel = require('./models/AiThreatIntel');
const Honeypot = require('./models/Honeypot');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('Using MONGO_URI:', process.env.MONGO_URI);
// Ensure MongoDB is connected
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[+] Connected to MongoDB Atlas cluster');
    let hp = await Honeypot.findOne({ name: 'Web_Honeypot_01' });
    if (!hp) {
      await Honeypot.create({ name: 'Web_Honeypot_01', type: 'HTTP', ip: '10.0.0.80', port: 8080, status: 'Running' });
      console.log('[+] Registered Web_Honeypot_01 sensor');
    }
  } catch (err) {
    console.error('[-] MongoDB connection error:', err.message);
    console.log('[*] Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};
connectDB();

// Helper function to extract true IP in local setups
const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         '127.0.0.1';
};

// Catch-all route to intercept EVERYTHING
app.use(async (req, res) => {
  const ip = getClientIp(req);
  const method = req.method;
  const path = req.url;
  const userAgent = req.headers['user-agent'] || 'Unknown';
  
  console.log(`[!] Trapped Request: ${method} ${path} from ${ip}`);

  try {
    // 1. Determine Severity and Phase
    let severity = 'Low';
    let type = 'Recon Scan';
    let phase = 'recon';
    let aiClassification = null;

    if (path.includes('.env') || path.includes('config.php')) {
      severity = 'High';
      type = 'Configuration Leak Probe';
      phase = 'enumeration';
      aiClassification = {
        name: 'Automated Credential Harvesting',
        mitreId: 'T1552',
        mitreName: 'Unsecured Credentials',
        pattern: `Attacker aggressively probed for sensitive configuration file: ${path}`
      };
    } else if (path.includes('wp-admin') || path.includes('login')) {
      severity = 'Medium';
      type = 'Admin Panel Brute Force';
      phase = 'scanning';
    } else if (req.body && JSON.stringify(req.body).includes("' OR 1=1")) {
      severity = 'Critical';
      type = 'SQL Injection Attack';
      phase = 'exploitation';
      aiClassification = {
        name: 'SQL Injection Payload',
        mitreId: 'T1190',
        mitreName: 'Exploit Public-Facing Application',
        pattern: 'Attacker injected malicious SQL payload into request body to bypass authentication.'
      };
    }

    // 2. Manage Attacker Session
    let session = await AttackerSession.findOne({ attackerIp: ip }).sort('-createdAt');
    
    // Create new session if none exists within the last hour
    if (!session || (new Date() - new Date(session.updatedAt)) > 3600000) {
      const sessionId = `sess_${Math.random().toString(36).substr(2, 9)}`;
      session = await AttackerSession.create({
        sessionId,
        attackerIp: ip,
        targetHoneypot: 'Web_Honeypot_01',
        currentPhase: phase,
        aiSummary: `Attacker initiated connection via ${userAgent}`,
        filesAccessed: []
      });
    } else {
      // Escalate phase if necessary
      const phases = ['recon', 'scanning', 'enumeration', 'exploitation'];
      if (phases.indexOf(phase) > phases.indexOf(session.currentPhase)) {
        session.currentPhase = phase;
      }
      // Log files accessed if any
      if (severity !== 'Low') {
        session.filesAccessed.push({ path: path, type: 'file' });
      }
      session.aiSummary = `Attacker escalated to ${type}`;
      await session.save();
    }

    // 3. Generate Incident Record
    await Incident.create({
      type,
      ip,
      target: 'Web_Honeypot_01',
      severity
    });

    // 4. Simulate a Terminal Log (To populate UI)
    await TerminalLog.create({
      sessionId: session.sessionId,
      command: `curl -X ${method} ${path}`,
      response: `HTTP/1.1 200 OK\nServer: Apache/2.4.41 (Ubuntu)\n\nFake Response Body`
    });

    // 5. Generate AI Threat Intel if Critical/High
    if (aiClassification && (severity === 'High' || severity === 'Critical')) {
      await AiThreatIntel.create({
        classification: aiClassification.name,
        confidence: Math.floor(Math.random() * (99 - 85) + 85),
        mitreId: aiClassification.mitreId,
        mitreName: aiClassification.mitreName,
        severity: severity,
        pattern: aiClassification.pattern,
        recommendation: `Block incoming connections from ${ip} immediately and patch web server vulnerabilities.`
      });
    }

    // 6. Serve a fake response to fool the attacker
    res.status(200).send('<html><body><h1>It works!</h1></body></html>');

  } catch (err) {
    console.error('Error processing trapped request:', err);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`🛡️  DecepShield HTTP Honeypot Active 🛡️`);
  console.log(`========================================`);
  console.log(`[+] Listening for attacks on port ${PORT}...`);
  console.log(`[!] Test it: curl http://localhost:${PORT}/wp-admin`);
});

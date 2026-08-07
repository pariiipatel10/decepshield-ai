// We don't have node-fetch or axios installed globally, but we can use the built-in fetch if Node >= 18

// We don't have node-fetch or axios installed globally, but we can use the built-in fetch if Node >= 18
// Or just require http since we only need to hit localhost

const targets = [
  'Fake Employee Portal (Port 8080)',
  'SSH Honeypot (Port 22)',
  'FTP Decoy (Port 21)',
  'MySQL Database (Port 3306)'
];

const attackTypes = [
  { type: 'Brute Force Attempt', severity: 'Medium' },
  { type: 'SQL Injection Attempt', severity: 'High' },
  { type: 'Cross-Site Scripting (XSS)', severity: 'High' },
  { type: 'Port Scan Detected', severity: 'Low' },
  { type: 'Unauthorized Access', severity: 'Medium' },
  { type: 'Remote Code Execution (RCE)', severity: 'Critical' }
];

const generateRandomIp = () => {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

const sendFakeAttack = async () => {
  const target = targets[Math.floor(Math.random() * targets.length)];
  const attack = attackTypes[Math.floor(Math.random() * attackTypes.length)];
  const ip = generateRandomIp();

  try {
    const response = await fetch('http://localhost:3001/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: attack.type,
        ip: ip,
        target: target,
        severity: attack.severity
      })
    });
    
    if (response.ok) {
      console.log(`💥 Fired: [${attack.severity}] ${attack.type} from ${ip} against ${target}`);
    } else {
      console.error('Failed to send attack (Server returned an error)');
    }
  } catch (err) {
    console.error('Failed to connect to API Backend. Is it running on port 3001?');
  }
};

console.log('🤖 DecepShield AI - Live Attack Simulator Started...');
console.log('Firing random attacks every 2 to 5 seconds. Press Ctrl+C to stop.\n');

// Fire initial attack
sendFakeAttack();

// Set up random interval loop
const loop = () => {
  const delay = Math.floor(Math.random() * (5000 - 2000 + 1) + 2000); // 2 to 5 seconds
  setTimeout(() => {
    sendFakeAttack();
    loop();
  }, delay);
};

loop();

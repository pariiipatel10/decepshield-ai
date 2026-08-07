const net = require('net');
const express = require('express');

// Dictionary to store active servers by Honeypot DB ID
const activeServers = {};

/**
 * Report an incident to the main backend API
 */
const reportIncident = async (ip, target, attackType, severity) => {
  try {
    await fetch('http://localhost:3001/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: attackType,
        ip: ip === '::1' || ip === '::ffff:127.0.0.1' ? '127.0.0.1' : ip,
        target: target,
        severity: severity
      })
    });
  } catch (error) {
    console.error(`[HoneypotManager] Failed to report incident: ${error.message}`);
  }
};

/**
 * Start a TCP/HTTP Honeypot Listener
 */
const startHoneypot = (id, type, port) => {
  if (activeServers[id]) {
    console.log(`[HoneypotManager] Honeypot ${id} is already running.`);
    return;
  }

  let server;

  try {
    if (type === 'SSH') {
      server = net.createServer((socket) => {
        const ip = socket.remoteAddress;
        console.log(`[Honeypot: SSH] Connection from ${ip}`);
        
        // Send fake OpenSSH banner
        socket.write('SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.1\r\n');
        
        socket.on('data', (data) => {
          // As soon as they send data (client banner or auth attempt), log it and drop
          reportIncident(ip, `SSH Honeypot (Port ${port})`, 'SSH Brute Force / Auth Attempt', 'High');
          socket.write('Protocol mismatch.\r\n');
          socket.end();
        });
        
        socket.on('error', () => {});
      });

    } else if (type === 'FTP') {
      server = net.createServer((socket) => {
        const ip = socket.remoteAddress;
        console.log(`[Honeypot: FTP] Connection from ${ip}`);
        
        // Send fake vsFTPd banner
        socket.write('220 (vsFTPd 3.0.3)\r\n');
        
        socket.on('data', (data) => {
          const input = data.toString().trim();
          reportIncident(ip, `FTP Decoy (Port ${port})`, `FTP Command: ${input.substring(0, 20)}`, 'Medium');
          
          if (input.toUpperCase().startsWith('USER')) {
            socket.write('331 Please specify the password.\r\n');
          } else if (input.toUpperCase().startsWith('PASS')) {
            socket.write('530 Login incorrect.\r\n');
            socket.end();
          } else {
            socket.write('530 Please login with USER and PASS.\r\n');
          }
        });
        
        socket.on('error', () => {});
      });

    } else if (type === 'MySQL' || type === 'Redis') {
      server = net.createServer((socket) => {
        const ip = socket.remoteAddress;
        socket.on('data', (data) => {
          reportIncident(ip, `${type} DB Decoy (Port ${port})`, `Unauthorized Access Attempt`, 'High');
          socket.end();
        });
        socket.on('error', () => {});
      });

    } else if (type === 'HTTP') {
      const app = express();
      app.all('*', (req, res) => {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        reportIncident(ip, `HTTP Decoy (Port ${port})`, `HTTP ${req.method} ${req.url}`, 'Medium');
        res.status(200).send('<html><body><h1>Admin Portal</h1><p>Under maintenance.</p></body></html>');
      });
      server = app;
    } else {
      console.error(`[HoneypotManager] Unknown honeypot type: ${type}`);
      return;
    }

    // Start listening
    if (type === 'HTTP') {
      activeServers[id] = server.listen(port, () => {
        console.log(`[HoneypotManager] Started HTTP honeypot on port ${port}`);
      });
    } else {
      server.listen(port, () => {
        console.log(`[HoneypotManager] Started ${type} honeypot on port ${port}`);
      });
      activeServers[id] = server;
    }

    // Handle port in use errors
    activeServers[id].on('error', (err) => {
      console.error(`[HoneypotManager] Error on port ${port}: ${err.message}`);
      delete activeServers[id];
    });

  } catch (error) {
    console.error(`[HoneypotManager] Failed to start honeypot on port ${port}:`, error);
  }
};

/**
 * Stop a Honeypot Listener
 */
const stopHoneypot = (id) => {
  if (activeServers[id]) {
    activeServers[id].close(() => {
      console.log(`[HoneypotManager] Stopped honeypot ID: ${id}`);
    });
    delete activeServers[id];
  } else {
    console.log(`[HoneypotManager] Honeypot ID: ${id} is not running.`);
  }
};

module.exports = {
  startHoneypot,
  stopHoneypot
};

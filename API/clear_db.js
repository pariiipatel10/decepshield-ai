require('dotenv').config();
const mongoose = require('mongoose');
const Incident = require('./models/Incident');
const Evidence = require('./models/Evidence');
const Honeypot = require('./models/Honeypot');
const AiThreatIntel = require('./models/AiThreatIntel');
const AttackerSession = require('./models/AttackerSession');
const TerminalLog = require('./models/TerminalLog');
const Settings = require('./models/Settings');

// Fix for Windows DNS failing on MongoDB SRV lookups
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const clearDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    console.log('Deleting all Incidents...');
    await Incident.deleteMany({});
    
    console.log('Deleting all Evidence...');
    await Evidence.deleteMany({});
    
    console.log('Deleting all Honeypots...');
    await Honeypot.deleteMany({});

    console.log('Deleting all AI Threat Intel...');
    await AiThreatIntel.deleteMany({});

    console.log('Deleting all Attacker Sessions...');
    await AttackerSession.deleteMany({});

    console.log('Deleting all Terminal Logs...');
    await TerminalLog.deleteMany({});

    console.log('Deleting all Settings...');
    await Settings.deleteMany({});

    console.log('Successfully cleared all database entries!');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

clearDB();

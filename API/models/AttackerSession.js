const mongoose = require('mongoose');

const activeTacticSchema = new mongoose.Schema({
  name: String,
  description: String
});

const fileAccessedSchema = new mongoose.Schema({
  path: String,
  type: { type: String, enum: ['file', 'script'] }
});

const attackerSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  attackerIp: { type: String, required: true },
  targetHoneypot: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  currentPhase: { 
    type: String, 
    enum: ['recon', 'scanning', 'enumeration', 'exploitation', 'persistence', 'privilege', 'exfiltration'],
    default: 'recon'
  },
  activeTactics: [activeTacticSchema],
  phaseDetails: {
    description: String,
    rawPayload: String
  },
  aiSummary: String,
  filesAccessed: [fileAccessedSchema]
}, { timestamps: true });

module.exports = mongoose.model('AttackerSession', attackerSessionSchema);

const mongoose = require('mongoose');

const terminalLogSchema = new mongoose.Schema({
  sessionId: { type: String, required: true }, // referencing AttackerSession.sessionId
  command: { type: String, required: true },
  response: { type: String },
  user: { type: String, default: 'root' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TerminalLog', terminalLogSchema);

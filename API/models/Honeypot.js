const mongoose = require('mongoose');

const honeypotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g., Web Server, Database, SSH
  port: { type: Number, required: true },
  status: { type: String, enum: ['Running', 'Stopped', 'Error'], default: 'Running' },
  attacks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Honeypot', honeypotSchema);

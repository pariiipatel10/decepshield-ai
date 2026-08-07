const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  type: { type: String, required: true },
  ip: { type: String, required: true },
  target: { type: String, required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Incident', incidentSchema);

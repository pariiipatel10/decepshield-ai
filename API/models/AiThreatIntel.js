const mongoose = require('mongoose');

const aiThreatIntelSchema = new mongoose.Schema({
  classification: { type: String, required: true },
  confidence: { type: Number, required: true },
  mitreId: { type: String },
  mitreName: { type: String },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
  pattern: { type: String },
  recommendation: { type: String },
  status: { type: String, enum: ['Active', 'Dismissed', 'Mitigated'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('AiThreatIntel', aiThreatIntelSchema);

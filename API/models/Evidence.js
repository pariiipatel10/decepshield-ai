const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  type: { type: String, required: true, default: 'LOG' },
  name: { type: String, required: true },
  size: { type: String, required: true },
  hash: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Evidence', evidenceSchema);

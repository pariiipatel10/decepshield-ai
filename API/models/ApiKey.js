const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true },
  lastUsed: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('ApiKey', apiKeySchema);

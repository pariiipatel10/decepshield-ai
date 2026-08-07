const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  notifications: {
    criticalAlerts: { type: Boolean, default: true },
    emailIntegration: { type: Boolean, default: true },
    slackWebhookUrl: { type: String, default: '' }
  },
  aiRules: {
    autoTarpitting: { type: Boolean, default: true },
    autoBlockMaliciousIps: { type: Boolean, default: false },
    aiConfidenceThreshold: { type: Number, default: 85 }
  },
  appearance: {
    theme: { type: String, default: 'dark' },
    disableAnimations: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);

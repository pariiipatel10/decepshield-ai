const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // Password is not required if user logs in via OAuth
  },
  name: {
    type: String,
  },
  role: {
    type: String,
    default: 'Security Analyst',
  },
  provider: {
    type: String,
    default: 'local',
  },
  providerId: {
    type: String,
  },
  avatar: {
    type: String,
  }
}, { timestamps: true });

// Method to match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook to hash password if it's new/modified
userSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) {
    return;
  } else {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;

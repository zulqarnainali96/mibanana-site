const mongoose = require('mongoose');

const authCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 500, // Code expires after 10 minutes
  },
});

module.exports = mongoose.model('auth_code', authCodeSchema);

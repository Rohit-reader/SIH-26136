const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    enum: [
      'Super Admin',
      'Government Admin',
      'Department Officer',
      'Procurement Officer',
      'Technical/Domain Evaluator',
      'Cybersecurity Evaluator',
      'Independent Validator',
      'Startup Admin',
      'Startup Team Member',
      'Viewer'
    ], 
    required: true 
  },
  department: { type: String, default: '' },
  startupName: { type: String, default: '' },
  organization: { type: String, default: '' },
  phone: { type: String, default: '+91 98200 12345' },
  avatarUrl: { type: String, default: '' },
  password: { type: String, default: 'GovInnovate@2026' }, // Common development password
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  nodalOfficer: { type: String, required: true },
  contactEmail: { type: String, required: true },
  annualInnovationBudget: { type: Number, required: true },
  focusAreas: [{ type: String }],
  location: { type: String, default: 'Mantralaya, Mumbai, Maharashtra' },
  activeChallengesCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Department', departmentSchema);

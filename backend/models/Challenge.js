const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  sector: { type: String, default: 'General Innovation' },
  problemDescription: { type: String, required: true },
  currentSituation: { type: String, required: true },
  targetBeneficiaries: { type: String, required: true },
  expectedOutcome: { type: String, required: true },
  kpiMetrics: [{
    name: { type: String, required: true },
    baselineValue: { type: String, required: true },
    targetValue: { type: String, required: true },
    currentValue: { type: String, default: 'Not Started' }
  }],
  requiredTechnology: [{ type: String }],
  estimatedBudget: { type: Number, required: true },
  pilotDurationDays: { type: Number, default: 90 },
  eligibilityRequirements: [{ type: String }],
  exemptions: {
    turnoverWaived: { type: Boolean, default: true },
    experienceWaived: { type: Boolean, default: true },
    emdExempted: { type: Boolean, default: true }
  },
  legalClauses: [{ type: String }],
  status: { 
    type: String, 
    enum: ['Draft', 'Pending Approval', 'Published', 'Pilot Active', 'Completed', 'Scaled Statewide'], 
    default: 'Published' 
  },
  aiGeneratedPrompt: { type: String },
  securityRequirements: [{ type: String }],
  location: { type: String, default: 'Maharashtra' },
  targetDistrict: { type: String, default: 'All Districts' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Challenge', challengeSchema);

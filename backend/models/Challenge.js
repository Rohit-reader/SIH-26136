const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true, default: 'Government of Maharashtra' },
  sector: { type: String, default: 'General Innovation' },
  problemDescription: { type: String, required: true },
  currentSituation: { type: String, default: 'Standard manual operational baseline' },
  targetBeneficiaries: { type: String, default: 'Citizens & Field Beneficiaries across Maharashtra' },
  expectedOutcome: { type: String, default: 'Measurable outcome & service delivery improvement' },
  kpiMetrics: [{
    name: { type: String, default: 'Primary Operational KPI Benchmark' },
    baselineValue: { type: String, default: 'Baseline benchmark to be established in pilot' },
    targetValue: { type: String, default: 'Target operational improvement' },
    currentValue: { type: String, default: 'Pending Pilot Launch' }
  }],
  requiredTechnology: [{ type: String }],
  estimatedBudget: { type: Number, default: 1500000 },
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

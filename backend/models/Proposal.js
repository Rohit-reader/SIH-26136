const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  solutionTitle: { type: String, required: true },
  technicalApproach: { type: String, required: true },
  architectureSummary: { type: String, required: true },
  implementationTimelineDays: { type: Number, required: true },
  proposedBudget: { type: Number, required: true },
  teamOverview: { type: String, required: true },
  securityApproach: { type: String, required: true },
  aiSummary: { type: String },
  aiRiskFlags: [{ type: String }],
  status: { 
    type: String, 
    enum: ['Submitted', 'Under Review', 'Shortlisted', 'Selected for Pilot', 'Rejected'], 
    default: 'Submitted' 
  },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Proposal', proposalSchema);

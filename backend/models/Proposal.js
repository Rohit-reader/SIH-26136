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
    enum: ['Submitted', 'Under Review', 'Eligible', 'Conditionally Eligible', 'Not Eligible', 'Shortlisted', 'Selected for Pilot', 'Rejected'], 
    default: 'Submitted' 
  },
  eligibilityScreening: {
    screeningStatus: {
      type: String,
      enum: ['Pending Screening', 'Eligible', 'Conditionally Eligible', 'Not Eligible'],
      default: 'Pending Screening'
    },
    screenedBy: { type: String, default: 'Department Screening Desk' },
    screenedAt: { type: Date },
    officerNotes: { type: String, default: '' },
    conditionalReason: { type: String, default: '' },
    disqualificationReason: { type: String, default: '' },
    automatedChecks: {
      dpiitVerified: { type: Boolean, default: true },
      digilockerDocVerified: { type: Boolean, default: true },
      gfrTurnoverExemptionApplied: { type: Boolean, default: true },
      gfrExperienceExemptionApplied: { type: Boolean, default: true },
      emdDepositExempted: { type: Boolean, default: true },
      cyberSecurityDeclared: { type: Boolean, default: true },
      trlLevelPassed: { type: Boolean, default: true }
    }
  },
  assignedEvaluators: [{
    evaluatorName: { type: String, required: true },
    evaluatorRole: { type: String, default: 'Technical/Domain Evaluator' },
    assignedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Assigned', 'Evaluated', 'Conflict Declared'], default: 'Assigned' }
  }],
  evaluationSummary: {
    aggregateScore: { type: Number, default: 0 },
    evaluationsCount: { type: Number, default: 0 },
    consensusRecommendation: { type: String, enum: ['Recommend for Pilot', 'Requires Revisions', 'Reject', 'Pending Evaluation'], default: 'Pending Evaluation' },
    evaluationStatus: { type: String, enum: ['Pending Assignment', 'Under Evaluation', 'Evaluated', 'Moderated', 'Shortlisted'], default: 'Pending Assignment' }
  },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Proposal', proposalSchema);

const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  milestoneNumber: { type: Number, required: true },
  title: { type: String, required: true },
  deliverables: { type: String, required: true },
  dueDate: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Evidence Submitted', 'Approved', 'Paid'], 
    default: 'Pending' 
  },
  evidenceUrl: { type: String, default: '' },
  approvedBy: { type: String, default: '' }
});

const pilotSchema = new mongoose.Schema({
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  proposalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal', required: true },
  pilotTitle: { type: String, required: true },
  location: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  totalBudget: { type: Number, required: true },
  milestones: [milestoneSchema],
  kpiTracking: [{
    metricName: { type: String, required: true },
    baseline: { type: String, required: true },
    target: { type: String, required: true },
    currentLive: { type: String, required: true },
    status: { type: String, enum: ['On Track', 'Target Achieved', 'Behind Target'], default: 'Target Achieved' }
  }],
  pilotSuccessScore: { type: Number, default: 90.2 },
  scoreBreakdown: {
    kpiAchievement: { type: Number, default: 95 },
    technicalPerformance: { type: Number, default: 92 },
    costEfficiency: { type: Number, default: 84 },
    security: { type: Number, default: 90 },
    scalability: { type: Number, default: 88 }
  },
  validationStatus: { 
    type: String, 
    enum: ['Pending Review', 'Validated', 'Partially Validated', 'Requires Evidence', 'Rejected'], 
    default: 'Validated' 
  },
  procurementRecommendation: { 
    type: String, 
    enum: ['Pending Decision', 'Scale Statewide', 'Extend Pilot', 'Modify Solution', 'Close Challenge'], 
    default: 'Scale Statewide' 
  },
  validatorNotes: { type: String, default: 'Independent validation confirms 60% reduction in hospital waiting times with zero cyber vulnerabilities reported.' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pilot', pilotSchema);

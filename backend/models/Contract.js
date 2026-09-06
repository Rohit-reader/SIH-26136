const mongoose = require('mongoose');

const milestoneContractSchema = new mongoose.Schema({
  milestoneNumber: { type: Number, required: true },
  title: { type: String, required: true },
  deliverables: { type: String, required: true },
  dueDate: { type: String, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Deliverable Submitted', 'Verified', 'Payment Approved', 'Disbursed'],
    default: 'Pending'
  },
  evidenceUrl: { type: String, default: '' },
  evidenceNotes: { type: String, default: '' },
  treasuryRefNo: { type: String, default: '' },
  approvedBy: { type: String, default: '' },
  disbursedAt: { type: Date }
});

const contractSchema = new mongoose.Schema({
  contractNumber: { type: String, required: true, unique: true },
  contractTitle: { type: String, required: true },
  pilotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pilot' },
  proposalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal', required: true },
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  templateType: { 
    type: String, 
    enum: ['Standard Innovation Procurement Agreement', 'Sandbox Pilot Scale Contract', 'Custom Direct Sanction'], 
    default: 'Standard Innovation Procurement Agreement' 
  },
  totalValue: { type: Number, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  status: {
    type: String,
    enum: ['Drafting', 'Under Legal Review', 'Active', 'Milestones In Progress', 'Completed', 'Suspended', 'Terminated'],
    default: 'Active'
  },
  milestones: [milestoneContractSchema],
  slaTerms: {
    uptimeSlaPct: { type: Number, default: 99.5 },
    performanceTargetThreshold: { type: String, default: '75% OPD wait time reduction' },
    penaltyClause: { type: String, default: '0.5% deduction per 24h delay beyond milestone target' }
  },
  dataGovernance: {
    governmentDataOwnership: { type: String, default: '100% Patient logs & telemetry belong to Govt of Maharashtra.' },
    startupIpProtection: { type: String, default: 'Proprietary AI code & computer vision IP belong exclusively to Startup.' },
    certInMandatory: { type: Boolean, default: true }
  },
  amendmentHistory: [{
    requestedBy: { type: String, required: true },
    reason: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contract', contractSchema);

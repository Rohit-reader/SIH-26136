const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  milestoneNumber: { type: Number, required: true },
  title: { type: String, required: true },
  deliverables: { type: String, required: true },
  dueDate: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Evidence Submitted', 'Approved', 'Paid'], 
    default: 'Pending' 
  },
  evidenceUrl: { type: String, default: '' },
  evidenceNotes: { type: String, default: '' },
  approvedBy: { type: String, default: '' }
});

const riskSchema = new mongoose.Schema({
  riskCategory: { type: String, default: 'Technical / Site' },
  description: { type: String, required: true },
  mitigationPlan: { type: String, default: '' },
  severity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Open', 'Mitigated', 'Closed'], default: 'Open' }
});

const pilotSchema = new mongoose.Schema({
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  proposalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal', required: true },
  pilotTitle: { type: String, required: true },
  scopeDescription: { type: String, default: 'Controlled field pilot deployment across selected district hospital sites for real-world OPD triage validation.' },
  location: { type: String, required: true },
  targetParticipants: { type: String, default: '3 District Hospitals (Pune, Nashik, Thane), ~15,000 OPD Patients' },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  totalBudget: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Draft Configuration', 'Pending Approval', 'Approved', 'Pilot Active', 'Completed', 'Closed'],
    default: 'Pilot Active'
  },
  milestones: [milestoneSchema],
  kpiTracking: [{
    metricName: { type: String, required: true },
    baseline: { type: String, required: true },
    target: { type: String, required: true },
    currentLive: { type: String, required: true },
    unit: { type: String, default: '%' },
    status: { type: String, enum: ['On Track', 'Target Achieved', 'Behind Target'], default: 'Target Achieved' }
  }],
  riskManagement: [riskSchema],
  dataGovernance: {
    governmentDataRights: { type: String, default: 'Government of Maharashtra retains 100% ownership of patient operational data, telemetry logs, and trial audit records.' },
    startupIpRights: { type: String, default: 'Startup retains exclusive intellectual property rights to underlying AI algorithms, computer vision models, and source code.' },
    dpdpActCompliance: { type: Boolean, default: true }
  },
  cyberSecurity: {
    certInDeclared: { type: Boolean, default: true },
    dataSecurityProtocol: { type: String, default: 'End-to-end AES-256 encrypted local hospital servers with zero public cloud PII exposure.' }
  },
  pilotSuccessScore: { type: Number, default: 92.4 },
  scoreBreakdown: {
    kpiAchievement: { type: Number, default: 95 },
    technicalPerformance: { type: Number, default: 92 },
    costEfficiency: { type: Number, default: 88 },
    security: { type: Number, default: 96 },
    scalability: { type: Number, default: 91 }
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
  validatorNotes: { type: String, default: 'Pilot completion report verifies 72% reduction in OPD wait times with zero security incidents.' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pilot', pilotSchema);

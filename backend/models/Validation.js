const mongoose = require('mongoose');

const kpiVerificationSchema = new mongoose.Schema({
  metricName: { type: String, required: true },
  baseline: { type: String, required: true },
  claimed: { type: String, required: true },
  verifiedLive: { type: String, required: true },
  variancePct: { type: Number, default: 0 },
  verificationStatus: { 
    type: String, 
    enum: ['Verified Pass', 'Discrepancy Noted', 'Failed'], 
    default: 'Verified Pass' 
  },
  evidenceType: { type: String, default: 'Independent Telemetry Log' }
});

const milestoneAuditSchema = new mongoose.Schema({
  milestoneNumber: { type: Number, required: true },
  deliverableTitle: { type: String, required: true },
  auditFinding: { type: String, required: true },
  evidenceQuality: { 
    type: String, 
    enum: ['High', 'Medium', 'Low', 'Insufficient'], 
    default: 'High' 
  },
  complianceStatus: { 
    type: String, 
    enum: ['Compliant', 'Non-Compliant', 'Conditional'], 
    default: 'Compliant' 
  }
});

const discrepancySchema = new mongoose.Schema({
  severity: { type: String, enum: ['Minor', 'Moderate', 'Critical'], default: 'Minor' },
  description: { type: String, required: true },
  impact: { type: String, default: '' },
  remedialAction: { type: String, default: '' }
});

const validationSchema = new mongoose.Schema({
  reportNumber: { type: String, required: true, unique: true },
  pilotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pilot', required: true },
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' },
  proposalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  validatorName: { type: String, required: true, default: 'Dr. Rameshwar Naik' },
  validatorOrg: { type: String, required: true, default: 'Maharashtra State Innovation Society (MSInS) Quality Control Board' },
  coiDeclared: { type: Boolean, required: true, default: true },
  validationScope: {
    targetSites: { type: String, default: '3 District Hospitals (Pune, Nashik, Thane)' },
    sampleSize: { type: String, default: '14,280 Live OPD Patient Transactions' },
    periodCovered: { type: String, default: '75-Day Continuous Controlled Pilot Trial' }
  },
  kpiVerifications: [kpiVerificationSchema],
  milestoneAudits: [milestoneAuditSchema],
  securityAndComplianceAudit: {
    certInPassed: { type: Boolean, default: true },
    dpdpDataPrivacyPassed: { type: Boolean, default: true },
    vulnerabilityReport: { type: String, default: 'Zero critical/high vulnerabilities discovered during penetration testing.' },
    slaAchievedPct: { type: Number, default: 99.8 }
  },
  discrepanciesAndExceptions: [discrepancySchema],
  overallValidationScore: { type: Number, default: 94.6 },
  recommendation: {
    type: String,
    enum: [
      'Recommended for Statewide Scale-Up',
      'Recommended with Minor Conditions',
      'Requires Further Trial/Evidence',
      'Not Recommended for Procurement'
    ],
    default: 'Recommended for Statewide Scale-Up'
  },
  executiveSummary: { 
    type: String, 
    default: 'Independent field audit confirms 72% reduction in OPD wait times with 99.8% system availability and robust DPDP Act 2023 compliance.' 
  },
  certifiedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Validation', validationSchema);

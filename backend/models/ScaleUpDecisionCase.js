const mongoose = require('mongoose');

const scaleCriterionSchema = new mongoose.Schema({
  key: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  weight: { type: Number, default: 10 }, // percentage out of 100
  score: { type: Number, default: 0 }, // 0 to 100
  status: {
    type: String,
    enum: ['READY', 'READY_WITH_CONDITIONS', 'NOT_READY', 'INSUFFICIENT_EVIDENCE', 'NOT_APPLICABLE'],
    default: 'READY'
  },
  evidenceSource: { type: String, default: '' },
  reviewerComments: { type: String, default: '' }
}, { _id: false });

const procurementCriterionSchema = new mongoose.Schema({
  key: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  status: {
    type: String,
    enum: ['READY', 'READY_WITH_CONDITIONS', 'NOT_READY', 'NOT_APPLICABLE'],
    default: 'READY'
  },
  evidenceSource: { type: String, default: '' },
  reviewerComments: { type: String, default: '' }
}, { _id: false });

const conditionSchema = new mongoose.Schema({
  conditionId: { type: String, required: true },
  description: { type: String, required: true },
  owner: { type: String, required: true }, // e.g., 'HealthAI Solutions', 'District Health Dept'
  dueDate: { type: String, default: '' },
  isRequired: { type: Boolean, default: true },
  status: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'WAIVED', 'FAILED'],
    default: 'PENDING'
  },
  completedAt: { type: Date },
  notes: { type: String, default: '' }
});

const gateSchema = new mongoose.Schema({
  gateNumber: { type: Number, required: true },
  name: { type: String, required: true }, // e.g., 'Gate 1 — Independent Validation'
  status: {
    type: String,
    enum: ['PASSED', 'FAILED', 'PENDING', 'WAIVED'],
    default: 'PENDING'
  },
  verifiedBy: { type: String, default: '' },
  verifiedAt: { type: Date },
  notes: { type: String, default: '' },
  isMandatory: { type: Boolean, default: true }
}, { _id: false });

const milestoneSchema = new mongoose.Schema({
  milestoneNumber: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  plannedDate: { type: String, default: '' },
  owner: { type: String, default: '' },
  deliverables: { type: String, default: '' },
  acceptanceCriteria: { type: String, default: '' },
  status: {
    type: String,
    enum: ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED'],
    default: 'PLANNED'
  }
}, { _id: false });

const scaleRiskSchema = new mongoose.Schema({
  riskId: { type: String, required: true },
  category: {
    type: String,
    enum: ['Technical', 'Operational', 'Financial', 'Cybersecurity', 'Data', 'Legal', 'Compliance', 'Vendor', 'Adoption', 'Infrastructure', 'Scalability'],
    default: 'Technical'
  },
  description: { type: String, required: true },
  probability: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  impact: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  riskScore: { type: Number, default: 5 }, // 1-10
  mitigation: { type: String, default: '' },
  owner: { type: String, default: '' },
  status: { type: String, enum: ['Open', 'Mitigating', 'Resolved'], default: 'Open' }
}, { _id: false });

const scaleKPISchema = new mongoose.Schema({
  kpiId: { type: String, required: true },
  metricName: { type: String, required: true },
  pilotBaseline: { type: String, default: '' },
  pilotResult: { type: String, default: '' },
  scaleTarget: { type: String, required: true },
  currentMeasurement: { type: String, default: '' },
  status: {
    type: String,
    enum: ['ON_TRACK', 'AT_RISK', 'TARGET_ACHIEVED', 'BEHIND'],
    default: 'ON_TRACK'
  }
}, { _id: false });

const benefitProjectionSchema = new mongoose.Schema({
  metricName: { type: String, required: true },
  baseline: { type: String, default: '' },
  pilotResult: { type: String, default: '' },
  projectedScale: { type: String, required: true },
  assumption: { type: String, default: '' },
  calculationMethod: { type: String, default: '' },
  confidence: { type: String, default: 'High' }
}, { _id: false });

const deploymentSchema = new mongoose.Schema({
  deploymentId: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true }, // e.g., 'Pune District', 'Nagpur Medical College'
  targetUsers: { type: String, default: '' },
  budgetAllocated: { type: Number, default: 0 },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  owner: { type: String, default: '' },
  status: {
    type: String,
    enum: ['PLANNED', 'APPROVED', 'PREPARING', 'DEPLOYING', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'],
    default: 'PLANNED'
  },
  pauseReason: { type: String, default: '' },
  infrastructureStatus: { type: String, default: 'Ready' },
  kpiStatus: { type: String, default: 'On Track' },
  riskStatus: { type: String, default: 'Low Risk' },
  feedback: [{
    userGroup: { type: String, default: '' },
    rating: { type: Number, default: 5 },
    feedback: { type: String, default: '' },
    issues: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now }
  }]
});

const procurementReferenceSchema = new mongoose.Schema({
  referenceId: { type: String, required: true },
  pathway: {
    type: String,
    enum: ['GEM', 'GEM_STARTUP_RUNWAY', 'CPPP', 'STATE_EPROCUREMENT', 'TENDER', 'DIRECT_AUTHORIZED_PROCUREMENT', 'INNOVATION_PROCUREMENT', 'FRAMEWORK_AGREEMENT', 'OTHER'],
    default: 'GEM_STARTUP_RUNWAY'
  },
  marketplace: { type: String, default: 'Government e-Marketplace (GeM)' },
  sellerId: { type: String, default: '' },
  listingId: { type: String, default: '' },
  procurementRefNumber: { type: String, default: '' },
  tenderId: { type: String, default: '' },
  bidId: { type: String, default: '' },
  orderRef: { type: String, default: '' },
  publicationDate: { type: String, default: '' },
  submissionDeadline: { type: String, default: '' },
  externalStatus: { type: String, default: 'Listed on GeM Startup Runway' },
  awardRef: { type: String, default: '' },
  externalDocumentUrl: { type: String, default: '' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const scaleUpDecisionCaseSchema = new mongoose.Schema({
  decisionId: { type: String, required: true, unique: true, index: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  pilotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pilot', required: true },
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' },
  validationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Validation', required: true },

  status: {
    type: String,
    enum: [
      'DRAFT',
      'UNDER_REVIEW',
      'EVIDENCE_REQUIRED',
      'RECOMMENDATION_READY',
      'PENDING_APPROVAL',
      'APPROVED',
      'APPROVED_WITH_CONDITIONS',
      'RE_PILOT_REQUIRED',
      'REJECTED',
      'EXECUTION_IN_PROGRESS',
      'COMPLETED',
      'CANCELLED'
    ],
    default: 'DRAFT'
  },

  scaleReadiness: {
    categories: [scaleCriterionSchema],
    overallScore: { type: Number, default: 0 },
    assessedBy: { type: String, default: '' },
    assessedAt: { type: Date }
  },

  procurementReadiness: {
    criteria: [procurementCriterionSchema],
    overallStatus: {
      type: String,
      enum: ['READY', 'READY_WITH_CONDITIONS', 'NOT_READY', 'NOT_APPLICABLE'],
      default: 'READY'
    },
    pathwayRecommended: {
      type: String,
      enum: ['GEM', 'GEM_STARTUP_RUNWAY', 'CPPP', 'STATE_EPROCUREMENT', 'TENDER', 'DIRECT_AUTHORIZED_PROCUREMENT', 'INNOVATION_PROCUREMENT', 'FRAMEWORK_AGREEMENT', 'OTHER'],
      default: 'GEM_STARTUP_RUNWAY'
    },
    assessedBy: { type: String, default: '' },
    assessedAt: { type: Date }
  },

  recommendation: {
    decision: {
      type: String,
      enum: ['SCALE', 'PROCURE', 'SCALE_AND_PROCURE', 'EXTEND_PILOT', 'RE_PILOT', 'MODIFY_AND_RETEST', 'DO_NOT_PROCEED', 'PENDING'],
      default: 'PENDING'
    },
    rationale: { type: String, default: '' },
    risksConsidered: [{ type: String }],
    suggestedConditions: [{ type: String }],
    generatedBy: { type: String, default: 'GovInnovate Decision Intelligence Service' },
    generatedAt: { type: Date }
  },

  finalDecision: {
    decision: {
      type: String,
      enum: ['SCALE', 'PROCURE', 'SCALE_AND_PROCURE', 'EXTEND_PILOT', 'RE_PILOT', 'MODIFY_AND_RETEST', 'DO_NOT_PROCEED', null],
      default: null
    },
    rationale: { type: String, default: '' },
    decidedBy: { type: String, default: '' },
    decidedRole: { type: String, default: '' },
    decidedAt: { type: Date },
    isOverride: { type: Boolean, default: false },
    overrideReason: { type: String, default: '' }
  },

  conditions: [conditionSchema],
  gates: [gateSchema],

  scaleUpPlan: {
    targetScope: {
      type: String,
      enum: ['SAME_LOCATION', 'ADDITIONAL_FACILITIES', 'ADDITIONAL_DISTRICTS', 'MULTI_DISTRICT', 'STATEWIDE', 'MULTI_DEPARTMENT', 'STATEWIDE_MULTI_DEPARTMENT'],
      default: 'MULTI_DISTRICT'
    },
    targetGeography: [{ type: String }],
    targetDepartments: [{ type: String }],
    targetUsers: { type: String, default: '' },
    deploymentTimeline: { type: String, default: '6 Months (Q3-Q4 2026)' },
    infrastructureRequirements: { type: String, default: '' },
    supportModel: { type: String, default: 'Tier-1 District Helpdesk + 24/7 OEM SLA' },
    trainingPlan: { type: String, default: 'District-level training for staff & administrators' },
    procurementRoute: { type: String, default: 'GeM Startup Runway Direct Sanction' },
    securityRequirements: { type: String, default: 'CERT-In audited edge gateways, DPDP 2023 encryption' },
    budgetSummary: {
      infrastructure: { type: Number, default: 0 },
      software: { type: Number, default: 0 },
      licensing: { type: Number, default: 0 },
      implementation: { type: Number, default: 0 },
      training: { type: Number, default: 0 },
      support: { type: Number, default: 0 },
      security: { type: Number, default: 0 },
      maintenance: { type: Number, default: 0 },
      operations: { type: Number, default: 0 },
      contingency: { type: Number, default: 0 },
      totalBudget: { type: Number, default: 0 },
      budgetApproved: { type: Boolean, default: false },
      financeApprover: { type: String, default: '' },
      financeApprovalDate: { type: Date }
    },
    benefitProjections: [benefitProjectionSchema],
    costEffectiveness: {
      pilotCost: { type: Number, default: 0 },
      projectedScaleCost: { type: Number, default: 0 },
      costPerUser: { type: Number, default: 0 },
      costPerOutcome: { type: String, default: '' },
      summary: { type: String, default: '' }
    },
    milestones: [milestoneSchema],
    risks: [scaleRiskSchema],
    kpis: [scaleKPISchema],
    governance: { type: String, default: 'Department Steering Committee Oversight' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },

  deployments: [deploymentSchema],
  procurementReferences: [procurementReferenceSchema],

  decisionHistory: [{
    version: { type: Number, default: 1 },
    decisionType: { type: String, default: 'RECOMMENDATION' }, // 'RECOMMENDATION', 'AUTHORIZED_DECISION', 'OVERRIDE', 'RE_PILOT', 'MODIFICATION'
    decision: { type: String, required: true },
    rationale: { type: String, default: '' },
    actor: { type: String, required: true },
    role: { type: String, default: 'Government Officer' },
    timestamp: { type: Date, default: Date.now },
    conditionsSnapshot: [mongoose.Schema.Types.Mixed],
    overrideReason: { type: String, default: '' }
  }],

  auditTrail: [{
    action: { type: String, required: true },
    actor: { type: String, required: true },
    role: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
    details: { type: String, default: '' },
    previousState: { type: String, default: '' },
    newState: { type: String, default: '' },
    reason: { type: String, default: '' }
  }],

  createdBy: { type: String, default: 'State Innovation Desk' },
  assignedReviewers: [{ type: String }],
  decisionMaker: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScaleUpDecisionCase', scaleUpDecisionCaseSchema);

const express = require('express');
const router = express.Router();
const ScaleUpDecisionCase = require('../models/ScaleUpDecisionCase');
const Pilot = require('../models/Pilot');
const Challenge = require('../models/Challenge');
const Startup = require('../models/Startup');
const Proposal = require('../models/Proposal');
const Evaluation = require('../models/Evaluation');
const Contract = require('../models/Contract');
const Validation = require('../models/Validation');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const marketplaceService = require('../services/marketplaceService');

// Default 10 Scale Readiness Criteria
const DEFAULT_SCALE_CRITERIA = [
  { key: 'technical_scalability', name: 'Technical Scalability', description: 'System capability to handle 10x transaction throughput across multiple district nodes with <100ms latency', weight: 12, score: 90, status: 'READY', evidenceSource: 'Phase 7 Telemetry Logs & Stress Test' },
  { key: 'operational_readiness', name: 'Operational Readiness', description: 'Department workflows, SOPs, and ground staff training capacity across districts', weight: 10, score: 85, status: 'READY', evidenceSource: 'Phase 5 Field Pilot Logs' },
  { key: 'kpi_achievement', name: 'KPI Target Achievement', description: 'Validated baseline improvement in key public service metrics (>70% wait time reduction)', weight: 15, score: 95, status: 'READY', evidenceSource: 'Phase 7 Independent Validation Report' },
  { key: 'user_adoption', name: 'User Adoption & Satisfaction', description: 'Beneficiary and frontline officer adoption score (>85% positive satisfaction rating)', weight: 10, score: 88, status: 'READY', evidenceSource: 'Pilot User Telemetry & Feedback' },
  { key: 'security_readiness', name: 'Cybersecurity & DPDP Compliance', description: 'Zero critical vulnerabilities, CERT-In compliance, and DPDP Act 2023 data privacy safeguards', weight: 15, score: 98, status: 'READY', evidenceSource: 'Phase 7 Security & Compliance Audit' },
  { key: 'financial_sustainability', name: 'Financial Sustainability', description: 'Cost-benefit viability, unit economics, and recurring maintenance affordability', weight: 10, score: 82, status: 'READY', evidenceSource: 'Phase 6 Treasury & Cost Review' },
  { key: 'support_capability', name: 'Support & Maintenance Capacity', description: 'Startup Tier-1 and Tier-2 helpdesk capability with 24h SLA for hardware/software issues', weight: 8, score: 80, status: 'READY_WITH_CONDITIONS', evidenceSource: 'Startup Support Protocol' },
  { key: 'infrastructure_readiness', name: 'Host District Infrastructure Readiness', description: 'Server rack space, power backup, and LAN connectivity at intended deployment sites', weight: 8, score: 85, status: 'READY', evidenceSource: 'District Site Readiness Survey' },
  { key: 'risk_profile', name: 'Risk & Disaster Recovery Profile', description: 'Mitigation plans for technical failovers, operational bottlenecks, and vendor dependencies', weight: 7, score: 88, status: 'READY', evidenceSource: 'Phase 5 & 7 Risk Registers' },
  { key: 'procurement_readiness', name: 'Procurement & Legal Alignment', description: 'Alignment with GFR Rule 173(i), GeM Startup Runway listing, and DPIIT recognized status', weight: 5, score: 92, status: 'READY', evidenceSource: 'DPIIT & GeM Registry Verification' }
];

// Default Procurement Readiness Criteria
const DEFAULT_PROCUREMENT_CRITERIA = [
  { key: 'approved_scope', name: 'Approved Scope & Requirements', description: 'Clearly defined statewide functional specifications and deliverables schedule', status: 'READY', evidenceSource: 'Phase 5 Pilot Final Specification' },
  { key: 'budget_availability', name: 'Budget Availability & Head of Account', description: 'Identified state innovation budget / department capital expenditure sanction', status: 'READY', evidenceSource: 'State Finance Department Allocation' },
  { key: 'pathway_identified', name: 'Procurement Pathway Identified', description: 'GeM Startup Runway / Direct State Innovation Sanction under GFR 173(i)', status: 'READY', evidenceSource: 'Maharashtra Innovation Procurement Guidelines' },
  { key: 'statutory_exemptions', name: 'Prior Turnover & EMD Exemptions', description: 'DPIIT startup recognized certificate verified for mandatory GFR turnover waiver', status: 'READY', evidenceSource: 'DPIIT Startup India Portal' },
  { key: 'legal_terms', name: 'Data Rights & Intellectual Property Terms', description: '100% Government data ownership and Startup proprietary AI protection confirmed', status: 'READY', evidenceSource: 'Phase 6 Master Contract Terms' },
  { key: 'certin_clearance', name: 'Security & Vulnerability Audit Clearance', description: 'CERT-In empaneled auditor clearance certificate with zero open CVEs', status: 'READY', evidenceSource: 'Phase 7 IVR Security Audit' },
  { key: 'vendor_readiness', name: 'Vendor Bank & Treasury Readiness', description: 'Validated bank details, PAN, GSTIN, and e-Kosh treasury disbursement profile', status: 'READY', evidenceSource: 'Phase 6 Treasury Disbursed Records' }
];

// Helper: Calculate Weighted Scale Readiness Score
function calculateScaleReadiness(categories = []) {
  let totalWeight = 0;
  let weightedSum = 0;
  categories.forEach(c => {
    const w = Number(c.weight) || 0;
    const s = Number(c.score) || 0;
    totalWeight += w;
    weightedSum += (w * s);
  });
  if (totalWeight === 0) return 0;
  return Math.round((weightedSum / totalWeight) * 10) / 10;
}

// -------------------------------------------------------------
// GET /api/scale-decisions/stats - Aggregate summary stats
// -------------------------------------------------------------
router.get('/stats', async (req, res) => {
  try {
    const cases = await ScaleUpDecisionCase.find();
    const stats = {
      totalCases: cases.length,
      pendingApproval: cases.filter(c => c.status === 'PENDING_APPROVAL' || c.status === 'RECOMMENDATION_READY').length,
      approved: cases.filter(c => c.status === 'APPROVED' || c.status === 'APPROVED_WITH_CONDITIONS' || c.status === 'EXECUTION_IN_PROGRESS' || c.status === 'COMPLETED').length,
      rePilot: cases.filter(c => c.status === 'RE_PILOT_REQUIRED').length,
      rejected: cases.filter(c => c.status === 'REJECTED' || c.status === 'CANCELLED').length,
      activeDeploymentsCount: cases.reduce((acc, c) => acc + (c.deployments ? c.deployments.filter(d => d.status === 'ACTIVE' || d.status === 'DEPLOYING').length : 0), 0),
      totalSanctionedBudget: cases.reduce((acc, c) => acc + (c.scaleUpPlan?.budgetSummary?.totalBudget || 0), 0)
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// GET /api/scale-decisions - List all Phase 8 Decision Cases
// -------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const { status, challengeId, startupId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (challengeId) filter.challengeId = challengeId;
    if (startupId) filter.startupId = startupId;

    const cases = await ScaleUpDecisionCase.find(filter)
      .populate('challengeId')
      .populate('startupId')
      .populate('pilotId')
      .populate('contractId')
      .populate('validationId')
      .sort({ createdAt: -1 });

    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// GET /api/scale-decisions/:id - Get single decision case
// -------------------------------------------------------------
router.get('/:id', async (req, res) => {
  try {
    const decisionCase = await ScaleUpDecisionCase.findById(req.params.id)
      .populate('challengeId')
      .populate('startupId')
      .populate('pilotId')
      .populate('contractId')
      .populate('validationId');

    if (!decisionCase) {
      return res.status(404).json({ error: 'Scale-Up Decision Case not found' });
    }
    res.json(decisionCase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// GET /api/scale-decisions/:id/evidence - Aggregated Phase 2-7 Evidence View
// -------------------------------------------------------------
router.get('/:id/evidence', async (req, res) => {
  try {
    const decisionCase = await ScaleUpDecisionCase.findById(req.params.id);
    if (!decisionCase) return res.status(404).json({ error: 'Decision case not found' });

    const [challenge, startup, pilot, contract, validation] = await Promise.all([
      Challenge.findById(decisionCase.challengeId),
      Startup.findById(decisionCase.startupId),
      Pilot.findById(decisionCase.pilotId).populate('proposalId'),
      Contract.findById(decisionCase.contractId),
      Validation.findById(decisionCase.validationId)
    ]);

    const proposal = pilot?.proposalId;
    const evaluations = proposal ? await Evaluation.find({ proposalId: proposal._id }) : [];

    const aggregatedEvidence = {
      decisionCaseId: decisionCase._id,
      decisionId: decisionCase.decisionId,
      status: decisionCase.status,
      phase2_discovery: {
        startupName: startup?.name,
        dpiitNumber: startup?.dpiitNumber,
        sector: startup?.sector,
        stage: startup?.stage,
        readinessLevel: startup?.readinessLevel
      },
      phase3_eligibility: {
        screeningStatus: proposal?.eligibilityScreening?.screeningStatus || 'Eligible',
        automatedChecks: proposal?.eligibilityScreening?.automatedChecks || {
          dpiitVerified: true,
          digilockerDocVerified: true,
          gfrTurnoverExemptionApplied: true,
          emdDepositExempted: true
        }
      },
      phase4_evaluation: {
        aggregateScore: proposal?.evaluationSummary?.aggregateScore || 92.5,
        evaluationsCount: evaluations.length,
        evaluatorFindings: evaluations.map(e => ({
          evaluator: e.evaluatorName,
          role: e.evaluatorRole,
          score: e.weightedTotalScore,
          coiDeclared: e.coiDeclared,
          comments: e.comments
        }))
      },
      phase5_pilot: {
        pilotTitle: pilot?.pilotTitle,
        location: pilot?.location,
        budget: pilot?.totalBudget,
        pilotSuccessScore: pilot?.pilotSuccessScore,
        kpiResults: pilot?.kpiTracking || [],
        milestonesAchieved: (pilot?.milestones || []).filter(m => m.status === 'Paid' || m.status === 'Approved'),
        risksTracked: pilot?.riskManagement || []
      },
      phase6_contract: {
        contractNumber: contract?.contractNumber,
        totalValue: contract?.totalValue,
        status: contract?.status,
        slaUptime: contract?.slaTerms?.uptimeSlaPct || 99.5,
        disbursedMilestones: (contract?.milestones || []).filter(m => m.status === 'Disbursed')
      },
      phase7_validation: {
        reportNumber: validation?.reportNumber,
        validatorName: validation?.validatorName,
        validatorOrg: validation?.validatorOrg,
        overallValidationScore: validation?.overallValidationScore,
        recommendation: validation?.recommendation,
        verifiedKpis: validation?.kpiVerifications || [],
        securityAudit: validation?.securityAndComplianceAudit || {},
        discrepancies: validation?.discrepanciesAndExceptions || []
      }
    };

    res.json(aggregatedEvidence);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// POST /api/scale-decisions - Initialize Decision Case for Validated Pilot
// -------------------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const { pilotId, actorName, actorRole } = req.body;
    if (!pilotId) return res.status(400).json({ error: 'pilotId is required' });

    const pilot = await Pilot.findById(pilotId).populate('proposalId');
    if (!pilot) return res.status(404).json({ error: 'Pilot not found' });

    // Step 3 Check: Must be validated in Phase 7
    let validation = await Validation.findOne({ pilotId });
    if (!validation && pilot.validationStatus !== 'Validated' && pilot.validationStatus !== 'Partially Validated') {
      return res.status(400).json({
        error: 'Pilot is not eligible for Phase 8. Phase 7 Independent Validation must be completed first.'
      });
    }

    // Find or link Contract
    let contract = await Contract.findOne({ pilotId });
    if (!contract && pilot.proposalId) {
      contract = await Contract.findOne({ proposalId: pilot.proposalId._id || pilot.proposalId });
    }

    const decisionId = `SUDC-MH-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const initialScore = calculateScaleReadiness(DEFAULT_SCALE_CRITERIA);

    const newCase = new ScaleUpDecisionCase({
      decisionId,
      challengeId: pilot.challengeId,
      startupId: pilot.startupId,
      pilotId: pilot._id,
      contractId: contract ? contract._id : null,
      validationId: validation ? validation._id : pilot._id,
      status: 'UNDER_REVIEW',
      scaleReadiness: {
        categories: DEFAULT_SCALE_CRITERIA,
        overallScore: initialScore,
        assessedBy: actorName || 'Government Innovation Desk',
        assessedAt: new Date()
      },
      procurementReadiness: {
        criteria: DEFAULT_PROCUREMENT_CRITERIA,
        overallStatus: 'READY',
        pathwayRecommended: 'GEM_STARTUP_RUNWAY',
        assessedBy: actorName || 'State Procurement Officer',
        assessedAt: new Date()
      },
      recommendation: {
        decision: 'SCALE_AND_PROCURE',
        rationale: `Pilot "${pilot.pilotTitle}" scored ${pilot.pilotSuccessScore || 92}/100. Independent validation certified successful KPI delivery. Recommended for multi-district scale-up via GeM Startup Runway.`,
        risksConsidered: ['District infrastructure variability', 'Hardware calibration in rural zones'],
        suggestedConditions: ['Establish Tier-1 local helpdesk in each recipient district', 'Submit updated CERT-In recertification before statewide rollout'],
        generatedBy: 'GovInnovate Decision Engine',
        generatedAt: new Date()
      },
      gates: [
        { gateNumber: 1, name: 'Gate 1 — Independent Validation Passed', status: 'PASSED', verifiedBy: 'Quality Control Board', verifiedAt: new Date(), isMandatory: true, notes: 'IVR Score > 90/100' },
        { gateNumber: 2, name: 'Gate 2 — CERT-In & DPDP 2023 Security Audit', status: 'PASSED', verifiedBy: 'Cybersecurity Desk', verifiedAt: new Date(), isMandatory: true, notes: 'Zero critical CVEs' },
        { gateNumber: 3, name: 'Gate 3 — GeM / Procurement Pathway Exemption Clearance', status: 'PASSED', verifiedBy: 'Procurement Cell', verifiedAt: new Date(), isMandatory: true, notes: 'DPIIT GFR 173(i) verified' },
        { gateNumber: 4, name: 'Gate 4 — Multi-District Scale Budget Sanction', status: 'PENDING', verifiedBy: '', isMandatory: true, notes: 'Awaiting formal treasury code' },
        { gateNumber: 5, name: 'Gate 5 — District Hospital / Site Operational Signoff', status: 'PENDING', verifiedBy: '', isMandatory: false, notes: 'Host district readiness' },
        { gateNumber: 6, name: 'Gate 6 — Full Scale Rollout Deployment Clearance', status: 'PENDING', verifiedBy: '', isMandatory: true, notes: 'Final authorization required' }
      ],
      conditions: [
        { conditionId: 'COND-1', description: 'Establish district-level 24/7 technical support desk SLA', owner: 'Startup', dueDate: '2026-09-30', isRequired: true, status: 'PENDING', notes: '' },
        { conditionId: 'COND-2', description: 'Execute host district site infrastructure readiness audit', owner: 'Department Officer', dueDate: '2026-10-15', isRequired: true, status: 'IN_PROGRESS', notes: '' }
      ],
      scaleUpPlan: {
        targetScope: 'ADDITIONAL_DISTRICTS',
        targetGeography: ['Pune', 'Nashik', 'Chhatrapati Sambhajinagar', 'Thane', 'Nagpur'],
        targetDepartments: ['Department of Public Health', 'Medical Education Department'],
        targetUsers: '1.2 Million Patients across 12 Civil Hospitals',
        deploymentTimeline: '6 Months (Q3-Q4 2026)',
        infrastructureRequirements: '48 Edge AI Kiosks, 24 Central Display Nodes, Dual-WAN Router',
        supportModel: 'Tier-1 District Helpdesk + 24/7 OEM Support SLA',
        trainingPlan: 'Train 250 Medical Officers and 600 Hospital Registration Staff',
        procurementRoute: 'GeM Startup Runway Direct Sanction under GFR Rule 173(i)',
        securityRequirements: 'AES-256 local encryption, CERT-In biannual audit, DPDP Act 2023 compliance',
        budgetSummary: {
          infrastructure: 12000000,
          software: 8000000,
          licensing: 4000000,
          implementation: 5000000,
          training: 2000000,
          support: 3000000,
          security: 2000000,
          maintenance: 4000000,
          operations: 3000000,
          contingency: 2000000,
          totalBudget: 45000000,
          budgetApproved: true,
          financeApprover: 'Treasury & Finance Cell, Govt of Maharashtra',
          financeApprovalDate: new Date()
        },
        benefitProjections: [
          { metricName: 'Average Patient Waiting Time', baseline: '210 minutes', pilotResult: '38 minutes', projectedScale: '< 30 minutes', assumption: 'Full token integration across 12 hospitals', calculationMethod: 'Hospital queue simulation model', confidence: 'High' },
          { metricName: 'Annual OPD Transaction Capacity', baseline: '150,000 / hospital', pilotResult: '380,000 / hospital', projectedScale: '> 450,000 / hospital', assumption: 'Automated triage and fast-track counters', calculationMethod: 'Live pilot throughput extrapolation', confidence: 'High' }
        ],
        costEffectiveness: {
          pilotCost: pilot.totalBudget || 1420000,
          projectedScaleCost: 45000000,
          costPerUser: 37.5,
          costPerOutcome: '₹37.50 per patient vs ₹180.00 conventional queue management cost',
          summary: '79.1% cost efficiency improvement over traditional physical triage systems.'
        },
        milestones: [
          { milestoneNumber: 1, name: 'Multi-District Procurement Sanction & GeM PO', description: 'Issuance of purchase order on GeM Startup Runway', plannedDate: '2026-09-15', owner: 'State Procurement Officer', deliverables: 'GeM Order Reference', acceptanceCriteria: 'Treasury Sanction Order', status: 'PLANNED' },
          { milestoneNumber: 2, name: 'Phase 1 Hardware & Gateway Rollout', description: 'Deployment of 24 kiosks across Pune, Nashik, Sambhajinagar', plannedDate: '2026-10-30', owner: 'Startup', deliverables: 'Hardware Installation Certificate', acceptanceCriteria: '100% Kiosks Online', status: 'PLANNED' },
          { milestoneNumber: 3, name: 'Phase 2 Statewide Rollout & HMIS Integration', description: 'Integration with state HMIS across all 12 target civil hospitals', plannedDate: '2026-12-15', owner: 'Startup & Health IT Desk', deliverables: 'HMIS Telemetry Logs', acceptanceCriteria: 'Zero Data Loss SLA', status: 'PLANNED' }
        ],
        risks: [
          { riskId: 'RSK-1', category: 'Infrastructure', description: 'Unstable LAN/power backup in remote district civil hospitals', probability: 'Medium', impact: 'High', riskScore: 6, mitigation: 'Provide 4-hour internal battery backup & 4G/5G dual-SIM fallback dongle', owner: 'Startup Technical Lead', status: 'Mitigating' },
          { riskId: 'RSK-2', category: 'Adoption', description: 'Resistance from local registration clerks to digital token kiosks', probability: 'Low', impact: 'Medium', riskScore: 4, mitigation: 'Conduct mandatory incentive workshops and localized Marathi UI tutorials', owner: 'District Health Officer', status: 'Open' }
        ],
        kpis: [
          { kpiId: 'KPI-1', metricName: 'Average OPD Triage Wait Time', pilotBaseline: '210 Mins', pilotResult: '38 Mins', scaleTarget: '< 30 Mins', currentMeasurement: '38 Mins', status: 'ON_TRACK' },
          { kpiId: 'KPI-2', metricName: 'System Availability Uptime SLA', pilotBaseline: '95.0%', pilotResult: '99.8%', scaleTarget: '> 99.5%', currentMeasurement: '99.8%', status: 'TARGET_ACHIEVED' }
        ]
      },
      deployments: [
        {
          deploymentId: 'DEP-PUNE-01',
          department: 'Department of Public Health',
          location: 'Pune District Civil Hospital, Aundh',
          targetUsers: '250,000 OPD Patients / Year',
          budgetAllocated: 9000000,
          startDate: '2026-09-15',
          endDate: '2026-12-31',
          owner: 'District Civil Surgeon, Pune',
          status: 'ACTIVE',
          infrastructureStatus: 'Ready (10 Kiosks Online)',
          kpiStatus: 'On Track (Avg wait 24 mins)',
          riskStatus: 'Low Risk',
          feedback: [
            { userGroup: 'Hospital Patients', rating: 5, feedback: 'Queue time reduced significantly; Marathi audio prompts are very clear.', issues: '', submittedAt: new Date() }
          ]
        },
        {
          deploymentId: 'DEP-NASHIK-02',
          department: 'Department of Public Health',
          location: 'Nashik General Hospital',
          targetUsers: '200,000 OPD Patients / Year',
          budgetAllocated: 8500000,
          startDate: '2026-10-01',
          endDate: '2027-01-31',
          owner: 'District Medical Officer, Nashik',
          status: 'PREPARING',
          infrastructureStatus: 'LAN Cabling In Progress',
          kpiStatus: 'Pending Go-Live',
          riskStatus: 'Low Risk',
          feedback: []
        }
      ],
      procurementReferences: [
        {
          referenceId: 'REF-GEM-2026-001',
          pathway: 'GEM_STARTUP_RUNWAY',
          marketplace: 'Government e-Marketplace (GeM)',
          sellerId: 'GEM-SELLER-MH-HEALTHAI',
          listingId: 'GEM-SR-2026-HEALTH-0941',
          procurementRefNumber: 'MH-HEALTH-SCALE-2026-088',
          orderRef: 'GEM-PO-2026-MH-449102',
          externalStatus: 'Order Placed & Sanction Verified',
          publicationDate: '2026-09-01',
          submissionDeadline: '2026-09-30',
          notes: 'Procured under GFR Rule 173(i) DPIIT innovation exemption'
        }
      ],
      decisionHistory: [
        {
          version: 1,
          decisionType: 'RECOMMENDATION',
          decision: 'SCALE_AND_PROCURE',
          rationale: 'Initial case creation based on certified Phase 7 Independent Validation Report.',
          actor: actorName || 'Innovation Screening Desk',
          role: actorRole || 'Government Officer',
          timestamp: new Date()
        }
      ],
      auditTrail: [
        {
          action: 'SCALE_DECISION_CREATED',
          actor: actorName || 'Government Admin',
          role: actorRole || 'Government Admin',
          timestamp: new Date(),
          details: `Created Phase 8 Decision Case ${decisionId} for pilot "${pilot.pilotTitle}"`,
          previousState: 'PILOT_VALIDATED',
          newState: 'UNDER_REVIEW',
          reason: 'Independent Validation certified successfully.'
        }
      ],
      createdBy: actorName || 'State Innovation Desk'
    });

    await newCase.save();

    await AuditLog.create({
      action: 'SCALE_DECISION_CREATED',
      actorRole: actorRole || 'Government Admin',
      actorName: actorName || 'Government Admin',
      details: `Initialized Phase 8 Scale-Up & Procurement Decision Case ${decisionId}`,
      entityId: newCase._id.toString()
    });

    await Notification.create({
      recipientRole: 'Government Admin',
      title: 'Phase 8 Scale Decision Case Initiated',
      message: `Scale-Up & Procurement Decision Case ${decisionId} is ready for review and authorization.`,
      type: 'ScaleUp',
      entityId: newCase._id.toString()
    });

    res.status(201).json(newCase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// POST /api/scale-decisions/:id/readiness - Update Scale Readiness Assessment
// -------------------------------------------------------------
router.post('/:id/readiness', async (req, res) => {
  try {
    const { categories, actorName, reviewerComments } = req.body;
    const decisionCase = await ScaleUpDecisionCase.findById(req.params.id);
    if (!decisionCase) return res.status(404).json({ error: 'Case not found' });

    if (categories && Array.isArray(categories)) {
      decisionCase.scaleReadiness.categories = categories;
      decisionCase.scaleReadiness.overallScore = calculateScaleReadiness(categories);
    }
    decisionCase.scaleReadiness.assessedBy = actorName || 'Readiness Review Committee';
    decisionCase.scaleReadiness.assessedAt = new Date();
    decisionCase.updatedAt = new Date();

    decisionCase.auditTrail.push({
      action: 'READINESS_ASSESSED',
      actor: actorName || 'Reviewer',
      role: 'Scale Readiness Reviewer',
      timestamp: new Date(),
      details: `Updated Scale Readiness Assessment. Overall Score: ${decisionCase.scaleReadiness.overallScore}/100.`,
      previousState: decisionCase.status,
      newState: decisionCase.status,
      reason: reviewerComments || 'Completed 10-point scale readiness assessment.'
    });

    await decisionCase.save();

    await AuditLog.create({
      action: 'READINESS_ASSESSED',
      actorRole: 'Scale Readiness Reviewer',
      actorName: actorName || 'Reviewer',
      details: `Evaluated Scale Readiness for Case ${decisionCase.decisionId}: Score ${decisionCase.scaleReadiness.overallScore}/100`,
      entityId: decisionCase._id.toString()
    });

    res.json(decisionCase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// POST /api/scale-decisions/:id/procurement-readiness - Update Procurement Readiness
// -------------------------------------------------------------
router.post('/:id/procurement-readiness', async (req, res) => {
  try {
    const { criteria, overallStatus, pathwayRecommended, actorName, notes } = req.body;
    const decisionCase = await ScaleUpDecisionCase.findById(req.params.id);
    if (!decisionCase) return res.status(404).json({ error: 'Case not found' });

    if (criteria && Array.isArray(criteria)) {
      decisionCase.procurementReadiness.criteria = criteria;
    }
    if (overallStatus) decisionCase.procurementReadiness.overallStatus = overallStatus;
    if (pathwayRecommended) decisionCase.procurementReadiness.pathwayRecommended = pathwayRecommended;
    decisionCase.procurementReadiness.assessedBy = actorName || 'Procurement Officer';
    decisionCase.procurementReadiness.assessedAt = new Date();
    decisionCase.updatedAt = new Date();

    decisionCase.auditTrail.push({
      action: 'PROCUREMENT_READINESS_ASSESSED',
      actor: actorName || 'Procurement Officer',
      role: 'Procurement Officer',
      timestamp: new Date(),
      details: `Procurement readiness assessed as ${decisionCase.procurementReadiness.overallStatus} via pathway ${decisionCase.procurementReadiness.pathwayRecommended}`,
      previousState: decisionCase.status,
      newState: decisionCase.status,
      reason: notes || 'Procurement and statutory review completed.'
    });

    await decisionCase.save();

    res.json(decisionCase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// POST /api/scale-decisions/:id/recommend - Generate & Save Recommendation
// -------------------------------------------------------------
router.post('/:id/recommend', async (req, res) => {
  try {
    const { decision, rationale, risksConsidered, suggestedConditions, actorName } = req.body;
    const decisionCase = await ScaleUpDecisionCase.findById(req.params.id);
    if (!decisionCase) return res.status(404).json({ error: 'Case not found' });

    decisionCase.recommendation = {
      decision: decision || 'SCALE_AND_PROCURE',
      rationale: rationale || 'Recommendation generated based on finalized evidence from Phases 2-7.',
      risksConsidered: risksConsidered || [],
      suggestedConditions: suggestedConditions || [],
      generatedBy: actorName || 'GovInnovate Decision Intelligence Service',
      generatedAt: new Date()
    };
    decisionCase.status = 'RECOMMENDATION_READY';
    decisionCase.updatedAt = new Date();

    decisionCase.decisionHistory.push({
      version: decisionCase.decisionHistory.length + 1,
      decisionType: 'RECOMMENDATION',
      decision: decisionCase.recommendation.decision,
      rationale: decisionCase.recommendation.rationale,
      actor: actorName || 'Evaluation & Steering Committee',
      role: 'Committee Chair',
      timestamp: new Date()
    });

    decisionCase.auditTrail.push({
      action: 'RECOMMENDATION_CREATED',
      actor: actorName || 'Steering Committee',
      role: 'Committee Chair',
      timestamp: new Date(),
      details: `Generated recommendation: ${decisionCase.recommendation.decision}`,
      previousState: 'UNDER_REVIEW',
      newState: 'RECOMMENDATION_READY',
      reason: decisionCase.recommendation.rationale
    });

    await decisionCase.save();

    res.json(decisionCase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// POST /api/scale-decisions/:id/approve - Final Authorized Decision
// -------------------------------------------------------------
router.post('/:id/approve', async (req, res) => {
  try {
    const {
      decision, // 'SCALE', 'PROCURE', 'SCALE_AND_PROCURE', 'EXTEND_PILOT', 'RE_PILOT', 'MODIFY_AND_RETEST', 'DO_NOT_PROCEED'
      rationale,
      conditions,
      actorName,
      actorRole
    } = req.body;

    if (!decision) return res.status(400).json({ error: 'Decision is required' });
    if (!rationale) return res.status(400).json({ error: 'Mandatory decision rationale is required' });

    const decisionCase = await ScaleUpDecisionCase.findById(req.params.id);
    if (!decisionCase) return res.status(404).json({ error: 'Case not found' });

    const previousStatus = decisionCase.status;
    const isOverride = decisionCase.recommendation?.decision && (decision !== decisionCase.recommendation.decision);

    // Map decision to status
    let newStatus = 'APPROVED';
    if (decision === 'RE_PILOT' || decision === 'EXTEND_PILOT') {
      newStatus = 'RE_PILOT_REQUIRED';
    } else if (decision === 'DO_NOT_PROCEED' || decision === 'MODIFY_AND_RETEST') {
      newStatus = 'REJECTED';
    } else if (conditions && conditions.length > 0) {
      newStatus = 'APPROVED_WITH_CONDITIONS';
    }

    decisionCase.status = newStatus;
    decisionCase.finalDecision = {
      decision,
      rationale,
      decidedBy: actorName || 'Authorized State Decision Maker',
      decidedRole: actorRole || 'Secretary / Head of Department',
      decidedAt: new Date(),
      isOverride: Boolean(isOverride),
      overrideReason: isOverride ? (req.body.overrideReason || 'Authorized decision maker administrative override') : ''
    };

    if (conditions && Array.isArray(conditions)) {
      decisionCase.conditions = conditions;
    }

    // Append to immutable decision history
    decisionCase.decisionHistory.push({
      version: decisionCase.decisionHistory.length + 1,
      decisionType: isOverride ? 'OVERRIDE' : 'AUTHORIZED_DECISION',
      decision,
      rationale,
      actor: actorName || 'Authorized Decision Maker',
      role: actorRole || 'Head of Department',
      timestamp: new Date(),
      conditionsSnapshot: decisionCase.conditions,
      overrideReason: isOverride ? decisionCase.finalDecision.overrideReason : ''
    });

    decisionCase.auditTrail.push({
      action: isOverride ? 'DECISION_OVERRIDDEN' : 'DECISION_APPROVED',
      actor: actorName || 'Authorized Decision Maker',
      role: actorRole || 'Head of Department',
      timestamp: new Date(),
      details: `Executed authorized decision: ${decision} (Status: ${newStatus}). ${isOverride ? 'OVERRIDE: ' + decisionCase.finalDecision.overrideReason : ''}`,
      previousState: previousStatus,
      newState: newStatus,
      reason: rationale
    });

    decisionCase.updatedAt = new Date();
    await decisionCase.save();

    // Notify Startup & Department
    await Notification.create({
      recipientRole: 'Startup Admin',
      title: `Scale-Up & Procurement Decision Finalized: ${decision}`,
      message: `Government of Maharashtra has issued decision "${decision}" for your solution. Status: ${newStatus}.`,
      type: 'ScaleUp',
      entityId: decisionCase._id.toString()
    });

    await AuditLog.create({
      action: 'DECISION_APPROVED',
      actorRole: actorRole || 'Government Admin',
      actorName: actorName || 'Authorized Decision Maker',
      details: `Finalized Phase 8 Decision for Case ${decisionCase.decisionId}: ${decision} (${newStatus})`,
      entityId: decisionCase._id.toString()
    });

    res.json(decisionCase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// POST /api/scale-decisions/:id/conditions - Add / Update Conditions
// -------------------------------------------------------------
router.post('/:id/conditions', async (req, res) => {
  try {
    const { description, owner, dueDate, isRequired, actorName } = req.body;
    if (!description) return res.status(400).json({ error: 'Condition description is required' });

    const decisionCase = await ScaleUpDecisionCase.findById(req.params.id);
    if (!decisionCase) return res.status(404).json({ error: 'Case not found' });

    const conditionId = `COND-${decisionCase.conditions.length + 1}`;
    decisionCase.conditions.push({
      conditionId,
      description,
      owner: owner || 'Startup',
      dueDate: dueDate || '',
      isRequired: isRequired !== undefined ? isRequired : true,
      status: 'PENDING'
    });

    decisionCase.auditTrail.push({
      action: 'CONDITION_CREATED',
      actor: actorName || 'Government Officer',
      role: 'Officer',
      timestamp: new Date(),
      details: `Added condition ${conditionId}: ${description} (Owner: ${owner})`,
      previousState: decisionCase.status,
      newState: decisionCase.status,
      reason: 'Requirement for scale execution clearance.'
    });

    await decisionCase.save();
    res.json(decisionCase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// PATCH /api/scale-decisions/:id/conditions/:condId - Update condition status
// -------------------------------------------------------------
router.patch('/:id/conditions/:condId', async (req, res) => {
  try {
    const { status, notes, actorName } = req.body;
    const decisionCase = await ScaleUpDecisionCase.findById(req.params.id);
    if (!decisionCase) return res.status(404).json({ error: 'Case not found' });

    const cond = decisionCase.conditions.find(c => c.conditionId === req.params.condId || c._id.toString() === req.params.condId);
    if (!cond) return res.status(404).json({ error: 'Condition not found' });

    const oldStatus = cond.status;
    cond.status = status;
    if (notes) cond.notes = notes;
    if (status === 'COMPLETED') cond.completedAt = new Date();

    decisionCase.auditTrail.push({
      action: 'CONDITION_UPDATED',
      actor: actorName || 'Reviewer',
      role: 'Officer',
      timestamp: new Date(),
      details: `Updated condition ${cond.conditionId} status from ${oldStatus} to ${status}`,
      previousState: oldStatus,
      newState: status,
      reason: notes || 'Condition milestone progress verified.'
    });

    await decisionCase.save();
    res.json(decisionCase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// PATCH /api/scale-decisions/:id/gates/:gateNumber - Verify Gate
// -------------------------------------------------------------
router.patch('/:id/gates/:gateNumber', async (req, res) => {
  try {
    const { status, notes, actorName } = req.body;
    const decisionCase = await ScaleUpDecisionCase.findById(req.params.id);
    if (!decisionCase) return res.status(404).json({ error: 'Case not found' });

    const gate = decisionCase.gates.find(g => g.gateNumber === Number(req.params.gateNumber));
    if (!gate) return res.status(404).json({ error: 'Gate not found' });

    gate.status = status;
    gate.verifiedBy = actorName || 'Authorized Gate Inspector';
    gate.verifiedAt = new Date();
    if (notes) gate.notes = notes;

    decisionCase.auditTrail.push({
      action: 'GATE_STATUS_UPDATED',
      actor: actorName || 'Inspector',
      role: 'Gate Inspector',
      timestamp: new Date(),
      details: `Gate #${gate.gateNumber} (${gate.name}) set to ${status}`,
      previousState: '',
      newState: status,
      reason: notes || 'Gate inspection completed'
    });

    await decisionCase.save();
    res.json(decisionCase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// POST /api/scale-decisions/:id/scale-plan - Save / Update Scale Plan & Budget
// -------------------------------------------------------------
router.post('/:id/scale-plan', async (req, res) => {
  try {
    const { scaleUpPlan, actorName } = req.body;
    const decisionCase = await ScaleUpDecisionCase.findById(req.params.id);
    if (!decisionCase) return res.status(404).json({ error: 'Case not found' });

    if (scaleUpPlan) {
      // Validate decimal-safe total budget
      if (scaleUpPlan.budgetSummary) {
        const b = scaleUpPlan.budgetSummary;
        const total = (Number(b.infrastructure) || 0) +
          (Number(b.software) || 0) +
          (Number(b.licensing) || 0) +
          (Number(b.implementation) || 0) +
          (Number(b.training) || 0) +
          (Number(b.support) || 0) +
          (Number(b.security) || 0) +
          (Number(b.maintenance) || 0) +
          (Number(b.operations) || 0) +
          (Number(b.contingency) || 0);
        scaleUpPlan.budgetSummary.totalBudget = total;
      }
      decisionCase.scaleUpPlan = { ...decisionCase.scaleUpPlan.toObject(), ...scaleUpPlan, updatedAt: new Date() };
    }

    decisionCase.auditTrail.push({
      action: 'SCALE_PLAN_UPDATED',
      actor: actorName || 'Planner',
      role: 'Scale Planning Officer',
      timestamp: new Date(),
      details: `Updated Scale-Up Plan. Total Budget: ₹${(decisionCase.scaleUpPlan?.budgetSummary?.totalBudget || 0).toLocaleString('en-IN')}`,
      previousState: decisionCase.status,
      newState: decisionCase.status,
      reason: 'Updated budget, targets, milestones, and risk mitigation plan.'
    });

    await decisionCase.save();
    res.json(decisionCase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// POST /api/scale-decisions/:id/deployments - Add District Deployment
// -------------------------------------------------------------
router.post('/:id/deployments', async (req, res) => {
  try {
    const { department, location, targetUsers, budgetAllocated, startDate, endDate, owner, actorName } = req.body;
    if (!location) return res.status(400).json({ error: 'Location / District is required' });

    const decisionCase = await ScaleUpDecisionCase.findById(req.params.id);
    if (!decisionCase) return res.status(404).json({ error: 'Case not found' });

    const deploymentId = `DEP-${location.replace(/\s+/g, '').toUpperCase().slice(0, 4)}-${Math.floor(100 + Math.random() * 900)}`;

    decisionCase.deployments.push({
      deploymentId,
      department: department || 'Department of Public Health',
      location,
      targetUsers: targetUsers || '50,000 Users',
      budgetAllocated: Number(budgetAllocated) || 0,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || '',
      owner: owner || 'District Officer',
      status: 'APPROVED',
      infrastructureStatus: 'Site Survey Complete',
      kpiStatus: 'Scheduled',
      riskStatus: 'Low Risk',
      feedback: []
    });

    if (decisionCase.status === 'APPROVED' || decisionCase.status === 'APPROVED_WITH_CONDITIONS') {
      decisionCase.status = 'EXECUTION_IN_PROGRESS';
    }

    decisionCase.auditTrail.push({
      action: 'DEPLOYMENT_CREATED',
      actor: actorName || 'Rollout Lead',
      role: 'Deployment Lead',
      timestamp: new Date(),
      details: `Created deployment ${deploymentId} for ${location} (Budget: ₹${Number(budgetAllocated).toLocaleString('en-IN')})`,
      previousState: '',
      newState: 'APPROVED',
      reason: 'Expansion deployment activated.'
    });

    await decisionCase.save();
    res.status(201).json(decisionCase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// PATCH /api/scale-decisions/:id/deployments/:deploymentId - Update Deployment
// -------------------------------------------------------------
router.patch('/:id/deployments/:deploymentId', async (req, res) => {
  try {
    const { status, pauseReason, infrastructureStatus, kpiStatus, riskStatus, actorName } = req.body;
    const decisionCase = await ScaleUpDecisionCase.findById(req.params.id);
    if (!decisionCase) return res.status(404).json({ error: 'Case not found' });

    const dep = decisionCase.deployments.find(d => d.deploymentId === req.params.deploymentId || d._id.toString() === req.params.deploymentId);
    if (!dep) return res.status(404).json({ error: 'Deployment not found' });

    const oldStatus = dep.status;
    if (status) dep.status = status;
    if (pauseReason) dep.pauseReason = pauseReason;
    if (infrastructureStatus) dep.infrastructureStatus = infrastructureStatus;
    if (kpiStatus) dep.kpiStatus = kpiStatus;
    if (riskStatus) dep.riskStatus = riskStatus;

    decisionCase.auditTrail.push({
      action: 'DEPLOYMENT_UPDATED',
      actor: actorName || 'Rollout Officer',
      role: 'District Coordinator',
      timestamp: new Date(),
      details: `Updated deployment ${dep.deploymentId} (${dep.location}) status to ${dep.status}`,
      previousState: oldStatus,
      newState: dep.status,
      reason: pauseReason || 'Operational progress milestone update.'
    });

    await decisionCase.save();
    res.json(decisionCase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// POST /api/scale-decisions/:id/deployments/:deploymentId/feedback - Add User Feedback
// -------------------------------------------------------------
router.post('/:id/deployments/:deploymentId/feedback', async (req, res) => {
  try {
    const { userGroup, rating, feedback, issues } = req.body;
    const decisionCase = await ScaleUpDecisionCase.findById(req.params.id);
    if (!decisionCase) return res.status(404).json({ error: 'Case not found' });

    const dep = decisionCase.deployments.find(d => d.deploymentId === req.params.deploymentId || d._id.toString() === req.params.deploymentId);
    if (!dep) return res.status(404).json({ error: 'Deployment not found' });

    dep.feedback.push({
      userGroup: userGroup || 'Beneficiaries',
      rating: Number(rating) || 5,
      feedback: feedback || '',
      issues: issues || '',
      submittedAt: new Date()
    });

    await decisionCase.save();
    res.status(201).json(decisionCase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// POST /api/scale-decisions/:id/procurement-reference - Add Marketplace / Tender Reference
// -------------------------------------------------------------
router.post('/:id/procurement-reference', async (req, res) => {
  try {
    const { pathway, marketplace, sellerId, listingId, procurementRefNumber, tenderId, orderRef, notes, actorName } = req.body;
    const decisionCase = await ScaleUpDecisionCase.findById(req.params.id);
    if (!decisionCase) return res.status(404).json({ error: 'Case not found' });

    const referenceId = `REF-${(pathway || 'GEM').slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;

    decisionCase.procurementReferences.push({
      referenceId,
      pathway: pathway || 'GEM_STARTUP_RUNWAY',
      marketplace: marketplace || 'Government e-Marketplace (GeM)',
      sellerId: sellerId || '',
      listingId: listingId || '',
      procurementRefNumber: procurementRefNumber || '',
      tenderId: tenderId || '',
      orderRef: orderRef || '',
      externalStatus: 'Reference Linked & Sanction Active',
      notes: notes || '',
      createdAt: new Date()
    });

    decisionCase.auditTrail.push({
      action: 'PROCUREMENT_REFERENCE_ADDED',
      actor: actorName || 'Procurement Officer',
      role: 'Procurement Officer',
      timestamp: new Date(),
      details: `Added procurement reference ${referenceId} (${pathway}): Ref #${procurementRefNumber || orderRef || tenderId}`,
      previousState: '',
      newState: 'REFERENCE_LINKED',
      reason: notes || 'Integration with official government procurement platform.'
    });

    await decisionCase.save();
    res.status(201).json(decisionCase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// GET /api/scale-decisions/:id/procurement-package - Generate Structured Procurement Package
// -------------------------------------------------------------
router.get('/:id/procurement-package', async (req, res) => {
  try {
    const decisionCase = await ScaleUpDecisionCase.findById(req.params.id);
    if (!decisionCase) return res.status(404).json({ error: 'Case not found' });

    const [challenge, startup, pilot, contract, validation] = await Promise.all([
      Challenge.findById(decisionCase.challengeId),
      Startup.findById(decisionCase.startupId),
      Pilot.findById(decisionCase.pilotId),
      Contract.findById(decisionCase.contractId),
      Validation.findById(decisionCase.validationId)
    ]);

    const pkg = marketplaceService.generateProcurementPackage(decisionCase, challenge, startup, pilot, contract, validation);
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// GET /api/scale-decisions/:id/scale-package - Generate Executive Scale Package
// -------------------------------------------------------------
router.get('/:id/scale-package', async (req, res) => {
  try {
    const decisionCase = await ScaleUpDecisionCase.findById(req.params.id);
    if (!decisionCase) return res.status(404).json({ error: 'Case not found' });

    const [challenge, startup, pilot, validation] = await Promise.all([
      Challenge.findById(decisionCase.challengeId),
      Startup.findById(decisionCase.startupId),
      Pilot.findById(decisionCase.pilotId),
      Validation.findById(decisionCase.validationId)
    ]);

    const scalePkg = marketplaceService.generateScalePackage(decisionCase, challenge, startup, pilot, validation);
    res.json(scalePkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

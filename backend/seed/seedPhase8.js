const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

dotenv.config();

const Challenge = require('../models/Challenge');
const Startup = require('../models/Startup');
const Pilot = require('../models/Pilot');
const Contract = require('../models/Contract');
const Validation = require('../models/Validation');
const ScaleUpDecisionCase = require('../models/ScaleUpDecisionCase');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');

const seedPhase8 = async (standalone = true) => {
  try {
    await connectDB();
    console.log('MongoDB Connected for Phase 8 Seeding...');

    const challenges = await Challenge.find();
    const startups = await Startup.find();
    const pilots = await Pilot.find();
    const validations = await Validation.find();
    const contracts = await Contract.find();

    console.log(`Found: ${challenges.length} challenges, ${startups.length} startups, ${pilots.length} pilots, ${validations.length} validations, ${contracts.length} contracts`);

    if (pilots.length === 0) {
      console.log('No pilots found. Please seed main database first.');
      if (standalone) process.exit(1);
      return;
    }

    // Clean existing ScaleUpDecisionCases
    await ScaleUpDecisionCase.deleteMany({});
    console.log('Cleared existing ScaleUpDecisionCases.');

    // Find completed pilot (AgriSense)
    const agriPilot = pilots.find(p => p.pilotTitle?.includes('Soil') || p.location?.includes('Yavatmal')) || pilots[0];
    const agriStartup = startups.find(s => s.name?.includes('AgriSense')) || startups[0];
    const agriChallenge = challenges.find(c => c._id.toString() === agriPilot.challengeId?.toString()) || challenges[0];
    const agriContract = contracts.find(c => c.pilotId?.toString() === agriPilot._id.toString()) || contracts[0];
    let agriValidation = validations.find(v => v.pilotId?.toString() === agriPilot._id.toString());
    if (!agriValidation) {
      agriValidation = await Validation.create({
        reportNumber: 'IVR-MH-2026-8842',
        pilotId: agriPilot._id,
        contractId: agriContract ? agriContract._id : null,
        proposalId: agriPilot.proposalId,
        startupId: agriPilot.startupId,
        challengeId: agriPilot.challengeId,
        validatorName: 'Dr. Rameshwar Naik',
        validatorOrg: 'Maharashtra State Innovation Society (MSInS) Quality Control Board',
        coiDeclared: true,
        validationScope: {
          targetSites: 'Yavatmal & Nanded Districts (50 Villages)',
          sampleSize: '5,000 On-Farm Live Soil Tests',
          periodCovered: '90-Day Continuous Controlled Harvest Trial'
        },
        kpiVerifications: [
          { metricName: 'Soil Test Turnaround Time', baseline: '14 Days', claimed: '12 Mins', verifiedLive: '12 Mins', variancePct: 0, verificationStatus: 'Verified Pass', evidenceType: 'Server Telemetry Logs' },
          { metricName: 'Farmer Crop Yield Improvement', baseline: '0%', claimed: '18%', verifiedLive: '18.2%', variancePct: 1.1, verificationStatus: 'Verified Pass', evidenceType: 'ICAR Agronomist Harvest Audit' }
        ],
        milestoneAudits: [
          { milestoneNumber: 1, deliverableTitle: 'Deploy 50 NIR Portable Soil Scanners', auditFinding: '100% hardware units field verified and calibrated.', evidenceQuality: 'High', complianceStatus: 'Compliant' },
          { milestoneNumber: 2, deliverableTitle: 'Conduct 5,000 instant soil tests', auditFinding: 'Field logs match farmer phone number OTP audits.', evidenceQuality: 'High', complianceStatus: 'Compliant' },
          { milestoneNumber: 3, deliverableTitle: 'ICAR Independent Verification Report', auditFinding: 'ICAR certified 18.2% average crop yield gain.', evidenceQuality: 'High', complianceStatus: 'Compliant' }
        ],
        securityAndComplianceAudit: {
          certInPassed: true,
          dpdpDataPrivacyPassed: true,
          vulnerabilityReport: 'Zero vulnerabilities in BLE sensor handshake and cloud sync.',
          slaAchievedPct: 99.9
        },
        overallValidationScore: 94.8,
        recommendation: 'Recommended for Statewide Scale-Up',
        executiveSummary: 'Independent field audit confirms 12-minute turnaround for soil test results with 18.2% yield enhancement across 5,000 cotton test plots in Vidarbha.'
      });
      console.log('Seeded Phase 7 Independent Validation Report (IVR-MH-2026-8842)');
    }

    // Find OPD pilot (HealthAI)
    const opdPilot = pilots.find(p => p.pilotTitle?.includes('SmartOPD') || p.pilotTitle?.includes('OPD')) || (pilots.length > 1 ? pilots[1] : pilots[0]);
    const opdStartup = startups.find(s => s.name?.includes('HealthAI')) || startups[0];
    const opdChallenge = challenges.find(c => c._id.toString() === opdPilot.challengeId?.toString()) || challenges[0];
    const opdContract = contracts.find(c => c.pilotId?.toString() === opdPilot._id.toString()) || contracts[0];
    let opdValidation = validations.find(v => v.pilotId?.toString() === opdPilot._id.toString());
    if (!opdValidation) {
      opdValidation = await Validation.create({
        reportNumber: 'IVR-MH-2026-7731',
        pilotId: opdPilot._id,
        contractId: opdContract ? opdContract._id : null,
        proposalId: opdPilot.proposalId,
        startupId: opdPilot.startupId,
        challengeId: opdPilot.challengeId,
        validatorName: 'Dr. Rameshwar Naik',
        validatorOrg: 'Maharashtra State Innovation Society (MSInS) Quality Control Board',
        coiDeclared: true,
        validationScope: {
          targetSites: 'Chhatrapati Sambhajinagar District Hospital',
          sampleSize: '15,000 OPD Patient Transactions',
          periodCovered: '60-Day Controlled Pilot Trial'
        },
        kpiVerifications: [
          { metricName: 'Average OPD Waiting Time', baseline: '45 mins', claimed: '18 mins', verifiedLive: '18 mins', variancePct: 0, verificationStatus: 'Verified Pass', evidenceType: 'Server Telemetry Logs' },
          { metricName: 'Patient Satisfaction Score', baseline: '42%', claimed: '89%', verifiedLive: '86%', variancePct: -3.4, verificationStatus: 'Discrepancy Noted', evidenceType: 'Patient Exit Survey' }
        ],
        milestoneAudits: [
          { milestoneNumber: 1, deliverableTitle: 'Infrastructure & AI Kiosk Setup', auditFinding: '100% hardware units and edge gateway verified.', evidenceQuality: 'High', complianceStatus: 'Compliant' },
          { milestoneNumber: 2, deliverableTitle: 'Controlled Live Trial (30 Days)', auditFinding: '15,000 tokens processed successfully.', evidenceQuality: 'High', complianceStatus: 'Compliant' },
          { milestoneNumber: 3, deliverableTitle: 'Final Performance Target & Audit', auditFinding: 'Elderly patient assistance required for voice accessibility.', evidenceQuality: 'Medium', complianceStatus: 'Conditional' }
        ],
        securityAndComplianceAudit: {
          certInPassed: true,
          dpdpDataPrivacyPassed: true,
          vulnerabilityReport: 'Zero vulnerabilities in telemetry logs; password policy compliant.',
          slaAchievedPct: 99.5
        },
        overallValidationScore: 88.5,
        recommendation: 'Recommended with Minor Conditions',
        executiveSummary: 'Independent field audit confirms 60% reduction in OPD wait times with robust DPDP Act 2023 compliance. Recommended for controlled 45-day re-pilot with Marathi voice assist before statewide rollout.'
      });
      console.log('Seeded Phase 7 Independent Validation Report (IVR-MH-2026-7731)');
    }

    // 1. Decision Case A: SCALE_AND_PROCURE (AgriSense)
    const caseA = await ScaleUpDecisionCase.create({
      decisionId: 'SUDC-MH-2026-001',
      challengeId: agriChallenge._id,
      startupId: agriStartup._id,
      pilotId: agriPilot._id,
      contractId: agriContract ? agriContract._id : null,
      validationId: agriValidation ? agriValidation._id : agriPilot._id,
      status: 'APPROVED',
      scaleReadiness: {
        categories: [
          { key: 'technical_scalability', name: 'Technical Scalability', description: 'Edge NIR sensor accuracy with offline BLE sync', weight: 12, score: 92, status: 'READY', evidenceSource: 'Phase 7 Field Validation', reviewerComments: 'Handled 5,000 tests without drift.' },
          { key: 'operational_readiness', name: 'Operational Readiness', description: 'Krishi Sevak field training capacity', weight: 10, score: 88, status: 'READY', evidenceSource: 'Phase 5 Field Logs', reviewerComments: '100 Krishi Sevaks trained.' },
          { key: 'kpi_achievement', name: 'KPI Target Achievement', description: 'Turnaround reduced from 14 days to 12 minutes', weight: 15, score: 98, status: 'READY', evidenceSource: 'Phase 7 ICAR Audit', reviewerComments: '18% yield improvement.' },
          { key: 'user_adoption', name: 'User Adoption & Satisfaction', description: 'Farmer satisfaction score >90%', weight: 10, score: 91, status: 'READY', evidenceSource: 'Farmer Field Interviews', reviewerComments: '92% farmers appreciated instant Marathi SMS.' },
          { key: 'security_readiness', name: 'Cybersecurity & DPDP Compliance', description: 'GPS plot anonymity & encrypted BLE', weight: 15, score: 95, status: 'READY', evidenceSource: 'Phase 7 Security Audit', reviewerComments: 'Passed CERT-In audit.' },
          { key: 'financial_sustainability', name: 'Financial Sustainability', description: 'Unit cost per soil test ₹15 vs ₹350 lab cost', weight: 10, score: 94, status: 'READY', evidenceSource: 'Phase 6 Cost Breakdown', reviewerComments: 'Extremely high cost benefit.' },
          { key: 'support_capability', name: 'Support & Maintenance Capacity', description: '48h replacement warranty for damaged sensors', weight: 8, score: 85, status: 'READY', evidenceSource: 'Startup SLA Agreement', reviewerComments: 'Regional repair centers in Pune and Nagpur.' },
          { key: 'infrastructure_readiness', name: 'Host District Infrastructure Readiness', description: 'Taluka agriculture offices readiness', weight: 8, score: 86, status: 'READY', evidenceSource: 'Dept Survey', reviewerComments: 'Office desks and charging hubs identified.' },
          { key: 'risk_profile', name: 'Risk Profile', description: 'Rainfall & seasonal calibration risks', weight: 7, score: 85, status: 'READY', evidenceSource: 'Phase 5 Risk Matrix', reviewerComments: 'Mitigated with weatherproof IP67 casing.' },
          { key: 'procurement_readiness', name: 'Procurement & Legal Alignment', description: 'GeM Startup Runway direct sanction', weight: 5, score: 96, status: 'READY', evidenceSource: 'DPIIT Registry', reviewerComments: 'Eligible for GFR 173(i) waiver.' }
        ],
        overallScore: 91.2,
        assessedBy: 'Dr. Anand Sharma (Technical Review Desk)',
        assessedAt: new Date('2026-08-25')
      },
      procurementReadiness: {
        criteria: [
          { key: 'approved_scope', name: 'Approved Scope & Requirements', description: '1,500 portable scanners across 36 districts', status: 'READY', evidenceSource: 'State Agri Plan 2026' },
          { key: 'budget_availability', name: 'Budget Availability', description: '₹4.50 Cr state innovation fund allocation', status: 'READY', evidenceSource: 'Treasury Budget Code MH-AGRI-2026-88' },
          { key: 'pathway_identified', name: 'Procurement Pathway Identified', description: 'GeM Startup Runway Direct Purchase', status: 'READY', evidenceSource: 'GeM Innovation Policy' },
          { key: 'statutory_exemptions', name: 'Statutory Exemptions Applied', description: 'DPIIT turnover and experience exemption verified', status: 'READY', evidenceSource: 'DPIIT Portal' },
          { key: 'legal_terms', name: 'Data Rights & IP Protection', description: '100% soil telemetry data belongs to Maharashtra Agri Dept', status: 'READY', evidenceSource: 'Master Contract' }
        ],
        overallStatus: 'READY',
        pathwayRecommended: 'GEM_STARTUP_RUNWAY',
        assessedBy: 'Sunita Kulkarni (Agri Procurement Cell)',
        assessedAt: new Date('2026-08-26')
      },
      recommendation: {
        decision: 'SCALE_AND_PROCURE',
        rationale: 'Pilot achieved 18% yield improvement, reduced soil testing from 14 days to 12 minutes, and passed independent ICAR audit. Recommended for statewide procurement and deployment across all 36 districts.',
        risksConsidered: ['Sensor calibration drift over 12 months', 'Monsoon humidity interference'],
        suggestedConditions: ['Conduct mandatory bi-annual recalibration of all field NIR sensors', 'Establish district repair hubs in 4 agro-climatic zones'],
        generatedBy: 'GovInnovate Decision Intelligence Engine',
        generatedAt: new Date('2026-08-27')
      },
      finalDecision: {
        decision: 'SCALE_AND_PROCURE',
        rationale: 'Approved based on ICAR independent validation, 91.2/100 readiness score, and GFR 173(i) DPIIT procurement compliance.',
        decidedBy: 'Sanjay Khandare, IAS (Principal Secretary)',
        decidedRole: 'Principal Secretary, Agriculture',
        decidedAt: new Date('2026-08-30'),
        isOverride: false,
        overrideReason: ''
      },
      conditions: [
        { conditionId: 'COND-AGRI-1', description: 'Establish 4 regional calibration and service centers (Pune, Nagpur, Sambhajinagar, Nashik)', owner: 'AgriSense Technologies', dueDate: '2026-10-15', isRequired: true, status: 'IN_PROGRESS', notes: 'Pune and Nagpur centers established.' },
        { conditionId: 'COND-AGRI-2', description: 'Integrate live soil test API with Maharashtra MahaAgri GIS portal', owner: 'AgriSense & State Agri IT Desk', dueDate: '2026-11-01', isRequired: true, status: 'PENDING', notes: '' }
      ],
      gates: [
        { gateNumber: 1, name: 'Gate 1 — Independent Validation Passed', status: 'PASSED', verifiedBy: 'ICAR & MSInS Quality Control Board', verifiedAt: new Date('2026-08-20'), isMandatory: true, notes: 'Score: 94.8/100' },
        { gateNumber: 2, name: 'Gate 2 — CERT-In & Hardware Quality Audit', status: 'PASSED', verifiedBy: 'Cybersecurity & Electronics Audit Desk', verifiedAt: new Date('2026-08-22'), isMandatory: true, notes: 'IP67 dust & water ingress rating verified.' },
        { gateNumber: 3, name: 'Gate 3 — GeM Innovation Listing Verification', status: 'PASSED', verifiedBy: 'State GeM Cell', verifiedAt: new Date('2026-08-25'), isMandatory: true, notes: 'Listed on GeM Startup Runway.' },
        { gateNumber: 4, name: 'Gate 4 — Treasury Budget Sanction Clearance', status: 'PASSED', verifiedBy: 'Finance Department', verifiedAt: new Date('2026-08-28'), isMandatory: true, notes: '₹4,50,00,000 sanctioned.' },
        { gateNumber: 5, name: 'Gate 5 — Taluka Level Krishi Sevak Readiness', status: 'PASSED', verifiedBy: 'Department of Agriculture', verifiedAt: new Date('2026-08-30'), isMandatory: false, notes: '100 trainers ready.' },
        { gateNumber: 6, name: 'Gate 6 — Full Statewide Deployment Order', status: 'PASSED', verifiedBy: 'Authorized State Decision Maker', verifiedAt: new Date('2026-08-30'), isMandatory: true, notes: 'Rollout sanctioned.' }
      ],
      scaleUpPlan: {
        targetScope: 'STATEWIDE',
        targetGeography: ['Yavatmal', 'Nanded', 'Akola', 'Amravati', 'Washim', 'Wardha', 'Buldhana', 'Nagpur', 'Jalna', 'Parbhani', 'Beed', 'Latur', 'Osmanabad', 'Solapur', 'Ahmednagar', 'Pune', 'Satara', 'Sangli', 'Kolhapur', 'Nashik', 'Dhule', 'Nandurbar', 'Jalgaon', 'Aurangabad', 'Palghar', 'Thane', 'Raigad', 'Ratnagiri', 'Sindhudurg', 'Bhandara', 'Gondia', 'Chandrapur', 'Gadchiroli', 'Hingoli'],
        targetDepartments: ['Department of Agriculture', 'Department of Cooperation and Marketing'],
        targetUsers: '1.2 Million Farmers across all 36 Districts of Maharashtra',
        deploymentTimeline: '12 Months (Q3 2026 - Q3 2027)',
        infrastructureRequirements: '1,500 Portable NIR Hardware Units, 36 Regional Calibration Kits, Cloud API Gateway',
        supportModel: 'Regional Service Hubs + 24/7 Krishi Helpline & Replacement SLA',
        trainingPlan: 'Train 3,000 Krishi Sevaks across 355 Talukas in 4 phased batches',
        procurementRoute: 'GeM Startup Runway Direct Sanction under GFR Rule 173(i)',
        securityRequirements: 'End-to-end encrypted BLE data transmission, anonymized geo-coordinates',
        budgetSummary: {
          infrastructure: 18000000,
          software: 6000000,
          licensing: 3000000,
          implementation: 5000000,
          training: 3000000,
          support: 3000000,
          security: 1500000,
          maintenance: 2500000,
          operations: 2000000,
          contingency: 1000000,
          totalBudget: 45000000,
          budgetApproved: true,
          financeApprover: 'Finance Cell, Government of Maharashtra',
          financeApprovalDate: new Date('2026-08-28')
        },
        benefitProjections: [
          { metricName: 'Soil Testing Turnaround Time', baseline: '14 days', pilotResult: '12 minutes', projectedScale: '< 15 minutes', assumption: 'On-farm mobile testing by Krishi Sevak', calculationMethod: 'NIR rapid scan algorithm', confidence: 'High' },
          { metricName: 'Farmer Fertilizer Input Cost Savings', baseline: '₹4,200 / acre', pilotResult: '₹3,100 / acre (26% savings)', projectedScale: '₹3,000 / acre (28% savings)', assumption: 'Precision N-P-K recommendation prevents over-fertilization', calculationMethod: 'ICAR soil telemetry trial data', confidence: 'High' },
          { metricName: 'Average Crop Yield Improvement', baseline: 'Standard baseline', pilotResult: '+ 18% yield', projectedScale: '+ 15-20% yield', assumption: 'Balanced micro-nutrient advisory adherence', calculationMethod: 'Field crop harvest audit', confidence: 'High' }
        ],
        costEffectiveness: {
          pilotCost: 2000000,
          projectedScaleCost: 45000000,
          costPerUser: 37.5,
          costPerOutcome: '₹37.50 per farmer tested vs ₹350.00 conventional lab testing cost',
          summary: '89.3% reduction in public expenditure per soil test delivered to rural farmers.'
        },
        milestones: [
          { milestoneNumber: 1, name: 'Sanction & GeM Procurement Order Issuance', description: 'Issuance of statewide supply order on GeM Startup Runway', plannedDate: '2026-09-01', owner: 'Procurement Cell', deliverables: 'GeM Purchase Order', acceptanceCriteria: 'Official PO Signed', status: 'COMPLETED' },
          { milestoneNumber: 2, name: 'Batch 1 Hardware Delivery (500 Scanners)', description: 'Delivery & calibration check of 500 NIR scanners for Marathwada & Vidarbha', plannedDate: '2026-10-31', owner: 'AgriSense Technologies', deliverables: 'Warehouse Dispatch Receipt', acceptanceCriteria: '100% Quality Inspection Pass', status: 'IN_PROGRESS' },
          { milestoneNumber: 3, name: 'Batch 2 Hardware Delivery (500 Scanners)', description: 'Delivery of 500 units for Western Maharashtra & North Maharashtra', plannedDate: '2026-12-31', owner: 'AgriSense Technologies', deliverables: 'District Delivery Receipts', acceptanceCriteria: 'Field Calibration Verified', status: 'PLANNED' },
          { milestoneNumber: 4, name: 'Batch 3 Delivery & Statewide Integration (500 Scanners)', description: 'Final batch delivery for Konkan & remaining districts + MahaAgri GIS Sync', plannedDate: '2027-02-28', owner: 'AgriSense Technologies', deliverables: 'Statewide Acceptance Report', acceptanceCriteria: 'All 36 Districts Operational', status: 'PLANNED' }
        ],
        risks: [
          { riskId: 'RSK-AGRI-1', category: 'Operational', description: 'Non-availability of Krishi Sevaks during heavy sowing periods', probability: 'Medium', impact: 'Medium', riskScore: 5, mitigation: 'Schedule testing during pre-sowing window (April-May & Sept-Oct)', owner: 'State Agri Commissioner', status: 'Mitigating' },
          { riskId: 'RSK-AGRI-2', category: 'Technical', description: 'Sensor glass scratching or soil contamination in muddy fields', probability: 'Low', impact: 'Medium', riskScore: 4, mitigation: 'Sapphire scratch-resistant optical window and ultrasonic cleaning kit included in each box', owner: 'AgriSense Hardware Lead', status: 'Resolved' }
        ],
        kpis: [
          { kpiId: 'KPI-AGRI-1', metricName: 'Instant Soil Tests Conducted', pilotBaseline: '0', pilotResult: '5,000 tests', scaleTarget: '1,200,000 tests', currentMeasurement: '28,400 tests', status: 'ON_TRACK' },
          { kpiId: 'KPI-AGRI-2', metricName: 'Soil Test Turnaround Time', pilotBaseline: '14 Days', pilotResult: '12 Mins', scaleTarget: '< 15 Mins', currentMeasurement: '12.4 Mins', status: 'TARGET_ACHIEVED' }
        ]
      },
      deployments: [
        {
          deploymentId: 'DEP-YAVATMAL-01',
          department: 'Department of Agriculture',
          location: 'Yavatmal District (Cotton Belt)',
          targetUsers: '120,000 Cotton Farmers',
          budgetAllocated: 4500000,
          startDate: '2026-09-01',
          endDate: '2027-08-31',
          owner: 'District Agriculture Officer, Yavatmal',
          status: 'ACTIVE',
          infrastructureStatus: '150 Scanners Deployed & Live',
          kpiStatus: 'On Track (12,400 tests done)',
          riskStatus: 'Low Risk',
          feedback: [
            { userGroup: 'Cotton Farmers', rating: 5, feedback: 'Instant soil report helped save ₹1,200 on DAP fertilizer per acre.', issues: '', submittedAt: new Date('2026-09-04') }
          ]
        },
        {
          deploymentId: 'DEP-NANDED-02',
          department: 'Department of Agriculture',
          location: 'Nanded District (Soybean & Cotton)',
          targetUsers: '100,000 Farmers',
          budgetAllocated: 3800000,
          startDate: '2026-09-10',
          endDate: '2027-08-31',
          owner: 'District Agriculture Officer, Nanded',
          status: 'ACTIVE',
          infrastructureStatus: '120 Scanners Deployed',
          kpiStatus: 'On Track (9,200 tests done)',
          riskStatus: 'Low Risk',
          feedback: []
        },
        {
          deploymentId: 'DEP-AMRAVATI-03',
          department: 'Department of Agriculture',
          location: 'Amravati District',
          targetUsers: '90,000 Farmers',
          budgetAllocated: 3500000,
          startDate: '2026-10-01',
          endDate: '2027-08-31',
          owner: 'District Agriculture Officer, Amravati',
          status: 'PREPARING',
          infrastructureStatus: 'Krishi Sevak Training in Progress',
          kpiStatus: 'Scheduled for Go-Live',
          riskStatus: 'Low Risk',
          feedback: []
        }
      ],
      procurementReferences: [
        {
          referenceId: 'REF-GEM-2026-AGRI-01',
          pathway: 'GEM_STARTUP_RUNWAY',
          marketplace: 'Government e-Marketplace (GeM)',
          sellerId: 'GEM-SELLER-AGRISENSE-MH',
          listingId: 'GEM-SR-2026-AGRI-00982',
          procurementRefNumber: 'MSINS-AGRI-SCALE-2026-004',
          orderRef: 'GEM-PO-2026-MH-994821',
          externalStatus: 'Sanction Order Dispatched & Initial Tranche Active',
          publicationDate: '2026-08-30',
          submissionDeadline: '2026-09-30',
          notes: 'Full exemption under Maharashtra Startup Innovation Procurement Policy 2024'
        }
      ],
      decisionHistory: [
        {
          version: 1,
          decisionType: 'RECOMMENDATION',
          decision: 'SCALE_AND_PROCURE',
          rationale: 'ICAR validated 18% yield improvement and 12-minute turnaround.',
          actor: 'GovInnovate Decision Intelligence Engine',
          role: 'Decision Support System',
          timestamp: new Date('2026-08-27')
        },
        {
          version: 2,
          decisionType: 'AUTHORIZED_DECISION',
          decision: 'SCALE_AND_PROCURE',
          rationale: 'Approved statewide rollout of 1,500 units across all 36 districts with ₹4.50 Cr sanction.',
          actor: 'Sanjay Khandare, IAS',
          role: 'Principal Secretary, Agriculture',
          timestamp: new Date('2026-08-30')
        }
      ],
      auditTrail: [
        {
          action: 'SCALE_DECISION_CREATED',
          actor: 'Sunita Kulkarni',
          role: 'Agri Procurement Cell',
          timestamp: new Date('2026-08-25'),
          details: 'Initiated Phase 8 Decision Case for AgriSense Soil Scanner',
          previousState: 'PILOT_VALIDATED',
          newState: 'UNDER_REVIEW',
          reason: 'ICAR validation report certified.'
        },
        {
          action: 'DECISION_APPROVED',
          actor: 'Sanjay Khandare, IAS',
          role: 'Principal Secretary',
          timestamp: new Date('2026-08-30'),
          details: 'Issued formal Sanction Order for Statewide Scale-Up & GeM Procurement',
          previousState: 'UNDER_REVIEW',
          newState: 'APPROVED',
          reason: 'Meets all 10 scale readiness and procurement criteria.'
        }
      ],
      createdBy: 'State Innovation Procurement Cell'
    });

    // 2. Decision Case B: RE_PILOT (HealthAI - OPD Queue)
    const caseB = await ScaleUpDecisionCase.create({
      decisionId: 'SUDC-MH-2026-002',
      challengeId: opdChallenge._id,
      startupId: opdStartup._id,
      pilotId: opdPilot._id,
      contractId: opdContract ? opdContract._id : null,
      validationId: opdValidation ? opdValidation._id : opdPilot._id,
      status: 'RE_PILOT_REQUIRED',
      scaleReadiness: {
        categories: [
          { key: 'technical_scalability', name: 'Technical Scalability', description: 'Server telemetry and edge kiosk queue processing', weight: 12, score: 75, status: 'READY_WITH_CONDITIONS', evidenceSource: 'Phase 5 Pilot Logs', reviewerComments: 'Kiosk touchscreen responsiveness degraded during peak 10 AM rush.' },
          { key: 'operational_readiness', name: 'Operational Readiness', description: 'Hospital staff adaptation in Sambhajinagar', weight: 10, score: 70, status: 'READY_WITH_CONDITIONS', evidenceSource: 'Hospital OPD Field Log', reviewerComments: 'Registration clerks need additional vernacular training.' },
          { key: 'kpi_achievement', name: 'KPI Target Achievement', description: 'Average OPD wait time cut to 18 mins (Target <20 mins)', weight: 15, score: 88, status: 'READY', evidenceSource: 'Phase 5 KPI Log', reviewerComments: 'Target wait time achieved in daytime OPD, but emergency evening queue remains unverified.' },
          { key: 'user_adoption', name: 'User Adoption', description: 'Patient token acceptance', weight: 10, score: 74, status: 'READY_WITH_CONDITIONS', evidenceSource: 'Patient Feedback', reviewerComments: 'Elderly patients struggled with touch UI without attendant guidance.' },
          { key: 'security_readiness', name: 'Cybersecurity & DPDP Compliance', description: 'CERT-In security audit', weight: 15, score: 85, status: 'READY', evidenceSource: 'Phase 7 Audit', reviewerComments: 'Zero high CVEs; minor password policy fix required.' },
          { key: 'financial_sustainability', name: 'Financial Sustainability', description: 'Hardware kiosk maintenance economics', weight: 10, score: 68, status: 'NOT_READY', evidenceSource: 'Cost Assessment', reviewerComments: 'Thermal printer paper replacement cost higher than budgeted.' },
          { key: 'support_capability', name: 'Support & Maintenance Capacity', description: 'On-site technical support SLA', weight: 8, score: 65, status: 'NOT_READY', evidenceSource: 'Startup SLA', reviewerComments: 'Startup currently lacks local technical team in Vidarbha.' },
          { key: 'infrastructure_readiness', name: 'Host District Infrastructure Readiness', description: 'LAN & Power stability in rural CHCs', weight: 8, score: 68, status: 'NOT_READY', evidenceSource: 'District Health Survey', reviewerComments: 'Rural health centers experience frequent power cuts.' },
          { key: 'risk_profile', name: 'Risk Profile', description: 'Triage error risk during emergency peak load', weight: 7, score: 70, status: 'READY_WITH_CONDITIONS', evidenceSource: 'Pilot Risk Log', reviewerComments: 'Manual override counter must be maintained.' },
          { key: 'procurement_readiness', name: 'Procurement & Legal Alignment', description: 'GeM Runway alignment', weight: 5, score: 78, status: 'READY_WITH_CONDITIONS', evidenceSource: 'DPIIT Status', reviewerComments: 'DPIIT certificate valid; vendor bank validation pending.' }
        ],
        overallScore: 74.8,
        assessedBy: 'Dr. Radhakishan Pawar (Health Review Desk)',
        assessedAt: new Date('2026-08-28')
      },
      procurementReadiness: {
        criteria: [
          { key: 'approved_scope', name: 'Approved Scope & Requirements', description: 'Controlled 45-day re-pilot in 2 multi-specialty hospitals', status: 'READY_WITH_CONDITIONS', evidenceSource: 'Health Dept Review' },
          { key: 'budget_availability', name: 'Budget Availability', description: 'Re-pilot extension fund ₹6,00,000 allocated', status: 'READY', evidenceSource: 'Innovation Sandbox Fund' },
          { key: 'pathway_identified', name: 'Procurement Pathway Identified', description: 'Pilot Sandbox Extension Protocol', status: 'READY', evidenceSource: 'MSInS Guidelines' }
        ],
        overallStatus: 'READY_WITH_CONDITIONS',
        pathwayRecommended: 'GEM_STARTUP_RUNWAY',
        assessedBy: 'Health Procurement Cell',
        assessedAt: new Date('2026-08-29')
      },
      recommendation: {
        decision: 'EXTEND_PILOT',
        rationale: 'While daytime OPD wait time achieved target (18 mins), user adoption among elderly patients and evening emergency peak triage requires 45-day re-test with physical attendant support before multi-district rollout.',
        risksConsidered: ['Thermal printer failure during peak load', 'Lack of rural district technical support team'],
        suggestedConditions: ['Add voice-guided Marathi audio assist to kiosks', 'Deploy dedicated support engineer during re-pilot'],
        generatedBy: 'GovInnovate Decision Intelligence Engine',
        generatedAt: new Date('2026-08-29')
      },
      finalDecision: {
        decision: 'RE_PILOT',
        rationale: 'Ordered 45-day controlled re-pilot across Chhatrapati Sambhajinagar and Pune Sassoon General Hospital with audio assist UI before statewide procurement.',
        decidedBy: 'Dr. Nitin Ambadekar (Director of Health Services)',
        decidedRole: 'Director, Health Services',
        decidedAt: new Date('2026-09-02'),
        isOverride: false,
        overrideReason: ''
      },
      conditions: [
        { conditionId: 'COND-OPD-1', description: 'Integrate Marathi voice assist prompts on all kiosk terminals', owner: 'HealthAI Solutions', dueDate: '2026-09-20', isRequired: true, status: 'IN_PROGRESS', notes: 'Audio recordings under test.' },
        { conditionId: 'COND-OPD-2', description: 'Execute 45-day re-pilot covering night emergency triage shifts', owner: 'HealthAI & Hospital Supt', dueDate: '2026-10-31', isRequired: true, status: 'PENDING', notes: '' }
      ],
      gates: [
        { gateNumber: 1, name: 'Gate 1 — Independent Validation Passed', status: 'PASSED', verifiedBy: 'MSInS Quality Control Board', verifiedAt: new Date('2026-08-25'), isMandatory: true, notes: 'Daytime triage validated.' },
        { gateNumber: 2, name: 'Gate 2 — CERT-In Security Audit Clearance', status: 'PASSED', verifiedBy: 'CERT-In Auditor', verifiedAt: new Date('2026-08-26'), isMandatory: true, notes: 'Security cleared.' },
        { gateNumber: 3, name: 'Gate 3 — Re-Pilot Protocol & Site Sanction', status: 'PASSED', verifiedBy: 'Directorate of Health Services', verifiedAt: new Date('2026-09-02'), isMandatory: true, notes: 'Extended sandbox trial approved.' },
        { gateNumber: 4, name: 'Gate 4 — Multi-District Budget Sanction', status: 'PENDING', verifiedBy: '', isMandatory: true, notes: 'Pending re-pilot outcome.' },
        { gateNumber: 5, name: 'Gate 5 — Site Operational Readiness', status: 'PENDING', verifiedBy: '', isMandatory: false, notes: 'Sassoon Hospital testing site ready.' },
        { gateNumber: 6, name: 'Gate 6 — Full Statewide Deployment Order', status: 'PENDING', verifiedBy: '', isMandatory: true, notes: 'Blocked until re-pilot passes.' }
      ],
      scaleUpPlan: {
        targetScope: 'ADDITIONAL_FACILITIES',
        targetGeography: ['Chhatrapati Sambhajinagar', 'Pune Sassoon General Hospital'],
        targetDepartments: ['Department of Public Health'],
        targetUsers: '50,000 OPD & Emergency Patients across 2 Multi-Specialty Sites',
        deploymentTimeline: '45 Days Re-Pilot (Sept - Oct 2026)',
        infrastructureRequirements: '6 Smart Kiosks with Voice Guidance, 4 Display Screens',
        supportModel: 'Dedicated On-Site Startup Technical Engineer',
        trainingPlan: 'Re-train 40 Registration Staff and 15 Emergency Triage Nurses',
        procurementRoute: 'Innovation Sandbox Re-Pilot Sanction Order',
        securityRequirements: 'AES-256 local encrypted queues, zero PII transmission',
        budgetSummary: {
          infrastructure: 300000,
          software: 150000,
          licensing: 50000,
          implementation: 50000,
          training: 20000,
          support: 30000,
          security: 0,
          maintenance: 0,
          operations: 0,
          contingency: 0,
          totalBudget: 600000,
          budgetApproved: true,
          financeApprover: 'Health Innovation Sandbox Fund',
          financeApprovalDate: new Date('2026-09-02')
        },
        milestones: [
          { milestoneNumber: 1, name: 'Audio Assist Integration & Kiosk Upgrade', description: 'Deploy voice-guided Marathi firmware to 6 test kiosks', plannedDate: '2026-09-20', owner: 'HealthAI Solutions', deliverables: 'Firmware Deployment Certificate', acceptanceCriteria: 'Audio functional in noisy OPD', status: 'IN_PROGRESS' },
          { milestoneNumber: 2, name: 'Night Emergency Triage Trial (30 Days)', description: 'Validate 24/7 continuous operation during emergency shifts', plannedDate: '2026-10-25', owner: 'HealthAI & Hospital Staff', deliverables: 'Shift Telemetry Logs', acceptanceCriteria: 'Zero System Downtime', status: 'PLANNED' }
        ],
        risks: [
          { riskId: 'RSK-OPD-1', category: 'Operational', description: 'Ambient OPD noise interfering with patient voice guidance comprehension', probability: 'Medium', impact: 'Medium', riskScore: 5, mitigation: 'Use directional high-decibel speakers with visual Marathi icon prompts', owner: 'HealthAI Technical Lead', status: 'Mitigating' }
        ],
        kpis: [
          { kpiId: 'KPI-OPD-1', metricName: 'Elderly Patient Independent Token Generation', pilotBaseline: '42%', pilotResult: '64%', scaleTarget: '> 85%', currentMeasurement: '68%', status: 'AT_RISK' }
        ]
      },
      deployments: [
        {
          deploymentId: 'DEP-SAMBHAJI-01',
          department: 'Department of Public Health',
          location: 'District Civil Hospital, Chhatrapati Sambhajinagar',
          targetUsers: '30,000 OPD Patients',
          budgetAllocated: 350000,
          startDate: '2026-09-15',
          endDate: '2026-10-31',
          owner: 'Civil Surgeon, Sambhajinagar',
          status: 'ACTIVE',
          infrastructureStatus: '4 Kiosks Online',
          kpiStatus: 'Re-Trial In Progress',
          riskStatus: 'Medium Risk (Noise issues monitored)',
          feedback: []
        }
      ],
      procurementReferences: [],
      decisionHistory: [
        {
          version: 1,
          decisionType: 'RECOMMENDATION',
          decision: 'EXTEND_PILOT',
          rationale: 'Recommend 45-day extension to address voice guidance for elderly patients.',
          actor: 'GovInnovate Decision Intelligence Engine',
          role: 'Decision Engine',
          timestamp: new Date('2026-08-29')
        },
        {
          version: 2,
          decisionType: 'AUTHORIZED_DECISION',
          decision: 'RE_PILOT',
          rationale: 'Authorized 45-day re-pilot with audio firmware upgrades before statewide tender.',
          actor: 'Dr. Nitin Ambadekar',
          role: 'Director, Health Services',
          timestamp: new Date('2026-09-02')
        }
      ],
      auditTrail: [
        {
          action: 'SCALE_DECISION_CREATED',
          actor: 'Dr. Radhakishan Pawar',
          role: 'Department Officer',
          timestamp: new Date('2026-08-28'),
          details: 'Created Phase 8 Decision Case for SmartOPD Queue Optimization',
          previousState: 'PILOT_VALIDATED',
          newState: 'UNDER_REVIEW',
          reason: 'Initial pilot completed; review required.'
        },
        {
          action: 'RE_PILOT_REQUESTED',
          actor: 'Dr. Nitin Ambadekar',
          role: 'Director, Health Services',
          timestamp: new Date('2026-09-02'),
          details: 'Ordered 45-day controlled re-pilot for voice assist verification',
          previousState: 'UNDER_REVIEW',
          newState: 'RE_PILOT_REQUIRED',
          reason: 'Elderly user adoption criteria must reach 85%.'
        }
      ],
      createdBy: 'Health Department Review Desk'
    });

    console.log('\n======================================================');
    console.log('   Phase 8 Scale-Up & Procurement Decision Cases Seeded!');
    console.log('======================================================');
    console.log(`- Case A (SCALE_AND_PROCURE - AgriSense): ${caseA.decisionId} [Status: ${caseA.status}]`);
    console.log(`- Case B (RE_PILOT - HealthAI): ${caseB.decisionId} [Status: ${caseB.status}]`);
    console.log('======================================================\n');
    if (standalone) {
      process.exit(0);
    }
  } catch (err) {
    console.error('Phase 8 Seeding Error:', err);
    if (standalone) process.exit(1);
    throw err;
  }
};

if (require.main === module) {
  seedPhase8(true);
}

module.exports = seedPhase8;

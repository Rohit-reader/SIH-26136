const express = require('express');
const router = express.Router();
const Validation = require('../models/Validation');
const Pilot = require('../models/Pilot');
const Contract = require('../models/Contract');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');

// GET /api/validations - Get all Independent Validation Reports
router.get('/', async (req, res) => {
  try {
    const validations = await Validation.find()
      .populate('pilotId')
      .populate('contractId')
      .populate('startupId')
      .populate('challengeId')
      .populate('proposalId');
    res.json(validations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/validations/:id - Get single validation report
router.get('/:id', async (req, res) => {
  try {
    const validation = await Validation.findById(req.params.id)
      .populate('pilotId')
      .populate('contractId')
      .populate('startupId')
      .populate('challengeId')
      .populate('proposalId');
    if (!validation) return res.status(404).json({ error: 'Validation report not found' });
    res.json(validation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/validations - Create & Submit Independent Validation Report (IVR)
router.post('/', async (req, res) => {
  try {
    const { 
      pilotId, 
      validatorName, 
      validatorOrg, 
      coiDeclared, 
      validationScope, 
      kpiVerifications, 
      milestoneAudits, 
      securityAndComplianceAudit, 
      discrepanciesAndExceptions, 
      overallValidationScore, 
      recommendation, 
      executiveSummary 
    } = req.body;

    if (!pilotId) {
      return res.status(400).json({ error: 'pilotId is required' });
    }

    if (!coiDeclared) {
      return res.status(400).json({ error: 'Mandatory Conflict of Interest (COI) check must be declared before submitting validation.' });
    }

    const pilot = await Pilot.findById(pilotId);
    if (!pilot) {
      return res.status(404).json({ error: 'Pilot not found' });
    }

    const reportNumber = `IVR-MH-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const validation = new Validation({
      reportNumber,
      pilotId,
      contractId: req.body.contractId || null,
      proposalId: pilot.proposalId,
      startupId: pilot.startupId,
      challengeId: pilot.challengeId,
      validatorName: validatorName || 'Dr. Rameshwar Naik',
      validatorOrg: validatorOrg || 'Maharashtra State Innovation Society (MSInS) Quality Control Board',
      coiDeclared: true,
      validationScope: validationScope || {
        targetSites: pilot.location || '3 District Hospitals (Pune, Nashik, Thane)',
        sampleSize: '14,280 Live OPD Patient Transactions',
        periodCovered: '75-Day Continuous Controlled Pilot Trial'
      },
      kpiVerifications: kpiVerifications || [
        { metricName: 'Avg OPD Queue Wait Time', baseline: '210 Mins', claimed: '38 Mins', verifiedLive: '39 Mins', variancePct: 2.6, verificationStatus: 'Verified Pass', evidenceType: 'Server Telemetry Logs' },
        { metricName: 'Emergency Triage Accuracy', baseline: '70%', claimed: '98%', verifiedLive: '97.4%', variancePct: 0.6, verificationStatus: 'Verified Pass', evidenceType: 'Doctor Inspection Audit' },
        { metricName: 'System Uptime SLA', baseline: '95%', claimed: '99.8%', verifiedLive: '99.8%', variancePct: 0, verificationStatus: 'Verified Pass', evidenceType: 'Network Monitoring Logs' }
      ],
      milestoneAudits: milestoneAudits || [
        { milestoneNumber: 1, deliverableTitle: 'Hardware & Camera Kiosk Setup', auditFinding: 'Verified physical deployment across all 3 district hospitals.', evidenceQuality: 'High', complianceStatus: 'Compliant' },
        { milestoneNumber: 2, deliverableTitle: 'HMIS & WhatsApp Queue Integration', auditFinding: 'API load test verified with 0 dropped packets.', evidenceQuality: 'High', complianceStatus: 'Compliant' },
        { milestoneNumber: 3, deliverableTitle: '75-Day Continuous Trial Audit', auditFinding: 'Outcome telemetry matches hospital admission register logs.', evidenceQuality: 'High', complianceStatus: 'Compliant' }
      ],
      securityAndComplianceAudit: securityAndComplianceAudit || {
        certInPassed: true,
        dpdpDataPrivacyPassed: true,
        vulnerabilityReport: 'Zero high/critical security vulnerabilities detected.',
        slaAchievedPct: 99.8
      },
      discrepanciesAndExceptions: discrepanciesAndExceptions || [],
      overallValidationScore: Number(overallValidationScore) || 94.6,
      recommendation: recommendation || 'Recommended for Statewide Scale-Up',
      executiveSummary: executiveSummary || 'Independent validation confirms pilot meets all contracted performance criteria with exceptional reliability.'
    });

    await validation.save();

    // Update Pilot Validation Status
    pilot.validationStatus = 'Validated';
    pilot.procurementRecommendation = recommendation === 'Recommended for Statewide Scale-Up' ? 'Scale Statewide' : 'Extend Pilot';
    pilot.validatorNotes = `IVR Report ${reportNumber} submitted by ${validation.validatorName}. Overall score: ${validation.overallValidationScore}/100.`;
    await pilot.save();

    // Audit Log
    await AuditLog.create({
      action: 'INDEPENDENT_VALIDATION_COMPLETED',
      actorRole: 'Independent Validator',
      actorName: validation.validatorName,
      details: `Submitted Independent Validation Report ${validation.reportNumber} for pilot "${pilot.pilotTitle}". Recommendation: ${validation.recommendation}. Score: ${validation.overallValidationScore}/100.`,
      entityId: validation._id.toString()
    });

    // Notification to Government Procurement Desk
    await Notification.create({
      recipientRole: 'Govt Official',
      title: 'Independent Validation Report (IVR) Submitted',
      message: `Independent Validator ${validation.validatorName} submitted Report ${validation.reportNumber} with recommendation: "${validation.recommendation}" (${validation.overallValidationScore}/100). Ready for Phase 8 Scale-Up Decision.`,
      link: `/govt?tab=procurement&validationId=${validation._id}`
    });

    res.status(201).json(validation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/validations/:id/certify - Certify IVR and Hand off to Phase 8 Statewide Scale-Up Desk
router.patch('/:id/certify', async (req, res) => {
  try {
    const validation = await Validation.findById(req.params.id).populate('pilotId');
    if (!validation) return res.status(404).json({ error: 'Validation report not found' });

    validation.certifiedAt = new Date();
    await validation.save();

    await AuditLog.create({
      action: 'INDEPENDENT_VALIDATION_CERTIFIED',
      actorRole: 'Quality Board Chair',
      actorName: validation.validatorName,
      details: `Formally certified IVR ${validation.reportNumber} and handed off to Phase 8 Statewide Scale-Up Desk.`,
      entityId: validation._id.toString()
    });

    await Notification.create({
      recipientRole: 'Govt Official',
      title: 'IVR Certified for Statewide Scale-Up',
      message: `IVR ${validation.reportNumber} has been officially certified by ${validation.validatorOrg}. Ready for Phase 8 Statewide Procurement Sanction.`,
      link: `/govt?tab=procurement`
    });

    res.json({
      message: `Validation report ${validation.reportNumber} certified successfully and handed off to Phase 8.`,
      validation
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

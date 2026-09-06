const express = require('express');
const router = express.Router();
const Pilot = require('../models/Pilot');
const Challenge = require('../models/Challenge');
const Proposal = require('../models/Proposal');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');

// GET /api/pilots - Get all pilots
router.get('/', async (req, res) => {
  try {
    const pilots = await Pilot.find()
      .populate('challengeId')
      .populate('startupId')
      .populate('proposalId');
    res.json(pilots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/pilots - Create & Launch Controlled Sandbox Pilot
router.post('/', async (req, res) => {
  try {
    const { proposalId, pilotTitle, location, startDate, endDate, totalBudget, scopeDescription, targetParticipants, milestones, kpiTracking, riskManagement, dataGovernance, cyberSecurity } = req.body;

    if (!proposalId || !pilotTitle || !location) {
      return res.status(400).json({ error: 'proposalId, pilotTitle, and location are required' });
    }

    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    // Phase 4 Handoff Gate Check: Ensure candidate completed Phase 4 Evaluation
    const isPhase4Qualified = ['Shortlisted', 'Selected for Pilot', 'Under Review'].includes(proposal.status) || 
                              proposal.evaluationSummary?.evaluationsCount > 0;

    if (!isPhase4Qualified) {
      return res.status(400).json({ 
        error: `Cannot launch pilot for proposal ID: ${proposalId}. Proposal must complete Phase 4 Expert Evaluation and be shortlisted before pilot launch.` 
      });
    }

    const pilot = new Pilot({
      challengeId: proposal.challengeId,
      startupId: proposal.startupId,
      proposalId,
      pilotTitle,
      scopeDescription: scopeDescription || 'Controlled sandbox trial deployment for real-world validation.',
      location,
      targetParticipants: targetParticipants || 'District Hospitals & Local OPD Patients',
      startDate,
      endDate,
      totalBudget: Number(totalBudget) || proposal.proposedBudget,
      status: 'Pilot Active',
      milestones: milestones || [
        { milestoneNumber: 1, title: 'Setup & Infrastructure Deployment', deliverables: 'Hardware installation and initial sandbox testing', dueDate: endDate, amount: Math.round((totalBudget || 1420000) * 0.3), status: 'Pending' },
        { milestoneNumber: 2, title: 'Live Field Trial (30 Days)', deliverables: 'Process live transactions/patients and record performance', dueDate: endDate, amount: Math.round((totalBudget || 1420000) * 0.4), status: 'Pending' },
        { milestoneNumber: 3, title: 'Final Performance Audit & Evaluation', deliverables: 'Demonstrate target KPI achievement with cybersecurity signoff', dueDate: endDate, amount: Math.round((totalBudget || 1420000) * 0.3), status: 'Pending' }
      ],
      kpiTracking: kpiTracking || [
        { metricName: 'OPD Queue Wait Time Reduction', baseline: '210 Mins', target: '< 45 Mins (75% Cut)', currentLive: '38 Mins', unit: 'Mins', status: 'Target Achieved' }
      ],
      riskManagement: riskManagement || [
        { riskCategory: 'Site LAN Connectivity', description: 'Network fluctuation at district counter desks', mitigationPlan: 'Local edge caching server with offline queue fallback', severity: 'Medium', status: 'Mitigated' }
      ],
      dataGovernance: dataGovernance || {
        governmentDataRights: 'Government of Maharashtra retains 100% ownership of patient operational data, telemetry logs, and trial audit records.',
        startupIpRights: 'Startup retains exclusive intellectual property rights to underlying AI algorithms and code.',
        dpdpActCompliance: true
      },
      cyberSecurity: cyberSecurity || {
        certInDeclared: true,
        dataSecurityProtocol: 'AES-256 encrypted local hospital servers with zero public cloud PII exposure.'
      }
    });

    await pilot.save();

    // Update Challenge and Proposal Statuses
    if (proposal.challengeId) {
      await Challenge.findByIdAndUpdate(proposal.challengeId, { status: 'Pilot Active' });
    }
    proposal.status = 'Selected for Pilot';
    await proposal.save();

    // Audit Log
    await AuditLog.create({
      action: 'PILOT_LAUNCHED',
      actorRole: 'Government Officer',
      actorName: 'Department Project Desk',
      details: `Launched Phase 5 Sandbox Pilot "${pilot.pilotTitle}" at ${pilot.location} with budget ₹${pilot.totalBudget.toLocaleString('en-IN')}`,
      entityId: pilot._id.toString()
    });

    // Notification to Startup Admin
    await Notification.create({
      recipientRole: 'Startup Admin',
      title: 'Phase 5 Sandbox Pilot Launched!',
      message: `Your project '${pilot.pilotTitle}' has been configured and launched into Phase 5 Sandbox Pilot at ${pilot.location}. Log into Pilot Workspace to track milestones.`,
      link: `/startup?tab=pilots&pilotId=${pilot._id}`
    });

    res.status(201).json(pilot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/pilots/:id/milestone/:mNum - Update Milestone Status & Deliverables
router.patch('/:id/milestone/:mNum', async (req, res) => {
  try {
    const { status, approvedBy, evidenceUrl, evidenceNotes } = req.body;
    const pilot = await Pilot.findById(req.params.id);
    if (!pilot) return res.status(404).json({ error: 'Pilot not found' });

    const mNum = parseInt(req.params.mNum);
    const milestone = pilot.milestones.find(m => m.milestoneNumber === mNum);
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });

    if (status) milestone.status = status;
    if (approvedBy) milestone.approvedBy = approvedBy;
    if (evidenceUrl) milestone.evidenceUrl = evidenceUrl;
    if (evidenceNotes) milestone.evidenceNotes = evidenceNotes;
    
    await pilot.save();

    await AuditLog.create({
      action: status === 'Paid' ? 'MILESTONE_PAID' : status === 'Approved' ? 'MILESTONE_APPROVED' : 'MILESTONE_UPDATED',
      actorRole: 'Procurement / Project Officer',
      actorName: approvedBy || 'Department Officer',
      details: `Updated Milestone #${mNum} (${milestone.title}) status to '${status}' for ₹${milestone.amount.toLocaleString('en-IN')}`,
      entityId: pilot._id.toString()
    });

    res.json(pilot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/pilots/:id/kpi-telemetry - Update Live Telemetry Metrics
router.patch('/:id/kpi-telemetry', async (req, res) => {
  try {
    const { metricName, currentLive, status } = req.body;
    const pilot = await Pilot.findById(req.params.id);
    if (!pilot) return res.status(404).json({ error: 'Pilot not found' });

    const kpi = pilot.kpiTracking.find(k => k.metricName.toLowerCase() === (metricName || '').toLowerCase());
    if (kpi) {
      if (currentLive) kpi.currentLive = currentLive;
      if (status) kpi.status = status;
    } else if (metricName && currentLive) {
      pilot.kpiTracking.push({
        metricName,
        baseline: 'Baseline',
        target: 'Target Threshold',
        currentLive,
        status: status || 'On Track'
      });
    }

    await pilot.save();

    await AuditLog.create({
      action: 'KPI_TELEMETRY_UPDATED',
      actorRole: 'System Telemetry / Startup Engine',
      actorName: 'Pilot Monitor',
      details: `Updated KPI '${metricName}' live value to '${currentLive}'`,
      entityId: pilot._id.toString()
    });

    res.json(pilot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/pilots/:id/complete - Complete Pilot Execution & Hand off to Phase 6
router.post('/:id/complete', async (req, res) => {
  try {
    const pilot = await Pilot.findById(req.params.id).populate('challengeId').populate('startupId');
    if (!pilot) return res.status(404).json({ error: 'Pilot not found' });

    pilot.status = 'Completed';
    pilot.validationStatus = 'Validated';
    await pilot.save();

    await AuditLog.create({
      action: 'PILOT_COMPLETED',
      actorRole: 'Department Project Desk',
      actorName: 'Department Officer',
      details: `Phase 5 Sandbox Pilot "${pilot.pilotTitle}" successfully completed with trial score ${pilot.pilotSuccessScore}/100. Handed off to Phase 6.`,
      entityId: pilot._id.toString()
    });

    await Notification.create({
      recipientRole: 'Startup Admin',
      title: 'Phase 5 Pilot Completed Successfully!',
      message: `Congratulations! Pilot project '${pilot.pilotTitle}' has concluded successfully with a overall success score of ${pilot.pilotSuccessScore}/100.`,
      link: `/startup?tab=pilots&pilotId=${pilot._id}`
    });

    res.status(200).json({
      message: 'Pilot project completed and handed off to Phase 6',
      pilot
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/pilots/:id/scale-decision - Update Independent Validation & Scale Decision
router.patch('/:id/scale-decision', async (req, res) => {
  try {
    const { validationStatus, procurementRecommendation, validatorNotes } = req.body;
    const pilot = await Pilot.findById(req.params.id);
    if (!pilot) return res.status(404).json({ error: 'Pilot not found' });

    if (validationStatus) pilot.validationStatus = validationStatus;
    if (procurementRecommendation) pilot.procurementRecommendation = procurementRecommendation;
    if (validatorNotes) pilot.validatorNotes = validatorNotes;

    await pilot.save();

    await AuditLog.create({
      action: 'PROCUREMENT_SCALE_DECISION',
      actorRole: 'Government Officer / Independent Validator',
      actorName: 'Department Officer',
      details: `Pilot decision recorded: ${procurementRecommendation}. Validation status: ${pilot.validationStatus}`,
      entityId: pilot._id.toString()
    });

    res.json(pilot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

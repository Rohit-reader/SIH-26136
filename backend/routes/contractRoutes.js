const express = require('express');
const router = express.Router();
const Contract = require('../models/Contract');
const Pilot = require('../models/Pilot');
const Proposal = require('../models/Proposal');
const Challenge = require('../models/Challenge');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');

// GET /api/contracts - Get all contracts
router.get('/', async (req, res) => {
  try {
    const contracts = await Contract.find()
      .populate('startupId')
      .populate('challengeId')
      .populate('proposalId')
      .populate('pilotId');
    res.json(contracts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/contracts/:id - Get single contract details
router.get('/:id', async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('startupId')
      .populate('challengeId')
      .populate('proposalId')
      .populate('pilotId');
    if (!contract) return res.status(404).json({ error: 'Contract not found' });
    res.json(contract);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/contracts - Instantiate Innovation Procurement Contract
router.post('/', async (req, res) => {
  try {
    const { 
      proposalId, 
      pilotId, 
      contractTitle, 
      templateType, 
      totalValue, 
      startDate, 
      endDate, 
      milestones, 
      slaTerms, 
      dataGovernance 
    } = req.body;

    if (!proposalId || !contractTitle) {
      return res.status(400).json({ error: 'proposalId and contractTitle are required' });
    }

    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const contractNumber = `MH-INNOV-2026-CT-${Math.floor(1000 + Math.random() * 9000)}`;

    const contract = new Contract({
      contractNumber,
      contractTitle,
      pilotId: pilotId || null,
      proposalId,
      startupId: proposal.startupId,
      challengeId: proposal.challengeId,
      templateType: templateType || 'Standard Innovation Procurement Agreement',
      totalValue: Number(totalValue) || proposal.proposedBudget,
      startDate: startDate || '2026-05-15',
      endDate: endDate || '2026-11-15',
      status: 'Active',
      milestones: milestones || [
        { milestoneNumber: 1, title: 'Phase 1: Setup & Infrastructure', deliverables: 'Hardware installation & initial testing', dueDate: '2026-06-15', amount: Math.round((totalValue || 1420000) * 0.3), status: 'Pending' },
        { milestoneNumber: 2, title: 'Phase 2: Live HMIS Trial', deliverables: 'WhatsApp broadcast & live queue triage', dueDate: '2026-08-15', amount: Math.round((totalValue || 1420000) * 0.4), status: 'Pending' },
        { milestoneNumber: 3, title: 'Phase 3: Performance Audit', deliverables: 'Target wait time reduction audit signoff', dueDate: '2026-11-15', amount: Math.round((totalValue || 1420000) * 0.3), status: 'Pending' }
      ],
      slaTerms: slaTerms || {
        uptimeSlaPct: 99.5,
        performanceTargetThreshold: '75% OPD wait time reduction',
        penaltyClause: '0.5% deduction per 24h delay beyond milestone target'
      },
      dataGovernance: dataGovernance || {
        governmentDataOwnership: '100% Patient logs & telemetry belong to Govt of Maharashtra.',
        startupIpProtection: 'Proprietary AI code & computer vision IP belong exclusively to Startup.',
        certInMandatory: true
      }
    });

    await contract.save();

    // Audit Log
    await AuditLog.create({
      action: 'CONTRACT_ACTIVATED',
      actorRole: 'Procurement / Legal Officer',
      actorName: 'Department Legal & Procurement Desk',
      details: `Instantiated Innovation Contract ${contract.contractNumber} (${contract.contractTitle}) for ₹${contract.totalValue.toLocaleString('en-IN')}`,
      entityId: contract._id.toString()
    });

    // Notification to Startup Admin
    await Notification.create({
      recipientRole: 'Startup Admin',
      title: 'Innovation Procurement Contract Activated!',
      message: `Official Government Contract ${contract.contractNumber} (${contract.contractTitle}) has been executed and activated. Track milestones in Financial Desk.`,
      link: `/startup?tab=payments&contractId=${contract._id}`
    });

    res.status(201).json(contract);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/contracts/:id/milestone/:mNum/submit - Startup Submits Milestone Deliverable
router.patch('/:id/milestone/:mNum/submit', async (req, res) => {
  try {
    const { evidenceUrl, evidenceNotes } = req.body;
    const contract = await Contract.findById(req.params.id);
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    const mNum = parseInt(req.params.mNum);
    const milestone = contract.milestones.find(m => m.milestoneNumber === mNum);
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });

    milestone.status = 'Deliverable Submitted';
    if (evidenceUrl) milestone.evidenceUrl = evidenceUrl;
    if (evidenceNotes) milestone.evidenceNotes = evidenceNotes;

    await contract.save();

    await AuditLog.create({
      action: 'MILESTONE_DELIVERABLE_SUBMITTED',
      actorRole: 'Startup Admin',
      actorName: 'Startup Technical Lead',
      details: `Submitted deliverable evidence for Milestone #${mNum} under Contract ${contract.contractNumber}`,
      entityId: contract._id.toString()
    });

    await Notification.create({
      recipientRole: 'Govt Official',
      title: 'Milestone Deliverable Submitted for Verification',
      message: `Startup submitted deliverable evidence for Milestone #${mNum} under Contract ${contract.contractNumber}. Please verify for payment release.`,
      link: `/govt?tab=procurement&contractId=${contract._id}`
    });

    res.json(contract);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/contracts/:id/milestone/:mNum/verify - Department Verifies Milestone Deliverable
router.patch('/:id/milestone/:mNum/verify', async (req, res) => {
  try {
    const { approvedBy } = req.body;
    const contract = await Contract.findById(req.params.id);
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    const mNum = parseInt(req.params.mNum);
    const milestone = contract.milestones.find(m => m.milestoneNumber === mNum);
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });

    milestone.status = 'Payment Approved';
    milestone.approvedBy = approvedBy || 'Procurement & Technical Desk';

    await contract.save();

    await AuditLog.create({
      action: 'MILESTONE_VERIFIED',
      actorRole: 'Procurement Officer',
      actorName: approvedBy || 'Procurement Desk',
      details: `Verified deliverable for Milestone #${mNum} under Contract ${contract.contractNumber}. Approved payment release of ₹${milestone.amount.toLocaleString('en-IN')}`,
      entityId: contract._id.toString()
    });

    res.json(contract);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/contracts/:id/milestone/:mNum/disburse - Financial Desk Disburses Milestone Payment via Treasury (e-Kosh)
router.patch('/:id/milestone/:mNum/disburse', async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id).populate('startupId');
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    const mNum = parseInt(req.params.mNum);
    const milestone = contract.milestones.find(m => m.milestoneNumber === mNum);
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });

    const treasuryRefNo = `MH-EKOSH-2026-TR-${Math.floor(100000 + Math.random() * 900000)}`;
    milestone.status = 'Disbursed';
    milestone.treasuryRefNo = treasuryRefNo;
    milestone.disbursedAt = new Date();

    // Check if all milestones disbursed to complete contract
    const allDisbursed = contract.milestones.every(m => m.status === 'Disbursed');
    if (allDisbursed) {
      contract.status = 'Completed';
    } else {
      contract.status = 'Milestones In Progress';
    }

    await contract.save();

    await AuditLog.create({
      action: 'PAYMENT_DISBURSED',
      actorRole: 'Treasury / Finance Officer',
      actorName: 'State Finance Department (e-Kosh)',
      details: `Disbursed Milestone #${mNum} payment of ₹${milestone.amount.toLocaleString('en-IN')} under Contract ${contract.contractNumber}. Treasury Ref: ${treasuryRefNo}`,
      entityId: contract._id.toString()
    });

    await Notification.create({
      recipientRole: 'Startup Admin',
      title: 'Milestone Payment Disbursed!',
      message: `Great news! Payment of ₹${milestone.amount.toLocaleString('en-IN')} for Milestone #${mNum} has been transferred directly to your bank account. Treasury e-Kosh Ref: ${treasuryRefNo}.`,
      link: `/startup?tab=payments&contractId=${contract._id}`
    });

    res.json({
      message: `Payment disbursed successfully via Treasury e-Kosh (Ref: ${treasuryRefNo})`,
      contract
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/contracts/:id/suspend - Suspend or Terminate Contract
router.patch('/:id/suspend', async (req, res) => {
  try {
    const { action, reason } = req.body; // action: 'SUSPEND' | 'TERMINATE' | 'REINSTATE'
    const contract = await Contract.findById(req.params.id);
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    if (action === 'TERMINATE') {
      contract.status = 'Terminated';
    } else if (action === 'REINSTATE') {
      contract.status = 'Active';
    } else {
      contract.status = 'Suspended';
    }

    contract.amendmentHistory.push({
      requestedBy: 'Department Legal Desk',
      reason: reason || `Contract status changed to ${contract.status}`,
      date: new Date()
    });

    await contract.save();

    await AuditLog.create({
      action: action === 'TERMINATE' ? 'CONTRACT_TERMINATED' : 'CONTRACT_SUSPENDED',
      actorRole: 'Legal Officer',
      actorName: 'Department Legal Desk',
      details: `Contract ${contract.contractNumber} status set to '${contract.status}'. Reason: ${reason || 'Administrative action'}`,
      entityId: contract._id.toString()
    });

    res.json(contract);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

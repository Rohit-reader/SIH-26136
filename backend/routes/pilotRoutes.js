const express = require('express');
const router = express.Router();
const Pilot = require('../models/Pilot');
const Challenge = require('../models/Challenge');
const Proposal = require('../models/Proposal');
const AuditLog = require('../models/AuditLog');

// Get all pilots
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

// Create new pilot
router.post('/', async (req, res) => {
  try {
    const pilot = new Pilot(req.body);
    await pilot.save();

    // Update challenge status to Pilot Active if applicable
    if (req.body.challengeId) {
      await Challenge.findByIdAndUpdate(req.body.challengeId, { status: 'Pilot Active' });
    }
    // Update proposal status to Selected for Pilot
    if (req.body.proposalId) {
      await Proposal.findByIdAndUpdate(req.body.proposalId, { status: 'Selected for Pilot' });
    }

    await AuditLog.create({
      action: 'PILOT_LAUNCHED',
      actorRole: 'Government Officer',
      actorName: req.body.createdBy || 'Department Officer',
      details: `Launched pilot project "${pilot.pilotTitle}" at ${pilot.location}`,
      entityId: pilot._id.toString()
    });

    res.status(201).json(pilot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update Pilot Milestone Status (e.g. Approve Payment)
router.patch('/:id/milestone/:mNum', async (req, res) => {
  try {
    const { status, approvedBy } = req.body;
    const pilot = await Pilot.findById(req.params.id);
    if (!pilot) return res.status(404).json({ error: 'Pilot not found' });

    const mNum = parseInt(req.params.mNum);
    const milestone = pilot.milestones.find(m => m.milestoneNumber === mNum);
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });

    milestone.status = status;
    if (approvedBy) milestone.approvedBy = approvedBy;
    
    await pilot.save();

    await AuditLog.create({
      action: status === 'Paid' ? 'MILESTONE_PAID' : 'MILESTONE_APPROVED',
      actorRole: 'Procurement Officer',
      actorName: approvedBy || 'Procurement Desk',
      details: `Milestone #${mNum} (${milestone.title}) status changed to ${status} for ₹${milestone.amount.toLocaleString('en-IN')}`,
      entityId: pilot._id.toString()
    });

    res.json(pilot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update Independent Validation & Scale Decision
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

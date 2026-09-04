const express = require('express');
const router = express.Router();
const Proposal = require('../models/Proposal');
const AuditLog = require('../models/AuditLog');

// Get all proposals
router.get('/', async (req, res) => {
  try {
    const proposals = await Proposal.find()
      .populate('challengeId')
      .populate('startupId')
      .sort({ submittedAt: -1 });
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Proposal Status (Shortlist / Select for Pilot / Reject)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, updatedBy } = req.body;
    const proposal = await Proposal.findById(req.params.id)
      .populate('challengeId')
      .populate('startupId');

    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });

    proposal.status = status;
    await proposal.save();

    await AuditLog.create({
      action: 'PROPOSAL_STATUS_UPDATED',
      actorRole: 'Government Officer',
      actorName: updatedBy || 'Department Officer',
      details: `Updated proposal status for "${proposal.solutionTitle}" to "${status}"`,
      entityId: proposal._id.toString()
    });

    res.json(proposal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

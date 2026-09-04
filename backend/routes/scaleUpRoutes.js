const express = require('express');
const router = express.Router();
const ScaleUp = require('../models/ScaleUp');
const Challenge = require('../models/Challenge');
const AuditLog = require('../models/AuditLog');

// Get all scale-up records
router.get('/', async (req, res) => {
  try {
    const scaleUps = await ScaleUp.find()
      .populate('pilotId')
      .populate('challengeId')
      .populate('startupId')
      .sort({ createdAt: -1 });
    res.json(scaleUps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create scale-up request
router.post('/', async (req, res) => {
  try {
    const scaleUp = new ScaleUp(req.body);
    await scaleUp.save();

    if (req.body.challengeId) {
      await Challenge.findByIdAndUpdate(req.body.challengeId, { status: 'Scaled Statewide' });
    }

    await AuditLog.create({
      action: 'SCALE_UP_SANCTIONED',
      actorRole: 'Government Officer',
      actorName: req.body.createdBy || 'Government Admin',
      details: `Sanctioned scale-up request for ${scaleUp.departmentName}: ${scaleUp.scaleScope} (Budget: ₹${scaleUp.totalApprovedBudget.toLocaleString('en-IN')})`,
      entityId: scaleUp._id.toString()
    });

    res.status(201).json(scaleUp);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

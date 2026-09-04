const express = require('express');
const router = express.Router();
const Evaluation = require('../models/Evaluation');
const AuditLog = require('../models/AuditLog');

// Get all evaluations
router.get('/', async (req, res) => {
  try {
    const evaluations = await Evaluation.find().populate('proposalId');
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit Evaluation
router.post('/', async (req, res) => {
  try {
    const { scores } = req.body;
    
    // Calculate weighted total score
    const weightedTotalScore = Number((
      (scores.technicalFeasibility * 0.20) +
      (scores.innovation * 0.20) +
      (scores.expectedImpact * 0.20) +
      (scores.scalability * 0.15) +
      (scores.costEffectiveness * 0.10) +
      (scores.security * 0.10) +
      (scores.teamCapability * 0.05)
    ).toFixed(2));

    const evaluation = new Evaluation({
      ...req.body,
      weightedTotalScore
    });

    await evaluation.save();

    // Audit Log
    await AuditLog.create({
      action: 'EVALUATION_COMPLETED',
      actorRole: 'Evaluator',
      actorName: req.body.evaluatorName || 'Expert Evaluator',
      details: `Evaluated proposal with weighted score ${weightedTotalScore}/100. COI Declared: ${req.body.coiDeclared ? 'Yes' : 'No'}`,
      entityId: evaluation._id.toString()
    });

    res.status(201).json(evaluation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

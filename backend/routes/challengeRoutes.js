const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const AuditLog = require('../models/AuditLog');

// Get all challenges
router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find().sort({ createdAt: -1 });
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new challenge
router.post('/', async (req, res) => {
  try {
    const challenge = new Challenge(req.body);
    await challenge.save();

    await AuditLog.create({
      action: 'CHALLENGE_CREATED',
      actorRole: 'Department Officer',
      actorName: req.body.department || 'Government Department',
      details: `Created challenge: ${challenge.title} (Status: ${challenge.status})`,
      entityId: challenge._id.toString()
    });

    res.status(201).json(challenge);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update challenge status (Draft -> Pending Approval -> Published -> Pilot Active -> Completed -> Scaled Statewide)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, updatedBy } = req.body;
    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

    await AuditLog.create({
      action: 'CHALLENGE_STATUS_UPDATED',
      actorRole: 'Government Officer',
      actorName: updatedBy || 'Department Officer',
      details: `Updated challenge "${challenge.title}" status to "${status}"`,
      entityId: challenge._id.toString()
    });

    res.json(challenge);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update full challenge
router.put('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
    res.json(challenge);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete challenge
router.delete('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
    
    await AuditLog.create({
      action: 'CHALLENGE_DELETED',
      actorRole: 'Government Officer',
      actorName: 'Department Officer',
      details: `Deleted challenge: ${challenge.title}`,
      entityId: req.params.id
    });

    res.json({ message: 'Challenge deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Assistant for Challenge Generation
router.post('/ai-assist', async (req, res) => {
  const { problemText } = req.body;
  
  const aiGenerated = {
    title: `AI Triage & Outcome Solution for ${problemText || 'Department Operational Challenge'}`,
    expectedOutcome: `Quantifiable reduction in processing delay from baseline by > 55% within 90 days of deployment.`,
    kpiMetrics: [
      { name: 'Primary Operational Delay', baselineValue: '45 minutes', targetValue: '< 20 minutes', currentValue: 'Pending Pilot' },
      { name: 'User Satisfaction Rating', baselineValue: '40%', targetValue: '> 85%', currentValue: 'Pending Pilot' }
    ],
    requiredTechnology: ['Artificial Intelligence', 'Predictive Analytics', 'Cloud Sync', 'Cybersecurity Audit'],
    estimatedBudget: 1500000,
    securityRequirements: ['AES-256 Data Encryption', 'MeitY Empaneled Cloud', 'CERT-In Security Audit']
  };

  res.json(aiGenerated);
});

module.exports = router;

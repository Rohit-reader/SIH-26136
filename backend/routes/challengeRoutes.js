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
  const { problemText, sector } = req.body;
  const text = (problemText || '').toLowerCase();
  
  let detectedSector = sector || 'General Innovation';
  if (text.includes('hospital') || text.includes('health') || text.includes('opd') || text.includes('patient') || text.includes('doctor')) {
    detectedSector = 'Public Health';
  } else if (text.includes('crop') || text.includes('pest') || text.includes('farm') || text.includes('agri') || text.includes('soil')) {
    detectedSector = 'Agriculture & Irrigation';
  } else if (text.includes('school') || text.includes('student') || text.includes('dropout') || text.includes('education') || text.includes('skill')) {
    detectedSector = 'School Education & Skills';
  } else if (text.includes('water') || text.includes('leak') || text.includes('chlorine') || text.includes('pipe') || text.includes('sanitation')) {
    detectedSector = 'Water & Sanitation';
  } else if (text.includes('road') || text.includes('pothole') || text.includes('traffic') || text.includes('municipal') || text.includes('pwd')) {
    detectedSector = 'Smart Governance & ULBs';
  }

  const titlePrefix = problemText && problemText.length > 5 
    ? problemText.split(' ').slice(0, 7).join(' ') 
    : 'AI & Data Driven Operational Optimization';

  const aiGenerated = {
    title: `Smart Outcome Challenge: ${titlePrefix}`,
    sector: detectedSector,
    problemDescription: problemText || 'Manual operational bottlenecks leading to citizen delays and high service delivery backlogs.',
    currentSituation: `Current baseline manual workflow results in extended SLA delays and unmonitored operational inefficiencies.`,
    targetBeneficiaries: `Citizens and Department Field Officers in Pilot Districts of Maharashtra`,
    expectedOutcome: `Quantifiable improvement in operational SLA efficiency by > 60% within 90 days of controlled pilot deployment.`,
    kpiBaseline: '180 mins SLA process turnaround time',
    kpiTarget: '< 40 mins turnaround time; 100% real-time digital tracking',
    kpiMetrics: [
      { name: 'Primary SLA Turnaround', baselineValue: '180 minutes', targetValue: '< 40 minutes', currentValue: 'Pending Pilot' },
      { name: 'Field Operational Compliance', baselineValue: '35%', targetValue: '> 90%', currentValue: 'Pending Pilot' }
    ],
    requiredTechnology: ['Edge Computer Vision', 'Predictive ML Engine', 'MeitY Cloud Gateway', 'Vernacular Mobile Interfaces'],
    estimatedBudget: 1500000,
    pilotDurationDays: 90,
    securityRequirements: ['DPDP Act 2023 Compliance', 'CERT-In Empaneled Cyber Security Audit', 'AES-256 Data Encryption at Rest'],
    exemptions: {
      turnoverWaived: true,
      experienceWaived: true,
      emdExempted: true
    },
    legalClauses: [
      'GFR Rule 173(i) Waiver: 100% Prior Turnover & Experience criteria relaxed for DPIIT & MSINS registered startups.',
      'IP Ownership Protection: Startup retains 100% background and foreground Intellectual Property; Govt retains non-exclusive pilot usage license.',
      'Data Privacy & Sovereignty: Strict adherence to DPDP Act 2023 with zero PII stored on unapproved public cloud endpoints.',
      'Milestone Payment Trigger: Direct disbursement upon validation of target KPI achievement by Independent Evaluator Panel.'
    ]
  };

  res.json(aiGenerated);
});

module.exports = router;

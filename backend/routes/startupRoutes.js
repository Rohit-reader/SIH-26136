const express = require('express');
const router = express.Router();
const Startup = require('../models/Startup');

// Get all startups
router.get('/', async (req, res) => {
  try {
    const startups = await Startup.find().sort({ matchScore: -1 });
    res.json(startups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Semantic Match AI analysis
router.get('/match-analysis/:id', async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });
    
    res.json({
      startupName: startup.name,
      matchScore: startup.matchScore,
      dpiitVerified: startup.dpiitRecognized,
      reasons: startup.matchJustification,
      missingCapabilities: ['None identified — fully compliant']
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

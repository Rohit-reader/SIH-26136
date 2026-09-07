const express = require('express');
const router = express.Router();
const seedDB = require('../seed/seedData');

// POST /api/seed - Trigger database seeding for all 13 collections
router.post('/', async (req, res) => {
  try {
    const summary = await seedDB(false);
    res.json({
      success: true,
      message: 'Database seeded successfully with all 13 collections!',
      summary
    });
  } catch (err) {
    console.error('API Seed Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/seed - Also allow GET request for quick browser/dev seeding
router.get('/', async (req, res) => {
  try {
    const summary = await seedDB(false);
    res.json({
      success: true,
      message: 'Database seeded successfully with all 13 collections!',
      summary
    });
  } catch (err) {
    console.error('API Seed Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

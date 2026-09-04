const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ role: 1, name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user roles summary
router.get('/roles-summary', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const rolesSummary = {
      platform: users.filter(u => u.role === 'Super Admin'),
      government: users.filter(u => ['Government Admin', 'Department Officer', 'Procurement Officer'].includes(u.role)),
      evaluation: users.filter(u => ['Technical/Domain Evaluator', 'Cybersecurity Evaluator', 'Independent Validator'].includes(u.role)),
      startup: users.filter(u => ['Startup Admin', 'Startup Team Member'].includes(u.role)),
      viewer: users.filter(u => u.role === 'Viewer')
    };
    res.json(rolesSummary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

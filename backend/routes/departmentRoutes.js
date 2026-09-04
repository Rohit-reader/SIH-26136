const express = require('express');
const router = express.Router();
const Department = require('../models/Department');

// Get all government departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

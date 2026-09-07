const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');

// Allowed government roles
const GOVT_ROLES = ['Government Admin', 'Department Officer', 'Procurement Officer', 'Super Admin'];

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ role: 1, name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Government Officers (for Government Admin)
router.get('/officers', async (req, res) => {
  try {
    const { department, role, status, search } = req.query;
    const filter = { role: { $in: GOVT_ROLES } };

    if (department && department !== 'All') {
      filter.department = department;
    }
    if (role && role !== 'All') {
      filter.role = role;
    }
    if (status && status !== 'All') {
      filter.isActive = status === 'Active';
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }

    const officers = await User.find(filter).select('-password').sort({ createdAt: -1, name: 1 });
    res.json(officers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single officer by ID
router.get('/officers/:id', async (req, res) => {
  try {
    const officer = await User.findById(req.params.id).select('-password');
    if (!officer) return res.status(404).json({ error: 'Officer not found' });
    res.json(officer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new Government Officer (Government Admin only)
router.post('/officers', async (req, res) => {
  try {
    const { name, email, role, department, organization, phone, password, isActive, adminName } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and Email are required.' });
    }

    const assignedRole = role || 'Department Officer';
    if (!GOVT_ROLES.includes(assignedRole)) {
      return res.status(400).json({ error: `Invalid role. Must be one of: ${GOVT_ROLES.join(', ')}` });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'An officer or user with this official email already exists.' });
    }

    const newOfficer = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: assignedRole,
      department: department || 'Department of Skills & Innovation',
      organization: organization || 'Government of Maharashtra',
      phone: phone || '+91 98200 00000',
      password: password || 'GovInnovate@2026',
      isActive: isActive !== undefined ? isActive : true
    });

    // Record governance audit trail
    await AuditLog.create({
      action: 'OFFICER_CREATED',
      actorRole: 'Government Admin',
      actorName: adminName || 'Government Admin',
      details: `Created new ${assignedRole} account: ${newOfficer.name} (${newOfficer.email}) in department "${newOfficer.department}"`,
      entityId: newOfficer._id.toString()
    });

    // System notification
    await Notification.create({
      recipientRole: 'Government Admin',
      recipientName: adminName || 'Government Admin',
      type: 'System',
      title: `Officer Account Provisioned: ${newOfficer.name}`,
      message: `Officer ${newOfficer.name} has been provisioned under ${newOfficer.department} with role ${assignedRole}.`,
      link: `/govt?tab=officers`,
      entityId: newOfficer._id.toString(),
      isRead: false
    });

    const responseOfficer = newOfficer.toObject();
    delete responseOfficer.password;

    res.status(201).json({ success: true, officer: responseOfficer, message: 'Officer account created successfully.' });
  } catch (err) {
    console.error('Create officer error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update an existing Government Officer
router.put('/officers/:id', async (req, res) => {
  try {
    const { name, email, role, department, organization, phone, password, isActive, adminName } = req.body;

    const officer = await User.findById(req.params.id);
    if (!officer) return res.status(404).json({ error: 'Officer not found' });

    if (email && email.toLowerCase().trim() !== officer.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase().trim(), _id: { $ne: officer._id } });
      if (emailExists) {
        return res.status(400).json({ error: 'Another user already exists with this email.' });
      }
      officer.email = email.toLowerCase().trim();
    }

    if (name) officer.name = name.trim();
    if (role) {
      if (!GOVT_ROLES.includes(role)) {
        return res.status(400).json({ error: `Invalid role. Must be one of: ${GOVT_ROLES.join(', ')}` });
      }
      officer.role = role;
    }
    if (department !== undefined) officer.department = department;
    if (organization !== undefined) officer.organization = organization;
    if (phone !== undefined) officer.phone = phone;
    if (password) officer.password = password;
    if (isActive !== undefined) officer.isActive = isActive;

    await officer.save();

    // Record Audit Log
    await AuditLog.create({
      action: 'OFFICER_UPDATED',
      actorRole: 'Government Admin',
      actorName: adminName || 'Government Admin',
      details: `Updated details for officer ${officer.name} (${officer.email}) — Role: ${officer.role}, Dept: ${officer.department}, Active: ${officer.isActive}`,
      entityId: officer._id.toString()
    });

    const responseOfficer = officer.toObject();
    delete responseOfficer.password;

    res.json({ success: true, officer: responseOfficer, message: 'Officer updated successfully.' });
  } catch (err) {
    console.error('Update officer error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Toggle Officer Active / Inactive Status
router.patch('/officers/:id/status', async (req, res) => {
  try {
    const { isActive, adminName } = req.body;
    const officer = await User.findById(req.params.id);
    if (!officer) return res.status(404).json({ error: 'Officer not found' });

    officer.isActive = isActive !== undefined ? isActive : !officer.isActive;
    await officer.save();

    await AuditLog.create({
      action: officer.isActive ? 'OFFICER_ACTIVATED' : 'OFFICER_DEACTIVATED',
      actorRole: 'Government Admin',
      actorName: adminName || 'Government Admin',
      details: `${officer.isActive ? 'Activated' : 'Deactivated'} account for ${officer.name} (${officer.email})`,
      entityId: officer._id.toString()
    });

    res.json({ success: true, isActive: officer.isActive, message: `Officer status changed to ${officer.isActive ? 'Active' : 'Inactive'}.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an Officer (Government Admin only)
router.delete('/officers/:id', async (req, res) => {
  try {
    const { adminName } = req.query;
    const officer = await User.findById(req.params.id);
    if (!officer) return res.status(404).json({ error: 'Officer not found' });

    const deletedName = officer.name;
    const deletedEmail = officer.email;
    const deletedDept = officer.department;

    await User.findByIdAndDelete(req.params.id);

    await AuditLog.create({
      action: 'OFFICER_DELETED',
      actorRole: 'Government Admin',
      actorName: adminName || 'Government Admin',
      details: `Permanently removed officer account: ${deletedName} (${deletedEmail}) from department "${deletedDept}"`,
      entityId: req.params.id
    });

    res.json({ success: true, message: `Officer ${deletedName} deleted successfully.` });
  } catch (err) {
    console.error('Delete officer error:', err);
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

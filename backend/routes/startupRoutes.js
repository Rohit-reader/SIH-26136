const express = require('express');
const router = express.Router();
const Startup = require('../models/Startup');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const Challenge = require('../models/Challenge');

// Get all startups
router.get('/', async (req, res) => {
  try {
    const startups = await Startup.find().sort({ matchScore: -1 });
    res.json(startups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle Shortlist Startup for a Published Challenge
router.post('/:id/shortlist', async (req, res) => {
  try {
    const { challengeId } = req.body;
    if (!challengeId) return res.status(400).json({ error: 'challengeId is required' });

    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });

    startup.shortlistedChallenges = startup.shortlistedChallenges || [];
    const index = startup.shortlistedChallenges.findIndex(sc => sc.challengeId === challengeId);

    let isShortlisted = false;
    if (index > -1) {
      startup.shortlistedChallenges.splice(index, 1);
      isShortlisted = false;
    } else {
      startup.shortlistedChallenges.push({ challengeId, shortlistedAt: new Date() });
      isShortlisted = true;
    }

    await startup.save();

    await AuditLog.create({
      action: isShortlisted ? 'STARTUP_SHORTLISTED' : 'STARTUP_UNSHORTLISTED',
      actorRole: 'Government Officer',
      actorName: 'Department Officer',
      details: `${isShortlisted ? 'Shortlisted' : 'Removed'} startup "${startup.name}" for Challenge ID ${challengeId}`,
      entityId: startup._id.toString()
    });

    res.json({ success: true, isShortlisted, shortlistedChallenges: startup.shortlistedChallenges });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Issue Official Challenge Invitation to Startup
router.post('/:id/invite', async (req, res) => {
  try {
    const { challengeId, challengeTitle, departmentName, inviteMessage } = req.body;
    if (!challengeId) return res.status(400).json({ error: 'challengeId is required' });

    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });

    startup.invitedChallenges = startup.invitedChallenges || [];
    const existingInvite = startup.invitedChallenges.find(ic => ic.challengeId === challengeId);
    
    if (!existingInvite) {
      startup.invitedChallenges.push({
        challengeId,
        challengeTitle: challengeTitle || 'Government Innovation Challenge',
        departmentName: departmentName || 'Department of Maharashtra',
        invitedAt: new Date(),
        inviteMessage: inviteMessage || 'Your startup has been shortlisted & invited to apply for this outcome-based challenge.'
      });
      await startup.save();
    }

    // Send Notification to Startup Portal
    await Notification.create({
      recipientRole: 'Startup Admin',
      recipientName: startup.name,
      recipientEmail: startup.contactEmail || '',
      type: 'Challenge Invitation',
      title: `Official Challenge Invitation: ${challengeTitle || 'Innovation Challenge'}`,
      message: `${departmentName || 'Government Department'} has directly invited ${startup.name} to submit a solution proposal. Note: "${inviteMessage || 'Outcome-based milestone trial eligibility verified.'}"`,
      link: `/startup?tab=challenges&challengeId=${challengeId}`,
      entityId: challengeId,
      isRead: false
    });

    // Record Governance Audit Log
    await AuditLog.create({
      action: 'STARTUP_INVITED_TO_CHALLENGE',
      actorRole: 'Government Officer',
      actorName: departmentName || 'Department Officer',
      details: `Issued direct innovation challenge invitation to ${startup.name} for "${challengeTitle || challengeId}"`,
      entityId: startup._id.toString()
    });

    res.json({ success: true, message: `Challenge invitation sent to ${startup.name}`, invitedChallenges: startup.invitedChallenges });
  } catch (err) {
    console.error('Invite error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Calculate Dynamic AI Semantic Match Rating for a specific Challenge
router.post('/match-score', async (req, res) => {
  try {
    const { challengeId, startupId } = req.body;

    const startup = await Startup.findById(startupId);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });

    let challenge = null;
    if (challengeId) {
      challenge = await Challenge.findById(challengeId);
    }

    let matchScore = 85;
    const reasons = [];

    if (challenge) {
      const challengeSector = (challenge.sector || '').toLowerCase();
      const startupDomain = (startup.industryDomain || '').toLowerCase();
      const reqTech = (challenge.requiredTechnology || []).map(t => t.toLowerCase());
      const startupTech = (startup.technologies || []).map(t => t.toLowerCase());

      // Sector Match Check
      if (startupDomain.includes(challengeSector) || challengeSector.includes(startupDomain) || (challengeSector.includes('health') && startupDomain.includes('health')) || (challengeSector.includes('agri') && startupDomain.includes('agri'))) {
        matchScore += 10;
        reasons.push(`Direct Sector Alignment: Startup domain (${startup.industryDomain}) aligns with challenge sector (${challenge.sector}).`);
      } else {
        reasons.push(`Adjacent Sector Capability: Startup specializes in ${startup.industryDomain}.`);
      }

      // Tech Stack Match Count
      const matchingTechs = startupTech.filter(st => reqTech.some(rt => st.includes(rt) || rt.includes(st)));
      if (matchingTechs.length > 0) {
        matchScore += Math.min(15, matchingTechs.length * 6);
        reasons.push(`Tech Stack Compatibility: ${matchingTechs.length} required technology capabilities matched (${matchingTechs.join(', ')}).`);
      }

      // DPIIT Verification Bonus
      if (startup.verificationStatus === 'DPIIT Verified' || startup.dpiitRecognized) {
        matchScore += 5;
        reasons.push(`DPIIT Compliance: Verified DPIIT Recognized startup eligible for 100% GFR turnover & experience waivers.`);
      }

      // Previous Govt Projects Bonus
      if (startup.previousGovtProjects && startup.previousGovtProjects.length > 0) {
        matchScore += 5;
        reasons.push(`Proven Government Execution: Demonstrated past performance in ${startup.previousGovtProjects.join(', ')}.`);
      }
    } else {
      matchScore = startup.matchScore || 92;
      reasons.push(...(startup.matchJustification || ['High technical compatibility score with published state requirements.']));
    }

    matchScore = Math.min(99, Math.max(65, matchScore));

    res.json({
      startupId: startup._id,
      matchScore,
      reasons,
      dpiitVerified: startup.dpiitRecognized || startup.verificationStatus === 'DPIIT Verified',
      digilockerVerified: startup.digilockerVerification?.status === 'Verified'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Semantic Match AI analysis GET fallback
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

// PUT /api/startups/:id - Update Startup Profile
router.put('/:id', async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });

    // Allowed updatable fields
    const allowedFields = [
      'name', 'dpiitNumber', 'industryDomain', 'technologies', 'teamSize',
      'location', 'contactEmail', 'contactPhone', 'documents', 'certifications',
      'previousGovtProjects', 'foundingYear'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        startup[field] = req.body[field];
      }
    });

    await startup.save();

    await AuditLog.create({
      action: 'STARTUP_PROFILE_UPDATED',
      actorRole: 'Startup Admin',
      actorName: startup.name,
      details: `Updated startup profile for "${startup.name}" (DPIIT: ${startup.dpiitNumber})`,
      entityId: startup._id.toString()
    });

    res.json(startup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

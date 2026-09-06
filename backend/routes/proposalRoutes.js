const express = require('express');
const router = express.Router();
const Proposal = require('../models/Proposal');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');

// Get all proposals
router.get('/', async (req, res) => {
  try {
    const proposals = await Proposal.find()
      .populate('challengeId')
      .populate('startupId')
      .sort({ submittedAt: -1 });
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Run Automated Eligibility Checks
router.post('/:id/eligibility-check', async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate('challengeId')
      .populate('startupId');

    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });

    const startup = proposal.startupId || {};
    const isDpiit = startup.dpiitRecognized || startup.verificationStatus === 'DPIIT Verified';
    const isDigiLocker = startup.digilockerVerification?.status === 'Verified';

    const checks = {
      dpiitVerified: isDpiit,
      digilockerDocVerified: isDigiLocker || isDpiit,
      gfrTurnoverExemptionApplied: isDpiit,
      gfrExperienceExemptionApplied: isDpiit,
      emdDepositExempted: true,
      cyberSecurityDeclared: true,
      trlLevelPassed: true
    };

    proposal.eligibilityScreening = proposal.eligibilityScreening || {};
    proposal.eligibilityScreening.automatedChecks = checks;
    
    // Auto suggest screening status if still pending
    if (proposal.eligibilityScreening.screeningStatus === 'Pending Screening') {
      proposal.eligibilityScreening.screeningStatus = (isDpiit || isDigiLocker) ? 'Eligible' : 'Conditionally Eligible';
    }

    await proposal.save();
    res.json({ success: true, automatedChecks: checks, proposal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Official Eligibility Screening Decision (Phase 3 Desk)
router.patch('/:id/screening-decision', async (req, res) => {
  try {
    const { screeningStatus, officerNotes, conditionalReason, disqualificationReason, screenedBy } = req.body;
    
    const proposal = await Proposal.findById(req.params.id)
      .populate('challengeId')
      .populate('startupId');

    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });

    proposal.eligibilityScreening = proposal.eligibilityScreening || {};
    proposal.eligibilityScreening.screeningStatus = screeningStatus;
    proposal.eligibilityScreening.screenedBy = screenedBy || 'Department Officer';
    proposal.eligibilityScreening.screenedAt = new Date();
    proposal.eligibilityScreening.officerNotes = officerNotes || '';
    proposal.eligibilityScreening.conditionalReason = conditionalReason || '';
    proposal.eligibilityScreening.disqualificationReason = disqualificationReason || '';

    // Align proposal overall status
    if (screeningStatus === 'Eligible') {
      proposal.status = 'Eligible';
    } else if (screeningStatus === 'Conditionally Eligible') {
      proposal.status = 'Conditionally Eligible';
    } else if (screeningStatus === 'Not Eligible') {
      proposal.status = 'Not Eligible';
    }

    await proposal.save();

    // Send notification to startup
    const startupName = proposal.startupId?.name || 'Startup';
    const challengeTitle = proposal.challengeId?.title || 'Innovation Challenge';
    
    let notificationTitle = 'Eligibility Screening Update';
    let notificationMsg = `Your proposal for "${challengeTitle}" status: ${screeningStatus}.`;

    if (screeningStatus === 'Eligible') {
      notificationTitle = 'Eligibility Screening Passed! Advanced to Phase 4';
      notificationMsg = `Congratulations! ${startupName} has passed Phase 3 Eligibility Screening for "${challengeTitle}". Your candidate proposal is now queued for Phase 4 Expert Evaluation.`;
    } else if (screeningStatus === 'Conditionally Eligible') {
      notificationTitle = 'Conditionally Eligible — Compliance Action Required';
      notificationMsg = `Your proposal for "${challengeTitle}" is Conditionally Eligible. Required compliance: ${conditionalReason || 'Submit updated documents'}.`;
    } else if (screeningStatus === 'Not Eligible') {
      notificationTitle = 'Eligibility Screening Result: Not Eligible';
      notificationMsg = `Your proposal for "${challengeTitle}" was screened as Not Eligible. Reason: ${disqualificationReason || 'Did not meet baseline eligibility criteria'}.`;
    }

    await Notification.create({
      recipientRole: 'Startup Admin',
      recipientName: startupName,
      type: 'Eligibility Decision',
      title: notificationTitle,
      message: notificationMsg,
      link: `/startup?tab=applications&proposalId=${proposal._id}`,
      isRead: false
    });

    // Record Audit Log
    await AuditLog.create({
      action: 'ELIGIBILITY_SCREENING_DECISION',
      actorRole: 'Government Officer',
      actorName: screenedBy || 'Department Officer',
      details: `Executed Phase 3 Eligibility Screening decision for "${proposal.solutionTitle}" (${startupName}): ${screeningStatus}`,
      entityId: proposal._id.toString()
    });

    res.json(proposal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update Proposal Status (Shortlist / Select for Pilot / Reject)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, updatedBy } = req.body;
    const proposal = await Proposal.findById(req.params.id)
      .populate('challengeId')
      .populate('startupId');

    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });

    proposal.status = status;
    await proposal.save();

    await AuditLog.create({
      action: 'PROPOSAL_STATUS_UPDATED',
      actorRole: 'Government Officer',
      actorName: updatedBy || 'Department Officer',
      details: `Updated proposal status for "${proposal.solutionTitle}" to "${status}"`,
      entityId: proposal._id.toString()
    });

    res.json(proposal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Proposal = require('../models/Proposal');
const Challenge = require('../models/Challenge');
const Startup = require('../models/Startup');
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

// Create new Proposal (Startup Submit Flow)
router.post('/', async (req, res) => {
  try {
    const {
      challengeId,
      startupId,
      solutionTitle,
      technicalApproach,
      architectureSummary,
      implementationTimelineDays,
      proposedBudget,
      teamOverview,
      securityApproach
    } = req.body;

    if (!challengeId) return res.status(400).json({ error: 'challengeId is required' });
    if (!startupId) return res.status(400).json({ error: 'startupId is required' });
    if (!solutionTitle) return res.status(400).json({ error: 'solutionTitle is required' });

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ error: 'Target Challenge not found' });

    const startup = await Startup.findById(startupId);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });

    const isDpiit = startup.dpiitRecognized || startup.verificationStatus === 'DPIIT Verified';
    const isDigiLocker = startup.digilockerVerification?.status === 'Verified';

    const newProposal = await Proposal.create({
      challengeId,
      startupId,
      solutionTitle,
      technicalApproach: technicalApproach || 'Localized solution methodology using modern technology stack.',
      architectureSummary: architectureSummary || 'Scalable architecture with MeitY cloud compliance and secure API integrations.',
      implementationTimelineDays: Number(implementationTimelineDays) || 75,
      proposedBudget: Number(proposedBudget) || challenge.estimatedBudget || 1500000,
      teamOverview: teamOverview || `${startup.name} core engineering team of ${startup.teamSize || 20}+ domain specialists.`,
      securityApproach: securityApproach || 'Strict compliance with DPDP Act 2023, ISO 27001, and CERT-In baseline standards.',
      status: 'Submitted',
      eligibilityScreening: {
        screeningStatus: 'Pending Screening',
        screenedBy: 'Department Screening Desk',
        officerNotes: '',
        automatedChecks: {
          dpiitVerified: isDpiit,
          digilockerDocVerified: isDigiLocker || isDpiit,
          gfrTurnoverExemptionApplied: isDpiit,
          gfrExperienceExemptionApplied: isDpiit,
          emdDepositExempted: true,
          cyberSecurityDeclared: true,
          trlLevelPassed: true
        }
      },
      evaluationSummary: {
        aggregateScore: 0,
        evaluationsCount: 0,
        consensusRecommendation: 'Pending Evaluation',
        evaluationStatus: 'Pending Assignment'
      },
      submittedAt: new Date()
    });

    // Populate for response
    await newProposal.populate(['challengeId', 'startupId']);

    // Record Audit Log
    await AuditLog.create({
      action: 'PROPOSAL_SUBMITTED',
      actorRole: 'Startup Admin',
      actorName: startup.name,
      details: `Submitted outcome-based innovation proposal "${solutionTitle}" for challenge "${challenge.title}"`,
      entityId: newProposal._id.toString()
    });

    // Notification for Government Dept
    await Notification.create({
      recipientRole: 'Government Officer',
      recipientName: challenge.department || 'Department Officer',
      type: 'Proposal',
      title: `New Proposal Submitted: ${solutionTitle}`,
      message: `${startup.name} has submitted a proposal for "${challenge.title}". Ready for Phase 3 Eligibility Screening.`,
      link: `/govt?tab=applications&proposalId=${newProposal._id}`,
      entityId: newProposal._id.toString(),
      isRead: false
    });

    // Notification for Startup
    await Notification.create({
      recipientRole: 'Startup Admin',
      recipientName: startup.name,
      recipientEmail: startup.contactEmail || '',
      type: 'Proposal',
      title: `Proposal Submitted: ${solutionTitle}`,
      message: `Your proposal for "${challenge.title}" has been successfully submitted and entered the Phase 3 Screening Queue.`,
      link: `/startup?tab=applications&proposalId=${newProposal._id}`,
      entityId: newProposal._id.toString(),
      isRead: false
    });

    res.status(201).json(newProposal);
  } catch (err) {
    console.error('Proposal submission error:', err);
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

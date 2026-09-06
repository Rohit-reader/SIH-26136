const express = require('express');
const router = express.Router();
const Evaluation = require('../models/Evaluation');
const Proposal = require('../models/Proposal');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');

// GET /api/evaluations - Get all evaluations
router.get('/', async (req, res) => {
  try {
    const evaluations = await Evaluation.find()
      .populate({
        path: 'proposalId',
        populate: [
          { path: 'startupId', select: 'name logo dpiitNumber sector email' },
          { path: 'challengeId', select: 'title department category estimatedBudget' }
        ]
      });
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/evaluations/assign - Assign an Expert Evaluator to a Phase 3 Eligible Proposal
router.post('/assign', async (req, res) => {
  try {
    const { proposalId, evaluatorName, evaluatorRole } = req.body;

    if (!proposalId || !evaluatorName) {
      return res.status(400).json({ error: 'proposalId and evaluatorName are required' });
    }

    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    // Phase 3 Gate Check: Only Eligible or Conditionally Eligible proposals can be evaluated
    const screeningStatus = proposal.eligibilityScreening?.screeningStatus || proposal.status;
    const isEligible = ['Eligible', 'Conditionally Eligible'].includes(screeningStatus) || 
                       ['Eligible', 'Conditionally Eligible'].includes(proposal.status);

    if (!isEligible) {
      return res.status(400).json({ 
        error: `Proposal cannot be assigned to expert evaluator. Current Phase 3 screening status is '${screeningStatus}'. Only 'Eligible' or 'Conditionally Eligible' proposals can proceed to Phase 4.` 
      });
    }

    // Check if evaluator is already assigned
    const alreadyAssigned = proposal.assignedEvaluators.some(
      ev => ev.evaluatorName.toLowerCase() === evaluatorName.toLowerCase()
    );

    if (!alreadyAssigned) {
      proposal.assignedEvaluators.push({
        evaluatorName,
        evaluatorRole: evaluatorRole || 'Domain / Technical Expert',
        status: 'Assigned'
      });
    }

    if (!proposal.evaluationSummary) {
      proposal.evaluationSummary = {};
    }
    proposal.evaluationSummary.evaluationStatus = 'Under Evaluation';
    if (proposal.status === 'Submitted' || proposal.status === 'Eligible') {
      proposal.status = 'Under Review';
    }

    await proposal.save();

    // Audit Log
    await AuditLog.create({
      action: 'EXPERT_EVALUATOR_ASSIGNED',
      actorRole: 'Government Officer',
      actorName: 'Department Evaluation Board',
      details: `Assigned expert evaluator '${evaluatorName}' (${evaluatorRole || 'Domain Expert'}) to evaluate proposal ID: ${proposalId}`,
      entityId: proposalId
    });

    // Notification to Evaluator Desk
    await Notification.create({
      recipientRole: 'Evaluator',
      title: 'New Evaluation Assignment',
      message: `You have been assigned to evaluate proposal '${proposal.solutionTitle}'. Please log into Evaluator Console to submit your COI declaration and scorecard.`,
      link: `/evaluator?proposalId=${proposalId}`
    });

    res.status(200).json({ 
      message: `Expert evaluator ${evaluatorName} assigned successfully.`, 
      proposal 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/evaluations - Submit Expert Scorecard & COI Declaration
router.post('/', async (req, res) => {
  try {
    const { 
      proposalId, 
      evaluatorName, 
      evaluatorRole, 
      coiDeclared, 
      scores = {}, 
      comments, 
      riskObservations, 
      recommendation 
    } = req.body;

    if (!proposalId) {
      return res.status(400).json({ error: 'proposalId is required' });
    }

    // Verify Proposal existence & Phase 3 Eligibility Gate
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ error: 'Target proposal not found' });
    }

    // Check Conflict of Interest (COI)
    if (!coiDeclared) {
      // Mark assignment as conflict declared
      const evaluatorIdx = proposal.assignedEvaluators.findIndex(
        ev => ev.evaluatorName.toLowerCase() === (evaluatorName || '').toLowerCase()
      );
      if (evaluatorIdx !== -1) {
        proposal.assignedEvaluators[evaluatorIdx].status = 'Conflict Declared';
        await proposal.save();
      }

      await AuditLog.create({
        action: 'COI_DECLARATION_CONFLICT',
        actorRole: 'Evaluator',
        actorName: evaluatorName || 'Expert Evaluator',
        details: `Evaluator declared Conflict of Interest (COI) for proposal ID: ${proposalId}. Evaluation blocked.`,
        entityId: proposalId
      });

      return res.status(400).json({ error: 'Evaluation blocked due to declared Conflict of Interest (COI).' });
    }

    // Calculate 7-Criteria Weighted Total Score
    const techScore = Number(scores.technicalFeasibility || 90);
    const innovScore = Number(scores.innovation || 90);
    const impactScore = Number(scores.expectedImpact || 90);
    const scaleScore = Number(scores.scalability || 85);
    const costScore = Number(scores.costEffectiveness || 85);
    const secScore = Number(scores.security || 90);
    const teamScore = Number(scores.teamCapability || 90);

    const weightedTotalScore = Number((
      (techScore * 0.20) +
      (innovScore * 0.20) +
      (impactScore * 0.20) +
      (scaleScore * 0.15) +
      (costScore * 0.10) +
      (secScore * 0.10) +
      (teamScore * 0.05)
    ).toFixed(2));

    // Save Evaluation
    const evaluation = new Evaluation({
      proposalId,
      evaluatorName: evaluatorName || 'Dr. Anand Sharma (Senior Health Tech Expert)',
      evaluatorRole: evaluatorRole || 'Technical/Domain Evaluator',
      coiDeclared: true,
      scores: {
        technicalFeasibility: techScore,
        innovation: innovScore,
        expectedImpact: impactScore,
        scalability: scaleScore,
        costEffectiveness: costScore,
        security: secScore,
        teamCapability: teamScore
      },
      weightedTotalScore,
      comments: comments || 'High technical feasibility with robust implementation framework.',
      riskObservations: riskObservations || '',
      recommendation: recommendation || 'Recommend for Pilot'
    });

    await evaluation.save();

    // Recalculate Aggregate Scores for the Proposal across ALL submitted evaluations
    const allEvaluations = await Evaluation.find({ proposalId });
    const count = allEvaluations.length;
    const totalWeightedSum = allEvaluations.reduce((sum, e) => sum + (e.weightedTotalScore || 0), 0);
    const aggregateScore = Number((totalWeightedSum / count).toFixed(2));

    // Determine consensus recommendation
    const recommendPilotCount = allEvaluations.filter(e => e.recommendation === 'Recommend for Pilot').length;
    let consensusRec = 'Recommend for Pilot';
    if (recommendPilotCount < count / 2) {
      consensusRec = 'Requires Revisions';
    }

    // Update Proposal evaluationSummary & assignedEvaluators
    proposal.evaluationSummary = {
      aggregateScore,
      evaluationsCount: count,
      consensusRecommendation: consensusRec,
      evaluationStatus: 'Evaluated'
    };

    const evIdx = proposal.assignedEvaluators.findIndex(
      ev => ev.evaluatorName.toLowerCase() === (evaluatorName || '').toLowerCase()
    );
    if (evIdx !== -1) {
      proposal.assignedEvaluators[evIdx].status = 'Evaluated';
    } else {
      proposal.assignedEvaluators.push({
        evaluatorName: evaluatorName || 'Dr. Anand Sharma (Senior Health Tech Expert)',
        evaluatorRole: evaluatorRole || 'Technical/Domain Evaluator',
        status: 'Evaluated'
      });
    }

    await proposal.save();

    // Audit Log
    await AuditLog.create({
      action: 'EVALUATION_COMPLETED',
      actorRole: 'Evaluator',
      actorName: evaluatorName || 'Expert Evaluator',
      details: `Completed evaluation for proposal ID: ${proposalId}. Weighted Score: ${weightedTotalScore}/100. Recommendation: ${recommendation}. Updated aggregate score: ${aggregateScore}/100.`,
      entityId: evaluation._id.toString()
    });

    // Notification to Government Board
    await Notification.create({
      recipientRole: 'Govt Official',
      title: 'Expert Evaluation Submitted',
      message: `Expert evaluator ${evaluatorName || 'Dr. Anand Sharma'} submitted scorecard (${weightedTotalScore}/100) for proposal '${proposal.solutionTitle}'. Current Aggregate Score: ${aggregateScore}/100.`,
      link: `/govt?tab=evaluations&proposalId=${proposalId}`
    });

    res.status(201).json(evaluation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/evaluations/moderate/:proposalId - Government Officer Moderation & Shortlisting for Phase 5 Pilot
router.post('/moderate/:proposalId', async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { action, officerNotes } = req.body; // action: 'SHORTLIST' | 'REJECT' | 'REVISION'

    const proposal = await Proposal.findById(proposalId).populate('startupId');
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    if (action === 'SHORTLIST' || !action) {
      proposal.status = 'Shortlisted';
      proposal.evaluationSummary.evaluationStatus = 'Shortlisted';
    } else if (action === 'REJECT') {
      proposal.status = 'Rejected';
    } else if (action === 'REVISION') {
      proposal.status = 'Under Review';
    }

    await proposal.save();

    // Audit Log
    await AuditLog.create({
      action: 'EVALUATION_MODERATED',
      actorRole: 'Government Officer',
      actorName: 'Department Evaluation Board',
      details: `Moderated Phase 4 evaluation for proposal '${proposal.solutionTitle}'. Decision: ${action || 'SHORTLIST'}. Officer Notes: ${officerNotes || 'Shortlisted based on multi-expert consensus.'}`,
      entityId: proposalId
    });

    // Notification to Startup Admin
    await Notification.create({
      recipientRole: 'Startup Admin',
      title: 'Proposal Shortlisted for Phase 5 Pilot Sandbox!',
      message: `Great news! Your proposal '${proposal.solutionTitle}' has passed Phase 4 Expert Evaluation with aggregate score ${proposal.evaluationSummary?.aggregateScore || 92}/100 and is shortlisted for Phase 5 Field Pilot.`,
      link: `/startup?tab=applications&proposalId=${proposalId}`
    });

    res.status(200).json({
      message: `Proposal successfully moderated and set to ${proposal.status}`,
      proposal
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  proposalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal', required: true },
  evaluatorName: { type: String, required: true },
  evaluatorRole: { type: String, default: 'Technical/Domain Evaluator' },
  coiDeclared: { type: Boolean, required: true, default: true },
  scores: {
    technicalFeasibility: { type: Number, default: 90 }, // Weight 20%
    innovation: { type: Number, default: 92 },           // Weight 20%
    expectedImpact: { type: Number, default: 95 },       // Weight 20%
    scalability: { type: Number, default: 88 },           // Weight 15%
    costEffectiveness: { type: Number, default: 85 },     // Weight 10%
    security: { type: Number, default: 90 },              // Weight 10%
    teamCapability: { type: Number, default: 94 }         // Weight 5%
  },
  weightedTotalScore: { type: Number, default: 90.75 },
  comments: { type: String, default: 'Outstanding implementation plan with robust queue optimization model.' },
  recommendation: { type: String, enum: ['Recommend for Pilot', 'Requires Revisions', 'Reject'], default: 'Recommend for Pilot' },
  evaluatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Evaluation', evaluationSchema);

const mongoose = require('mongoose');

const scaleUpSchema = new mongoose.Schema({
  pilotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pilot', required: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  departmentName: { type: String, required: true },
  scaleScope: { type: String, required: true }, // e.g. 'Statewide 36 Districts deployment'
  targetDistrictsCount: { type: Number, default: 36 },
  targetBeneficiaries: { type: String, required: true },
  scalableUnits: { type: Number, required: true },
  totalApprovedBudget: { type: Number, required: true },
  procurementMechanism: { type: String, default: 'GeM Innovation Portal / Direct MSINS State Sanction' },
  gemIntegrationRef: { type: String, default: '' },
  approvalStatus: { 
    type: String, 
    enum: ['Approved', 'Sanctioned', 'Contract Signed', 'In Rollout'], 
    default: 'Approved' 
  },
  sanctionedDate: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScaleUp', scaleUpSchema);

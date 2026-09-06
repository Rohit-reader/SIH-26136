const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dpiitNumber: { type: String, required: true },
  dpiitRecognized: { type: Boolean, default: true },
  industryDomain: { type: String, required: true },
  technologies: [{ type: String }],
  foundingYear: { type: Number, default: 2021 },
  teamSize: { type: Number, default: 24 },
  location: { type: String, default: 'Pune, Maharashtra' },
  certifications: [{ type: String }],
  previousGovtProjects: [{ type: String }],
  matchScore: { type: Number, default: 94 },
  matchJustification: [{ type: String }],
  verificationStatus: { 
    type: String, 
    enum: ['Pending', 'Document Verified', 'Eligibility Verified', 'DPIIT Verified'], 
    default: 'DPIIT Verified' 
  },
  contactEmail: { type: String, required: true },
  digilockerVerification: {
    status: {
      type: String,
      enum: ['Not Verified', 'Verification in Progress', 'Verified', 'Failed', 'Expired'],
      default: 'Not Verified'
    },
    provider: { type: String, default: 'digilocker' }, // 'digilocker' or 'mock'
    mode: { type: String, default: 'production' }, // 'production' or 'demo'
    verifiedAt: { type: Date },
    documentType: { type: String, default: 'DPIIT Recognition Certificate' },
    issuer: { type: String, default: 'Department for Promotion of Industry and Internal Trade (DPIIT)' },
    maskedDocRef: { type: String },
    failureReason: { type: String }
  },
  documents: [{
    title: { type: String, required: true },
    type: { type: String, required: true },
    url: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }],
  shortlistedChallenges: [{
    challengeId: { type: String, required: true },
    shortlistedAt: { type: Date, default: Date.now }
  }],
  invitedChallenges: [{
    challengeId: { type: String, required: true },
    challengeTitle: { type: String },
    departmentName: { type: String },
    invitedAt: { type: Date, default: Date.now },
    inviteMessage: { type: String }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Startup', startupSchema);

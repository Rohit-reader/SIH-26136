import React, { useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import axios from 'axios';
import { formatText } from '../utils/textUtils';

export const ProposalModal = ({ isOpen, onClose, challenge, onProposalSubmitted }) => {
  const [formData, setFormData] = useState({
    solutionTitle: 'SmartOPD — AI Triage and Computer Vision Queue Triage Platform',
    technicalApproach: 'Deploys edge-AI cameras and smart token kiosks to dynamically estimate patient wait times, auto-route priority emergency cases, and broadcast queue status via WhatsApp and local hospital screens.',
    architectureSummary: 'Microservices architecture with local hospital server fallback, encrypted API gateways, and MeitY-approved cloud sync.',
    implementationTimelineDays: 75,
    proposedBudget: 1420000,
    teamOverview: 'Lead by Dr. V. Deshmukh (Ex-AIIMS Health Tech Specialist) and 5 Senior AI Engineers.',
    securityApproach: 'End-to-end AES-256 encryption, zero PII exposure to public APIs, compliance with Digital Personal Data Protection Act 2023.'
  });

  if (!isOpen || !challenge) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get startup id
      const resS = await axios.get('/api/startups');
      const startupId = resS.data[0]._id;

      await axios.post('/api/evaluations', {
        proposalId: challenge._id,
        evaluatorName: 'Dr. A. Sharma',
        coiDeclared: true,
        scores: { technicalFeasibility: 92, innovation: 94, expectedImpact: 96, scalability: 90, costEffectiveness: 88, security: 92, teamCapability: 95 },
        recommendation: 'Recommend for Pilot'
      });

      alert('Proposal Submitted Successfully! Candidate entered Multi-Expert Evaluation Queue.');
      onProposalSubmitted();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <span className="badge badge-emerald">Startup Proposal Submission</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', marginTop: '0.2rem' }}>
              Apply for Challenge: {formatText(challenge.title)}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#64748B" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Proposed Solution Title</label>
              <input
                className="form-input"
                value={formData.solutionTitle}
                onChange={e => setFormData({ ...formData, solutionTitle: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Technical & Algorithmic Approach</label>
              <textarea
                className="form-textarea"
                rows="3"
                value={formData.technicalApproach}
                onChange={e => setFormData({ ...formData, technicalApproach: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Proposed Budget (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.proposedBudget}
                  onChange={e => setFormData({ ...formData, proposedBudget: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Implementation Days</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.implementationTimelineDays}
                  onChange={e => setFormData({ ...formData, implementationTimelineDays: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Cybersecurity & Data Privacy Architecture</label>
              <textarea
                className="form-textarea"
                rows="2"
                value={formData.securityApproach}
                onChange={e => setFormData({ ...formData, securityApproach: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-emerald">
              <Send size={16} />
              <span>Submit Official Proposal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

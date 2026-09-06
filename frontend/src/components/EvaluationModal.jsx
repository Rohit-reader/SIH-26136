import React, { useState } from 'react';
import { X, Scale, ShieldAlert, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { formatText } from '../utils/textUtils';

export const EvaluationModal = ({ isOpen, onClose, proposal, onEvaluationSubmitted }) => {
  const [coiDeclared, setCoiDeclared] = useState(true);
  const [scores, setScores] = useState({
    technicalFeasibility: 92,
    innovation: 94,
    expectedImpact: 96,
    scalability: 90,
    costEffectiveness: 88,
    security: 92,
    teamCapability: 95
  });
  const [comments, setComments] = useState('Outstanding technical approach with realistic OPD queue optimization algorithms and solid security certifications.');
  const [riskObservations, setRiskObservations] = useState('Low risk. Requires dedicated LAN access at hospital site.');
  const [recommendation, setRecommendation] = useState('Recommend for Pilot');

  if (!isOpen || !proposal) return null;

  const calculateTotal = () => {
    const total = (
      (scores.technicalFeasibility * 0.20) +
      (scores.innovation * 0.20) +
      (scores.expectedImpact * 0.20) +
      (scores.scalability * 0.15) +
      (scores.costEffectiveness * 0.10) +
      (scores.security * 0.10) +
      (scores.teamCapability * 0.05)
    );
    return total.toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coiDeclared) {
      alert('You must declare No Conflict of Interest (COI) before evaluating.');
      return;
    }

    try {
      await axios.post('/api/evaluations', {
        proposalId: proposal._id,
        evaluatorName: 'Dr. A. Sharma (Senior Health Tech Expert)',
        evaluatorRole: 'Technical/Domain Evaluator',
        coiDeclared,
        scores,
        comments,
        riskObservations,
        recommendation
      });
      alert('Expert Scorecard Submitted Successfully! Aggregate score updated.');
      if (onEvaluationSubmitted) onEvaluationSubmitted();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to submit expert evaluation');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <span className="badge badge-navy">Expert Evaluation Engine</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', marginTop: '0.2rem' }}>
              Evaluate Startup Proposal
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#64748B" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Conflict of Interest Checkbox Card */}
            <div style={{
              backgroundColor: coiDeclared ? '#ECFDF5' : '#FEF2F2',
              border: coiDeclared ? '1px solid #A7F3D0' : '1px solid #FCA5A5',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.25rem'
            }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={coiDeclared}
                  onChange={e => setCoiDeclared(e.target.checked)}
                  style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#059669' }}
                />
                <div>
                  <p style={{ fontWeight: 700, color: coiDeclared ? '#065F46' : '#991B1B', fontSize: '0.9rem' }}>
                    Mandatory Conflict of Interest (COI) Declaration
                  </p>
                  <p style={{ fontSize: '0.8rem', color: coiDeclared ? '#047857' : '#B91C1C' }}>
                    "I hereby solemnly declare that I have no financial, directorship, or personal conflict of interest with this startup candidate."
                  </p>
                </div>
              </label>
            </div>

            {/* Scorecard Sliders */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540' }}>Configurable Criteria Scorecard</h4>
              <div style={{ backgroundColor: '#0A2540', color: '#FFFFFF', padding: '0.35rem 0.85rem', borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem' }}>
                Total Score: <span style={{ color: '#FF9933' }}>{calculateTotal()} / 100</span>
              </div>
            </div>

            {[
              { key: 'technicalFeasibility', label: 'Technical Feasibility', weight: '20%' },
              { key: 'innovation', label: 'Innovation & Approach', weight: '20%' },
              { key: 'expectedImpact', label: 'Expected KPI Impact', weight: '20%' },
              { key: 'scalability', label: 'Scalability Potential', weight: '15%' },
              { key: 'costEffectiveness', label: 'Cost Effectiveness', weight: '10%' },
              { key: 'security', label: 'Cybersecurity & Privacy', weight: '10%' },
              { key: 'teamCapability', label: 'Team Capability', weight: '5%' }
            ].map(item => (
              <div key={item.key} style={{ marginBottom: '1rem', backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 600, color: '#1E293B', marginBottom: '0.35rem' }}>
                  <span>{formatText(item.label)} <span style={{ color: '#64748B', fontWeight: 400 }}>(Weight: {item.weight})</span></span>
                  <span style={{ color: '#0A2540', fontWeight: 700 }}>{scores[item.key]} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scores[item.key]}
                  onChange={e => setScores({ ...scores, [item.key]: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#0A2540' }}
                />
              </div>
            ))}

            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label className="form-label">Evaluator Comments & Risk Observations</label>
              <textarea
                className="form-textarea"
                rows="3"
                value={comments}
                onChange={e => setComments(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Final Recommendation</label>
              <select
                className="form-select"
                value={recommendation}
                onChange={e => setRecommendation(e.target.value)}
              >
                <option value="Recommend for Pilot">Recommend for Controlled Pilot</option>
                <option value="Requires Revisions">Requires Technical Revisions</option>
                <option value="Reject">Reject Application</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-emerald">
              <Scale size={16} />
              <span>Submit Expert Scorecard</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

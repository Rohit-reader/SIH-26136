import React, { useState } from 'react';
import { Award, ShieldCheck, UserCheck, CheckCircle2, AlertTriangle, Plus, X } from 'lucide-react';
import axios from 'axios';
import { formatText } from '../../utils/textUtils';

export const GovtEvaluationsTab = ({ evaluations = [], proposals = [], onRefresh, onSelectForPilot }) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedEvaluator, setSelectedEvaluator] = useState('Dr. Anand Sharma');
  const [selectedProposalId, setSelectedProposalId] = useState('');

  const handleAssignEvaluator = (e) => {
    e.preventDefault();
    alert(`Assigned ${selectedEvaluator} to evaluate selected proposal.`);
    setIsAssignModalOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0A2540' }}>
            Domain Expert & Cybersecurity Evaluation Panel
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Multi-criteria scorecards, conflict-of-interest declarations, evaluator assignments, and applicant ranking
          </p>
        </div>
        <button onClick={() => setIsAssignModalOpen(true)} className="btn-primary">
          <Plus size={16} />
          <span>Assign Expert Evaluator</span>
        </button>
      </div>

      {/* Ranking & Scoreboard Table */}
      <div className="gov-card" style={{ marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', marginBottom: '1rem' }}>
          Applicant Evaluation Ranking Scoreboard
        </h3>
        <table className="gov-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Solution & Startup</th>
              <th>Evaluator Name & Role</th>
              <th>COI Status</th>
              <th>Weighted Score</th>
              <th>Recommendation</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map((ev, idx) => {
              const proposalTitle = ev.proposalId?.solutionTitle || 'SmartOPD Platform';
              const startupName = ev.proposalId?.startupId?.name || 'HealthAI Solutions Pvt Ltd';

              return (
                <tr key={ev._id || idx}>
                  <td><strong style={{ fontSize: '1.1rem', color: '#0A2540' }}>#{idx + 1}</strong></td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0A2540' }}>{formatText(proposalTitle)}</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B' }}>{formatText(startupName)}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#0F172A' }}>{ev.evaluatorName}</span>
                    <span style={{ display: 'block', fontSize: '0.725rem', color: '#2563EB' }}>{ev.evaluatorRole}</span>
                  </td>
                  <td>
                    <span className="badge badge-emerald">
                      <ShieldCheck size={12} /> COI Clear (Declared)
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669' }}>
                      {ev.weightedTotalScore} / 100
                    </span>
                  </td>
                  <td><span className="badge badge-navy">{formatText(ev.recommendation)}</span></td>
                  <td>
                    <button
                      onClick={() => onSelectForPilot && onSelectForPilot(ev.proposalId)}
                      className="btn-emerald"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                    >
                      <CheckCircle2 size={13} /> Select for Pilot
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Criteria Weighting Breakdown Cards */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', marginBottom: '1rem' }}>
        Detailed Evaluation Breakdown Cards
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {evaluations.map((ev, idx) => (
          <div key={ev._id || idx} className="gov-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0A2540' }}>{ev.evaluatorName}</h4>
                <span style={{ fontSize: '0.775rem', color: '#2563EB', fontWeight: 600 }}>{ev.evaluatorRole}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>{ev.weightedTotalScore}</span>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748B' }}>WEIGHTED SCORE</span>
              </div>
            </div>

            {/* Criteria Scores Grid */}
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.75rem', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.25rem' }}>
                <span>Technical Feasibility (20%):</span>
                <strong>{ev.scores?.technicalFeasibility || 90}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.25rem' }}>
                <span>Innovation & IP (20%):</span>
                <strong>{ev.scores?.innovation || 92}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.25rem' }}>
                <span>Expected Impact (20%):</span>
                <strong>{ev.scores?.expectedImpact || 95}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.25rem' }}>
                <span>Scalability (15%):</span>
                <strong>{ev.scores?.scalability || 88}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.25rem' }}>
                <span>Cost Effectiveness (10%):</span>
                <strong>{ev.scores?.costEffectiveness || 85}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.25rem' }}>
                <span>Cybersecurity (10%):</span>
                <strong>{ev.scores?.security || 90}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem' }}>
                <span>Team Capability (5%):</span>
                <strong>{ev.scores?.teamCapability || 94}</strong>
              </div>
            </div>

            <p style={{ fontSize: '0.825rem', color: '#334155', fontStyle: 'italic' }}>
              "{formatText(ev.comments)}"
            </p>
          </div>
        ))}
      </div>

      {/* Assign Evaluator Modal */}
      {isAssignModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAssignModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540' }}>Assign Domain Expert / Evaluator</h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAssignEvaluator}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Proposal</label>
                  <select 
                    value={selectedProposalId} 
                    onChange={e => setSelectedProposalId(e.target.value)} 
                    className="form-select"
                    required
                  >
                    <option value="">-- Choose Proposal --</option>
                    {proposals.map(p => (
                      <option key={p._id} value={p._id}>{formatText(p.solutionTitle)}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Select Evaluator</label>
                  <select 
                    value={selectedEvaluator} 
                    onChange={e => setSelectedEvaluator(e.target.value)} 
                    className="form-select"
                  >
                    <option value="Dr. Anand Sharma">Dr. Anand Sharma (Technical / HealthTech Expert)</option>
                    <option value="Dr. Sneha Joshi">Dr. Sneha Joshi (AgriTech & Sensors Specialist)</option>
                    <option value="Vikramaditya Mane">Vikramaditya Mane (CERT-In Cybersecurity Auditor)</option>
                    <option value="Dr. Rameshwar Naik">Dr. Rameshwar Naik (Quality Control Board)</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsAssignModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Assign Evaluator</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

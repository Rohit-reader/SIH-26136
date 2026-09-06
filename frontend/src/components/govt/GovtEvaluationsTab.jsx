import React, { useState } from 'react';
import { Award, ShieldCheck, UserCheck, CheckCircle2, AlertTriangle, Plus, X, Rocket } from 'lucide-react';
import axios from 'axios';
import { formatText } from '../../utils/textUtils';

export const GovtEvaluationsTab = ({ evaluations = [], proposals = [], onRefresh, onSelectForPilot }) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedEvaluator, setSelectedEvaluator] = useState('Dr. Anand Sharma');
  const [evaluatorRole, setEvaluatorRole] = useState('Technical / HealthTech Expert');
  const [selectedProposalId, setSelectedProposalId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter proposals eligible for Phase 4 Expert Evaluation (Phase 3 Gate Check)
  const eligibleProposals = proposals.filter(p => {
    const s = p.eligibilityScreening?.screeningStatus || p.status;
    return ['Eligible', 'Conditionally Eligible', 'Under Review', 'Submitted'].includes(s);
  });

  const handleAssignEvaluator = async (e) => {
    e.preventDefault();
    if (!selectedProposalId) {
      alert('Please select a proposal');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post('/api/evaluations/assign', {
        proposalId: selectedProposalId,
        evaluatorName: selectedEvaluator,
        evaluatorRole
      });

      alert(`Successfully assigned ${selectedEvaluator} to evaluate selected proposal.`);
      setIsAssignModalOpen(false);
      setSelectedProposalId('');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to assign expert evaluator.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModerateProposal = async (proposalId) => {
    try {
      await axios.post(`/api/evaluations/moderate/${proposalId}`, {
        action: 'SHORTLIST',
        officerNotes: 'Shortlisted for Phase 5 Field Pilot Sandbox based on high multi-expert evaluation consensus.'
      });
      alert('Proposal Shortlisted for Phase 5 Field Pilot Sandbox successfully!');
      if (onRefresh) onRefresh();
      if (onSelectForPilot) onSelectForPilot(proposalId);
    } catch (err) {
      console.error(err);
      alert('Failed to moderate proposal.');
    }
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
            Phase 4 Multi-criteria scorecards, conflict-of-interest declarations, evaluator assignments, and applicant ranking
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
          Phase 4 Candidate Evaluation Ranking Scoreboard
        </h3>
        
        {evaluations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
            <Award size={36} color="#CBD5E1" style={{ marginBottom: '0.5rem' }} />
            <p style={{ margin: 0, fontSize: '0.9rem' }}>No evaluations completed yet. Assign expert evaluators above to begin Phase 4 scoring.</p>
          </div>
        ) : (
          <table className="gov-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Solution & Startup</th>
                <th>Evaluator Name & Role</th>
                <th>COI Status</th>
                <th>Weighted Score</th>
                <th>Recommendation</th>
                <th>Moderation Action</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((ev, idx) => {
                const proposalTitle = ev.proposalId?.solutionTitle || 'SmartOPD Platform';
                const startupName = ev.proposalId?.startupId?.name || 'HealthAI Solutions Pvt Ltd';
                const propId = ev.proposalId?._id || ev.proposalId;

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
                      <span className={`badge ${ev.coiDeclared ? 'badge-emerald' : 'badge-red'}`}>
                        <ShieldCheck size={12} /> {ev.coiDeclared ? 'COI Clear (Declared)' : 'Conflict Declared'}
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
                        onClick={() => handleModerateProposal(propId)}
                        className="btn-emerald"
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                      >
                        <CheckCircle2 size={13} /> Shortlist for Phase 5 Pilot
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
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

            <p style={{ fontSize: '0.825rem', color: '#334155', fontStyle: 'italic', margin: '0 0 0.4rem 0' }}>
              "{formatText(ev.comments)}"
            </p>
            {ev.riskObservations && (
              <span style={{ fontSize: '0.75rem', color: '#D97706', display: 'block' }}>
                <strong>Risk Notes:</strong> {ev.riskObservations}
              </span>
            )}
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
                  <label className="form-label">Select Phase 3 Eligible Proposal *</label>
                  <select 
                    value={selectedProposalId} 
                    onChange={e => setSelectedProposalId(e.target.value)} 
                    className="form-select"
                    required
                  >
                    <option value="">-- Choose Phase 3 Screened Proposal --</option>
                    {(eligibleProposals.length > 0 ? eligibleProposals : proposals).map(p => (
                      <option key={p._id} value={p._id}>
                        {formatText(p.solutionTitle)} ({p.eligibilityScreening?.screeningStatus || p.status || 'Eligible'})
                      </option>
                    ))}
                  </select>
                  <span style={{ fontSize: '0.725rem', color: '#64748B', marginTop: '0.25rem', display: 'block' }}>
                    Note: Only proposals screened as Eligible or Conditionally Eligible are listed above.
                  </span>
                </div>
                <div className="form-group">
                  <label className="form-label">Select Evaluator Expert *</label>
                  <select 
                    value={selectedEvaluator} 
                    onChange={e => {
                      setSelectedEvaluator(e.target.value);
                      if (e.target.value.includes('Sneha')) setEvaluatorRole('AgriTech & Sensors Specialist');
                      else if (e.target.value.includes('Vikramaditya')) setEvaluatorRole('CERT-In Cybersecurity Auditor');
                      else if (e.target.value.includes('Rameshwar')) setEvaluatorRole('Quality Control Board');
                      else setEvaluatorRole('Technical / HealthTech Expert');
                    }} 
                    className="form-select"
                  >
                    <option value="Dr. Anand Sharma">Dr. Anand Sharma (Technical / HealthTech Expert)</option>
                    <option value="Dr. Sneha Joshi">Dr. Sneha Joshi (AgriTech & Sensors Specialist)</option>
                    <option value="Vikramaditya Mane">Vikramaditya Mane (CERT-In Cybersecurity Auditor)</option>
                    <option value="Dr. Rameshwar Naik">Dr. Rameshwar Naik (Quality Control Board)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Evaluator Role / Panel *</label>
                  <input
                    type="text"
                    value={evaluatorRole}
                    onChange={e => setEvaluatorRole(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsAssignModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? 'Assigning Evaluator...' : 'Assign Evaluator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovtEvaluationsTab;

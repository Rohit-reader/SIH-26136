import React, { useState } from 'react';
import { FileText, CheckCircle2, XCircle, AlertTriangle, Sparkles, Eye, ShieldCheck, UserCheck } from 'lucide-react';
import axios from 'axios';
import { formatText, formatCurrency } from '../../utils/textUtils';

export const GovtApplicationsTab = ({ proposals = [], onRefresh }) => {
  const [selectedProposal, setSelectedProposal] = useState(null);

  const handleUpdateProposalStatus = async (proposalId, status) => {
    try {
      await axios.patch(`/api/proposals/${proposalId}/status`, {
        status,
        updatedBy: 'Department Officer'
      });
      onRefresh();
      if (selectedProposal && selectedProposal._id === proposalId) {
        setSelectedProposal(prev => prev ? { ...prev, status } : null);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update proposal status');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0A2540' }}>
          Startup Proposals & Eligibility Screening Desk
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
          Review technical proposals, automated eligibility checklists, AI risk indicators, and execute shortlisting decisions
        </p>
      </div>

      {/* Proposals List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {proposals.length === 0 ? (
          <div className="gov-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#64748B' }}>No startup proposals submitted yet.</p>
          </div>
        ) : (
          proposals.map((p) => {
            const startupName = p.startupId?.name || 'HealthAI Solutions Pvt Ltd';
            const challengeTitle = p.challengeId?.title || 'AI Based Hospital OPD Queue Optimization';

            return (
              <div key={p._id} className="gov-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    {/* Header Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-navy">{formatText(p.status)}</span>
                      <span className="badge badge-saffron">{formatText(startupName)}</span>
                      <span className="badge badge-emerald">DPIIT Verified</span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.35rem' }}>
                      {formatText(p.solutionTitle)}
                    </h3>
                    <p style={{ fontSize: '0.825rem', color: '#64748B', marginBottom: '0.85rem' }}>
                      <strong>Challenge:</strong> {formatText(challengeTitle)}
                    </p>

                    {/* Proposal Quick Specs */}
                    <div style={{
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '0.85rem 1rem',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '0.75rem',
                      marginBottom: '0.85rem'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>PROPOSED BUDGET</span>
                        <p style={{ fontWeight: 700, color: '#0A2540' }}>{formatCurrency(p.proposedBudget)}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>TIMELINE</span>
                        <p style={{ fontWeight: 700, color: '#475569' }}>{p.implementationTimelineDays} Days</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>SUBMITTED DATE</span>
                        <p style={{ fontWeight: 600, color: '#475569', fontSize: '0.85rem' }}>
                          {new Date(p.submittedAt || Date.now()).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* AI Proposal Summary Box */}
                    {p.aiSummary && (
                      <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '6px', padding: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1E3A8A', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                          <Sparkles size={14} color="#2563EB" /> AI Executive Summary
                        </div>
                        <p style={{ fontSize: '0.825rem', color: '#1E3A8A' }}>{formatText(p.aiSummary)}</p>
                      </div>
                    )}

                    {/* AI Risk Flags */}
                    {p.aiRiskFlags && p.aiRiskFlags.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {p.aiRiskFlags.map((risk, idx) => (
                          <span key={idx} style={{ backgroundColor: '#FEF2F2', color: '#DC2626', fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid #FCA5A5' }}>
                            ⚠️ Risk Flag: {formatText(risk)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '160px' }}>
                    <button
                      onClick={() => setSelectedProposal(p)}
                      className="btn-secondary"
                      style={{ fontSize: '0.8rem', justifyContent: 'center' }}
                    >
                      <Eye size={14} /> Full Proposal
                    </button>
                    {p.status !== 'Shortlisted' && p.status !== 'Selected for Pilot' && (
                      <button
                        onClick={() => handleUpdateProposalStatus(p._id, 'Shortlisted')}
                        className="btn-primary"
                        style={{ fontSize: '0.8rem', justifyContent: 'center' }}
                      >
                        <UserCheck size={14} /> Shortlist Proposal
                      </button>
                    )}
                    {p.status === 'Shortlisted' && (
                      <button
                        onClick={() => handleUpdateProposalStatus(p._id, 'Selected for Pilot')}
                        className="btn-emerald"
                        style={{ fontSize: '0.8rem', justifyContent: 'center' }}
                      >
                        <CheckCircle2 size={14} /> Select for Pilot
                      </button>
                    )}
                    {p.status !== 'Rejected' && (
                      <button
                        onClick={() => handleUpdateProposalStatus(p._id, 'Rejected')}
                        className="btn-secondary"
                        style={{ fontSize: '0.8rem', justifyContent: 'center', color: '#DC2626', borderColor: '#FCA5A5' }}
                      >
                        <XCircle size={14} /> Reject Application
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Full Proposal Detail Modal */}
      {selectedProposal && (
        <div className="modal-overlay" onClick={() => setSelectedProposal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540' }}>
                {formatText(selectedProposal.solutionTitle)}
              </h3>
              <button onClick={() => setSelectedProposal(null)} className="btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            <div className="modal-body">
              {/* Automated Eligibility Checklist */}
              <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#166534', marginBottom: '0.5rem' }}>
                  Automated Procurement Eligibility Checklist
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.825rem' }}>
                  <div style={{ color: '#15803D' }}>✓ DPIIT Recognized Startup (Relaxed EMD/Turnover)</div>
                  <div style={{ color: '#15803D' }}>✓ Domain Experience & Tech Alignment Verified</div>
                  <div style={{ color: '#15803D' }}>✓ ISO 27001 / CERT-In Cyber Compliance Certified</div>
                  <div style={{ color: '#15803D' }}>✓ Prior Experience Exemption Applied</div>
                </div>
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.4rem' }}>Technical Approach</h4>
              <p style={{ fontSize: '0.875rem', color: '#334155', marginBottom: '1rem' }}>{formatText(selectedProposal.technicalApproach)}</p>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.4rem' }}>System Architecture</h4>
              <p style={{ fontSize: '0.875rem', color: '#334155', marginBottom: '1rem' }}>{formatText(selectedProposal.architectureSummary)}</p>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.4rem' }}>Team & Security</h4>
              <p style={{ fontSize: '0.875rem', color: '#334155', marginBottom: '0.5rem' }}><strong>Team:</strong> {formatText(selectedProposal.teamOverview)}</p>
              <p style={{ fontSize: '0.875rem', color: '#334155' }}><strong>Security:</strong> {formatText(selectedProposal.securityApproach)}</p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setSelectedProposal(null)} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

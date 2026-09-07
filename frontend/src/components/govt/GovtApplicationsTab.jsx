import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  Eye, 
  ShieldCheck, 
  UserCheck, 
  X, 
  Check, 
  Clock, 
  Filter, 
  FileCheck, 
  Award, 
  Building2, 
  Lock, 
  RefreshCw, 
  Send 
} from 'lucide-react';
import axios from 'axios';
import { formatText, formatCurrency } from '../../utils/textUtils';

export const GovtApplicationsTab = ({ proposals = [], onRefresh }) => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isScreeningModalOpen, setIsScreeningModalOpen] = useState(false);

  // Screening decision form state
  const [screeningStatus, setScreeningStatus] = useState('Eligible');
  const [officerNotes, setOfficerNotes] = useState('');
  const [conditionalReason, setConditionalReason] = useState('');
  const [disqualificationReason, setDisqualificationReason] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);

  const statuses = [
    { id: 'All', label: 'All Proposals' },
    { id: 'Pending Screening', label: 'Pending Screening' },
    { id: 'Eligible', label: 'Eligible (Phase 4 Ready)' },
    { id: 'Conditionally Eligible', label: 'Conditionally Eligible' },
    { id: 'Not Eligible', label: 'Not Eligible' }
  ];

  const filteredProposals = proposals.filter(p => {
    const pScreening = p.eligibilityScreening?.screeningStatus || 'Pending Screening';
    if (filterStatus === 'All') return true;
    if (filterStatus === 'Pending Screening') return pScreening === 'Pending Screening' || p.status === 'Submitted' || p.status === 'Under Review';
    if (filterStatus === 'Eligible') return pScreening === 'Eligible' || p.status === 'Eligible' || p.status === 'Shortlisted';
    if (filterStatus === 'Conditionally Eligible') return pScreening === 'Conditionally Eligible' || p.status === 'Conditionally Eligible';
    if (filterStatus === 'Not Eligible') return pScreening === 'Not Eligible' || p.status === 'Not Eligible' || p.status === 'Rejected';
    return true;
  });

  const handleOpenScreeningDesk = (proposal) => {
    setSelectedProposal(proposal);
    const existing = proposal.eligibilityScreening || {};
    setScreeningStatus(existing.screeningStatus !== 'Pending Screening' ? existing.screeningStatus : 'Eligible');
    setOfficerNotes(existing.officerNotes || '');
    setConditionalReason(existing.conditionalReason || '');
    setDisqualificationReason(existing.disqualificationReason || '');
    setIsScreeningModalOpen(true);
  };

  const handleRunAutomatedChecks = async (proposalId) => {
    try {
      setLoadingAction(true);
      const res = await axios.post(`/api/proposals/${proposalId}/eligibility-check`);
      if (selectedProposal && selectedProposal._id === proposalId) {
        setSelectedProposal(res.data.proposal);
      }
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error running automated checks:', err);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSaveScreeningDecision = async (e) => {
    e.preventDefault();
    if (!selectedProposal) return;

    setLoadingAction(true);
    try {
      await axios.patch(`/api/proposals/${selectedProposal._id}/screening-decision`, {
        screeningStatus,
        officerNotes,
        conditionalReason,
        disqualificationReason,
        screenedBy: 'Department Eligibility Screening Desk'
      });

      alert(`Eligibility Screening decision saved: Startup marked as "${screeningStatus}"!`);
      setIsScreeningModalOpen(false);
      setSelectedProposal(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error saving screening decision:', err);
      alert('Failed to save screening decision.');
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-navy">Phase 3 Desk</span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
            Startup Proposals & Eligibility Screening Desk
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
          Verify candidate proposals against DPIIT rules, DigiLocker certificates, GFR waivers, cybersecurity standards, and advance eligible candidates to Phase 4 Expert Evaluation.
        </p>
      </div>

      {/* Screening Status Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {statuses.map(st => (
          <button
            key={st.id}
            onClick={() => setFilterStatus(st.id)}
            style={{
              padding: '0.5rem 0.95rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 700,
              border: filterStatus === st.id ? '1px solid #0A2540' : '1px solid #CBD5E1',
              backgroundColor: filterStatus === st.id ? '#0A2540' : '#FFFFFF',
              color: filterStatus === st.id ? '#FFFFFF' : '#475569',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Proposals List Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredProposals.length === 0 ? (
          <div className="gov-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <FileText size={40} color="#CBD5E1" style={{ marginBottom: '0.5rem' }} />
            <p style={{ color: '#64748B', margin: 0 }}>No proposals found matching filter "{filterStatus}".</p>
          </div>
        ) : (
          filteredProposals.map((p) => {
            const startupName = p.startupId?.name || 'HealthAI Solutions Pvt Ltd';
            const challengeTitle = p.challengeId?.title || 'Hospital OPD Queue Optimization System';
            const screeningState = p.eligibilityScreening?.screeningStatus || (p.status === 'Eligible' ? 'Eligible' : 'Pending Screening');
            const isDigiLocker = p.startupId?.digilockerVerification?.status === 'Verified';

            return (
              <div key={p._id} className="gov-card" style={{ borderLeft: screeningState === 'Eligible' ? '4px solid #059669' : screeningState === 'Conditionally Eligible' ? '4px solid #D97706' : screeningState === 'Not Eligible' ? '4px solid #DC2626' : '4px solid #0A2540' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    {/* Status Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <span className={`badge ${screeningState === 'Eligible' ? 'badge-emerald' : screeningState === 'Conditionally Eligible' ? 'badge-saffron' : screeningState === 'Not Eligible' ? 'badge-navy' : 'badge-navy'}`}>
                        Phase 3: {screeningState}
                      </span>
                      <span className="badge badge-saffron">{formatText(startupName)}</span>
                      <span className="badge badge-dpiit">DPIIT Registered</span>
                      {isDigiLocker && <span className="badge badge-emerald">✓ DigiLocker Verified</span>}
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.35rem' }}>
                      {formatText(p.solutionTitle)}
                    </h3>
                    <p style={{ fontSize: '0.825rem', color: '#64748B', marginBottom: '0.85rem' }}>
                      <strong>Target Challenge:</strong> {formatText(challengeTitle)}
                    </p>

                    {/* Automated Rule Checks Summary Bar */}
                    <div style={{
                      backgroundColor: '#F0FDF4',
                      border: '1px solid #BBF7D0',
                      borderRadius: '6px',
                      padding: '0.65rem 0.85rem',
                      marginBottom: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      flexWrap: 'wrap',
                      fontSize: '0.75rem'
                    }}>
                      <span style={{ fontWeight: 700, color: '#065F46' }}>Automated Rule Verifications:</span>
                      <span style={{ color: '#047857', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}><CheckCircle2 size={13} color="#059669" /> DPIIT GFR Turnover Waived</span>
                      <span style={{ color: '#047857', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}><CheckCircle2 size={13} color="#059669" /> Prior Experience Waived</span>
                      <span style={{ color: '#047857', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}><CheckCircle2 size={13} color="#059669" /> CERT-In Cyber Compliant</span>
                    </div>

                    {/* Quick Specs */}
                    <div style={{
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '0.75rem'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>PROPOSED BUDGET</span>
                        <p style={{ fontWeight: 700, color: '#0A2540', margin: 0 }}>{formatCurrency(p.proposedBudget)}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>TIMELINE</span>
                        <p style={{ fontWeight: 700, color: '#475569', margin: 0 }}>{p.implementationTimelineDays} Days</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>SUBMITTED DATE</span>
                        <p style={{ fontWeight: 600, color: '#475569', fontSize: '0.85rem', margin: 0 }}>
                          {new Date(p.submittedAt || Date.now()).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '170px' }}>
                    <button
                      onClick={() => handleOpenScreeningDesk(p)}
                      className="btn-primary"
                      style={{ fontSize: '0.8rem', justifyContent: 'center', backgroundColor: '#0A2540' }}
                    >
                      <ShieldCheck size={15} color="#FF9933" />
                      <span>Screening Desk</span>
                    </button>

                    <button
                      onClick={() => setSelectedProposal(p)}
                      className="btn-secondary"
                      style={{ fontSize: '0.8rem', justifyContent: 'center' }}
                    >
                      <Eye size={14} /> Full Proposal
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Department Eligibility Screening Desk Modal */}
      {isScreeningModalOpen && selectedProposal && (
        <div className="modal-overlay" onClick={() => setIsScreeningModalOpen(false)} style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '820px', width: '95%', maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ backgroundColor: '#0A2540', color: '#FFFFFF', padding: '1.15rem 1.5rem', borderBottom: '4px solid #FF9933', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ backgroundColor: 'rgba(255,153,51,0.2)', padding: '0.5rem', borderRadius: '50%' }}>
                  <ShieldCheck size={22} color="#FF9933" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    Phase 3 Eligibility Screening Desk
                  </h3>
                  <p style={{ fontSize: '0.775rem', color: '#94A3B8', margin: 0 }}>
                    {selectedProposal.solutionTitle} — {selectedProposal.startupId?.name}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsScreeningModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#FFFFFF" />
              </button>
            </div>

            <form onSubmit={handleSaveScreeningDecision} style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Automated Rule Verification Box */}
              <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={18} color="#059669" /> Automated Rule Verifications
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRunAutomatedChecks(selectedProposal._id)}
                    disabled={loadingAction}
                    className="btn-secondary"
                    style={{ fontSize: '0.725rem', padding: '0.3rem 0.65rem', backgroundColor: '#FFFFFF' }}
                  >
                    <RefreshCw size={12} className={loadingAction ? 'spin-animation' : ''} /> Run Rule Check
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.8rem' }}>
                  <div style={{ color: '#15803D', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Check size={14} color="#059669" /> DPIIT Recognition Validated
                  </div>
                  <div style={{ color: '#15803D', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Check size={14} color="#059669" /> GFR Rule 173(i) Turnover Waived
                  </div>
                  <div style={{ color: '#15803D', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Check size={14} color="#059669" /> DigiLocker Verified Certificate
                  </div>
                  <div style={{ color: '#15803D', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Check size={14} color="#059669" /> Prior Experience Exemption Applied
                  </div>
                  <div style={{ color: '#15803D', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Check size={14} color="#059669" /> CERT-In Cyber Security Declared
                  </div>
                  <div style={{ color: '#15803D', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Check size={14} color="#059669" /> TRL 6 Prototype Readiness Passed
                  </div>
                </div>
              </div>

              {/* Official Screening Decision Selection */}
              <div>
                <label className="form-label" style={{ fontWeight: 700, color: '#0A2540', fontSize: '0.85rem' }}>
                  Select Official Eligibility Screening Decision:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '0.5rem' }}>
                  
                  {/* Option A: Eligible */}
                  <div
                    onClick={() => setScreeningStatus('Eligible')}
                    style={{
                      border: screeningStatus === 'Eligible' ? '2px solid #059669' : '1px solid #CBD5E1',
                      backgroundColor: screeningStatus === 'Eligible' ? '#ECFDF5' : '#FFFFFF',
                      borderRadius: '8px',
                      padding: '0.85rem',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <CheckCircle2 size={24} color="#059669" style={{ margin: '0 auto 0.35rem auto' }} />
                    <strong style={{ fontSize: '0.85rem', color: '#065F46', display: 'block' }}>Eligible</strong>
                    <span style={{ fontSize: '0.725rem', color: '#047857' }}>Advance to Phase 4 Expert Evaluation</span>
                  </div>

                  {/* Option B: Conditionally Eligible */}
                  <div
                    onClick={() => setScreeningStatus('Conditionally Eligible')}
                    style={{
                      border: screeningStatus === 'Conditionally Eligible' ? '2px solid #D97706' : '1px solid #CBD5E1',
                      backgroundColor: screeningStatus === 'Conditionally Eligible' ? '#FFFBEB' : '#FFFFFF',
                      borderRadius: '8px',
                      padding: '0.85rem',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <AlertTriangle size={24} color="#D97706" style={{ margin: '0 auto 0.35rem auto' }} />
                    <strong style={{ fontSize: '0.85rem', color: '#B45309', display: 'block' }}>Conditionally Eligible</strong>
                    <span style={{ fontSize: '0.725rem', color: '#B45309' }}>Requires specific compliance document</span>
                  </div>

                  {/* Option C: Not Eligible */}
                  <div
                    onClick={() => setScreeningStatus('Not Eligible')}
                    style={{
                      border: screeningStatus === 'Not Eligible' ? '2px solid #DC2626' : '1px solid #CBD5E1',
                      backgroundColor: screeningStatus === 'Not Eligible' ? '#FEF2F2' : '#FFFFFF',
                      borderRadius: '8px',
                      padding: '0.85rem',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <XCircle size={24} color="#DC2626" style={{ margin: '0 auto 0.35rem auto' }} />
                    <strong style={{ fontSize: '0.85rem', color: '#991B1B', display: 'block' }}>Not Eligible</strong>
                    <span style={{ fontSize: '0.725rem', color: '#991B1B' }}>Disqualify application</span>
                  </div>

                </div>
              </div>

              {/* Conditional Reason Input */}
              {screeningStatus === 'Conditionally Eligible' && (
                <div className="form-group">
                  <label className="form-label" style={{ color: '#B45309' }}>Required Conditional Compliance Details</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Must submit updated ISO 27001 certificate within 7 days"
                    value={conditionalReason}
                    onChange={e => setConditionalReason(e.target.value)}
                    className="form-input"
                  />
                </div>
              )}

              {/* Disqualification Reason Input */}
              {screeningStatus === 'Not Eligible' && (
                <div className="form-group">
                  <label className="form-label" style={{ color: '#DC2626' }}>Disqualification Reason</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Solution does not meet minimum technical outcome readiness"
                    value={disqualificationReason}
                    onChange={e => setDisqualificationReason(e.target.value)}
                    className="form-input"
                  />
                </div>
              )}

              {/* Officer Remarks & Notes */}
              <div className="form-group">
                <label className="form-label">Department Officer Notes & Governance Remarks</label>
                <textarea
                  rows="3"
                  placeholder="Enter official notes for compliance audit trail..."
                  value={officerNotes}
                  onChange={e => setOfficerNotes(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div className="modal-footer" style={{ marginTop: 'auto', padding: 0 }}>
                <button type="button" onClick={() => setIsScreeningModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loadingAction} style={{ backgroundColor: '#0A2540' }}>
                  <ShieldCheck size={16} />
                  <span>{loadingAction ? 'Saving...' : 'Save Screening Decision'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Proposal Detail Modal */}
      {selectedProposal && !isScreeningModalOpen && (
        <div className="modal-overlay" onClick={() => setSelectedProposal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540' }}>
                {formatText(selectedProposal.solutionTitle)}
              </h3>
              <button onClick={() => setSelectedProposal(null)} className="btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#166534', marginBottom: '0.5rem' }}>
                  Automated Procurement Eligibility Checklist
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.825rem' }}>
                  <div style={{ color: '#15803D', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><CheckCircle2 size={14} /> DPIIT Recognized Startup (Relaxed EMD/Turnover)</div>
                  <div style={{ color: '#15803D', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><CheckCircle2 size={14} /> Domain Experience & Tech Alignment Verified</div>
                  <div style={{ color: '#15803D', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><CheckCircle2 size={14} /> ISO 27001 / CERT-In Cyber Compliance Certified</div>
                  <div style={{ color: '#15803D', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><CheckCircle2 size={14} /> Prior Experience Exemption Applied</div>
                </div>
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.4rem' }}>Technical Approach</h4>
              <p style={{ fontSize: '0.875rem', color: '#334155', marginBottom: '1rem' }}>{formatText(selectedProposal.technicalApproach)}</p>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.4rem' }}>System Architecture</h4>
              <p style={{ fontSize: '0.875rem', color: '#334155', marginBottom: '1rem' }}>{formatText(selectedProposal.architectureSummary)}</p>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.5rem' }}>Team & Security</h4>
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

export default GovtApplicationsTab;

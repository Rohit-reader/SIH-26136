import React, { useState } from 'react';
import { Rocket, Clock, CheckCircle2, IndianRupee, ExternalLink, Plus, MapPin, Building, X, ShieldCheck, AlertTriangle, TrendingUp, FileText } from 'lucide-react';
import axios from 'axios';
import { formatText, formatCurrency } from '../../utils/textUtils';

export const GovtPilotsTab = ({ pilots = [], proposals = [], onRefresh }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPilotData, setNewPilotData] = useState({
    pilotTitle: '',
    location: 'Pune District Hospital, Aundh, Maharashtra',
    scopeDescription: 'Controlled field trial of edge-AI OPD triage system across 3 district hospital counters.',
    targetParticipants: '3 District Hospitals, ~15,000 OPD Patients',
    startDate: '2026-05-10',
    endDate: '2026-08-10',
    totalBudget: 1420000,
    proposalId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter proposals qualified from Phase 4 Expert Evaluation
  const shortlistedProposals = proposals.filter(p => {
    return ['Shortlisted', 'Selected for Pilot', 'Under Review'].includes(p.status) || p.evaluationSummary?.evaluationsCount > 0;
  });

  const handleUpdateMilestoneStatus = async (pilotId, milestoneNumber, status) => {
    try {
      await axios.patch(`/api/pilots/${pilotId}/milestone/${milestoneNumber}`, {
        status,
        approvedBy: 'District Civil Surgeon / Procurement Officer'
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to update milestone status');
    }
  };

  const handleCompletePilot = async (pilotId) => {
    try {
      await axios.post(`/api/pilots/${pilotId}/complete`);
      alert('Phase 5 Pilot project completed successfully! Handed off to Phase 6.');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to complete pilot project.');
    }
  };

  const handleCreatePilot = async (e) => {
    e.preventDefault();
    if (!newPilotData.proposalId) {
      alert('Please select a Phase 4 qualified proposal');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedProp = proposals.find(p => p._id === newPilotData.proposalId);
      await axios.post('/api/pilots', {
        ...newPilotData,
        challengeId: selectedProp?.challengeId?._id || selectedProp?.challengeId,
        startupId: selectedProp?.startupId?._id || selectedProp?.startupId,
        milestones: [
          { milestoneNumber: 1, title: 'Phase 1: Setup & Infrastructure Deployment', deliverables: 'Edge camera installation & token kiosk testing in 3 hospitals', dueDate: '2026-06-01', amount: Math.round(newPilotData.totalBudget * 0.3), status: 'Pending' },
          { milestoneNumber: 2, title: 'Phase 2: Live HMIS Trial (30 Days)', deliverables: 'WhatsApp broadcast & live OPD queue triage processing', dueDate: '2026-07-01', amount: Math.round(newPilotData.totalBudget * 0.4), status: 'Pending' },
          { milestoneNumber: 3, title: 'Phase 3: Performance Audit & Telemetry Validation', deliverables: 'Target wait time reduction verified with zero cyber incidents', dueDate: '2026-08-10', amount: Math.round(newPilotData.totalBudget * 0.3), status: 'Pending' }
        ],
        kpiTracking: [
          { metricName: 'Avg OPD Queue Wait Time', baseline: '210 Mins', target: '< 45 Mins (75% Cut)', currentLive: '38 Mins', unit: 'Mins', status: 'Target Achieved' },
          { metricName: 'Triage Patient Volume', baseline: '0 Patients', target: '> 10,000 Patients', currentLive: '14,280 Patients', unit: 'Patients', status: 'Target Achieved' }
        ],
        riskManagement: [
          { riskCategory: 'Site Infrastructure', description: 'Power outages at hospital counters', mitigationPlan: 'UPS battery backup provided for edge servers', severity: 'Low', status: 'Mitigated' }
        ],
        dataGovernance: {
          governmentDataRights: 'Government of Maharashtra retains 100% ownership of patient operational data, telemetry logs, and trial audit records.',
          startupIpRights: 'Startup retains exclusive intellectual property rights to underlying AI algorithms and code.',
          dpdpActCompliance: true
        },
        cyberSecurity: {
          certInDeclared: true,
          dataSecurityProtocol: 'AES-256 encrypted local hospital servers with zero public cloud PII exposure.'
        },
        createdBy: 'Department Officer'
      });
      alert('Phase 5 Sandbox Pilot Created and Launched Successfully!');
      setIsCreateModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to create pilot');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0A2540' }}>
            Phase 5 — Sandbox / Pilot Design & Execution Desk
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Structure milestone agreements, monitor live KPI telemetry, verify field evidence, enforce data rights, and hand off completed trials
          </p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="btn-primary">
          <Plus size={16} />
          <span>Launch New Controlled Pilot</span>
        </button>
      </div>

      {/* Pilots List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {pilots.length === 0 ? (
          <div className="gov-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <Rocket size={40} color="#CBD5E1" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', margin: '0 0 0.35rem 0' }}>
              No Active Pilots Configured
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', maxWidth: '420px', margin: '0 auto 1.25rem auto' }}>
              Phase 4 qualified proposals can be configured into controlled field pilot projects above.
            </p>
          </div>
        ) : (
          pilots.map((pilot) => {
            const startupName = pilot.startupId?.name || 'HealthAI Solutions Pvt Ltd';
            const challengeTitle = pilot.challengeId?.title || 'Hospital OPD Queue Optimization System';
            const isCompleted = pilot.status === 'Completed';

            return (
              <div key={pilot._id} className="gov-card" style={{ borderLeft: isCompleted ? '4px solid #059669' : '4px solid #0A2540' }}>
                {/* Top Title & Badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                      <span className={`badge ${isCompleted ? 'badge-emerald' : 'badge-navy'}`}>{formatText(pilot.status || 'Pilot Active')}</span>
                      <span className="badge badge-saffron">{formatText(startupName)}</span>
                      <span className="badge badge-emerald"><MapPin size={12} /> {formatText(pilot.location)}</span>
                      <span className="badge badge-dpiit"><ShieldCheck size={12} /> CERT-In Verified</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A2540', margin: '0 0 0.25rem 0' }}>
                      {formatText(pilot.pilotTitle)}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
                      <strong>Target Challenge:</strong> {formatText(challengeTitle)} • <strong>Scope:</strong> {formatText(pilot.targetParticipants || '3 District Hospitals')}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>{formatCurrency(pilot.totalBudget)}</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B' }}>CONTRACTED PILOT BUDGET</span>
                  </div>
                </div>

                {/* Scope & IP Governance Info Box */}
                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem', fontSize: '0.825rem' }}>
                  <div>
                    <strong style={{ color: '#0A2540', display: 'block', marginBottom: '0.2rem' }}>PILOT OBJECTIVE & SCOPE:</strong>
                    <span style={{ color: '#334155' }}>{formatText(pilot.scopeDescription || 'Controlled sandbox trial deployment across hospital OPD counters.')}</span>
                  </div>
                  <div>
                    <strong style={{ color: '#0A2540', display: 'block', marginBottom: '0.2rem' }}>DATA & IP GOVERNANCE:</strong>
                    <span style={{ color: '#059669', fontWeight: 600 }}>✓ Government Data Ownership (100% Patient Logs)</span><br />
                    <span style={{ color: '#2563EB', fontWeight: 600 }}>✓ Startup IP Protection (Algorithm & Source Code)</span>
                  </div>
                </div>

                {/* Telemetry KPIs Grid */}
                {pilot.kpiTracking && pilot.kpiTracking.length > 0 && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <TrendingUp size={16} color="#059669" /> Trial Telemetry & Outcome Performance
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
                      {pilot.kpiTracking.map((kpi, idx) => (
                        <div key={idx} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                          <span style={{ color: '#64748B', fontSize: '0.7rem', fontWeight: 700, display: 'block' }}>{kpi.metricName}</span>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.2rem' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669' }}>{kpi.currentLive}</span>
                            <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Target: {kpi.target}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Milestones Tracker */}
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.75rem' }}>
                  Milestone Deliverables & Payment Disbursement Schedule
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {pilot.milestones?.map((m) => (
                    <div 
                      key={m.milestoneNumber} 
                      style={{ 
                        border: '1px solid #E2E8F0', 
                        borderRadius: '8px', 
                        padding: '0.85rem 1rem', 
                        backgroundColor: m.status === 'Paid' ? '#F0FDF4' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <strong style={{ fontSize: '0.9rem', color: '#0A2540' }}>
                            Milestone #{m.milestoneNumber}: {formatText(m.title)}
                          </strong>
                          <span className={`badge ${m.status === 'Paid' ? 'badge-emerald' : m.status === 'Evidence Submitted' ? 'badge-saffron' : 'badge-navy'}`}>
                            {formatText(m.status)}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.825rem', color: '#334155', marginBottom: '0.35rem' }}>
                          {formatText(m.deliverables)}
                        </p>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                          Due Date: {m.dueDate} | Amount: <strong>{formatCurrency(m.amount)}</strong>
                          {m.approvedBy && ` | Approved By: ${m.approvedBy}`}
                        </div>
                      </div>

                      {/* Evidence & Action Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {m.evidenceUrl && (
                          <a 
                            href={m.evidenceUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="btn-secondary" 
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                          >
                            <ExternalLink size={13} /> View Evidence
                          </a>
                        )}
                        {m.status === 'Evidence Submitted' && (
                          <button
                            onClick={() => handleUpdateMilestoneStatus(pilot._id, m.milestoneNumber, 'Approved')}
                            className="btn-primary"
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                          >
                            <CheckCircle2 size={13} /> Approve Evidence
                          </button>
                        )}
                        {m.status === 'Approved' && (
                          <button
                            onClick={() => handleUpdateMilestoneStatus(pilot._id, m.milestoneNumber, 'Paid')}
                            className="btn-emerald"
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                          >
                            <IndianRupee size={13} /> Approve Payment
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Controls: Complete Pilot Handoff */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
                  {!isCompleted ? (
                    <button
                      onClick={() => handleCompletePilot(pilot._id)}
                      className="btn-emerald"
                      style={{ fontSize: '0.825rem', padding: '0.5rem 1rem' }}
                    >
                      <Rocket size={15} /> Complete Phase 5 Trial & Hand off to Phase 6 →
                    </button>
                  ) : (
                    <span className="badge badge-emerald" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
                      ✓ Phase 5 Sandbox Trial Complete & Handed Off
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Pilot Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '750px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540' }}>Structure Controlled Pilot Project</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreatePilot}>
              <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                <div className="form-group">
                  <label className="form-label">Select Phase 4 Qualified Proposal *</label>
                  <select
                    value={newPilotData.proposalId}
                    onChange={e => {
                      const sel = proposals.find(p => p._id === e.target.value);
                      setNewPilotData({ 
                        ...newPilotData, 
                        proposalId: e.target.value,
                        pilotTitle: sel ? `Pilot: ${sel.solutionTitle}` : newPilotData.pilotTitle,
                        totalBudget: sel ? sel.proposedBudget : newPilotData.totalBudget
                      });
                    }}
                    className="form-select"
                    required
                  >
                    <option value="">-- Choose Proposal --</option>
                    {(shortlistedProposals.length > 0 ? shortlistedProposals : proposals).map(p => (
                      <option key={p._id} value={p._id}>
                        {formatText(p.solutionTitle)} ({formatCurrency(p.proposedBudget)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Pilot Project Title *</label>
                  <input
                    type="text"
                    required
                    value={newPilotData.pilotTitle}
                    onChange={e => setNewPilotData({ ...newPilotData, pilotTitle: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pilot Scope & Implementation Objectives *</label>
                  <textarea
                    rows="2"
                    required
                    value={newPilotData.scopeDescription}
                    onChange={e => setNewPilotData({ ...newPilotData, scopeDescription: e.target.value })}
                    className="form-textarea"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Pilot Location / Sites *</label>
                    <input
                      type="text"
                      required
                      value={newPilotData.location}
                      onChange={e => setNewPilotData({ ...newPilotData, location: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Target Participants / User Scale *</label>
                    <input
                      type="text"
                      required
                      value={newPilotData.targetParticipants}
                      onChange={e => setNewPilotData({ ...newPilotData, targetParticipants: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Start Date *</label>
                    <input
                      type="date"
                      required
                      value={newPilotData.startDate}
                      onChange={e => setNewPilotData({ ...newPilotData, startDate: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date *</label>
                    <input
                      type="date"
                      required
                      value={newPilotData.endDate}
                      onChange={e => setNewPilotData({ ...newPilotData, endDate: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Total Contracted Budget (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newPilotData.totalBudget}
                    onChange={e => setNewPilotData({ ...newPilotData, totalBudget: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? 'Launching Pilot...' : 'Launch Phase 5 Pilot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovtPilotsTab;

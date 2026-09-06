import React, { useState } from 'react';
import { Rocket, Clock, CheckCircle2, IndianRupee, ExternalLink, Plus, MapPin, Building, X } from 'lucide-react';
import axios from 'axios';
import { formatText, formatCurrency } from '../../utils/textUtils';

export const GovtPilotsTab = ({ pilots = [], proposals = [], onRefresh }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPilotData, setNewPilotData] = useState({
    pilotTitle: '',
    location: '',
    startDate: '',
    endDate: '',
    totalBudget: 1500000,
    proposalId: ''
  });

  const handleUpdateMilestoneStatus = async (pilotId, milestoneNumber, status) => {
    try {
      await axios.patch(`/api/pilots/${pilotId}/milestone/${milestoneNumber}`, {
        status,
        approvedBy: 'District Civil Surgeon / Procurement Officer'
      });
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to update milestone status');
    }
  };

  const handleCreatePilot = async (e) => {
    e.preventDefault();
    try {
      const selectedProp = proposals.find(p => p._id === newPilotData.proposalId);
      await axios.post('/api/pilots', {
        ...newPilotData,
        challengeId: selectedProp?.challengeId?._id || selectedProp?.challengeId,
        startupId: selectedProp?.startupId?._id || selectedProp?.startupId,
        milestones: [
          { milestoneNumber: 1, title: 'Setup & Infrastructure Deployment', deliverables: 'Hardware installation and initial sandbox testing', dueDate: '2026-09-30', amount: Math.round(newPilotData.totalBudget * 0.3), status: 'Pending' },
          { milestoneNumber: 2, title: 'Live Field Trial (30 Days)', deliverables: 'Process live transactions/patients and record performance', dueDate: '2026-10-31', amount: Math.round(newPilotData.totalBudget * 0.4), status: 'Pending' },
          { milestoneNumber: 3, title: 'Final Performance Audit & Evaluation', deliverables: 'Demonstrate target KPI achievement with cybersecurity signoff', dueDate: '2026-11-30', amount: Math.round(newPilotData.totalBudget * 0.3), status: 'Pending' }
        ],
        kpiTracking: [
          { metricName: 'Primary Efficiency Improvement', baseline: 'Baseline', target: '> 50% Improvement', currentLive: 'Live Pilot Active', status: 'On Track' }
        ],
        createdBy: 'Department Officer'
      });
      setIsCreateModalOpen(false);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to create pilot');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0A2540' }}>
            Controlled Pilot & PoC Management Desk
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Structure milestone agreements, verify field evidence, monitor live KPIs, and disburse milestone payments
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
            <p style={{ color: '#64748B' }}>No active or completed pilots created yet.</p>
          </div>
        ) : (
          pilots.map((pilot) => {
            const startupName = pilot.startupId?.name || 'HealthAI Solutions Pvt Ltd';
            const challengeTitle = pilot.challengeId?.title || 'AI Based Hospital OPD Queue Optimization';

            return (
              <div key={pilot._id} className="gov-card">
                {/* Top Title & Badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <span className="badge badge-navy">{formatText(pilot.validationStatus)}</span>
                      <span className="badge badge-saffron">{formatText(startupName)}</span>
                      <span className="badge badge-emerald"><MapPin size={12} /> {formatText(pilot.location)}</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A2540' }}>
                      {formatText(pilot.pilotTitle)}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                      <strong>Challenge:</strong> {formatText(challengeTitle)}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>{formatCurrency(pilot.totalBudget)}</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B' }}>TOTAL PILOT BUDGET</span>
                  </div>
                </div>

                {/* Milestones Tracker */}
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.75rem' }}>
                  Milestone Deliverables & Payment Disbursement Schedule
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
              </div>
            );
          })
        )}
      </div>

      {/* Create Pilot Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540' }}>Structure Controlled Pilot Project</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreatePilot}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Shortlisted Proposal</label>
                  <select
                    value={newPilotData.proposalId}
                    onChange={e => setNewPilotData({ ...newPilotData, proposalId: e.target.value })}
                    className="form-select"
                    required
                  >
                    <option value="">-- Choose Proposal --</option>
                    {proposals.map(p => (
                      <option key={p._id} value={p._id}>
                        {formatText(p.solutionTitle)} ({formatCurrency(p.proposedBudget)})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Pilot Project Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Pilot Project: SmartOPD Queue Optimization in District Hospital"
                    value={newPilotData.pilotTitle}
                    onChange={e => setNewPilotData({ ...newPilotData, pilotTitle: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Pilot Location / District</label>
                  <input
                    type="text"
                    placeholder="e.g. District Hospital, Chhatrapati Sambhajinagar"
                    value={newPilotData.location}
                    onChange={e => setNewPilotData({ ...newPilotData, location: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      value={newPilotData.startDate}
                      onChange={e => setNewPilotData({ ...newPilotData, startDate: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      value={newPilotData.endDate}
                      onChange={e => setNewPilotData({ ...newPilotData, endDate: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Total Allocated Budget (₹)</label>
                  <input
                    type="number"
                    value={newPilotData.totalBudget}
                    onChange={e => setNewPilotData({ ...newPilotData, totalBudget: Number(e.target.value) })}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Launch Pilot</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

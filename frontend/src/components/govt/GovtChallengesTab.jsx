import React, { useState } from 'react';
import { Plus, Filter, Building, CheckCircle2, Clock, Trash2, Send, Eye, FileText, Lock, X } from 'lucide-react';
import axios from 'axios';
import { formatText, formatCurrency } from '../../utils/textUtils';
import { ProblemTemplatesModal } from './ProblemTemplatesModal';

export const GovtChallengesTab = ({ challenges = [], onRefresh, onOpenCreateModal }) => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);

  const statuses = ['All', 'Published', 'Draft', 'Pending Approval', 'Pilot Active', 'Completed'];

  const filteredChallenges = filterStatus === 'All'
    ? challenges
    : challenges.filter(c => c.status === filterStatus);

  const handleUpdateStatus = async (challengeId, newStatus) => {
    try {
      await axios.patch(`/api/challenges/${challengeId}/status`, {
        status: newStatus,
        updatedBy: 'Department Officer'
      });
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to update challenge status');
    }
  };

  const handleDelete = async (challengeId) => {
    if (!window.confirm('Are you sure you want to delete this challenge specification?')) return;
    try {
      await axios.delete(`/api/challenges/${challengeId}`);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to delete challenge');
    }
  };

  return (
    <div>
      {/* Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0A2540' }}>
            Outcome-Based Innovation Challenge Management
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Formulate outcome specs, define baseline targets, set eligibility rules, and publish government challenges
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={() => setIsTemplatesModalOpen(true)} 
            className="btn-secondary"
            style={{ backgroundColor: '#F8FAFC' }}
          >
            <FileText size={16} color="#FF9933" />
            <span>Problem Statement Templates</span>
          </button>
          <button onClick={onOpenCreateModal} className="btn-primary">
            <Plus size={16} />
            <span>Create Outcome Challenge</span>
          </button>
        </div>
      </div>

      <ProblemTemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onSelectTemplate={(template) => {
          setIsTemplatesModalOpen(false);
          onOpenCreateModal();
        }}
      />

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {statuses.map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`btn-secondary ${filterStatus === st ? 'btn-primary' : ''}`}
            style={{ 
              padding: '0.45rem 0.9rem', 
              fontSize: '0.8rem',
              backgroundColor: filterStatus === st ? '#0A2540' : '#FFFFFF',
              color: filterStatus === st ? '#FFFFFF' : '#0A2540'
            }}
          >
            {formatText(st)}
          </button>
        ))}
      </div>

      {/* Challenges List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredChallenges.length === 0 ? (
          <div className="gov-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#64748B' }}>No challenges found under status "{filterStatus}".</p>
          </div>
        ) : (
          filteredChallenges.map((c) => (
            <div key={c._id} className="gov-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  {/* Header badges */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-navy">{formatText(c.status)}</span>
                    <span className="badge badge-saffron">{formatText(c.department)}</span>
                    {c.sector && <span className="badge badge-emerald">{formatText(c.sector)}</span>}
                    <span className="badge badge-emerald">{formatText(c.location || 'Maharashtra')}</span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.5rem' }}>
                    {formatText(c.title)}
                  </h3>

                  <p style={{ fontSize: '0.875rem', color: '#334155', marginBottom: '1rem' }}>
                    {formatText(c.problemDescription)}
                  </p>

                  {/* GFR Startup Waivers Badges */}
                  <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.6rem 0.85rem', borderRadius: '6px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#065F46', textTransform: 'uppercase' }}>GFR Startup Relaxations:</span>
                    <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>✓ Turnover 100% Waived</span>
                    <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>✓ Prior Experience Waived</span>
                    <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>✓ EMD Exempted</span>
                  </div>

                  {/* Baseline vs Target Box */}
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '1rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>CURRENT BASELINE</span>
                      <p style={{ fontWeight: 700, color: '#DC2626', fontSize: '0.9rem' }}>{c.currentSituation}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>EXPECTED OUTCOME</span>
                      <p style={{ fontWeight: 700, color: '#059669', fontSize: '0.9rem' }}>{formatText(c.expectedOutcome)}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>ESTIMATED BUDGET</span>
                      <p style={{ fontWeight: 700, color: '#0A2540', fontSize: '0.9rem' }}>{formatCurrency(c.estimatedBudget)}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>PILOT DURATION</span>
                      <p style={{ fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>{c.pilotDurationDays} Days</p>
                    </div>
                  </div>

                  {/* Tech & Security Tags */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {c.requiredTechnology?.map((tech, idx) => (
                      <span key={idx} style={{ backgroundColor: '#EFF6FF', color: '#1E3A8A', fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                        {formatText(tech)}
                      </span>
                    ))}
                    {c.securityRequirements?.map((sec, idx) => (
                      <span key={idx} style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Lock size={12} color="#92400E" /> {formatText(sec)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px' }}>
                  {c.status === 'Draft' && (
                    <button 
                      onClick={() => handleUpdateStatus(c._id, 'Pending Approval')} 
                      className="btn-secondary" 
                      style={{ fontSize: '0.8rem', justifyContent: 'center' }}
                    >
                      <Send size={14} /> Submit Approval
                    </button>
                  )}
                  {(c.status === 'Draft' || c.status === 'Pending Approval') && (
                    <button 
                      onClick={() => handleUpdateStatus(c._id, 'Published')} 
                      className="btn-emerald" 
                      style={{ fontSize: '0.8rem', justifyContent: 'center' }}
                    >
                      <CheckCircle2 size={14} /> Publish Challenge
                    </button>
                  )}
                  {c.status === 'Published' && (
                    <button 
                      onClick={() => handleUpdateStatus(c._id, 'Pilot Active')} 
                      className="btn-primary" 
                      style={{ fontSize: '0.8rem', justifyContent: 'center' }}
                    >
                      <Send size={14} /> Set Pilot Active
                    </button>
                  )}
                  <button 
                    onClick={() => setSelectedChallenge(c)} 
                    className="btn-secondary" 
                    style={{ fontSize: '0.8rem', justifyContent: 'center' }}
                  >
                    <Eye size={14} /> View Details
                  </button>
                  <button 
                    onClick={() => handleDelete(c._id)} 
                    className="btn-secondary" 
                    style={{ fontSize: '0.8rem', justifyContent: 'center', color: '#DC2626', borderColor: '#FCA5A5' }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Challenge Detail Modal */}
      {selectedChallenge && (
        <div className="modal-overlay" onClick={() => setSelectedChallenge(null)}>
          <div className="modal-content" style={{ maxWidth: '780px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540' }}>
                {formatText(selectedChallenge.title)}
              </h3>
              <button onClick={() => setSelectedChallenge(null)} className="btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <p><strong>Department:</strong> {formatText(selectedChallenge.department)}</p>
              <p><strong>Sector:</strong> {formatText(selectedChallenge.sector || 'Public Health')}</p>
              <p><strong>Problem Description:</strong> {formatText(selectedChallenge.problemDescription)}</p>
              <p><strong>Target Beneficiaries:</strong> {formatText(selectedChallenge.targetBeneficiaries)}</p>
              <p><strong>Expected Outcome Target:</strong> {formatText(selectedChallenge.expectedOutcome)}</p>
              
              <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.75rem', borderRadius: '6px' }}>
                <strong style={{ fontSize: '0.825rem', color: '#065F46' }}>DPIIT / MSINS Startup GFR Waivers:</strong>
                <ul style={{ margin: '0.35rem 0 0 1.25rem', fontSize: '0.8rem', color: '#047857' }}>
                  <li>Turnover Requirement: 100% Waived under GFR Rule 173(i)</li>
                  <li>Prior Experience Criteria: 100% Waived for registered startups</li>
                  <li>EMD Security Deposit: Exempted</li>
                </ul>
              </div>

              {selectedChallenge.legalClauses && selectedChallenge.legalClauses.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.4rem' }}>Attached Legal & Security Clauses</h4>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {selectedChallenge.legalClauses.map((clause, idx) => (
                      <li key={idx} style={{ fontSize: '0.8rem', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.5rem 0.75rem', borderRadius: '6px', color: '#334155' }}>
                        ⚖️ {formatText(clause)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0.5rem 0 0.35rem' }}>Quantifiable KPI Metrics</h4>
              <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                {selectedChallenge.kpiMetrics?.map((kpi, idx) => (
                  <li key={idx} style={{ marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                    <strong>{formatText(kpi.name)}:</strong> Baseline ({kpi.baselineValue}) → Target ({kpi.targetValue})
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal-footer">
              <button onClick={() => setSelectedChallenge(null)} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

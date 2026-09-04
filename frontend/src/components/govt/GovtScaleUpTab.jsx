import React, { useState } from 'react';
import { TrendingUp, Plus, MapPin, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { formatText, formatCurrency } from '../../utils/textUtils';

export const GovtScaleUpTab = ({ scaleUps = [], pilots = [], onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    pilotId: '',
    departmentName: 'Department of Agriculture, Government of Maharashtra',
    scaleScope: 'Statewide 36 Districts Rollout',
    targetDistrictsCount: 36,
    targetBeneficiaries: '1.2 Million Farmers',
    scalableUnits: 1500,
    totalApprovedBudget: 45000000,
    procurementMechanism: 'GeM Innovation Portal / MSINS State Sanction Order',
    gemIntegrationRef: 'GEM-MSINS-2026-AGRI-00982'
  });

  const handleCreateScaleUp = async (e) => {
    e.preventDefault();
    try {
      const selectedPilot = pilots.find(p => p._id === formData.pilotId);
      await axios.post('/api/scaleups', {
        ...formData,
        challengeId: selectedPilot?.challengeId?._id || selectedPilot?.challengeId,
        startupId: selectedPilot?.startupId?._id || selectedPilot?.startupId,
        sanctionedDate: new Date().toISOString().split('T')[0],
        createdBy: 'Government Admin'
      });
      alert('Scale-Up Sanction Order created successfully!');
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to create Scale-Up request');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0A2540' }}>
            Statewide Scale-Up & Deployment Expansion Portal
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Sanction statewide rollouts for validated startup innovations across all 36 districts of Maharashtra
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-emerald">
          <Plus size={16} />
          <span>Sanction Scale-Up Order</span>
        </button>
      </div>

      {/* Scale-Up Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {scaleUps.length === 0 ? (
          <div className="gov-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#64748B' }}>No scale-up deployment orders created yet.</p>
          </div>
        ) : (
          scaleUps.map((su) => {
            const startupName = su.startupId?.name || 'AgriSense Technologies';

            return (
              <div key={su._id} className="gov-card" style={{ borderLeft: '4px solid #166534' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <span className="badge badge-emerald"><CheckCircle2 size={12} /> {formatText(su.approvalStatus)}</span>
                      <span className="badge badge-saffron">{formatText(startupName)}</span>
                      <span className="badge badge-navy"><MapPin size={12} /> {su.targetDistrictsCount} Districts</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A2540' }}>{formatText(su.scaleScope)}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748B' }}>{formatText(su.departmentName)}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#166534' }}>{formatCurrency(su.totalApprovedBudget)}</span>
                    <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#15803D' }}>APPROVED SANCTION BUDGET</span>
                  </div>
                </div>

                {/* Scale Specs Grid */}
                <div style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '1rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem'
                }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>TARGET BENEFICIARIES</span>
                    <p style={{ fontWeight: 700, color: '#0A2540' }}>{formatText(su.targetBeneficiaries)}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>SCALABLE UNITS</span>
                    <p style={{ fontWeight: 700, color: '#2563EB' }}>{su.scalableUnits?.toLocaleString('en-IN')} Units</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>PROCUREMENT MECHANISM</span>
                    <p style={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>{formatText(su.procurementMechanism)}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>GEM REFERENCE</span>
                    <p style={{ fontWeight: 700, color: '#059669', fontSize: '0.85rem' }}>{su.gemIntegrationRef}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Scale-Up Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540' }}>Sanction Statewide Scale-Up Order</h3>
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            <form onSubmit={handleCreateScaleUp}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Validated Pilot</label>
                  <select
                    value={formData.pilotId}
                    onChange={e => setFormData({ ...formData, pilotId: e.target.value })}
                    className="form-select"
                    required
                  >
                    <option value="">-- Choose Validated Pilot --</option>
                    {pilots.map(p => (
                      <option key={p._id} value={p._id}>
                        {formatText(p.pilotTitle)} (Score: {p.pilotSuccessScore})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Scale Scope & Title</label>
                  <input
                    type="text"
                    value={formData.scaleScope}
                    onChange={e => setFormData({ ...formData, scaleScope: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Target Districts Count</label>
                    <input
                      type="number"
                      value={formData.targetDistrictsCount}
                      onChange={e => setFormData({ ...formData, targetDistrictsCount: Number(e.target.value) })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Scalable Units / Hardware Count</label>
                    <input
                      type="number"
                      value={formData.scalableUnits}
                      onChange={e => setFormData({ ...formData, scalableUnits: Number(e.target.value) })}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Total Approved Scale Budget (₹)</label>
                  <input
                    type="number"
                    value={formData.totalApprovedBudget}
                    onChange={e => setFormData({ ...formData, totalApprovedBudget: Number(e.target.value) })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">GeM Portal Integration Reference</label>
                  <input
                    type="text"
                    value={formData.gemIntegrationRef}
                    onChange={e => setFormData({ ...formData, gemIntegrationRef: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-emerald">Issue Sanction Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

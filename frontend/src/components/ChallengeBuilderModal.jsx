import React, { useState } from 'react';
import { X, Sparkles, Plus, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { formatText } from '../utils/textUtils';

export const ChallengeBuilderModal = ({ isOpen, onClose, onChallengeCreated }) => {
  const [loadingAi, setLoadingAi] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: 'Public Health Department, Government of Maharashtra',
    problemDescription: '',
    currentSituation: 'Average patient wait time from token generation to doctor consultation is 45 minutes.',
    targetBeneficiaries: 'Daily OPD Patients across State District Hospitals',
    expectedOutcome: '',
    estimatedBudget: 1500000,
    pilotDurationDays: 90,
    kpiBaseline: '45 minutes',
    kpiTarget: '< 20 minutes',
    requiredTechnology: 'AI Queue Optimization, Computer Vision, Kiosk',
    securityRequirements: 'AES-256 Encryption, CERT-In Audit'
  });

  if (!isOpen) return null;

  const handleAiAssist = async () => {
    setLoadingAi(true);
    try {
      const res = await axios.post('/api/challenges/ai-assist', {
        problemText: formData.problemDescription || 'OPD Hospital Queue Waiting Time'
      });
      const data = res.data;
      setFormData(prev => ({
        ...prev,
        title: data.title,
        expectedOutcome: data.expectedOutcome,
        kpiBaseline: data.kpiMetrics[0].baselineValue,
        kpiTarget: data.kpiMetrics[0].targetValue,
        requiredTechnology: data.requiredTechnology.join(', '),
        securityRequirements: data.securityRequirements.join(', ')
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        department: formData.department,
        problemDescription: formData.problemDescription,
        currentSituation: formData.currentSituation,
        targetBeneficiaries: formData.targetBeneficiaries,
        expectedOutcome: formData.expectedOutcome,
        estimatedBudget: Number(formData.estimatedBudget),
        pilotDurationDays: Number(formData.pilotDurationDays),
        kpiMetrics: [
          { name: 'Primary Operational KPI', baselineValue: formData.kpiBaseline, targetValue: formData.kpiTarget, currentValue: 'Pending Pilot' }
        ],
        requiredTechnology: formData.requiredTechnology.split(',').map(s => s.trim()),
        securityRequirements: formData.securityRequirements.split(',').map(s => s.trim()),
        status: 'Published'
      };

      await axios.post('/api/challenges', payload);
      onChallengeCreated();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-saffron">Outcome Based Builder</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540' }}>
              Create Government Innovation Challenge
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#64748B" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between'
            }}>
              <div>
                <p style={{ fontWeight: 600, color: '#1E3A8A', fontSize: '0.875rem' }}>
                  Need help formulating outcome-based requirements?
                </p>
                <p style={{ fontSize: '0.775rem', color: '#3B82F6' }}>
                  AI Challenge Assistant transforms rough problems into measurable KPIs and security criteria.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAiAssist}
                className="btn-primary"
                disabled={loadingAi}
                style={{ backgroundColor: '#D97706', whiteSpace: 'nowrap' }}
              >
                <Sparkles size={16} color="#FFFFFF" />
                <span>{loadingAi ? 'AI Synthesizing...' : 'AI Assist Challenge'}</span>
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Government Department</label>
              <input
                className="form-input"
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Challenge Title</label>
              <input
                className="form-input"
                placeholder="e.g. AI Based Hospital OPD Queue Optimization"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Problem Statement Description</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Describe current operational bottlenecks and hospital impact..."
                value={formData.problemDescription}
                onChange={e => setFormData({ ...formData, problemDescription: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Baseline KPI Metric</label>
                <input
                  className="form-input"
                  placeholder="e.g. 45 minutes"
                  value={formData.kpiBaseline}
                  onChange={e => setFormData({ ...formData, kpiBaseline: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Target KPI Outcome</label>
                <input
                  className="form-input"
                  placeholder="e.g. < 20 minutes"
                  value={formData.kpiTarget}
                  onChange={e => setFormData({ ...formData, kpiTarget: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Estimated Pilot Budget (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.estimatedBudget}
                  onChange={e => setFormData({ ...formData, estimatedBudget: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Pilot Duration (Days)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.pilotDurationDays}
                  onChange={e => setFormData({ ...formData, pilotDurationDays: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Required Technologies (Comma separated)</label>
              <input
                className="form-input"
                value={formData.requiredTechnology}
                onChange={e => setFormData({ ...formData, requiredTechnology: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Plus size={16} />
              <span>Publish Challenge</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

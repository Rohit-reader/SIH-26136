import React, { useState } from 'react';
import { X, Sparkles, Plus, CheckCircle2, FileText, Layers } from 'lucide-react';
import axios from 'axios';
import { formatText } from '../utils/textUtils';
import { ProblemTemplatesModal } from './govt/ProblemTemplatesModal';

export const ChallengeBuilderModal = ({ isOpen, onClose, onChallengeCreated }) => {
  const [loadingAi, setLoadingAi] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    department: 'Public Health Department, Government of Maharashtra',
    problemDescription: '',
    currentSituation: 'Average patient wait time from token generation to doctor consultation is 210 minutes (3.5 hours).',
    targetBeneficiaries: 'Daily OPD Patients across State District Hospitals',
    expectedOutcome: 'Reduce patient OPD wait times below 45 minutes and eliminate emergency triage delays.',
    estimatedBudget: 1420000,
    pilotDurationDays: 90,
    kpiBaseline: '210 minutes patient wait time',
    kpiTarget: '< 45 minutes wait time',
    requiredTechnology: 'Edge Computer Vision, ML Queue Optimization, Smart Token Kiosks, WhatsApp Business API',
    securityRequirements: 'DPDP Act 2023 Compliance, ISO 27001 Certified Edge Nodes, Zero PII Storage on Public Cloud'
  });

  if (!isOpen) return null;

  const handleSelectTemplate = (template) => {
    setFormData({
      title: template.title,
      department: template.department,
      problemDescription: template.problemDescription,
      currentSituation: template.currentSituation,
      targetBeneficiaries: template.targetBeneficiaries,
      expectedOutcome: template.kpiTarget,
      estimatedBudget: template.estimatedBudget,
      pilotDurationDays: template.pilotDurationDays,
      kpiBaseline: template.kpiBaseline,
      kpiTarget: template.kpiTarget,
      requiredTechnology: template.requiredTechnology,
      securityRequirements: template.securityRequirements
    });
  };

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
    <>
      <div className="modal-overlay">
        <div className="modal-content" style={{ maxWidth: '840px' }}>
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
              {/* Template & AI Assist Helper Bar */}
              <div style={{
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div>
                  <p style={{ fontWeight: 700, color: '#1E3A8A', fontSize: '0.875rem', margin: 0 }}>
                    Standard Formulation Templates Available
                  </p>
                  <p style={{ fontSize: '0.775rem', color: '#3B82F6', margin: '0.15rem 0 0 0' }}>
                    Load pre-structured, outcome-based definitions for Health, Agri, Education, Water & Smart ULBs
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsTemplatesModalOpen(true)}
                    className="btn-primary"
                    style={{ backgroundColor: '#0A2540', fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                  >
                    <FileText size={15} color="#FF9933" />
                    <span>Browse Templates</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAiAssist}
                    className="btn-primary"
                    disabled={loadingAi}
                    style={{ backgroundColor: '#D97706', fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                  >
                    <Sparkles size={15} color="#FFFFFF" />
                    <span>{loadingAi ? 'Synthesizing...' : 'AI Assist'}</span>
                  </button>
                </div>
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
                <label className="form-label">Baseline Problem Statement Description</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="Describe current operational bottlenecks and public service impact..."
                  value={formData.problemDescription}
                  onChange={e => setFormData({ ...formData, problemDescription: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Baseline Operational Metric</label>
                  <input
                    className="form-input"
                    placeholder="e.g. 210 minutes average wait time"
                    value={formData.kpiBaseline}
                    onChange={e => setFormData({ ...formData, kpiBaseline: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Target KPI Outcome</label>
                  <input
                    className="form-input"
                    placeholder="e.g. < 45 minutes wait time"
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

              <div className="form-group">
                <label className="form-label">Cybersecurity & Risk Compliance Requirements</label>
                <input
                  className="form-input"
                  value={formData.securityRequirements}
                  onChange={e => setFormData({ ...formData, securityRequirements: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Plus size={16} />
                <span>Publish Outcome Challenge</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Problem Formulation Templates Gallery Modal */}
      <ProblemTemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </>
  );
};

export default ChallengeBuilderModal;

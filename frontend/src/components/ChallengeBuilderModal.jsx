import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  FileText, 
  Layers, 
  ShieldCheck, 
  Award, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Building2,
  Lock,
  IndianRupee,
  Clock,
  Target,
  FileCheck
} from 'lucide-react';
import axios from 'axios';
import { formatText } from '../utils/textUtils';
import { ProblemTemplatesModal } from './govt/ProblemTemplatesModal';

const PRE_APPROVED_LEGAL_CLAUSES = [
  {
    id: 'gfr_waiver',
    title: 'GFR Rule 173(i) Turnover & Experience Waiver',
    category: 'Procurement Exemption',
    text: '100% relaxation of prior turnover and prior experience criteria for DPIIT and MSINS registered startups under Maharashtra Innovation Procurement Guidelines 2024.'
  },
  {
    id: 'ip_protection',
    title: 'Startup Intellectual Property Ownership Clause',
    category: 'IP & Patent Rights',
    text: 'Startup retains 100% ownership of background and foreground IP developed during the pilot. Government receives non-exclusive perpetual usage rights for state public services.'
  },
  {
    id: 'dpdp_compliance',
    title: 'DPDP Act 2023 & Data Privacy Compliance',
    category: 'Data Privacy',
    text: 'Strict adherence to Digital Personal Data Protection Act 2023. Zero PII storage on public cloud infrastructure; all data encrypted at rest (AES-256) and in transit.'
  },
  {
    id: 'cert_in_audit',
    title: 'CERT-In Cyber Security Pre-Flight Audit',
    category: 'Cybersecurity',
    text: 'Pre-flight security vulnerability assessment certified by CERT-In empaneled auditor prior to live government infrastructure sandboxing.'
  },
  {
    id: 'milestone_disbursement',
    title: 'Unconditional Milestone Verification & Escrow Trigger',
    category: 'Financial Milestone',
    text: 'Automated 100% payment release triggered within 7 business days upon independent validator digital verification of target KPI achievement.'
  }
];

const EMPTY_FORM_DATA = {
  title: '',
  department: 'Public Health Department, Government of Maharashtra',
  sector: 'Public Health',
  problemDescription: '',
  currentSituation: '',
  targetBeneficiaries: '',
  targetDistrict: 'Statewide (All 36 Districts)',
  expectedOutcome: '',
  estimatedBudget: '',
  pilotDurationDays: 90,
  kpiBaseline: '',
  kpiTarget: '',
  requiredTechnology: '',
  securityRequirements: 'DPDP Act 2023 Compliance, ISO 27001 Certified Edge Nodes, CERT-In Cyber Security Audit',
  exemptions: {
    turnoverWaived: true,
    experienceWaived: true,
    emdExempted: true
  },
  selectedClauses: [
    'gfr_waiver',
    'ip_protection',
    'dpdp_compliance',
    'cert_in_audit',
    'milestone_disbursement'
  ]
};

export const ChallengeBuilderModal = ({ isOpen, onClose, onChallengeCreated }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [loadingAi, setLoadingAi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);

  const [formData, setFormData] = useState(EMPTY_FORM_DATA);

  if (!isOpen) return null;

  const handleSelectTemplate = (template) => {
    setFormData(prev => ({
      ...prev,
      title: template.title,
      department: template.department,
      sector: template.sector || 'Public Health',
      problemDescription: template.problemDescription,
      currentSituation: template.currentSituation || 'Manual workflow baseline',
      targetBeneficiaries: template.targetBeneficiaries,
      expectedOutcome: template.kpiTarget,
      estimatedBudget: template.estimatedBudget,
      pilotDurationDays: template.pilotDurationDays,
      kpiBaseline: template.kpiBaseline,
      kpiTarget: template.kpiTarget,
      requiredTechnology: template.requiredTechnology,
      securityRequirements: template.securityRequirements || prev.securityRequirements
    }));
    setErrorMsg('');
  };

  const handleAiAssist = async () => {
    if (!formData.title) return;
    setLoadingAi(true);
    setErrorMsg('');
    try {
      const res = await axios.post('/api/challenges/ai-formulate', {
        title: formData.title,
        sector: formData.sector
      });
      const data = res.data;
      setFormData(prev => ({
        ...prev,
        title: data.title,
        sector: data.sector || prev.sector,
        problemDescription: data.problemDescription || prev.problemDescription,
        currentSituation: data.currentSituation || prev.currentSituation,
        targetBeneficiaries: data.targetBeneficiaries || prev.targetBeneficiaries,
        expectedOutcome: data.expectedOutcome,
        kpiBaseline: data.kpiBaseline,
        kpiTarget: data.kpiTarget,
        requiredTechnology: Array.isArray(data.requiredTechnology) ? data.requiredTechnology.join(', ') : data.requiredTechnology,
        securityRequirements: Array.isArray(data.securityRequirements) ? data.securityRequirements.join(', ') : data.securityRequirements
      }));
    } catch (err) {
      console.error('AI assist failed', err);
    } finally {
      setLoadingAi(false);
    }
  };

  const toggleClause = (clauseId) => {
    setFormData(prev => {
      const exists = prev.selectedClauses.includes(clauseId);
      return {
        ...prev,
        selectedClauses: exists 
          ? prev.selectedClauses.filter(id => id !== clauseId)
          : [...prev.selectedClauses, clauseId]
      };
    });
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      if (!formData.title || !formData.title.trim()) {
        setErrorMsg('Please specify a Challenge Title in Sector & Context (Step 1).');
        setActiveStep(1);
        setIsSubmitting(false);
        return;
      }
      if (!formData.problemDescription || !formData.problemDescription.trim()) {
        setErrorMsg('Please provide a Problem Statement in Sector & Context (Step 1).');
        setActiveStep(1);
        setIsSubmitting(false);
        return;
      }

      const compiledClauses = formData.selectedClauses.map(id => {
        const found = PRE_APPROVED_LEGAL_CLAUSES.find(c => c.id === id);
        return found ? `${found.title}: ${found.text}` : id;
      });

      const budget = Number(formData.estimatedBudget) > 0 ? Number(formData.estimatedBudget) : 1500000;
      const duration = Number(formData.pilotDurationDays) > 0 ? Number(formData.pilotDurationDays) : 90;

      const payload = {
        title: formData.title.trim(),
        department: formData.department || 'Public Health Department, Government of Maharashtra',
        sector: formData.sector || 'Public Health',
        problemDescription: formData.problemDescription.trim(),
        currentSituation: formData.currentSituation || 'Standard manual operational baseline',
        targetBeneficiaries: formData.targetBeneficiaries || 'Citizens & Field Beneficiaries across Maharashtra',
        targetDistrict: formData.targetDistrict || 'Statewide (All 36 Districts)',
        expectedOutcome: formData.expectedOutcome || formData.kpiTarget || 'Measurable outcome & operational improvement',
        estimatedBudget: budget,
        pilotDurationDays: duration,
        kpiMetrics: [
          { 
            name: 'Primary Operational KPI Benchmark', 
            baselineValue: formData.kpiBaseline || 'Current manual process baseline', 
            targetValue: formData.kpiTarget || formData.expectedOutcome || 'Target operational improvement', 
            currentValue: 'Pending Pilot Launch' 
          }
        ],
        requiredTechnology: typeof formData.requiredTechnology === 'string' 
          ? formData.requiredTechnology.split(',').map(s => s.trim()).filter(Boolean) 
          : (formData.requiredTechnology || []),
        securityRequirements: typeof formData.securityRequirements === 'string'
          ? formData.securityRequirements.split(',').map(s => s.trim()).filter(Boolean)
          : (formData.securityRequirements || []),
        exemptions: formData.exemptions || { turnoverWaived: true, experienceWaived: true, emdExempted: true },
        legalClauses: compiledClauses,
        status: 'Published'
      };

      await axios.post('/api/challenges', payload);
      setFormData(EMPTY_FORM_DATA);
      setActiveStep(1);
      if (typeof onChallengeCreated === 'function') {
        onChallengeCreated();
      }
      if (typeof onClose === 'function') {
        onClose();
      }
    } catch (err) {
      console.error('Failed to publish challenge:', err);
      const msg = err.response?.data?.error || err.message || 'Failed to publish challenge. Please check input values.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" style={{ zIndex: 1100 }}>
        <div className="modal-content" style={{ maxWidth: '920px', width: '95%', maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          
          {/* Header */}
          <div style={{ backgroundColor: '#0A2540', color: '#FFFFFF', padding: '1.15rem 1.5rem', borderBottom: '4px solid #FF9933', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ backgroundColor: 'rgba(255,153,51,0.2)', padding: '0.5rem', borderRadius: '50%' }}>
                <Layers size={22} color="#FF9933" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    Outcome-Based Challenge Builder
                  </h3>
                  <span className="badge badge-saffron" style={{ fontSize: '0.65rem' }}>
                    Phase 1 Standardized
                  </span>
                </div>
                <p style={{ fontSize: '0.775rem', color: '#94A3B8', margin: 0 }}>
                  Structured formulation with GFR startup waivers & pre-approved legal clause templates
                </p>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} color="#FFFFFF" />
            </button>
          </div>

          {/* Stepper Wizard Bar */}
          <div style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '0.85rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {[
              { step: 1, label: 'Sector & Context' },
              { step: 2, label: 'Outcome KPIs & Budget' },
              { step: 3, label: 'Tech & Security' },
              { step: 4, label: 'GFR Waivers & Legal' }
            ].map(s => {
              const isActive = activeStep === s.step;
              const isCompleted = activeStep > s.step;
              return (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(s.step)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: isActive || isCompleted ? 1 : 0.5
                  }}
                >
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: isCompleted ? '#059669' : isActive ? '#0A2540' : '#CBD5E1',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}>
                    {isCompleted ? <Check size={14} /> : s.step}
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: isActive ? 700 : 500, color: isActive ? '#0A2540' : '#475569' }}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-body" style={{ flex: 1, padding: '1.25rem 1.5rem' }}>
              
              {/* Helper Bar for Standard Formulation Templates */}
              <div style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div>
                  <p style={{ fontWeight: 700, color: '#0A2540', fontSize: '0.85rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FileText size={16} color="#FF9933" /> Standard Problem Formulation Library
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.15rem 0 0 0' }}>
                    Load pre-structured department templates for outcome KPIs, cybersecurity criteria & GFR clauses
                  </p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setIsTemplatesModalOpen(true)}
                    className="btn-primary"
                    style={{ backgroundColor: '#0A2540', fontSize: '0.775rem', padding: '0.4rem 0.85rem' }}
                  >
                    <FileText size={14} color="#FF9933" />
                    <span>Sector Templates</span>
                  </button>
                </div>
              </div>

              {/* STEP 1: SECTOR & CONTEXT */}
              {activeStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                      <label className="form-label">Sector / Domain</label>
                      <select
                        className="form-input"
                        value={formData.sector}
                        onChange={e => setFormData({ ...formData, sector: e.target.value })}
                      >
                        <option value="Public Health">Public Health</option>
                        <option value="Agriculture & Irrigation">Agriculture & Irrigation</option>
                        <option value="School Education & Skills">School Education & Skills</option>
                        <option value="Water & Sanitation">Water & Sanitation</option>
                        <option value="Smart Governance & ULBs">Smart Governance & ULBs</option>
                        <option value="CleanTech & Energy">CleanTech & Energy</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Challenge Title</label>
                    <input
                      className="form-input"
                      placeholder="e.g. Smart OPD Queue Triage & Hospital Crowding Reduction"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Baseline Operational Problem Statement</label>
                    <textarea
                      className="form-textarea"
                      rows="3"
                      placeholder="Describe the operational bottleneck and public service impact..."
                      value={formData.problemDescription}
                      onChange={e => setFormData({ ...formData, problemDescription: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Target Beneficiaries</label>
                      <input
                        className="form-input"
                        placeholder="e.g. Daily OPD Patients across State Hospitals"
                        value={formData.targetBeneficiaries}
                        onChange={e => setFormData({ ...formData, targetBeneficiaries: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Target District / Pilot Scope</label>
                      <input
                        className="form-input"
                        placeholder="e.g. Statewide (All 36 Districts)"
                        value={formData.targetDistrict}
                        onChange={e => setFormData({ ...formData, targetDistrict: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: OUTCOME KPIS & BUDGET */}
              {activeStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0A2540', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                      <Target size={16} color="#0A2540" /> Quantifiable Outcome Metrics (Baseline vs Target)
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Baseline Metric (Current Problem)</label>
                        <input
                          className="form-input"
                          placeholder="e.g. 210 minutes average wait time"
                          value={formData.kpiBaseline}
                          onChange={e => setFormData({ ...formData, kpiBaseline: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Target Outcome KPI (Expected Impact)</label>
                        <input
                          className="form-input"
                          placeholder="e.g. < 45 minutes wait time"
                          value={formData.kpiTarget}
                          onChange={e => setFormData({ ...formData, kpiTarget: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Expected High-Level Impact Summary</label>
                    <textarea
                      className="form-textarea"
                      rows="2"
                      placeholder="Summarize outcome achievement goals..."
                      value={formData.expectedOutcome}
                      onChange={e => setFormData({ ...formData, expectedOutcome: e.target.value })}
                    />
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
                      <label className="form-label">Pilot Trial Duration (Days)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.pilotDurationDays}
                        onChange={e => setFormData({ ...formData, pilotDurationDays: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: TECH & SECURITY */}
              {activeStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Required Technologies (Comma separated)</label>
                    <input
                      className="form-input"
                      value={formData.requiredTechnology}
                      onChange={e => setFormData({ ...formData, requiredTechnology: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cybersecurity & Risk Compliance Protocols</label>
                    <textarea
                      className="form-textarea"
                      rows="3"
                      value={formData.securityRequirements}
                      onChange={e => setFormData({ ...formData, securityRequirements: e.target.value })}
                    />
                  </div>

                  <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', padding: '0.85rem 1rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#B45309', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <ShieldCheck size={16} color="#D97706" /> Regulatory Sandbox Security Standard
                    </span>
                    <p style={{ fontSize: '0.75rem', color: '#78350F', margin: '0.2rem 0 0 0' }}>
                      All solutions will undergo pre-flight cybersecurity scanning and data privacy validation prior to live integration with department databases.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 4: GFR WAIVERS & LEGAL CLAUSES */}
              {activeStep === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  {/* Startup GFR Exemptions Card */}
                  <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#065F46', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Award size={18} color="#059669" /> Startup Relaxation & Procurement Waivers (GFR Rule 173)
                      </span>
                      <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Automated GFR Relaxations</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FFFFFF', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.775rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.exemptions.turnoverWaived}
                          onChange={e => setFormData({ ...formData, exemptions: { ...formData.exemptions, turnoverWaived: e.target.checked } })}
                        />
                        <span style={{ fontWeight: 600, color: '#111827' }}>Turnover Criteria Waived</span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FFFFFF', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.775rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.exemptions.experienceWaived}
                          onChange={e => setFormData({ ...formData, exemptions: { ...formData.exemptions, experienceWaived: e.target.checked } })}
                        />
                        <span style={{ fontWeight: 600, color: '#111827' }}>Prior Experience Waived</span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FFFFFF', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.775rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.exemptions.emdExempted}
                          onChange={e => setFormData({ ...formData, exemptions: { ...formData.exemptions, emdExempted: e.target.checked } })}
                        />
                        <span style={{ fontWeight: 600, color: '#111827' }}>EMD Deposit Exempted</span>
                      </label>
                    </div>
                  </div>

                  {/* Pre-Approved Clause Library Selector */}
                  <div>
                    <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#0A2540', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                      SELECT PRE-APPROVED LEGAL & COMPLIANCE CLAUSES ({formData.selectedClauses.length} selected):
                    </span>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {PRE_APPROVED_LEGAL_CLAUSES.map(clause => {
                        const isSelected = formData.selectedClauses.includes(clause.id);
                        return (
                          <div
                            key={clause.id}
                            onClick={() => toggleClause(clause.id)}
                            style={{
                              border: isSelected ? '2px solid #0A2540' : '1px solid #E2E8F0',
                              backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                              borderRadius: '6px',
                              padding: '0.75rem 0.85rem',
                              cursor: 'pointer',
                              display: 'flex',
                              gap: '0.75rem',
                              alignItems: 'flex-start',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              style={{ marginTop: '0.2rem' }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong style={{ fontSize: '0.825rem', color: '#0A2540' }}>{clause.title}</strong>
                                <span className="badge badge-navy" style={{ fontSize: '0.625rem' }}>{clause.category}</span>
                              </div>
                              <p style={{ fontSize: '0.75rem', color: '#475569', margin: '0.2rem 0 0 0', lineHeight: 1.4 }}>
                                {clause.text}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error message banner if any */}
            {errorMsg && (
              <div style={{ backgroundColor: '#FEF2F2', borderTop: '1px solid #FCA5A5', padding: '0.65rem 1.5rem', color: '#991B1B', fontSize: '0.825rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>⚠️ {errorMsg}</span>
              </div>
            )}

            {/* Footer Navigation Controls */}
            <div className="modal-footer" style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => activeStep > 1 ? setActiveStep(activeStep - 1) : onClose()}
                className="btn-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                {activeStep > 1 ? <ChevronLeft size={16} /> : null}
                <span>{activeStep > 1 ? 'Back' : 'Cancel'}</span>
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {activeStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeStep === 1 && !formData.title.trim()) {
                        setErrorMsg('Please enter a Challenge Title before proceeding.');
                        return;
                      }
                      setErrorMsg('');
                      setActiveStep(activeStep + 1);
                    }}
                    className="btn-primary"
                    style={{ backgroundColor: '#0A2540', fontSize: '0.85rem' }}
                  >
                    <span>Next: {activeStep === 1 ? 'Outcome KPIs' : activeStep === 2 ? 'Tech & Security' : 'Legal & Waivers'}</span>
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn-emerald" 
                    style={{ fontSize: '0.85rem', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                  >
                    <FileCheck size={18} />
                    <span>{isSubmitting ? 'Publishing Challenge...' : 'Publish Standardized Challenge'}</span>
                  </button>
                )}
              </div>
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

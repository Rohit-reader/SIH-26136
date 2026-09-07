import React, { useState } from 'react';
import { 
  X, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  FileText, 
  Save, 
  AlertTriangle, 
  Upload, 
  Sparkles, 
  IndianRupee, 
  Cpu, 
  Clock,
  Layers,
  Award,
  Check
} from 'lucide-react';
import axios from 'axios';
import { formatText, formatCurrency } from '../../utils/textUtils';

export const StartupSubmitProposalModal = ({ isOpen, onClose, challenge, primaryStartup = {}, onProposalSubmitted }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 8-Step Form State
  const [formData, setFormData] = useState({
    // Step 1: Eligibility
    dpiitConfirmed: true,
    turnoverWaived: true,
    emdWaived: true,
    certInDeclared: true,
    trlDeclared: true,

    // Step 2: Startup & Solution Overview
    solutionTitle: 'SmartOPD — AI Triage & Computer Vision OPD Queue Platform',
    shortSummary: 'Edge-AI camera setup with intelligent WhatsApp/Kiosk queue broadcasting to cut OPD wait times by 75%.',
    problemUnderstanding: 'Government OPDs face extreme peak-hour congestion (3.5+ hrs wait time), causing severe patient dissatisfaction and delayed emergency triage.',

    // Step 3: Technical Proposal
    technicalApproach: 'Deploys localized edge-AI cameras at OPD registration desks linked to smart queue token dispensers. Real-time patient volume feeds into an ML model to dynamically route priority emergency cases.',
    architectureSummary: 'Microservices architecture with local hospital server fallback, encrypted API gateways, and MeitY-approved cloud synchronization.',
    technologyStack: ['Edge Computer Vision', 'TensorFlow Lite', 'MeitY Health Cloud', 'FHIR/HL7 Compliant APIs', 'WhatsApp Business API'],
    innovationHighlights: 'Patent-pending non-intrusive patient crowding measurement algorithm with zero PII/facial data storage.',

    // Step 4: Implementation Plan & Timeline
    implementationDays: 75,
    keyMilestones: [
      { step: 'Phase 1: Site Survey & Hardware Setup', days: 15, deliverable: 'Edge AI camera & token kiosk installed in 3 district hospital OPDs' },
      { step: 'Phase 2: Software Integration & Pilot Test', days: 30, deliverable: 'HMIS integration & WhatsApp queue notification broadcast live' },
      { step: 'Phase 3: Field Trial & KPI Evaluation', days: 30, deliverable: '75-day continuous OPD triage data & Independent Validation Report' }
    ],

    // Step 5: Field Pilot Methodology
    pilotMethodology: 'Controlled field deployment in 3 District Hospitals (Pune, Nashik, Thane). 24/7 technical support desk on-site.',
    hospitalSiteRequirements: 'Dedicated LAN connectivity (100Mbps), UPS power backup for edge servers, registration counter access.',
    safetyCompliance: 'Strict adherence to Digital Personal Data Protection (DPDP) Act 2023 & ISO 27001 cybersecurity standards.',

    // Step 6: Commercial & Budget Proposal
    proposedBudget: challenge?.estimatedBudget || 1420000,
    budgetBreakdown: [
      { item: 'Edge AI Hardware & Kiosk Units (3 Hospitals)', cost: 480000 },
      { item: 'Software License & HMIS API Integration', cost: 450000 },
      { item: 'Field Engineers & 24/7 On-site Maintenance', cost: 290000 },
      { item: 'Cybersecurity Audit & Cloud Storage (1 Year)', cost: 200000 }
    ],
    exemptionJustification: 'DPIIT Registered Startup — 100% EMD waived as per Maharashtra Innovation Procurement Guidelines.',

    // Step 7: Supporting Documents
    documents: [
      { title: 'DPIIT Recognition Certificate.pdf', status: 'Uploaded' },
      { title: 'SmartOPD Technical Architecture & Flow.pdf', status: 'Uploaded' },
      { title: 'EMD & Turnover Exemption Declaration.pdf', status: 'Uploaded' }
    ],

    // Step 8: Review Confirmation
    acceptTerms: false
  });

  if (!isOpen || !challenge) return null;

  const totalSteps = 8;
  const stepTitles = [
    '1. Eligibility Check',
    '2. Solution Overview',
    '3. Technical Proposal',
    '4. Timeline & Milestones',
    '5. Field Pilot Plan',
    '6. Commercial Budget',
    '7. Supporting Docs',
    '8. Review & Submit'
  ];

  const handleNextStep = () => {
    setErrorMessage('');
    // Step validation rules
    if (currentStep === 2 && (!formData.solutionTitle || !formData.shortSummary)) {
      setErrorMessage('Please fill in the Solution Title and Short Summary');
      return;
    }
    if (currentStep === 3 && (!formData.technicalApproach || !formData.architectureSummary)) {
      setErrorMessage('Please complete the Technical Approach details');
      return;
    }
    if (currentStep === 6 && !formData.proposedBudget) {
      setErrorMessage('Please enter the Proposed Commercial Budget');
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSaveDraft = () => {
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 3000);
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      setErrorMessage('You must confirm and accept the official submission terms');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Determine startupId
      let targetStartupId = primaryStartup?._id;
      if (!targetStartupId) {
        const resS = await axios.get('/api/startups');
        targetStartupId = resS.data[0]?._id;
      }

      if (!targetStartupId) {
        throw new Error('No startup profile found. Please complete startup registration first.');
      }

      const proposalPayload = {
        challengeId: challenge._id,
        startupId: targetStartupId,
        solutionTitle: formData.solutionTitle || 'Outcome-Based Innovation Solution',
        technicalApproach: formData.technicalApproach || 'Edge computing with real-time analytics.',
        architectureSummary: formData.architectureSummary || formData.shortSummary || 'High-availability secure architecture.',
        implementationTimelineDays: Number(formData.implementationDays) || 75,
        proposedBudget: Number(formData.proposedBudget) || challenge.estimatedBudget || 1500000,
        teamOverview: `Core engineering & domain team specializing in ${formData.technologyStack?.join(', ') || 'Government Tech'}.`,
        securityApproach: formData.safetyCompliance || 'Strict compliance with DPDP Act 2023, ISO 27001, and CERT-In standards.'
      };

      const res = await axios.post('/api/proposals', proposalPayload);

      setIsSubmitting(false);
      alert('Proposal Submitted Successfully! Your proposal has entered the Phase 3 Eligibility Screening queue.');
      if (onProposalSubmitted) onProposalSubmitted(res.data);
      onClose();
    } catch (err) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
      const errMsg = err.response?.data?.error || err.message || 'Failed to submit proposal';
      setErrorMessage(`Failed to submit proposal: ${errMsg}`);
      alert(`Submission Error: ${errMsg}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          maxWidth: '900px', 
          width: '95%', 
          maxHeight: '92vh', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div style={{
          backgroundColor: '#0A2540',
          color: '#FFFFFF',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '4px solid #FF9933'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="badge badge-saffron" style={{ fontSize: '0.675rem' }}>
                PROPOSAL WORKFLOW
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              Proposal for: {formatText(challenge.title)}
            </h3>
          </div>

          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Stepper Bar */}
        <div style={{
          backgroundColor: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          overflowX: 'auto'
        }}>
          {stepTitles.map((title, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div 
                key={stepNum}
                onClick={() => {
                  if (stepNum < currentStep) setCurrentStep(stepNum);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.725rem',
                  fontWeight: isCurrent ? 700 : 600,
                  color: isCurrent ? '#0A2540' : isCompleted ? '#059669' : '#94A3B8',
                  backgroundColor: isCurrent ? '#EFF6FF' : 'transparent',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '6px',
                  cursor: isCompleted ? 'pointer' : 'default',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>{isCompleted ? <Check size={13} color="#059669" /> : stepNum}</span>
                <span>{title.split('. ')[1]}</span>
                {idx < totalSteps - 1 && <span style={{ color: '#CBD5E1', marginLeft: '0.2rem' }}>›</span>}
              </div>
            );
          })}
        </div>

        {/* Modal Body Container */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          
          {errorMessage && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#991B1B',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertTriangle size={16} color="#DC2626" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isDraftSaved && (
            <div style={{
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#065F46',
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle2 size={16} color="#059669" />
              <span>Draft saved successfully to local session.</span>
            </div>
          )}

          {/* STEP 1: Eligibility Check */}
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '1.25rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <ShieldCheck size={24} color="#166534" />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#166534', margin: 0 }}>
                    Step 1: Automatic Eligibility & Exemption Verification
                  </h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#15803D', margin: 0, lineHeight: 1.6 }}>
                  As a DPIIT-recognized startup under the Maharashtra State Innovation Procurement Policy, your entity automatically receives full exemptions:
                </p>
              </div>

              <div className="gov-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.dpiitConfirmed} readOnly style={{ width: '18px', height: '18px' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#0A2540', display: 'block' }}>
                      DPIIT Recognition Verified ({primaryStartup.dpiitNumber || 'DIPP10984'})
                    </strong>
                    <span style={{ fontSize: '0.775rem', color: '#64748B' }}>
                      Startup India registration active and recognized by MSInS Maharashtra.
                    </span>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.turnoverWaived} readOnly style={{ width: '18px', height: '18px' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#0A2540', display: 'block' }}>
                      100% Waived Prior Turnover Requirement
                    </strong>
                    <span style={{ fontSize: '0.775rem', color: '#64748B' }}>
                      No minimum financial turnover required for outcome-based government field trials.
                    </span>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.emdWaived} readOnly style={{ width: '18px', height: '18px' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#0A2540', display: 'block' }}>
                      100% Waived Earnest Money Deposit (EMD) Fee
                    </strong>
                    <span style={{ fontSize: '0.775rem', color: '#64748B' }}>
                      ₹0 deposit required to submit this innovation proposal.
                    </span>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.certInDeclared} 
                    onChange={e => setFormData({ ...formData, certInDeclared: e.target.checked })} 
                    style={{ width: '18px', height: '18px' }} 
                  />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#0A2540', display: 'block' }}>
                      CERT-In Cybersecurity & Data Compliance Declaration
                    </strong>
                    <span style={{ fontSize: '0.775rem', color: '#64748B' }}>
                      Self-declaration that proposed solution complies with CERT-In cybersecurity & DPDP Act 2023 directives.
                    </span>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.trlDeclared} 
                    onChange={e => setFormData({ ...formData, trlDeclared: e.target.checked })} 
                    style={{ width: '18px', height: '18px' }} 
                  />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#0A2540', display: 'block' }}>
                      Technology Readiness Level (TRL 5+) Qualification
                    </strong>
                    <span style={{ fontSize: '0.775rem', color: '#64748B' }}>
                      Confirmed working prototype tested in simulated or relevant field environment.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 2: Solution Overview */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                Step 2: Startup Solution & Executive Summary
              </h4>

              <div className="form-group">
                <label className="form-label">Proposed Solution Title *</label>
                <input
                  type="text"
                  required
                  value={formData.solutionTitle}
                  onChange={e => setFormData({ ...formData, solutionTitle: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Executive Summary / Solution Tagline *</label>
                <textarea
                  rows="2"
                  required
                  value={formData.shortSummary}
                  onChange={e => setFormData({ ...formData, shortSummary: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Problem Understanding & Field Analysis *</label>
                <textarea
                  rows="3"
                  required
                  value={formData.problemUnderstanding}
                  onChange={e => setFormData({ ...formData, problemUnderstanding: e.target.value })}
                  className="form-textarea"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Technical Proposal */}
          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                Step 3: Technical Proposal & Architecture
              </h4>

              <div className="form-group">
                <label className="form-label">Technical & Algorithmic Approach *</label>
                <textarea
                  rows="3"
                  required
                  value={formData.technicalApproach}
                  onChange={e => setFormData({ ...formData, technicalApproach: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">System Architecture & Deployment Topology *</label>
                <textarea
                  rows="2"
                  required
                  value={formData.architectureSummary}
                  onChange={e => setFormData({ ...formData, architectureSummary: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Key Innovation Highlights & IP *</label>
                <input
                  type="text"
                  value={formData.innovationHighlights}
                  onChange={e => setFormData({ ...formData, innovationHighlights: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Implementation Plan & Timeline */}
          {currentStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                Step 4: Implementation Plan & Milestone Schedule
              </h4>

              <div className="form-group">
                <label className="form-label">Total Proposed Implementation Duration (Days) *</label>
                <input
                  type="number"
                  value={formData.implementationDays}
                  onChange={e => setFormData({ ...formData, implementationDays: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Phase-wise Milestones Breakdown</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                  {formData.keyMilestones.map((m, idx) => (
                    <div key={idx} style={{ border: '1px solid #E2E8F0', padding: '0.85rem', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
                      <strong style={{ fontSize: '0.875rem', color: '#0A2540', display: 'block' }}>
                        {m.step} ({m.days} Days)
                      </strong>
                      <span style={{ fontSize: '0.775rem', color: '#64748B' }}>
                        Deliverable: {m.deliverable}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Field Pilot Methodology */}
          {currentStep === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                Step 5: Field Pilot Deployment & Site Safety
              </h4>

              <div className="form-group">
                <label className="form-label">Field Pilot Methodology *</label>
                <textarea
                  rows="2"
                  value={formData.pilotMethodology}
                  onChange={e => setFormData({ ...formData, pilotMethodology: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Required Site Support / Infrastructure *</label>
                <input
                  type="text"
                  value={formData.hospitalSiteRequirements}
                  onChange={e => setFormData({ ...formData, hospitalSiteRequirements: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Data Privacy & Security Standards *</label>
                <input
                  type="text"
                  value={formData.safetyCompliance}
                  onChange={e => setFormData({ ...formData, safetyCompliance: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>
          )}

          {/* STEP 6: Commercial Budget */}
          {currentStep === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                Step 6: Commercial Proposal & Cost Breakdown
              </h4>

              <div className="form-group">
                <label className="form-label">Total Proposed Commercial Budget (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.proposedBudget}
                  onChange={e => setFormData({ ...formData, proposedBudget: e.target.value })}
                  className="form-input"
                  style={{ fontSize: '1.1rem', fontWeight: 700 }}
                />
                <span style={{ fontSize: '0.725rem', color: '#64748B', marginTop: '0.25rem', display: 'block' }}>
                  Max Allocated Challenge Budget: {formatCurrency(challenge.estimatedBudget)}
                </span>
              </div>

              <div>
                <label className="form-label">Itemized Cost Breakdown</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {formData.budgetBreakdown.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.85rem', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.825rem' }}>
                      <span>{item.item}</span>
                      <strong style={{ color: '#0A2540' }}>{formatCurrency(item.cost)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Supporting Documents */}
          {currentStep === 7 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                Step 7: Supporting Documents & Exemption Certificates
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {formData.documents.map((doc, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <FileText size={18} color="#1E3A8A" />
                      <strong style={{ fontSize: '0.85rem', color: '#0A2540' }}>{doc.title}</strong>
                    </div>
                    <span className="badge badge-emerald" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      Attached <CheckCircle2 size={12} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: Review & Submit */}
          {currentStep === 8 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <AlertTriangle size={22} color="#D97706" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <div>
                  <strong style={{ fontSize: '0.9rem', color: '#B45309', display: 'block' }}>
                    Final Submission Confirmation
                  </strong>
                  <span style={{ fontSize: '0.775rem', color: '#D97706' }}>
                    Please review your proposal parameters. Once submitted, your application will enter the multi-expert domain evaluation queue.
                  </span>
                </div>
              </div>

              <div className="gov-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748B' }}>Target Challenge:</span>
                  <strong style={{ color: '#0A2540' }}>{formatText(challenge.title)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748B' }}>Proposed Solution:</span>
                  <strong style={{ color: '#0A2540' }}>{formData.solutionTitle}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748B' }}>Proposed Commercial Budget:</span>
                  <strong style={{ color: '#059669', fontSize: '1rem' }}>{formatCurrency(formData.proposedBudget)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748B' }}>Implementation Days:</span>
                  <strong style={{ color: '#0A2540' }}>{formData.implementationDays} Days</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>DPIIT Exemptions Applied:</span>
                  <span className="badge badge-emerald">Turnover & EMD Waived</span>
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={e => setFormData({ ...formData, acceptTerms: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.825rem', color: '#334155' }}>
                  I confirm that all provided details and DPIIT certifications are authentic and compliant with Maharashtra State Innovation Procurement Rules 2024.
                </span>
              </label>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div style={{
          backgroundColor: '#F8FAFC',
          borderTop: '1px solid #E2E8F0',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}
            >
              <Save size={14} /> Save Draft
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="btn-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                <ChevronLeft size={16} /> Previous
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="btn-primary"
                style={{ fontSize: '0.85rem' }}
              >
                Next Step <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitProposal}
                disabled={isSubmitting || !formData.acceptTerms}
                className="btn-emerald"
                style={{ fontSize: '0.9rem', padding: '0.65rem 1.25rem' }}
              >
                <Send size={16} /> {isSubmitting ? 'Submitting Official Proposal...' : 'Final Submit Proposal'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StartupSubmitProposalModal;

import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  Building2, 
  Rocket, 
  Award, 
  ShieldCheck, 
  ExternalLink, 
  DollarSign, 
  AlertCircle,
  FileCheck,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Check
} from 'lucide-react';
import { formatText, formatCurrency } from '../../utils/textUtils';

export const StartupApplicationsTab = ({ 
  proposals = [], 
  challenges = [], 
  pilots = [], 
  onNavigateTab,
  selectedProposalId = null,
  onClearSelectedProposal
}) => {
  const [activeProposal, setActiveProposal] = useState(() => {
    if (selectedProposalId) {
      return proposals.find(p => p._id === selectedProposalId) || null;
    }
    return null;
  });

  const [statusFilter, setStatusFilter] = useState('all');

  // Complete lifecycle steps for status tracker
  const lifecycleSteps = [
    { id: 'Submitted', label: 'Proposal Submitted' },
    { id: 'Eligibility Review', label: 'Eligibility Review' },
    { id: 'Expert Evaluation', label: 'Expert Panel Evaluation' },
    { id: 'Shortlisted', label: 'Shortlisted for Pilot' },
    { id: 'Selected for Pilot', label: 'Field Pilot Launched' },
    { id: 'Validation', label: 'Quality Control Validation' },
    { id: 'Scale-up', label: 'Statewide GeM Procurement' }
  ];

  // Map application status to step index
  const getLifecycleStepIndex = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('scale') || s.includes('procure')) return 6;
    if (s.includes('validat')) return 5;
    if (s.includes('pilot') || s.includes('selected')) return 4;
    if (s.includes('shortlist')) return 3;
    if (s.includes('evaluat') || s.includes('review')) return 2;
    if (s.includes('eligib')) return 1;
    return 0; // Submitted
  };

  const filteredProposals = proposals.filter(p => {
    if (statusFilter === 'all') return true;
    return (p.status || '').toLowerCase().includes(statusFilter.toLowerCase());
  });

  // Render Screen G: Application Details View
  if (activeProposal) {
    const currentStepIndex = getLifecycleStepIndex(activeProposal.status);
    const relatedChallenge = activeProposal.challengeId || {};
    const relatedPilot = pilots.find(p => p.proposalId?._id === activeProposal._id || p.challengeId?._id === relatedChallenge._id);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Top Navigation Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => {
              setActiveProposal(null);
              if (onClearSelectedProposal) onClearSelectedProposal();
            }}
            className="btn-secondary"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
          >
            <ArrowLeft size={16} /> Back to My Applications List
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
              Current Stage: {formatText(activeProposal.status || 'Submitted')}
            </span>
            <span className="badge badge-saffron" style={{ fontSize: '0.75rem' }}>
              Ref: {activeProposal._id?.substring(0, 8).toUpperCase() || 'PROP-9843'}
            </span>
          </div>
        </div>

        {/* 1. Proposal Header Card */}
        <div className="gov-card" style={{ backgroundColor: '#0A2540', color: '#FFFFFF', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span className="badge badge-saffron" style={{ fontSize: '0.675rem' }}>
                  {formatText(relatedChallenge.department || 'Public Health Department')}
                </span>
                <span className="badge badge-dpiit" style={{ fontSize: '0.675rem' }}>
                  DPIIT Exemption Applied
                </span>
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.4rem 0' }}>
                {formatText(activeProposal.solutionTitle || relatedChallenge.title || 'SmartOPD AI Triage Solution')}
              </h2>

              <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0 }}>
                Submitted on: {activeProposal.submittedAt ? new Date(activeProposal.submittedAt).toLocaleDateString('en-IN') : 'Recent'} • Target Department: {formatText(relatedChallenge.department || 'Govt of Maharashtra')}
              </p>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '0.85rem 1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>PROPOSED PILOT BUDGET</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FF9933', margin: '0.2rem 0' }}>
                {formatCurrency(activeProposal.proposedBudget || 1420000)}
              </div>
              <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 600 }}>100% Milestone Based</span>
            </div>
          </div>
        </div>

        {/* 2. Lifecycle Status Stepper Bar (Where am I? What happens next?) */}
        <div className="gov-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <TrendingUp size={18} color="#0A2540" /> Application Lifecycle Tracker
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', position: 'relative' }}>
            {lifecycleSteps.map((step, idx) => {
              const isPassed = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1, minWidth: '110px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: isCurrent ? '#FF9933' : isPassed ? '#059669' : '#F1F5F9',
                    color: isCurrent || isPassed ? '#FFFFFF' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    lineHeight: 1,
                    boxSizing: 'border-box',
                    border: isCurrent ? '3px solid #0A2540' : 'none',
                    boxShadow: isCurrent ? '0 0 0 3px rgba(255,153,51,0.25)' : 'none',
                    marginBottom: '0.4rem'
                  }}>
                    {isPassed ? (
                      <Check size={18} color="#FFFFFF" strokeWidth={3} />
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>{idx + 1}</span>
                    )}
                  </div>

                  <strong style={{ fontSize: '0.75rem', color: isCurrent ? '#0A2540' : '#475569', display: 'block', lineHeight: 1.2 }}>
                    {step.label}
                  </strong>
                  <span style={{ fontSize: '0.675rem', color: isCurrent ? '#D97706' : isPassed ? '#059669' : '#94A3B8', fontWeight: 600, marginTop: '0.15rem' }}>
                    {isCurrent ? 'Current Stage' : isPassed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Main Details Grid: Submitted Proposal & Evaluation Feedback */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Submitted Technical Proposal Summary */}
          <div className="gov-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={18} color="#0A2540" /> Submitted Technical & Solution Proposal
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 700 }}>TECHNICAL APPROACH</span>
                <p style={{ color: '#334155', margin: '0.2rem 0 0 0', lineHeight: 1.5 }}>
                  {formatText(activeProposal.technicalApproach || 'Edge-AI camera setup with intelligent WhatsApp/Kiosk queue broadcasting to cut OPD wait times by 75%.')}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 700 }}>SYSTEM ARCHITECTURE</span>
                <p style={{ color: '#334155', margin: '0.2rem 0 0 0', lineHeight: 1.5 }}>
                  {formatText(activeProposal.architectureSummary || 'Microservices architecture with local hospital server fallback, encrypted API gateways, and MeitY-approved cloud sync.')}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 700 }}>CYBERSECURITY & DATA PRIVACY</span>
                <p style={{ color: '#334155', margin: '0.2rem 0 0 0', lineHeight: 1.5 }}>
                  {formatText(activeProposal.securityApproach || 'End-to-end AES-256 encryption, zero PII exposure to public APIs, compliance with DPDP Act 2023.')}
                </p>
              </div>
            </div>
          </div>

          {/* Expert Panel Evaluation Scores & Feedback */}
          <div className="gov-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Award size={18} color="#7C3AED" /> Expert Panel Scorecard & Feedback
            </h3>

            <div style={{ backgroundColor: '#F5F3FF', border: '1px solid #DDD6FE', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#6D28D9' }}>DOMIAN EVALUATOR SCORE</span>
                <strong style={{ fontSize: '1.25rem', color: '#7C3AED' }}>93.4 / 100</strong>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#5B21B6', display: 'block' }}>
                Evaluator: Dr. Anand Sharma (IIT Bombay / HealthTech Expert)
              </span>
              <p style={{ fontSize: '0.775rem', color: '#4C1D95', margin: '0.4rem 0 0 0', fontStyle: 'italic' }}>
                "High technical feasibility with exceptional field pilot methodology. Highly recommended for district deployment."
              </p>
            </div>

            {/* Score Metrics Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.775rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0.5rem', backgroundColor: '#F8FAFC', borderRadius: '4px' }}>
                <span>Technical Feasibility</span>
                <strong>92 / 100</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0.5rem', backgroundColor: '#F8FAFC', borderRadius: '4px' }}>
                <span>Innovation & IP Uniqueness</span>
                <strong>94 / 100</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0.5rem', backgroundColor: '#F8FAFC', borderRadius: '4px' }}>
                <span>Field Pilot Readiness</span>
                <strong>96 / 100</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0.5rem', backgroundColor: '#F8FAFC', borderRadius: '4px' }}>
                <span>Scalability & Cost Effectiveness</span>
                <strong>90 / 100</strong>
              </div>
            </div>

            {/* Link to Pilot Workspace if available */}
            {relatedPilot && (
              <button 
                onClick={() => onNavigateTab('pilots')} 
                className="btn-emerald" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '0.65rem' }}
              >
                <Rocket size={16} /> Open Pilot Workspace →
              </button>
            )}
          </div>

        </div>

      </div>
    );
  }

  // Render Screen F: My Applications List
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header & Filter Row */}
      <div className="gov-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A2540', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={22} color="#0A2540" /> My Submitted Proposals & Applications
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
              Track the evaluation status, scoring, and milestone progress for all submitted proposals
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Applications' },
              { id: 'submitted', label: 'Submitted' },
              { id: 'evaluation', label: 'Under Evaluation' },
              { id: 'pilot', label: 'Selected for Pilot' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: statusFilter === f.id ? '1px solid #0A2540' : '1px solid #CBD5E1',
                  backgroundColor: statusFilter === f.id ? '#0A2540' : '#FFFFFF',
                  color: statusFilter === f.id ? '#FFFFFF' : '#475569',
                  cursor: 'pointer'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications List Table / Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredProposals.length === 0 ? (
          <div className="gov-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <FileText size={40} color="#CBD5E1" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', margin: '0 0 0.35rem 0' }}>
              No applications found
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', maxWidth: '400px', margin: '0 auto 1.25rem auto' }}>
              You haven't submitted any proposal applications for government innovation challenges yet.
            </p>
            <button onClick={() => onNavigateTab('challenges')} className="btn-emerald">
              Explore Open Challenges to Apply
            </button>
          </div>
        ) : (
          filteredProposals.map((prop) => {
            const relChallenge = prop.challengeId || {};

            return (
              <div 
                key={prop._id} 
                className="gov-card"
                style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  borderLeft: '4px solid #059669'
                }}
              >
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.35rem' }}>
                    <span className="badge badge-emerald">{formatText(prop.status || 'Submitted')}</span>
                    <span className="badge badge-saffron">{formatText(relChallenge.department || 'Public Health')}</span>
                    <span className="badge badge-dpiit">DPIIT Waived</span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', margin: '0.2rem 0 0.35rem 0' }}>
                    {formatText(prop.solutionTitle || relChallenge.title || 'SmartOPD Triage Platform')}
                  </h3>

                  <p style={{ fontSize: '0.825rem', color: '#475569', margin: 0 }}>
                    Target Challenge: <strong style={{ color: '#0A2540' }}>{formatText(relChallenge.title || 'OPD Queue Management')}</strong> • Submitted: {prop.submittedAt ? new Date(prop.submittedAt).toLocaleDateString('en-IN') : 'Recent'}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>PROPOSED BUDGET</span>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0A2540' }}>
                      {formatCurrency(prop.proposedBudget || 1420000)}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveProposal(prop)}
                    className="btn-primary"
                    style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}
                  >
                    Track Application →
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default StartupApplicationsTab;

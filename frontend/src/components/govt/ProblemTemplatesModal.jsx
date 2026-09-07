import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  CheckCircle2, 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  IndianRupee, 
  Clock, 
  ArrowRight,
  Filter,
  Check,
  Sprout,
  GraduationCap,
  Droplet,
  Landmark,
  Target
} from 'lucide-react';
import { formatCurrency } from '../../utils/textUtils';

export const PROBLEM_FORMULATION_TEMPLATES = [
  {
    id: 'tpl_health_1',
    sector: 'Public Health',
    SectorIcon: Building2,
    title: 'Smart OPD Queue Triage & Hospital Crowding Reduction',
    department: 'Public Health Department, Government of Maharashtra',
    problemDescription: 'High patient overcrowding at District Hospital registration desks causes average waiting times exceeding 210 minutes (3.5 hours) prior to triage, increasing cross-infection risks and emergency care delays.',
    currentSituation: 'Manual token distribution with average 210 mins wait time; no real-time emergency triage escalation.',
    targetBeneficiaries: 'Daily OPD patients & Emergency casualties across 36 District General Hospitals in Maharashtra.',
    kpiBaseline: '210 minutes average patient wait time',
    kpiTarget: '< 45 minutes average wait time; 100% emergency triage escalation within 3 mins',
    estimatedBudget: 1420000,
    pilotDurationDays: 90,
    requiredTechnology: 'Edge Computer Vision, Intelligent Queue Optimization, Smart Token Kiosks, WhatsApp Business API',
    securityRequirements: 'DPDP Act 2023 Compliance, ISO 27001 Certified Edge Nodes, Zero PII Storage on Public Cloud',
    legalClauses: '100% Waived Turnover & EMD for DPIIT Startups under Maharashtra Innovation Procurement Rules 2024.'
  },
  {
    id: 'tpl_agri_1',
    sector: 'Agriculture & Irrigation',
    SectorIcon: Sprout,
    title: 'Precision Soil Moisture Telemetry & Pest Early Warning System',
    department: 'Department of Agriculture, Government of Maharashtra',
    problemDescription: 'Smallholder farmers in Marathwada & Vidarbha suffer 35% crop losses due to unmonitored soil moisture depletion and delayed detection of Pink Bollworm and Fall Armyworm pest outbreaks.',
    currentSituation: 'Manual physical field extension visits occurring once every 3 weeks; delayed pest advisories.',
    targetBeneficiaries: '50,000+ Cotton & Soybean Farmers across 5 Pilot Agricultural Blocks.',
    kpiBaseline: '35% average crop yield loss due to unmonitored pests',
    kpiTarget: '< 8% crop damage; 48-hour automated pest advisory alert delivery',
    estimatedBudget: 1850000,
    pilotDurationDays: 120,
    requiredTechnology: 'IoT Soil Telemetry Sensors, Satellite Multispectral Imaging, Edge Camera Traps, Vernacular Voice Interface',
    securityRequirements: 'ISRO BHUVAN Data Standards, Encrypted Field LoRaWAN Mesh Networks',
    legalClauses: '100% Government ownership of soil telemetry data; 100% Startup retention of proprietary software & algorithm IP.'
  },
  {
    id: 'tpl_edu_1',
    sector: 'School Education & Skills',
    SectorIcon: GraduationCap,
    title: 'Early Warning System for Rural Student Dropout Risk & Skill Analytics',
    department: 'School Education & Sports Department, Government of Maharashtra',
    problemDescription: 'Secondary schools in tribal districts experience a 28% annual dropout rate post 8th grade due to unidentified learning gaps and seasonal migration patterns.',
    currentSituation: 'Manual paper register attendance tracking analyzed only at quarterly district review meetings.',
    targetBeneficiaries: '120 Zilla Parishad Schools in Gadchiroli, Nandurbar & Palghar districts.',
    kpiBaseline: '28% annual student dropout rate',
    kpiTarget: '< 9% dropout rate; 95% early identification of at-risk students within 14 days',
    estimatedBudget: 1200000,
    pilotDurationDays: 90,
    requiredTechnology: 'Predictive Analytics, Biometric Tokenless Attendance, Offline-First Mobile App, Marathi NLP',
    securityRequirements: 'Child Data Protection Protocol, MeitY Cloud Hosting, SHA-256 Anonymization',
    legalClauses: 'Strict compliance with Child Data Protection guidelines; zero commercial monetization of student data.'
  },
  {
    id: 'tpl_water_1',
    sector: 'Water & Sanitation',
    SectorIcon: Droplet,
    title: 'Smart Rural Water Supply Telemetry & Non-Revenue Water Loss Detection',
    department: 'Water Supply & Sanitation Department, Government of Maharashtra',
    problemDescription: 'Rural piped water schemes lose up to 42% of potable water due to undetected pipeline leaks, illegal tappings, and unmonitored residual chlorine contamination.',
    currentSituation: 'Manual physical water sampling conducted twice a month; zero continuous pressure sensing.',
    targetBeneficiaries: '150 Gram Panchayats covered under Jal Jeevan Mission.',
    kpiBaseline: '42% Non-Revenue Water Loss & 2.5 days leak resolution time',
    kpiTarget: '< 12% water loss; < 4 hours leak detection & automated pump shutdown',
    estimatedBudget: 1680000,
    pilotDurationDays: 90,
    requiredTechnology: 'Ultrasonic Flow Telemetry, Acoustic Leak Detection, IoT Water Quality Sensors, SCADA Gateway',
    securityRequirements: 'Critical Infrastructure Protection Standards, BIS 10500 Water Quality Protocols',
    legalClauses: 'Trial site infrastructure provided by Jal Jeevan Mission Cell; milestone payments tied to leak reduction.'
  },
  {
    id: 'tpl_gov_1',
    sector: 'Smart Governance & ULBs',
    SectorIcon: Landmark,
    title: 'Automated Road Pothole & Infrastructure Quality Audit via Mobile Computer Vision',
    department: 'Urban Development & Public Works Department (PWD), Govt of MH',
    problemDescription: 'Monsoon road damage and potholes in Municipal Corporations lead to severe traffic congestion, road accidents, and delayed contractor accountability due to manual inspection backlogs.',
    currentSituation: 'Physical inspection teams cover only 15% of municipal road networks per month.',
    targetBeneficiaries: '1.5 Million Urban Commuters across Pune & Thane Municipal Corporations.',
    kpiBaseline: '14 days average pothole detection and repair turnaround time',
    kpiTarget: '< 48 hours pothole identification & contractor repair SLA dispatch',
    estimatedBudget: 1500000,
    pilotDurationDays: 60,
    requiredTechnology: 'Dashcam Computer Vision, Geospatial GIS, Automated Contractor SLA Dispatch Engine',
    securityRequirements: 'Geo-fenced GIS Mapping, PWD Contractor Portal Integration, Encrypted Evidence Chain',
    legalClauses: 'Automated video evidence log generated for direct inclusion in PWD contractor SLA penalty notices.'
  }
];

export const ProblemTemplatesModal = ({ isOpen, onClose, onSelectTemplate }) => {
  const [selectedSector, setSelectedSector] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState(PROBLEM_FORMULATION_TEMPLATES[0]);

  if (!isOpen) return null;

  const sectors = ['all', 'Public Health', 'Agriculture & Irrigation', 'School Education & Skills', 'Water & Sanitation', 'Smart Governance & ULBs'];

  const filteredTemplates = selectedSector === 'all'
    ? PROBLEM_FORMULATION_TEMPLATES
    : PROBLEM_FORMULATION_TEMPLATES.filter(t => t.sector === selectedSector);

  const handleApplyTemplate = (template) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1150 }}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()}
        style={{ 
          maxWidth: '1020px', 
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ backgroundColor: 'rgba(255,153,51,0.2)', padding: '0.5rem', borderRadius: '50%' }}>
              <FileText size={22} color="#FF9933" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  Problem Statement Formulation Templates
                </h3>
                <span className="badge badge-saffron" style={{ fontSize: '0.65rem' }}>
                  Standard Templates
                </span>
              </div>
              <p style={{ fontSize: '0.775rem', color: '#94A3B8', margin: 0 }}>
                Pre-structured, outcome-based challenge definitions with quantifiable KPI targets & budget allocations
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.25rem 0.5rem', backgroundColor: 'transparent', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Sector Filter Bar */}
        <div style={{
          backgroundColor: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          gap: '0.4rem',
          flexWrap: 'wrap'
        }}>
          {sectors.map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.775rem',
                fontWeight: 600,
                border: selectedSector === sec ? '1px solid #0A2540' : '1px solid #CBD5E1',
                backgroundColor: selectedSector === sec ? '#0A2540' : '#FFFFFF',
                color: selectedSector === sec ? '#FFFFFF' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {sec === 'all' ? 'All Sectors' : sec}
            </button>
          ))}
        </div>

        {/* Modal Body: Left List + Right Detail Preview */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          
          {/* Left Column: Template Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              SELECT PRE-STRUCTURED TEMPLATE ({filteredTemplates.length}):
            </span>

            {filteredTemplates.map(tpl => {
              const isSelected = previewTemplate?.id === tpl.id;
              const IconComp = tpl.SectorIcon;

              return (
                <div
                  key={tpl.id}
                  onClick={() => setPreviewTemplate(tpl)}
                  style={{
                    border: isSelected ? '2px solid #0A2540' : '1px solid #E2E8F0',
                    backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                    borderRadius: '8px',
                    padding: '0.85rem 1rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseOver={e => { if (!isSelected) e.currentTarget.style.borderColor = '#94A3B8'; }}
                  onMouseOut={e => { if (!isSelected) e.currentTarget.style.borderColor = '#E2E8F0'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <span className="badge badge-navy" style={{ fontSize: '0.675rem', gap: '0.3rem' }}>
                      <IconComp size={12} color="#1E3A8A" /> {tpl.sector}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0A2540' }}>
                      {formatCurrency(tpl.estimatedBudget)}
                    </span>
                  </div>

                  <strong style={{ fontSize: '0.9rem', color: '#0A2540', display: 'block', lineHeight: 1.3, marginBottom: '0.35rem' }}>
                    {tpl.title}
                  </strong>

                  <p style={{ fontSize: '0.775rem', color: '#64748B', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {tpl.problemDescription}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Template Detailed Outcome Breakdown */}
          {previewTemplate && (() => {
            const IconComp = previewTemplate.SectorIcon;
            return (
              <div className="gov-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                  <div>
                    <span className="badge badge-saffron" style={{ fontSize: '0.7rem', marginBottom: '0.35rem', gap: '0.3rem' }}>
                      <IconComp size={12} color="#D97706" /> {previewTemplate.sector} Template
                    </span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                      {previewTemplate.title}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {previewTemplate.department}
                    </span>
                  </div>
                </div>

                {/* Problem Definition */}
                <div>
                  <span style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 700 }}>BASELINE PROBLEM DEFINITION</span>
                  <p style={{ fontSize: '0.825rem', color: '#334155', margin: '0.2rem 0 0 0', lineHeight: 1.5 }}>
                    {previewTemplate.problemDescription}
                  </p>
                </div>

                {/* Quantifiable KPI Benchmarks */}
                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.85rem' }}>
                  <span style={{ fontSize: '0.725rem', color: '#0A2540', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                    <Target size={14} color="#0A2540" /> QUANTIFIABLE KPI OUTCOME TARGETS
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.775rem' }}>
                    <div>
                      <span style={{ color: '#64748B' }}>Baseline Issue:</span>
                      <strong style={{ display: 'block', color: '#DC2626' }}>{previewTemplate.kpiBaseline}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Target Outcome:</span>
                      <strong style={{ display: 'block', color: '#059669' }}>{previewTemplate.kpiTarget}</strong>
                    </div>
                  </div>
                </div>

                {/* Budget & Duration */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem' }}>
                  <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', padding: '0.65rem 0.85rem', borderRadius: '6px' }}>
                    <span style={{ color: '#1E3A8A', fontSize: '0.7rem', fontWeight: 700 }}>ESTIMATED PILOT BUDGET</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0A2540' }}>
                      {formatCurrency(previewTemplate.estimatedBudget)}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', padding: '0.65rem 0.85rem', borderRadius: '6px' }}>
                    <span style={{ color: '#B45309', fontSize: '0.7rem', fontWeight: 700 }}>TRIAL DURATION</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#D97706' }}>
                      {previewTemplate.pilotDurationDays} Days
                    </div>
                  </div>
                </div>

                {/* Required Technology & Security */}
                <div>
                  <span style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 700 }}>REQUIRED TECHNOLOGIES</span>
                  <p style={{ fontSize: '0.8rem', color: '#0A2540', fontWeight: 600, margin: '0.15rem 0 0 0' }}>
                    {previewTemplate.requiredTechnology}
                  </p>
                </div>

                <div>
                  <span style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 700 }}>CYBERSECURITY & COMPLIANCE</span>
                  <p style={{ fontSize: '0.775rem', color: '#475569', margin: '0.15rem 0 0 0' }}>
                    {previewTemplate.securityRequirements}
                  </p>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleApplyTemplate(previewTemplate)}
                  className="btn-emerald"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: 'auto', fontSize: '0.9rem' }}
                >
                  <CheckCircle2 size={18} /> Apply This Sector Template to Challenge Builder
                </button>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default ProblemTemplatesModal;ProblemTemplatesModal;

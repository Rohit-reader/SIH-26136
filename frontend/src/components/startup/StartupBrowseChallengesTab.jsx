import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Building2, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  ShieldCheck, 
  Send, 
  ArrowLeft, 
  FileText, 
  Download, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  ChevronRight,
  SlidersHorizontal,
  RefreshCw,
  Lock,
  Tag
} from 'lucide-react';
import { formatText, formatCurrency } from '../../utils/textUtils';

export const StartupBrowseChallengesTab = ({ 
  challenges = [], 
  primaryStartup = {}, 
  onOpenApplyModal,
  selectedChallengeId = null,
  onClearSelectedChallenge
}) => {
  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'budget_high' | 'deadline'

  // Detailed View State (Screen D)
  const [detailChallenge, setDetailChallenge] = useState(() => {
    if (selectedChallengeId) {
      return challenges.find(c => c._id === selectedChallengeId) || null;
    }
    return null;
  });

  // Extract unique domains & departments for filter dropdowns
  const domains = Array.from(new Set(challenges.map(c => c.category || c.domain || 'Healthcare').filter(Boolean)));
  const departments = Array.from(new Set(challenges.map(c => c.department).filter(Boolean)));
  const locations = Array.from(new Set(challenges.map(c => c.location).filter(Boolean)));

  // Filter & Search Logic
  const filteredChallenges = challenges.filter(c => {
    const titleMatch = (c.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (c.problemDescription || '').toLowerCase().includes(searchQuery.toLowerCase());
    const queryMatch = titleMatch || descMatch;

    const domainMatch = selectedDomain === 'all' || (c.category || c.domain || '') === selectedDomain;
    const deptMatch = selectedDept === 'all' || c.department === selectedDept;
    const locationMatch = selectedLocation === 'all' || c.location === selectedLocation;
    const statusMatch = selectedStatus === 'all' || c.status === selectedStatus;

    return queryMatch && domainMatch && deptMatch && locationMatch && statusMatch;
  }).sort((a, b) => {
    if (sortBy === 'budget_high') {
      return (b.estimatedBudget || 0) - (a.estimatedBudget || 0);
    }
    if (sortBy === 'deadline') {
      return new Date(a.applicationDeadline || '2026-12-31') - new Date(b.applicationDeadline || '2026-12-31');
    }
    return new Date(b.createdAt || '2026-01-01') - new Date(a.createdAt || '2026-01-01');
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDomain('all');
    setSelectedDept('all');
    setSelectedLocation('all');
    setSelectedStatus('all');
    setSortBy('newest');
  };

  // Eligibility check logic for startup
  const isStartupEligible = (challenge) => {
    // DPIIT registered startups are eligible for all challenges under MH Govt rules
    if (primaryStartup.dpiitNumber || primaryStartup.verificationStatus?.includes('Verified')) {
      return { eligible: true, reason: 'Eligible: DPIIT Registered Startup (Turnover & EMD Exemption Applied)' };
    }
    return { eligible: true, reason: 'Eligible: DPIIT Registered Startup' };
  };

  // Render Screen D: Challenge Details View
  if (detailChallenge) {
    const { eligible, reason } = isStartupEligible(detailChallenge);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Back Navigation Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={() => {
              setDetailChallenge(null);
              if (onClearSelectedChallenge) onClearSelectedChallenge();
            }}
            className="btn-secondary"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
          >
            <ArrowLeft size={16} /> Back to Open Challenges
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className="badge badge-navy">{formatText(detailChallenge.status || 'Open')}</span>
            <span className="badge badge-saffron">{formatText(detailChallenge.department)}</span>
            <span className="badge badge-dpiit">DPIIT Exemption Waived</span>
          </div>
        </div>

        {/* 1. Header Banner Overview */}
        <div className="gov-card" style={{ 
          background: 'linear-gradient(135deg, #0A2540 0%, #0F172A 60%, #1E3A8A 100%)', 
          color: '#FFFFFF', 
          border: 'none'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-saffron" style={{ fontSize: '0.7rem' }}>
                  CHALLENGE CODE: {detailChallenge.code || 'MH-GOV-2026-84'}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                  Published: {detailChallenge.createdAt ? new Date(detailChallenge.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                </span>
              </div>

              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.6rem 0', lineHeight: 1.25 }}>
                {formatText(detailChallenge.title)}
              </h1>

              <p style={{ fontSize: '0.9rem', color: '#CBD5E1', margin: 0, lineHeight: 1.5 }}>
                Department: <strong style={{ color: '#FFFFFF' }}>{formatText(detailChallenge.department)}</strong> • Location: {formatText(detailChallenge.location || 'Statewide Maharashtra')}
              </p>
            </div>

            <div style={{ 
              backgroundColor: 'rgba(255,255,255,0.08)', 
              border: '1px solid rgba(255,255,255,0.15)', 
              padding: '1rem 1.25rem', 
              borderRadius: '10px',
              textAlign: 'center',
              minWidth: '200px'
            }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>ALLOCATED PILOT BUDGET</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FF9933', margin: '0.2rem 0' }}>
                {formatCurrency(detailChallenge.estimatedBudget)}
              </div>
              <span style={{ fontSize: '0.725rem', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                <ShieldCheck size={12} /> Milestone Payment Release
              </span>
            </div>
          </div>

          <div style={{ 
            marginTop: '1.25rem', 
            paddingTop: '1rem', 
            borderTop: '1px solid rgba(255,255,255,0.12)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: '#94A3B8', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={14} color="#FF9933" /> Application Deadline: <strong style={{ color: '#FFFFFF' }}>{detailChallenge.applicationDeadline || '30 Sep 2026'}</strong></span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} color="#FF9933" /> Expected Pilot Duration: <strong style={{ color: '#FFFFFF' }}>{detailChallenge.pilotDurationMonths || 3} Months</strong></span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Target size={14} color="#FF9933" /> Max Pilot Locations: <strong style={{ color: '#FFFFFF' }}>{detailChallenge.pilotSites || '3 District Hospitals'}</strong></span>
            </div>

            <button 
              onClick={() => onOpenApplyModal(detailChallenge)} 
              disabled={!eligible}
              className="btn-emerald"
              style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}
            >
              <Send size={18} /> Submit Official Proposal →
            </button>
          </div>
        </div>

        {/* Eligibility Banner Alert */}
        <div style={{
          backgroundColor: eligible ? '#F0FDF4' : '#FEF2F2',
          border: `1px solid ${eligible ? '#BBF7D0' : '#FECACA'}`,
          padding: '0.85rem 1.15rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          {eligible ? <CheckCircle2 size={20} color="#166534" /> : <AlertCircle size={20} color="#DC2626" />}
          <div>
            <strong style={{ fontSize: '0.875rem', color: eligible ? '#166534' : '#991B1B', display: 'block' }}>
              {reason}
            </strong>
            <span style={{ fontSize: '0.775rem', color: eligible ? '#15803D' : '#B91C1C' }}>
              DPIIT Recognized startups receive 100% Waiver for Prior Turnover, Prior Experience, and EMD Security Deposit.
            </span>
          </div>
        </div>

        {/* Detailed 12-Section Breakdown Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Section 2: Detailed Problem Statement */}
          <div className="gov-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Building2 size={18} color="#0A2540" /> 2. Government Operational Problem Statement
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
              {formatText(detailChallenge.problemDescription)}
            </p>

            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.85rem', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 700 }}>CURRENT BASELINE SITUATION</span>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#DC2626', margin: '0.2rem 0 0 0' }}>
                {detailChallenge.currentSituation || 'High overcrowding in District OPDs causing wait times exceeding 3.5 hours and high emergency triage error rates.'}
              </p>
            </div>
          </div>

          {/* Section 3: Expected Outcome & Measurable KPIs */}
          <div className="gov-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={18} color="#D97706" /> 3. Target Outcome & KPI Benchmarks
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
              {formatText(detailChallenge.expectedOutcome)}
            </p>

            <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.85rem', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.725rem', color: '#047857', fontWeight: 700 }}>REQUIRED KPI BENCHMARK</span>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669', margin: '0.2rem 0 0 0' }}>
                Reduce OPD wait time below 45 minutes; zero un-triaged emergency cases in trial sites.
              </p>
            </div>
          </div>

          {/* Section 5: Eligibility Requirements */}
          <div className="gov-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Award size={18} color="#0A2540" /> 5. Eligibility Criteria & Waivers
            </h3>
            <ul style={{ fontSize: '0.825rem', color: '#334155', margin: 0, paddingLeft: '1.2rem', lineHeight: 1.7 }}>
              <li><strong>DPIIT Recognition:</strong> Valid DIPP Recognition Certificate required.</li>
              <li><strong>Prior Turnover:</strong> 100% Waived for DPIIT Startups.</li>
              <li><strong>Prior Experience:</strong> 100% Waived for DPIIT Startups.</li>
              <li><strong>EMD Deposit:</strong> Waived (₹0 required).</li>
              <li><strong>Tech Readiness Level:</strong> TRL 6 or above (Functional Prototype / Beta Ready).</li>
            </ul>
          </div>

          {/* Section 6: Evaluation Criteria & Scoring Rubric */}
          <div className="gov-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={18} color="#0A2540" /> 6. Evaluation Scoring Rubric (100 Marks)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0.5rem', backgroundColor: '#F8FAFC', borderRadius: '4px' }}>
                <span>Technical Feasibility & Innovation</span>
                <strong>30 Marks</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0.5rem', backgroundColor: '#F8FAFC', borderRadius: '4px' }}>
                <span>Impact & Baseline Improvement</span>
                <strong>25 Marks</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0.5rem', backgroundColor: '#F8FAFC', borderRadius: '4px' }}>
                <span>Field Pilot Readiness & Methodology</span>
                <strong>20 Marks</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0.5rem', backgroundColor: '#F8FAFC', borderRadius: '4px' }}>
                <span>Cybersecurity & Data Privacy</span>
                <strong>15 Marks</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0.5rem', backgroundColor: '#F8FAFC', borderRadius: '4px' }}>
                <span>Cost Effectiveness & Scalability</span>
                <strong>10 Marks</strong>
              </div>
            </div>
          </div>

          {/* Section 7 & 8: Pilot Site & Data/IP Requirements */}
          <div className="gov-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={18} color="#0A2540" /> 7 & 8. Pilot Site & Data IP Compliance
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.6, marginBottom: '0.5rem' }}>
              Pilot to be deployed across 3 designated District General Hospitals in Maharashtra. Hardware connectivity & high-speed Internet provided by Department.
            </p>
            <span style={{ fontSize: '0.775rem', fontWeight: 600, color: '#0A2540', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Lock size={14} color="#0A2540" /> Data Ownership: 100% Government of Maharashtra. Startup retains core proprietary IP.
            </span>
          </div>

          {/* Section 11: Documents & Proposal Templates */}
          <div className="gov-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Download size={18} color="#0A2540" /> 11. Challenge Resources & Templates
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Downloading Official Challenge Guidelines PDF'); }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.8rem', textDecoration: 'none', color: '#0A2540' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><FileText size={14} color="#2563EB" /> Challenge Technical Guidelines.pdf</span>
                <Download size={14} color="#2563EB" />
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Downloading Proposal Format Template DOCX'); }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.8rem', textDecoration: 'none', color: '#0A2540' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><FileText size={14} color="#2563EB" /> Technical Proposal Template.docx</span>
                <Download size={14} color="#2563EB" />
              </a>
            </div>
          </div>

        </div>

        {/* Sticky Action Footer */}
        <div className="gov-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0A2540', color: '#FFFFFF' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              Ready to submit your solution proposal?
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
              Multi-step proposal process takes ~10 minutes. Drafts are auto-saved.
            </p>
          </div>

          <button 
            onClick={() => onOpenApplyModal(detailChallenge)} 
            disabled={!eligible}
            className="btn-emerald"
            style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
          >
            <Send size={16} /> Apply Now →
          </button>
        </div>
      </div>
    );
  }

  // Render Screen C: Browse Challenges Discovery Grid & Search
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Search & Filter Header Box */}
      <div className="gov-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A2540', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search size={22} color="#0A2540" /> Browse Government Innovation Challenges
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
              Discover active outcome challenges published by Maharashtra departments with DPIIT exemptions
            </p>
          </div>

          <span className="badge badge-saffron" style={{ fontSize: '0.75rem' }}>
            {filteredChallenges.length} Open Opportunities Found
          </span>
        </div>

        {/* Search Bar Input */}
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <Search size={18} color="#64748B" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by challenge title, problem statement keyword, department, or technology tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.75rem', width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        {/* Multi-Parameter Filters Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', alignItems: 'center' }}>
          {/* Domain Filter */}
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.2rem' }}>DOMAIN / CATEGORY</label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.8rem', padding: '0.45rem' }}
            >
              <option value="all">All Domains</option>
              {domains.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.2rem' }}>GOVT DEPARTMENT</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.8rem', padding: '0.45rem' }}
            >
              <option value="all">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.2rem' }}>LOCATION / DISTRICT</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.8rem', padding: '0.45rem' }}
            >
              <option value="all">All Locations</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.2rem' }}>CHALLENGE STATUS</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.8rem', padding: '0.45rem' }}
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open & Accepting Proposals</option>
              <option value="Published">Published</option>
              <option value="Pilot Active">Pilot Active</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.2rem' }}>SORT BY</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.8rem', padding: '0.45rem' }}
            >
              <option value="newest">Newest Published</option>
              <option value="budget_high">Highest Budget First</option>
              <option value="deadline">Closing Deadline Soonest</option>
            </select>
          </div>

          {/* Reset Filters CTA */}
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', paddingTop: '1rem' }}>
            <button
              onClick={resetFilters}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.775rem', width: '100%', justifyContent: 'center' }}
            >
              <RefreshCw size={12} /> Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Challenges Grid List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredChallenges.length === 0 ? (
          /* Empty / No Results State */
          <div className="gov-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
            <Search size={44} color="#CBD5E1" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.35rem' }}>
              No matching challenges found
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', maxWidth: '400px', margin: '0 auto 1.25rem auto' }}>
              Try adjusting your search criteria or resetting filters to view all available government innovation opportunities.
            </p>
            <button onClick={resetFilters} className="btn-primary">
              Reset Search Filters
            </button>
          </div>
        ) : (
          filteredChallenges.map((challenge) => {
            const { eligible, reason } = isStartupEligible(challenge);

            return (
              <div 
                key={challenge._id} 
                className="gov-card"
                style={{
                  transition: 'all 0.2s ease',
                  borderLeft: '4px solid #0A2540'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  
                  {/* Left Column: Challenge Info */}
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                      <span className="badge badge-navy">{formatText(challenge.status || 'Open')}</span>
                      <span className="badge badge-saffron">{formatText(challenge.department)}</span>
                      <span className="badge badge-dpiit" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>DPIIT Waived <CheckCircle2 size={12} /></span>
                      <span className="badge badge-emerald">{formatText(challenge.location || 'Maharashtra')}</span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0A2540', margin: '0.2rem 0 0.4rem 0' }}>
                      {formatText(challenge.title)}
                    </h3>

                    <p style={{ fontSize: '0.875rem', color: '#334155', margin: '0 0 0.85rem 0', lineHeight: 1.5 }}>
                      {formatText(challenge.problemDescription)}
                    </p>

                    {/* Baseline vs Target Outcome Pills */}
                    <div style={{ 
                      backgroundColor: '#F8FAFC', 
                      border: '1px solid #E2E8F0', 
                      borderRadius: '6px', 
                      padding: '0.65rem 0.85rem', 
                      display: 'flex', 
                      gap: '1.5rem', 
                      flexWrap: 'wrap',
                      fontSize: '0.775rem'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.675rem', color: '#64748B', fontWeight: 700 }}>BASELINE ISSUE</span>
                        <p style={{ fontWeight: 700, color: '#DC2626', margin: '0.1rem 0 0 0' }}>
                          {challenge.currentSituation || 'Manual paper tracking'}
                        </p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.675rem', color: '#64748B', fontWeight: 700 }}>EXPECTED OUTCOME</span>
                        <p style={{ fontWeight: 700, color: '#059669', margin: '0.1rem 0 0 0' }}>
                          {formatText(challenge.expectedOutcome || 'Automated telemetry')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Financials & Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem', minWidth: '180px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>PILOT BUDGET</span>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0A2540' }}>
                        {formatCurrency(challenge.estimatedBudget)}
                      </div>
                      <span style={{ fontSize: '0.725rem', color: '#059669', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={12} color="#059669" /> Deadline: {challenge.applicationDeadline || '30 Sep 2026'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setDetailChallenge(challenge)}
                        className="btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}
                      >
                        View Challenge
                      </button>

                      <button
                        onClick={() => onOpenApplyModal(challenge)}
                        disabled={!eligible}
                        className="btn-emerald"
                        style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}
                      >
                        <Send size={14} /> Apply
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default StartupBrowseChallengesTab;

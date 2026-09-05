import React from 'react';
import { 
  Rocket, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  DollarSign, 
  ChevronRight, 
  Bell, 
  ArrowUpRight,
  FileCheck,
  Building2,
  Calendar,
  Award
} from 'lucide-react';
import { formatText, formatCurrency } from '../../utils/textUtils';
import { StartupIndiaBadge } from '../Emblems';

export const StartupDashboardTab = ({ 
  primaryStartup = {}, 
  challenges = [], 
  proposals = [], 
  pilots = [], 
  notifications = [], 
  onNavigateTab,
  onOpenApplyModal,
  onSelectChallenge,
  onSelectProposal,
  onSelectPilot
}) => {
  // Metric Calculations
  const openChallengesCount = challenges.filter(c => c.status === 'Open' || c.status === 'Published').length;
  const submittedCount = proposals.length;
  const underEvaluationCount = proposals.filter(p => p.status === 'Submitted' || p.status === 'Under Review' || p.status === 'Eligibility Review').length;
  const activePilotsCount = pilots.filter(p => p.status === 'In Progress' || p.status === 'Pilot Active' || p.status === 'Deploying').length;
  
  // Milestones & Payments metrics
  let pendingMilestonesCount = 0;
  let pendingPaymentsAmount = 0;
  let totalContractedAmount = 0;
  let totalReceivedAmount = 0;

  pilots.forEach(pilot => {
    if (pilot.contractedBudget) totalContractedAmount += pilot.contractedBudget;
    pilot.milestones?.forEach(m => {
      if (m.status === 'Pending' || m.status === 'In Progress') {
        pendingMilestonesCount++;
      }
      if (m.status === 'Approved' || m.status === 'Completed') {
        pendingPaymentsAmount += (m.amount || 0);
      }
      if (m.status === 'Paid') {
        totalReceivedAmount += (m.amount || 0);
      }
    });
  });

  if (pendingPaymentsAmount === 0 && pilots.length > 0) {
    pendingPaymentsAmount = 426000;
  }
  if (totalContractedAmount === 0) {
    totalContractedAmount = 1420000;
    totalReceivedAmount = 994000;
  }

  // Profile completion score
  const profileCompletionScore = 92;

  // Recent applications (first 3)
  const recentProposals = proposals.slice(0, 3);
  // Recent notifications (first 3)
  const recentNotifications = notifications.slice(0, 3);
  // Recommended challenges (first 3 open)
  const recommendedChallenges = challenges.filter(c => c.status === 'Open' || c.status === 'Published').slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Welcome & Startup Status Header Card */}
      <div className="gov-card" style={{ 
        background: 'linear-gradient(135deg, #0A2540 0%, #0F172A 60%, #1E3A8A 100%)', 
        color: '#FFFFFF', 
        border: 'none',
        boxShadow: '0 10px 25px -5px rgba(10,37,64,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ backgroundColor: 'rgba(255,153,51,0.2)', padding: '0.5rem', borderRadius: '50%' }}>
                <Rocket size={26} color="#FF9933" />
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Welcome back, {primaryStartup.name || 'HealthAI Solutions Pvt Ltd'}
              </h2>
              <StartupIndiaBadge />
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
              DPIIT Reg: <strong style={{ color: '#FFFFFF' }}>{primaryStartup.dpiitNumber || 'DIPP10984'}</strong> • Domain: {primaryStartup.industryDomain || 'Healthcare & MedTech'} • Location: {primaryStartup.location || 'Pune, Maharashtra'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <div style={{ 
              backgroundColor: 'rgba(255,255,255,0.08)', 
              padding: '0.75rem 1.15rem', 
              borderRadius: '10px', 
              border: '1px solid rgba(255,255,255,0.15)',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, letterSpacing: '0.5px' }}>DPIIT EXEMPTION STATUS</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', marginTop: '0.2rem' }}>
                <ShieldCheck size={16} color="#10B981" />
                <span style={{ fontWeight: 700, color: '#10B981', fontSize: '0.875rem' }}>
                  Turnover & EMD Waived ✓
                </span>
              </div>
            </div>

            <button 
              onClick={() => onNavigateTab('challenges')} 
              className="btn-emerald" 
              style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem', alignSelf: 'center' }}
            >
              <Sparkles size={16} /> Explore Open Challenges
            </button>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div style={{ 
          marginTop: '1.25rem', 
          paddingTop: '1rem', 
          borderTop: '1px solid rgba(255,255,255,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.35rem' }}>
              <span style={{ color: '#CBD5E1', fontWeight: 600 }}>Company Profile Completion</span>
              <strong style={{ color: '#38BDF8' }}>{profileCompletionScore}% Complete</strong>
            </div>
            <div style={{ height: '7px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: `${profileCompletionScore}%`, height: '100%', backgroundColor: '#38BDF8', borderRadius: '9999px' }}></div>
            </div>
          </div>

          <button 
            onClick={() => onNavigateTab('profile')} 
            style={{ background: 'none', border: 'none', color: '#93C5FD', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            Update Profile & Docs →
          </button>
        </div>
      </div>

      {/* 6 Grid Metric Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '1rem' 
      }}>
        {/* Card 1: Eligible Challenges */}
        <div 
          className="gov-card" 
          onClick={() => onNavigateTab('challenges')} 
          style={{ cursor: 'pointer', borderLeft: '4px solid #0A2540', transition: 'all 0.15s ease' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>OPEN CHALLENGES</span>
            <div style={{ backgroundColor: '#EFF6FF', padding: '0.4rem', borderRadius: '50%' }}>
              <Building2 size={16} color="#0A2540" />
            </div>
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0A2540', display: 'block' }}>
            {openChallengesCount}
          </span>
          <span style={{ fontSize: '0.725rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.25rem' }}>
            <CheckCircle2 size={12} /> DPIIT Eligible
          </span>
        </div>

        {/* Card 2: Applications Submitted */}
        <div 
          className="gov-card" 
          onClick={() => onNavigateTab('applications')} 
          style={{ cursor: 'pointer', borderLeft: '4px solid #D97706', transition: 'all 0.15s ease' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>SUBMITTED APPS</span>
            <div style={{ backgroundColor: '#FFFBEB', padding: '0.4rem', borderRadius: '50%' }}>
              <FileText size={16} color="#D97706" />
            </div>
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D97706', display: 'block' }}>
            {submittedCount}
          </span>
          <span style={{ fontSize: '0.725rem', color: '#64748B', display: 'block', marginTop: '0.25rem' }}>
            Total Proposals
          </span>
        </div>

        {/* Card 3: Under Evaluation */}
        <div 
          className="gov-card" 
          onClick={() => onNavigateTab('applications')} 
          style={{ cursor: 'pointer', borderLeft: '4px solid #7C3AED', transition: 'all 0.15s ease' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>UNDER EVALUATION</span>
            <div style={{ backgroundColor: '#F5F3FF', padding: '0.4rem', borderRadius: '50%' }}>
              <Clock size={16} color="#7C3AED" />
            </div>
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#7C3AED', display: 'block' }}>
            {underEvaluationCount}
          </span>
          <span style={{ fontSize: '0.725rem', color: '#7C3AED', fontWeight: 600, display: 'block', marginTop: '0.25rem' }}>
            Expert Panel Review
          </span>
        </div>

        {/* Card 4: Active Field Pilots */}
        <div 
          className="gov-card" 
          onClick={() => onNavigateTab('pilots')} 
          style={{ cursor: 'pointer', borderLeft: '4px solid #059669', transition: 'all 0.15s ease' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>ACTIVE PILOTS</span>
            <div style={{ backgroundColor: '#ECFDF5', padding: '0.4rem', borderRadius: '50%' }}>
              <Rocket size={16} color="#059669" />
            </div>
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', display: 'block' }}>
            {activePilotsCount}
          </span>
          <span style={{ fontSize: '0.725rem', color: '#059669', fontWeight: 600, display: 'block', marginTop: '0.25rem' }}>
            District Field Trial
          </span>
        </div>

        {/* Card 5: Pending Milestones */}
        <div 
          className="gov-card" 
          onClick={() => onNavigateTab('pilots')} 
          style={{ cursor: 'pointer', borderLeft: '4px solid #2563EB', transition: 'all 0.15s ease' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>PENDING MILESTONES</span>
            <div style={{ backgroundColor: '#EFF6FF', padding: '0.4rem', borderRadius: '50%' }}>
              <FileCheck size={16} color="#2563EB" />
            </div>
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2563EB', display: 'block' }}>
            {pendingMilestonesCount || 2}
          </span>
          <span style={{ fontSize: '0.725rem', color: '#2563EB', fontWeight: 600, display: 'block', marginTop: '0.25rem' }}>
            Telemetry Due Soon
          </span>
        </div>

        {/* Card 6: Pending Payment Releases */}
        <div 
          className="gov-card" 
          onClick={() => onNavigateTab('payments')} 
          style={{ cursor: 'pointer', borderLeft: '4px solid #166534', transition: 'all 0.15s ease' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>PENDING PAYMENTS</span>
            <div style={{ backgroundColor: '#F0FDF4', padding: '0.4rem', borderRadius: '50%' }}>
              <DollarSign size={16} color="#166534" />
            </div>
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#166534', display: 'block' }}>
            {formatCurrency(pendingPaymentsAmount)}
          </span>
          <span style={{ fontSize: '0.725rem', color: '#166534', fontWeight: 600, display: 'block', marginTop: '0.25rem' }}>
            Approved by Treasury
          </span>
        </div>
      </div>

      {/* Main Grid: Recommended Challenges & Applications/Notifications */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left Column: Recommended Open Challenges */}
        <div className="gov-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={18} color="#D97706" /> Recommended Open Challenges
              </h3>
              <p style={{ fontSize: '0.775rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
                DPIIT Startup eligible government innovation requirements
              </p>
            </div>
            <button 
              onClick={() => onNavigateTab('challenges')} 
              style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              View All ({challenges.length}) <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            {recommendedChallenges.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                <Building2 size={32} color="#CBD5E1" style={{ marginBottom: '0.5rem' }} />
                <p style={{ margin: 0, fontSize: '0.875rem' }}>No open challenges found at the moment.</p>
              </div>
            ) : (
              recommendedChallenges.map((c) => (
                <div 
                  key={c._id} 
                  style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '1rem',
                    backgroundColor: '#FFFFFF',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#0A2540'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
                >
                  <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                    <span className="badge badge-navy" style={{ fontSize: '0.675rem' }}>{formatText(c.status)}</span>
                    <span className="badge badge-saffron" style={{ fontSize: '0.675rem' }}>{formatText(c.department)}</span>
                    <span className="badge badge-dpiit" style={{ fontSize: '0.675rem' }}>DPIIT Eligible</span>
                  </div>

                  <h4 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.35rem' }}>
                    {formatText(c.title)}
                  </h4>

                  <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {formatText(c.problemDescription)}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px dashed #E2E8F0' }}>
                    <div>
                      <span style={{ fontSize: '0.675rem', color: '#64748B', display: 'block' }}>PILOT BUDGET</span>
                      <strong style={{ fontSize: '0.9rem', color: '#0A2540' }}>{formatCurrency(c.estimatedBudget)}</strong>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => onSelectChallenge(c)} 
                        className="btn-secondary" 
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => onOpenApplyModal(c)} 
                        className="btn-emerald" 
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        <Send size={12} /> Apply
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Applications Status & Recent Activity Notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Recent Applications Tracker */}
          <div className="gov-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={18} color="#0A2540" /> My Recent Applications
              </h3>
              <button 
                onClick={() => onNavigateTab('applications')} 
                style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.775rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Track All ({proposals.length}) →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentProposals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748B', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                  <p style={{ margin: 0, fontSize: '0.825rem' }}>No submitted applications yet.</p>
                  <button onClick={() => onNavigateTab('challenges')} className="btn-primary" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                    Browse Challenges to Apply
                  </button>
                </div>
              ) : (
                recentProposals.map((prop) => (
                  <div 
                    key={prop._id} 
                    onClick={() => onSelectProposal(prop)}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      backgroundColor: '#F8FAFC',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: '#0A2540', display: 'block' }}>
                        {formatText(prop.solutionTitle || prop.challengeId?.title || 'AI OPD Queue Triage')}
                      </strong>
                      <span style={{ fontSize: '0.725rem', color: '#64748B' }}>
                        Dept: {formatText(prop.challengeId?.department || 'Public Health')}
                      </span>
                    </div>

                    <span className="badge badge-emerald" style={{ fontSize: '0.675rem', flexShrink: 0 }}>
                      {formatText(prop.status || 'Submitted')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* System Notifications Box */}
          <div className="gov-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Bell size={18} color="#FF9933" /> Recent Notifications
              </h3>
              <button 
                onClick={() => onNavigateTab('notifications')} 
                style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.775rem', fontWeight: 600, cursor: 'pointer' }}
              >
                View All →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {recentNotifications.length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: '#64748B', padding: '0.75rem', textAlign: 'center' }}>
                  No new notifications.
                </div>
              ) : (
                recentNotifications.map((n, idx) => (
                  <div key={n._id || idx} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', borderBottom: idx < recentNotifications.length - 1 ? '1px solid #F1F5F9' : 'none', paddingBottom: '0.5rem' }}>
                    <div style={{ backgroundColor: '#EFF6FF', padding: '0.35rem', borderRadius: '50%', flexShrink: 0, marginTop: '0.1rem' }}>
                      <Bell size={12} color="#1E3A8A" />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.8rem', color: '#0A2540', display: 'block', lineHeight: 1.2 }}>
                        {formatText(n.title || n.message)}
                      </strong>
                      <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                        {n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-IN') : 'Today'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default StartupDashboardTab;

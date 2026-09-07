import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Building, 
  FileText, 
  Award, 
  Rocket, 
  Activity, 
  CheckCircle2, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Plus
} from 'lucide-react';
import { formatText, formatCurrency, isAuditAdmin } from '../../utils/textUtils';
import { DepartmentBudgetChart, InnovationFunnelChart } from '../charts/GovtAnalyticsCharts';

export const GovtDashboardTab = ({ 
  challenges = [], 
  proposals = [], 
  evaluations = [], 
  pilots = [], 
  scaleUps = [], 
  auditLogs = [],
  currentUser,
  onSelectTab,
  onOpenCreateModal
}) => {
  const { t } = useTranslation();
  const activeChallenges = challenges.filter(c => c.status === 'Published' || c.status === 'Pilot Active').length;
  const pendingProposals = proposals.filter(p => p.status === 'Submitted' || p.status === 'Under Review').length;
  const pendingEvaluations = evaluations.filter(e => e.recommendation === 'Recommend for Pilot').length;
  const activePilots = pilots.filter(p => p.validationStatus === 'Pending Review' || p.validationStatus === 'Active').length;
  const pendingMilestones = pilots.reduce((acc, p) => acc + p.milestones.filter(m => m.status === 'Evidence Submitted').length, 0);
  const pendingValidations = pilots.filter(p => p.validationStatus === 'Pending Review').length;
  const scaleDecisions = pilots.filter(p => p.procurementRecommendation === 'Scale Statewide').length;
  const scaledSolutions = scaleUps.length;

  return (
    <div>
      {/* Header with Quick Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0A2540' }}>
            {t('govt.dashboardTitle')}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            {t('govt.dashboardSubtitle')}
          </p>
        </div>
        <button onClick={onOpenCreateModal} className="btn-primary">
          <Plus size={16} />
          <span>{t('govt.createChallengeBtn')}</span>
        </button>
      </div>

      {/* 9 Metric Cards Grid */}
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-card-accent" style={{ backgroundColor: '#0A2540' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>{t('govt.metrics.activeChallenges').toUpperCase()}</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0A2540' }}>{challenges.length}</h3>
            </div>
            <div style={{ backgroundColor: '#EFF6FF', padding: '0.65rem', borderRadius: '50%' }}>
              <Building size={22} color="#0A2540" />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.5rem', fontWeight: 600 }}>{activeChallenges} Published / Active</p>
        </div>

        <div className="metric-card">
          <div className="metric-card-accent" style={{ backgroundColor: '#D97706' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>PENDING PROPOSALS</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#D97706' }}>{pendingProposals}</h3>
            </div>
            <div style={{ backgroundColor: '#FFFBEB', padding: '0.65rem', borderRadius: '50%' }}>
              <FileText size={22} color="#D97706" />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#D97706', marginTop: '0.5rem', fontWeight: 600 }}>Awaiting Screening</p>
        </div>

        <div className="metric-card">
          <div className="metric-card-accent" style={{ backgroundColor: '#2563EB' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>EXPERT EVALUATIONS</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563EB' }}>{evaluations.length}</h3>
            </div>
            <div style={{ backgroundColor: '#EFF6FF', padding: '0.65rem', borderRadius: '50%' }}>
              <Award size={22} color="#2563EB" />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#2563EB', marginTop: '0.5rem', fontWeight: 600 }}>COI Status: All Clear</p>
        </div>

        <div className="metric-card">
          <div className="metric-card-accent" style={{ backgroundColor: '#7C3AED' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>ACTIVE PILOTS</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7C3AED' }}>{pilots.length}</h3>
            </div>
            <div style={{ backgroundColor: '#F5F3FF', padding: '0.65rem', borderRadius: '50%' }}>
              <Rocket size={22} color="#7C3AED" />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#7C3AED', marginTop: '0.5rem', fontWeight: 600 }}>Controlled Field Deployments</p>
        </div>

        <div className="metric-card">
          <div className="metric-card-accent" style={{ backgroundColor: '#059669' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>KPI PERFORMANCE</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669' }}>94.8%</h3>
            </div>
            <div style={{ backgroundColor: '#ECFDF5', padding: '0.65rem', borderRadius: '50%' }}>
              <Activity size={22} color="#059669" />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.5rem', fontWeight: 600 }}>All Targets Exceeded</p>
        </div>

        <div className="metric-card">
          <div className="metric-card-accent" style={{ backgroundColor: '#DC2626' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>PENDING MILESTONES</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#DC2626' }}>{pendingMilestones}</h3>
            </div>
            <div style={{ backgroundColor: '#FEF2F2', padding: '0.65rem', borderRadius: '50%' }}>
              <Clock size={22} color="#DC2626" />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#DC2626', marginTop: '0.5rem', fontWeight: 600 }}>Evidence Review Ready</p>
        </div>

        <div className="metric-card">
          <div className="metric-card-accent" style={{ backgroundColor: '#0284C7' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>INDEPENDENT VALIDATION</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284C7' }}>{pendingValidations}</h3>
            </div>
            <div style={{ backgroundColor: '#F0F9FF', padding: '0.65rem', borderRadius: '50%' }}>
              <CheckCircle2 size={22} color="#0284C7" />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#0284C7', marginTop: '0.5rem', fontWeight: 600 }}>Quality Board Certified</p>
        </div>

        <div className="metric-card">
          <div className="metric-card-accent" style={{ backgroundColor: '#EA580C' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>SCALE RECOMMENDATIONS</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#EA580C' }}>{scaleDecisions}</h3>
            </div>
            <div style={{ backgroundColor: '#FFF7ED', padding: '0.65rem', borderRadius: '50%' }}>
              <ShoppingBag size={22} color="#EA580C" />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#EA580C', marginTop: '0.5rem', fontWeight: 600 }}>Recommended Scale Statewide</p>
        </div>

        <div className="metric-card">
          <div className="metric-card-accent" style={{ backgroundColor: '#166534' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>SOLUTIONS BEING SCALED</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#166534' }}>{scaledSolutions}</h3>
            </div>
            <div style={{ backgroundColor: '#F0FDF4', padding: '0.65rem', borderRadius: '50%' }}>
              <TrendingUp size={22} color="#166534" />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#166534', marginTop: '0.5rem', fontWeight: 600 }}>₹4.5 Crore Budget Sanctioned</p>
        </div>
      </div>

      {/* Innovation Procurement Pipeline Visual */}
      <div className="gov-card" style={{ marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0A2540', marginBottom: '1rem' }}>
          Innovation Lifecycle Pipeline Overview
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {[
            { step: '1. Challenge', count: challenges.length, color: '#0A2540', tab: 'challenges' },
            { step: '2. Startup Discovery', count: 5, color: '#D97706', tab: 'startups' },
            { step: '3. Applications', count: proposals.length, color: '#2563EB', tab: 'applications' },
            { step: '4. Evaluation', count: evaluations.length, color: '#7C3AED', tab: 'evaluations' },
            { step: '5. Pilot', count: pilots.length, color: '#059669', tab: 'pilots' },
            { step: '6. KPI Tracking', count: '100%', color: '#0284C7', tab: 'kpis' },
            { step: '7. Validation', count: pilots.length, color: '#EA580C', tab: 'validation' },
            { step: '8. Procurement', count: scaleUps.length, color: '#166534', tab: 'procurement' },
            { step: '9. Scale-Up', count: scaleUps.length, color: '#1E3A8A', tab: 'scaleup' }
          ].map((item, idx, arr) => (
            <React.Fragment key={item.step}>
              <div 
                onClick={() => onSelectTab(item.tab)}
                style={{ 
                  flex: 1, 
                  minWidth: '110px', 
                  backgroundColor: '#F8FAFC', 
                  border: `1px solid ${item.color}30`, 
                  borderRadius: '8px', 
                  padding: '0.75rem 0.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: item.color, display: 'block' }}>{item.step}</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0A2540' }}>{item.count}</span>
              </div>
              {idx < arr.length - 1 && (
                <ArrowRight size={14} color="#94A3B8" style={{ flexShrink: 0 }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Analytics Visual Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
        <DepartmentBudgetChart 
          departments={[
            { name: 'Public Health Department', annualInnovationBudget: 15000000 },
            { name: 'Department of Agriculture', annualInnovationBudget: 20000000 },
            { name: 'School Education & Sports Department', annualInnovationBudget: 12000000 }
          ]} 
        />
        <InnovationFunnelChart 
          challengesCount={challenges.length}
          proposalsCount={proposals.length}
          evaluationsCount={evaluations.length}
          pilotsCount={pilots.length}
          scaledCount={scaleUps.length}
        />
      </div>

      {/* Active Challenges Table & Activity Feed Row */}
      <div style={{ display: 'grid', gridTemplateColumns: isAuditAdmin(currentUser) ? '2fr 1fr' : '1fr', gap: '1.5rem' }}>
        {/* Active Challenges */}
        <div className="gov-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540' }}>
              Active Innovation Challenges
            </h3>
            <button onClick={() => onSelectTab('challenges')} className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
              View All Challenges
            </button>
          </div>
          <table className="gov-table">
            <thead>
              <tr>
                <th>Challenge Title</th>
                <th>Department</th>
                <th>Budget</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {challenges.slice(0, 4).map((c) => (
                <tr key={c._id}>
                  <td>
                    <span style={{ fontWeight: 600, color: '#0A2540' }}>{formatText(c.title)}</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B' }}>{formatText(c.location)}</span>
                  </td>
                  <td><span className="badge badge-saffron">{formatText(c.department)}</span></td>
                  <td><strong>{formatCurrency(c.estimatedBudget)}</strong></td>
                  <td><span className="badge badge-navy">{formatText(c.status)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Audit Log Activity Stream (Restricted to Government Admin and Platform Admin) */}
        {isAuditAdmin(currentUser) && (
          <div className="gov-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', marginBottom: '1rem' }}>
              Recent Activity Audit Stream
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {auditLogs.slice(0, 5).map((log, idx) => (
                <div key={log._id || idx} style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span className="badge badge-navy" style={{ fontSize: '0.65rem' }}>{formatText(log.action)}</span>
                    <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0F172A' }}>{log.actorName}</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748B' }}>{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

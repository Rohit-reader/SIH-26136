import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Scale, 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  UserCheck,
  LayoutDashboard,
  Award,
  ShieldCheck,
  Clock,
  Check
} from 'lucide-react';
import axios from 'axios';
import { formatText, formatCurrency } from '../utils/textUtils';
import { EvaluationCriteriaChart } from '../components/charts/RoleAnalyticsCharts';
import { RoleSidebar } from '../components/RoleSidebar';

export const EvaluatorView = ({ onOpenEvaluationModal, currentUser, onLogout, onOpenAudit }) => {
  const { t } = useTranslation();
  const [evaluations, setEvaluations] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resE, resP] = await Promise.all([
        axios.get('/api/evaluations'),
        axios.get('/api/proposals')
      ]);
      setEvaluations(resE.data || []);
      setProposals(resP.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter proposals eligible for Phase 4 evaluation
  const eligibleProposals = proposals.filter(p => {
    const s = p.eligibilityScreening?.screeningStatus || p.status;
    return ['Eligible', 'Conditionally Eligible', 'Under Review', 'Submitted'].includes(s);
  });

  const sidebarItems = [
    { id: 'dashboard', label: formatText('Evaluation Console'), icon: LayoutDashboard },
    { id: 'proposals', label: formatText('Assigned Proposals'), icon: FileText, count: eligibleProposals.length },
    { id: 'scorecard', label: formatText('Scoring Criteria'), icon: Award },
    { id: 'coi', label: formatText('COI Declarations'), icon: ShieldCheck, count: evaluations.filter(e => e.coiDeclared).length }
  ];

  return (
    <div className="govt-layout">
      {/* Persistent Evaluator Sidebar */}
      <RoleSidebar
        title="EVALUATOR PORTAL"
        subtitle={currentUser?.name || 'Expert Evaluator'}
        items={sidebarItems}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        currentUser={currentUser}
        onLogout={onLogout}
        onOpenAudit={onOpenAudit}
      />

      {/* Main Content Area */}
      <section className="govt-content-area">
        {/* Evaluator Portal Header */}
        <div className="gov-card" style={{ marginBottom: '1.5rem', backgroundColor: '#F8FAFC', borderLeft: '4px solid #0A2540' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <UserCheck size={24} color="#0A2540" />
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0A2540' }}>
                  {formatText('Multi-Expert Evaluation Console')}
                </h2>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#475569' }}>
                {formatText('Evaluator')}: <strong style={{ color: '#0A2540' }}>{currentUser?.name || 'Dr. A. Sharma'}</strong> • {formatText('Public Health Department')}
              </p>
            </div>

            <div className="badge badge-navy" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
              {formatText('Mandatory COI Declaration Required Before Scoring')}
            </div>
          </div>
        </div>

        {/* Multi-Criteria Scoring Weights Chart */}
        {(activeTab === 'dashboard' || activeTab === 'scorecard') && (
          <div style={{ marginBottom: '1.5rem' }}>
            <EvaluationCriteriaChart 
              scores={{
                technicalFeasibility: 94,
                innovation: 95,
                expectedImpact: 96,
                scalability: 90,
                costEffectiveness: 88,
                security: 98,
                teamCapability: 95
              }} 
            />
          </div>
        )}

        {/* Assigned Proposals */}
        {(activeTab === 'dashboard' || activeTab === 'proposals') && (
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A2540', marginBottom: '1rem' }}>
              {formatText('Assigned Startup Applications for Phase 4 Review')}
            </h3>

            {eligibleProposals.length === 0 ? (
              <div className="gov-card" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
                <FileText size={36} color="#CBD5E1" style={{ marginBottom: '0.5rem' }} />
                <p style={{ margin: 0 }}>{formatText('No proposals currently assigned for evaluation. Proposals that pass Phase 3 Eligibility will appear here.')}</p>
              </div>
            ) : eligibleProposals.map((prop) => (
              <div key={prop._id} className="gov-card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.35rem' }}>
                      <span className="badge badge-saffron">{formatText('Public Health Department')}</span>
                      <span className="badge badge-emerald">
                        Phase 3 Gate: {formatText(prop.eligibilityScreening?.screeningStatus || prop.status || 'Eligible')}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A2540' }}>
                      {formatText(prop.solutionTitle)}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                      {formatText('Applicant')}: <strong>{formatText(prop.startupId?.name || prop.startupName || 'HealthAI Solutions Pvt Ltd')}</strong> • {formatText('Budget')}: {formatCurrency(prop.proposedBudget)}
                    </p>
                  </div>

                  <button onClick={() => onOpenEvaluationModal(prop)} className="btn-emerald">
                    <Award size={16} /> {formatText('Submit Evaluation & COI')}
                  </button>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <strong style={{ fontSize: '0.8rem', color: '#0A2540', display: 'block', marginBottom: '0.25rem' }}>{formatText('Technical Approach Summary')}:</strong>
                  <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0 }}>
                    {formatText(prop.technicalApproach)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default EvaluatorView;

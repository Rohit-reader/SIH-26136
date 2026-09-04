import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  UserCheck,
  LayoutDashboard,
  Award,
  ShieldCheck,
  Clock
} from 'lucide-react';
import axios from 'axios';
import { formatText, formatCurrency } from '../utils/textUtils';
import { EvaluationCriteriaChart } from '../components/charts/RoleAnalyticsCharts';
import { RoleSidebar } from '../components/RoleSidebar';

export const EvaluatorView = ({ onOpenEvaluationModal }) => {
  const [evaluations, setEvaluations] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resE = await axios.get('/api/evaluations');
      setEvaluations(resE.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sampleProposal = {
    _id: 'p123',
    solutionTitle: 'SmartOPD — AI Triage and Computer Vision Queue Platform',
    startupName: 'HealthAI Solutions Pvt Ltd',
    proposedBudget: 1420000,
    technicalApproach: 'Deploys edge-AI cameras and smart token kiosks to dynamically estimate patient wait times, auto-route priority emergency cases, and broadcast queue status via WhatsApp and local hospital screens.',
    securityApproach: 'End-to-end AES-256 encryption, zero PII exposure to public APIs, compliance with Digital Personal Data Protection Act 2023.'
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Evaluation Console', icon: LayoutDashboard },
    { id: 'proposals', label: 'Assigned Proposals', icon: FileText, count: 1 },
    { id: 'scorecard', label: 'Scoring Criteria', icon: Award },
    { id: 'coi', label: 'COI Declarations', icon: ShieldCheck, count: evaluations.filter(e => e.coiDeclared).length }
  ];

  return (
    <div className="govt-layout">
      {/* Persistent Evaluator Sidebar */}
      <RoleSidebar
        title="EVALUATOR PORTAL"
        subtitle="Dr. A. Sharma (IITB Expert)"
        items={sidebarItems}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
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
                  Multi-Expert Evaluation Console
                </h2>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#475569' }}>
                Evaluator: <strong style={{ color: '#0A2540' }}>Dr. A. Sharma (Senior Health Tech Expert)</strong> • Department Panel: Public Health
              </p>
            </div>

            <div className="badge badge-navy" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
              COI Declaration Required Before Scoring
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
              Assigned Startup Applications for Review
            </h3>

            <div className="gov-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <span className="badge badge-saffron" style={{ marginBottom: '0.35rem' }}>Public Health Department</span>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A2540' }}>
                    {sampleProposal.solutionTitle}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    Applicant: <strong>{sampleProposal.startupName}</strong> • Budget: {formatCurrency(sampleProposal.proposedBudget)}
                  </p>
                </div>

                <button onClick={() => onOpenEvaluationModal(sampleProposal)} className="btn-emerald">
                  <Award size={16} /> Submit Evaluation & COI
                </button>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <strong style={{ fontSize: '0.8rem', color: '#0A2540' }}>TECHNICAL APPROACH SUMMARY:</strong>
                <p style={{ fontSize: '0.85rem', color: '#334155', marginTop: '0.25rem' }}>
                  {sampleProposal.technicalApproach}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

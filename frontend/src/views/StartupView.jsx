import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  Award, 
  Building2,
  LayoutDashboard,
  Target,
  FileText,
  DollarSign,
  FileCheck
} from 'lucide-react';
import axios from 'axios';
import { formatText, formatCurrency } from '../utils/textUtils';
import { StartupIndiaBadge } from '../components/Emblems';
import { StartupFundingChart } from '../components/charts/RoleAnalyticsCharts';
import { RoleSidebar } from '../components/RoleSidebar';

export const StartupView = ({ onOpenProposalModal }) => {
  const [startups, setStartups] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resS, resC] = await Promise.all([
        axios.get('/api/startups'),
        axios.get('/api/challenges')
      ]);
      setStartups(resS.data);
      setChallenges(resC.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const primaryStartup = startups[0] || {};

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard & Profile', icon: LayoutDashboard },
    { id: 'challenges', label: 'Explore Challenges', icon: Target, count: challenges.length },
    { id: 'proposals', label: 'My Proposals', icon: FileText, count: 2 },
    { id: 'pilots', label: 'Active Pilots', icon: Rocket, count: 1 },
    { id: 'funding', label: 'Funding & Grants', icon: DollarSign },
    { id: 'documents', label: 'Compliance Docs', icon: FileCheck, count: primaryStartup.documents?.length || 3 }
  ];

  return (
    <div className="govt-layout">
      {/* Persistent Startup Admin Sidebar */}
      <RoleSidebar
        title="STARTUP PORTAL"
        subtitle={formatText(primaryStartup.name || 'HealthAI Solutions')}
        items={sidebarItems}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Main Content Area */}
      <section className="govt-content-area">
        {/* Startup Verified Header Card */}
        <div className="gov-card" style={{ backgroundColor: '#0A2540', color: '#FFFFFF', marginBottom: '1.5rem', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Rocket size={28} color="#FF9933" />
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {formatText(primaryStartup.name || 'HealthAI Solutions Pvt Ltd')}
                </h2>
                <StartupIndiaBadge />
              </div>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>
                DPIIT Reg No: <strong style={{ color: '#FFFFFF' }}>{primaryStartup.dpiitNumber || 'DPIIT984321'}</strong> • Location: {primaryStartup.location || 'Pune, Maharashtra'} • Team Size: {primaryStartup.teamSize || 28}
              </p>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '0.85rem 1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>DPIIT ELIGIBILITY STATUS</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                <ShieldCheck size={18} color="#10B981" />
                <span style={{ fontWeight: 700, color: '#10B981', fontSize: '0.95rem' }}>
                  {formatText(primaryStartup.verificationStatus || 'DPIIT Verified')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content Rendering */}
        {(activeTab === 'dashboard' || activeTab === 'funding') && (
          <div style={{ marginBottom: '1.5rem' }}>
            <StartupFundingChart paidAmount={994000} totalAmount={1420000} />
          </div>
        )}

        {(activeTab === 'dashboard' || activeTab === 'challenges') && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0A2540', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="#D97706" /> Recommended Government Innovation Challenges
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {challenges.map((c) => (
                <div key={c._id} className="gov-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <span className="badge badge-navy">{formatText(c.status)}</span>
                        <span className="badge badge-saffron">{formatText(c.department)}</span>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.35rem' }}>
                        {formatText(c.title)}
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '0.75rem' }}>
                        {formatText(c.problemDescription)}
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0A2540' }}>{formatCurrency(c.estimatedBudget)}</span>
                      <button onClick={() => onOpenProposalModal(c)} className="btn-primary" style={{ fontSize: '0.8rem' }}>
                        <Send size={14} /> Submit Technical Proposal
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="gov-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', marginBottom: '1rem' }}>
              Compliance Documents & DPIIT Certificates
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {primaryStartup.documents?.map((doc, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #E2E8F0', padding: '0.85rem', borderRadius: '6px' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0A2540' }}>{formatText(doc.title)}</h4>
                    <span className="badge badge-navy" style={{ fontSize: '0.7rem' }}>{formatText(doc.type)}</span>
                  </div>
                  <a href={doc.url} target="_blank" rel="noreferrer" className="btn-secondary" style={{ fontSize: '0.775rem' }}>
                    View Document
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

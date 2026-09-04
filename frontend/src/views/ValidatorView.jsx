import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  DollarSign, 
  TrendingUp, 
  ChevronRight, 
  Activity,
  LayoutDashboard,
  FileCheck
} from 'lucide-react';
import axios from 'axios';
import { formatText, formatCurrency } from '../utils/textUtils';
import { InnovationFunnelChart } from '../components/charts/GovtAnalyticsCharts';
import { EvaluationCriteriaChart } from '../components/charts/RoleAnalyticsCharts';
import { RoleSidebar } from '../components/RoleSidebar';

export const ValidatorView = ({ onRefreshData }) => {
  const [pilots, setPilots] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPilots();
  }, []);

  const fetchPilots = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/pilots');
      setPilots(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayMilestone = async (pilotId, mNum) => {
    try {
      await axios.patch(`/api/pilots/${pilotId}/milestone/${mNum}`, {
        status: 'Paid',
        approvedBy: 'State Finance & Procurement Officer'
      });
      fetchPilots();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleScaleUp = async (pilotId) => {
    try {
      await axios.patch(`/api/pilots/${pilotId}/scale-decision`, {
        validationStatus: 'Validated',
        procurementRecommendation: 'Scale Statewide',
        validatorNotes: 'Validated by Quality Control Board. 60% waiting time reduction verified across 30 days.'
      });
      alert('Statewide Procurement Scale-Up Decision Recorded! Scaling to 100 District Hospitals across Maharashtra.');
      fetchPilots();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const currentPilot = pilots[0] || {};

  const sidebarItems = [
    { id: 'dashboard', label: 'Validation Console', icon: LayoutDashboard },
    { id: 'audits', label: 'Field Audits', icon: CheckCircle2, count: pilots.length },
    { id: 'scale', label: 'Scale Decisions', icon: TrendingUp, count: 1 },
    { id: 'milestones', label: 'Milestone Approvals', icon: DollarSign, count: 1 }
  ];

  return (
    <div className="govt-layout">
      {/* Persistent Independent Validator Sidebar */}
      <RoleSidebar
        title="VALIDATOR PORTAL"
        subtitle="Dr. R. Naik (MSINS Quality Board)"
        items={sidebarItems}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Main Content Area */}
      <section className="govt-content-area">
        {/* Header Banner */}
        <div className="gov-card" style={{ backgroundColor: '#0A2540', color: '#FFFFFF', marginBottom: '1.5rem', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <ShieldCheck size={26} color="#FF9933" />
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Independent Quality & Scale-Up Validation Board
                </h2>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                Auditor: <strong style={{ color: '#FFFFFF' }}>Dr. Rameshwar Naik</strong> • Organization: Maharashtra State Innovation Society (MSINS)
              </p>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '0.85rem 1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>INDEPENDENT VALIDATION STATUS</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span style={{ fontWeight: 700, color: '#10B981', fontSize: '0.95rem' }}>
                  {formatText(currentPilot.validationStatus || 'Validated')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Validator Visual Charts Grid */}
        {(activeTab === 'dashboard' || activeTab === 'audits') && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <InnovationFunnelChart 
              challengesCount={5}
              proposalsCount={5}
              evaluationsCount={5}
              pilotsCount={pilots.length}
              scaledCount={1}
            />
            <EvaluationCriteriaChart 
              scores={{
                technicalFeasibility: 95,
                innovation: 96,
                expectedImpact: 98,
                scalability: 92,
                costEffectiveness: 90,
                security: 92,
                teamCapability: 94
              }}
            />
          </div>
        )}

        {/* Controlled Pilot Details */}
        {currentPilot._id && (
          <div className="gov-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-emerald" style={{ marginBottom: '0.35rem' }}>Pilot Active</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0A2540' }}>
                  {formatText(currentPilot.title || 'SmartOPD Field Pilot — Aundh District Hospital')}
                </h3>
              </div>

              {currentPilot.procurementRecommendation !== 'Scale Statewide' ? (
                <button onClick={() => handleScaleUp(currentPilot._id)} className="btn-emerald">
                  <TrendingUp size={16} /> Certify & Recommend Scale Statewide
                </button>
              ) : (
                <span className="badge badge-emerald" style={{ fontSize: '0.9rem', padding: '0.4rem 0.85rem' }}>
                  ✓ Certified for Statewide Scaling
                </span>
              )}
            </div>

            {/* Milestones Approval Table */}
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.75rem' }}>
              Milestone Disburser & Payment Verification
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>Milestone</th>
                    <th>Deliverables</th>
                    <th>Payment Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPilot.milestones?.map((m) => (
                    <tr key={m.number}>
                      <td><strong>Milestone {m.number}</strong></td>
                      <td>{m.title}</td>
                      <td><strong>{formatCurrency(m.paymentAmount)}</strong></td>
                      <td>
                        <span className={`badge ${m.status === 'Paid' ? 'badge-emerald' : m.status === 'Evidence Submitted' ? 'badge-saffron' : 'badge-navy'}`}>
                          {formatText(m.status)}
                        </span>
                      </td>
                      <td>
                        {m.status === 'Evidence Submitted' ? (
                          <button onClick={() => handlePayMilestone(currentPilot._id, m.number)} className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
                            <DollarSign size={12} /> Approve & Pay
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Verified</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

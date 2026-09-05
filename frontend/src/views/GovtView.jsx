import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GovtSidebar } from '../components/govt/GovtSidebar';
import { GovtDashboardTab } from '../components/govt/GovtDashboardTab';
import { GovtChallengesTab } from '../components/govt/GovtChallengesTab';
import { GovtStartupDiscoveryTab } from '../components/govt/GovtStartupDiscoveryTab';
import { GovtApplicationsTab } from '../components/govt/GovtApplicationsTab';
import { GovtEvaluationsTab } from '../components/govt/GovtEvaluationsTab';
import { GovtPilotsTab } from '../components/govt/GovtPilotsTab';
import { GovtKPIPerformanceTab } from '../components/govt/GovtKPIPerformanceTab';
import { GovtValidationTab } from '../components/govt/GovtValidationTab';
import { GovtProcurementTab } from '../components/govt/GovtProcurementTab';
import { GovtScaleUpTab } from '../components/govt/GovtScaleUpTab';
import { GovtNotificationsTab } from '../components/govt/GovtNotificationsTab';

export const GovtView = ({ onOpenCreateModal, currentUser, onLogout, onOpenAudit }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data states
  const [challenges, setChallenges] = useState([]);
  const [startups, setStartups] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [pilots, setPilots] = useState([]);
  const [scaleUps, setScaleUps] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        resC, resS, resP, resE, resPilots, resScale, resN, resA
      ] = await Promise.all([
        axios.get('/api/challenges'),
        axios.get('/api/startups'),
        axios.get('/api/proposals'),
        axios.get('/api/evaluations'),
        axios.get('/api/pilots'),
        axios.get('/api/scaleups'),
        axios.get('/api/notifications'),
        axios.get('/api/audit')
      ]);

      setChallenges(resC.data);
      setStartups(resS.data);
      setProposals(resP.data);
      setEvaluations(resE.data);
      setPilots(resPilots.data);
      setScaleUps(resScale.data);
      setNotifications(resN.data);
      setAuditLogs(resA.data);
    } catch (err) {
      console.error('Error fetching GovtView data:', err);
    } finally {
      setLoading(false);
    }
  };

  const counts = {
    challenges: challenges.length,
    startups: startups.length,
    proposals: proposals.filter(p => p.status === 'Submitted' || p.status === 'Under Review').length,
    evaluations: evaluations.length,
    pilots: pilots.length,
    validations: pilots.filter(p => p.validationStatus === 'Pending Review').length,
    scaleUps: scaleUps.length,
    notifications: notifications.filter(n => !n.isRead).length
  };

  return (
    <div className="govt-layout">
      {/* Persistent Government Officer Sidebar */}
      <GovtSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        counts={counts}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentUser={currentUser}
        onLogout={onLogout}
        onOpenAudit={onOpenAudit}
      />

      {/* Main Content Area */}
      <section className="govt-content-area">
        {loading ? (
          <div className="gov-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#64748B', fontWeight: 600 }}>Loading Government Innovation Registry Data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <GovtDashboardTab
                challenges={challenges}
                proposals={proposals}
                evaluations={evaluations}
                pilots={pilots}
                scaleUps={scaleUps}
                auditLogs={auditLogs}
                onSelectTab={setActiveTab}
                onOpenCreateModal={onOpenCreateModal}
              />
            )}

            {activeTab === 'challenges' && (
              <GovtChallengesTab
                challenges={challenges}
                onRefresh={fetchAllData}
                onOpenCreateModal={onOpenCreateModal}
              />
            )}

            {activeTab === 'startups' && (
              <GovtStartupDiscoveryTab
                startups={startups}
              />
            )}

            {activeTab === 'applications' && (
              <GovtApplicationsTab
                proposals={proposals}
                onRefresh={fetchAllData}
              />
            )}

            {activeTab === 'evaluations' && (
              <GovtEvaluationsTab
                evaluations={evaluations}
                proposals={proposals}
                onRefresh={fetchAllData}
                onSelectForPilot={(proposal) => {
                  setActiveTab('pilots');
                }}
              />
            )}

            {activeTab === 'pilots' && (
              <GovtPilotsTab
                pilots={pilots}
                proposals={proposals}
                onRefresh={fetchAllData}
              />
            )}

            {activeTab === 'kpis' && (
              <GovtKPIPerformanceTab
                pilots={pilots}
              />
            )}

            {activeTab === 'validation' && (
              <GovtValidationTab
                pilots={pilots}
                onRefresh={fetchAllData}
                onNavigateToScaleUp={() => setActiveTab('scaleup')}
              />
            )}

            {activeTab === 'procurement' && (
              <GovtProcurementTab
                pilots={pilots}
                scaleUps={scaleUps}
                auditLogs={auditLogs}
              />
            )}

            {activeTab === 'scaleup' && (
              <GovtScaleUpTab
                scaleUps={scaleUps}
                pilots={pilots}
                onRefresh={fetchAllData}
              />
            )}

            {activeTab === 'notifications' && (
              <GovtNotificationsTab
                notifications={notifications}
                onRefresh={fetchAllData}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
};

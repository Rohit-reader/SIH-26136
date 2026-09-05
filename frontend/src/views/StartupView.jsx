import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  LayoutDashboard,
  Target,
  FileText,
  DollarSign,
  FileCheck,
  Bell,
  User,
  ShieldCheck
} from 'lucide-react';
import axios from 'axios';
import { formatText } from '../utils/textUtils';
import { RoleSidebar } from '../components/RoleSidebar';

// Import Modular Startup Screen Tabs
import { StartupDashboardTab } from '../components/startup/StartupDashboardTab';
import { StartupProfileTab } from '../components/startup/StartupProfileTab';
import { StartupBrowseChallengesTab } from '../components/startup/StartupBrowseChallengesTab';
import { StartupSubmitProposalModal } from '../components/startup/StartupSubmitProposalModal';
import { StartupApplicationsTab } from '../components/startup/StartupApplicationsTab';
import { StartupPilotsTab } from '../components/startup/StartupPilotsTab';
import { StartupPaymentsTab } from '../components/startup/StartupPaymentsTab';
import { StartupNotificationsTab } from '../components/startup/StartupNotificationsTab';

export const StartupView = ({ onOpenProposalModal, currentUser, onLogout, onOpenAudit }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Application Data States
  const [startups, setStartups] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [pilots, setPilots] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Selection states for cross-tab drill down
  const [selectedChallengeForDetails, setSelectedChallengeForDetails] = useState(null);
  const [selectedProposalForDetails, setSelectedProposalForDetails] = useState(null);

  // Proposal Submission Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [challengeToApply, setChallengeToApply] = useState(null);

  useEffect(() => {
    fetchStartupData();
  }, []);

  const fetchStartupData = async () => {
    setLoading(true);
    try {
      const [resS, resC, resP, resPilots, resN] = await Promise.all([
        axios.get('/api/startups'),
        axios.get('/api/challenges'),
        axios.get('/api/proposals'),
        axios.get('/api/pilots'),
        axios.get('/api/notifications')
      ]);

      setStartups(resS.data);
      setChallenges(resC.data);
      setProposals(resP.data);
      setPilots(resPilots.data);
      setNotifications(resN.data);
    } catch (err) {
      console.error('Error fetching StartupView data:', err);
    } finally {
      setLoading(false);
    }
  };

  const primaryStartup = startups[0] || {};

  const handleOpenApplyModal = (challenge) => {
    setChallengeToApply(challenge);
    setIsApplyModalOpen(true);
  };

  const handleProposalSubmitted = () => {
    fetchStartupData();
    setIsApplyModalOpen(false);
    setActiveTab('applications');
  };

  // Sidebar navigation items with live badges
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'challenges', label: 'Browse Challenges', icon: Target, count: challenges.length },
    { id: 'applications', label: 'My Applications', icon: FileText, count: proposals.length },
    { id: 'pilots', label: 'Pilot Workspace', icon: Rocket, count: pilots.length },
    { id: 'payments', label: 'Payments & Milestones', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: notifications.filter(n => !n.isRead).length },
    { id: 'profile', label: 'Company Profile', icon: User }
  ];

  return (
    <div className="govt-layout">
      {/* Persistent Startup Admin Sidebar */}
      <RoleSidebar
        title="STARTUP PORTAL"
        subtitle={formatText(primaryStartup.name || 'HealthAI Solutions')}
        items={sidebarItems}
        activeTab={activeTab}
        onSelectTab={(tabId) => {
          setActiveTab(tabId);
          setSelectedChallengeForDetails(null);
          setSelectedProposalForDetails(null);
        }}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        currentUser={currentUser}
        onLogout={onLogout}
        onOpenAudit={onOpenAudit}
      />

      {/* Main Content Workspace Area */}
      <section className="govt-content-area">
        {loading ? (
          <div className="gov-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#64748B', fontWeight: 600 }}>Loading Startup Portal & Innovation Registry Data...</p>
          </div>
        ) : (
          <>
            {/* Screen A: Startup Dashboard */}
            {activeTab === 'dashboard' && (
              <StartupDashboardTab
                primaryStartup={primaryStartup}
                challenges={challenges}
                proposals={proposals}
                pilots={pilots}
                notifications={notifications}
                onNavigateTab={(tab) => {
                  setActiveTab(tab);
                  setSelectedChallengeForDetails(null);
                  setSelectedProposalForDetails(null);
                }}
                onOpenApplyModal={handleOpenApplyModal}
                onSelectChallenge={(c) => {
                  setSelectedChallengeForDetails(c._id);
                  setActiveTab('challenges');
                }}
                onSelectProposal={(p) => {
                  setSelectedProposalForDetails(p._id);
                  setActiveTab('applications');
                }}
                onSelectPilot={() => setActiveTab('pilots')}
              />
            )}

            {/* Screen B: Startup Company Profile */}
            {activeTab === 'profile' && (
              <StartupProfileTab
                primaryStartup={primaryStartup}
                onSaveProfile={(updatedData) => {
                  console.log('Saved profile:', updatedData);
                }}
              />
            )}

            {/* Screen C & D: Browse Challenges & Challenge Details */}
            {activeTab === 'challenges' && (
              <StartupBrowseChallengesTab
                challenges={challenges}
                primaryStartup={primaryStartup}
                onOpenApplyModal={handleOpenApplyModal}
                selectedChallengeId={selectedChallengeForDetails}
                onClearSelectedChallenge={() => setSelectedChallengeForDetails(null)}
              />
            )}

            {/* Screen F & G: My Applications & Application Details */}
            {activeTab === 'applications' && (
              <StartupApplicationsTab
                proposals={proposals}
                challenges={challenges}
                pilots={pilots}
                onNavigateTab={setActiveTab}
                selectedProposalId={selectedProposalForDetails}
                onClearSelectedProposal={() => setSelectedProposalForDetails(null)}
              />
            )}

            {/* Screen H: Pilot Workspace */}
            {activeTab === 'pilots' && (
              <StartupPilotsTab
                pilots={pilots}
                onRefreshData={fetchStartupData}
              />
            )}

            {/* Screen I: Payments & Milestones */}
            {activeTab === 'payments' && (
              <StartupPaymentsTab
                pilots={pilots}
              />
            )}

            {/* Screen J: Notifications Center */}
            {activeTab === 'notifications' && (
              <StartupNotificationsTab
                notifications={notifications}
                onNavigateTab={setActiveTab}
              />
            )}
          </>
        )}
      </section>

      {/* Screen E: Multi-Step Proposal Submission Workflow Modal */}
      {isApplyModalOpen && challengeToApply && (
        <StartupSubmitProposalModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          challenge={challengeToApply}
          primaryStartup={primaryStartup}
          onProposalSubmitted={handleProposalSubmitted}
        />
      )}
    </div>
  );
};

export default StartupView;

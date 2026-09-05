import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { LandingPageView } from './views/LandingPageView';
import { LoginPageView } from './views/LoginPageView';
import { GovtView } from './views/GovtView';
import { StartupView } from './views/StartupView';
import { EvaluatorView } from './views/EvaluatorView';
import { ValidatorView } from './views/ValidatorView';

import { ChallengeBuilderModal } from './components/ChallengeBuilderModal';
import { ProposalModal } from './components/ProposalModal';
import { EvaluationModal } from './components/EvaluationModal';
import { AuditLogModal } from './components/AuditLogModal';

export function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('govinnovate_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [activePublicPage, setActivePublicPage] = useState('landing'); // 'landing' | 'login'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Modals state
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  const handleLoginSuccess = (userAccount) => {
    setCurrentUser(userAccount);
    try {
      localStorage.setItem('govinnovate_user', JSON.stringify(userAccount));
    } catch (e) {
      console.error('Error saving user state:', e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActivePublicPage('landing');
    try {
      localStorage.removeItem('govinnovate_user');
    } catch (e) {
      console.error('Error clearing user state:', e);
    }
  };

  const handleOpenProposal = (challenge) => {
    setSelectedChallenge(challenge);
    setIsProposalModalOpen(true);
  };

  const handleOpenEvaluation = (proposal) => {
    setSelectedProposal(proposal);
    setIsEvaluationModalOpen(true);
  };

  return (
    <div className="app-container">
      {/* Non-authenticated user view: Either Landing Page or Full Login Page */}
      {!currentUser ? (
        activePublicPage === 'login' ? (
          <LoginPageView 
            onLoginSuccess={handleLoginSuccess}
            onNavigateToLanding={() => setActivePublicPage('landing')}
          />
        ) : (
          <>
            <Navbar
              currentUser={currentUser}
              onOpenAuth={() => setActivePublicPage('login')}
              onLogout={handleLogout}
              onOpenAudit={() => setIsAuditModalOpen(true)}
            />
            <LandingPageView onOpenLogin={() => setActivePublicPage('login')} />
          </>
        )
      ) : (
        /* Authorized Portal View based on Logged-in User Role */
        <main className="main-content" key={refreshKey}>
          {currentUser.roleId === 'govt' && (
            <GovtView 
              onOpenCreateModal={() => setIsChallengeModalOpen(true)} 
              currentUser={currentUser}
              onLogout={handleLogout}
              onOpenAudit={() => setIsAuditModalOpen(true)}
            />
          )}
          
          {currentUser.roleId === 'startup' && (
            <StartupView 
              onOpenProposalModal={handleOpenProposal} 
              currentUser={currentUser}
              onLogout={handleLogout}
              onOpenAudit={() => setIsAuditModalOpen(true)}
            />
          )}

          {currentUser.roleId === 'evaluator' && (
            <EvaluatorView 
              onOpenEvaluationModal={handleOpenEvaluation} 
              currentUser={currentUser}
              onLogout={handleLogout}
              onOpenAudit={() => setIsAuditModalOpen(true)}
            />
          )}

          {currentUser.roleId === 'validator' && (
            <ValidatorView 
              onRefreshData={triggerRefresh} 
              currentUser={currentUser}
              onLogout={handleLogout}
              onOpenAudit={() => setIsAuditModalOpen(true)}
            />
          )}
        </main>
      )}

      {/* Auth / Sign In Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Operational Modals */}
      <ChallengeBuilderModal
        isOpen={isChallengeModalOpen}
        onClose={() => setIsChallengeModalOpen(false)}
        onChallengeCreated={triggerRefresh}
      />

      <ProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        challenge={selectedChallenge}
        onProposalSubmitted={triggerRefresh}
      />

      <EvaluationModal
        isOpen={isEvaluationModalOpen}
        onClose={() => setIsEvaluationModalOpen(false)}
        proposal={selectedProposal}
        onEvaluationSubmitted={triggerRefresh}
      />

      <AuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </div>
  );
}

export default App;

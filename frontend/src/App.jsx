import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { LandingPageView } from './views/LandingPageView';
import { GovtView } from './views/GovtView';
import { StartupView } from './views/StartupView';
import { EvaluatorView } from './views/EvaluatorView';
import { ValidatorView } from './views/ValidatorView';

import { ChallengeBuilderModal } from './components/ChallengeBuilderModal';
import { ProposalModal } from './components/ProposalModal';
import { EvaluationModal } from './components/EvaluationModal';
import { AuditLogModal } from './components/AuditLogModal';

export function App() {
  const [currentUser, setCurrentUser] = useState(null);
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
  };

  const handleLogout = () => {
    setCurrentUser(null);
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
      {/* Top Banner Navigation */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenAudit={() => setIsAuditModalOpen(true)}
      />

      {/* Main Content Area */}
      {!currentUser ? (
        // Public Product Landing Page
        <LandingPageView onOpenLogin={() => setIsAuthModalOpen(true)} />
      ) : (
        // Authorized Portal View based on Logged-in User Role
        <main className="main-content" key={refreshKey}>
          {currentUser.roleId === 'govt' && (
            <GovtView onOpenCreateModal={() => setIsChallengeModalOpen(true)} />
          )}
          
          {currentUser.roleId === 'startup' && (
            <StartupView onOpenProposalModal={handleOpenProposal} />
          )}

          {currentUser.roleId === 'evaluator' && (
            <EvaluatorView onOpenEvaluationModal={handleOpenEvaluation} />
          )}

          {currentUser.roleId === 'validator' && (
            <ValidatorView onRefreshData={triggerRefresh} />
          )}
        </main>
      )}

      {/* Auth / Sign In Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Modals */}
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

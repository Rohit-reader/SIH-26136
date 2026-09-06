import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Building, 
  ShieldCheck, 
  FileCheck, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Eye, 
  X, 
  Star, 
  Send, 
  Filter, 
  Award, 
  Layers, 
  MapPin, 
  Users, 
  Cpu, 
  Check 
} from 'lucide-react';
import axios from 'axios';
import { formatText } from '../../utils/textUtils';

export const GovtStartupDiscoveryTab = ({ startups = [], challenges = [], onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [dpiitFilter, setDpiitFilter] = useState('All');
  const [shortlistOnly, setShortlistOnly] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState(challenges[0]?._id || '');

  // Modals state
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [activeDocModal, setActiveDocModal] = useState(null);
  const [inviteModalStartup, setInviteModalStartup] = useState(null);
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteSending, setInviteSending] = useState(false);

  // Dynamic match scores state
  const [matchScoresMap, setMatchScoresMap] = useState({});

  useEffect(() => {
    if (selectedChallengeId && startups.length > 0) {
      calculateMatchScoresForChallenge(selectedChallengeId);
    }
  }, [selectedChallengeId, startups]);

  const calculateMatchScoresForChallenge = async (chId) => {
    try {
      const promises = startups.map(s => 
        axios.post('/api/startups/match-score', { challengeId: chId, startupId: s._id })
      );
      const results = await Promise.all(promises);

      const scoreMap = {};
      results.forEach(res => {
        scoreMap[res.data.startupId] = res.data;
      });
      setMatchScoresMap(scoreMap);
    } catch (err) {
      console.error('Error computing dynamic match scores:', err);
    }
  };

  const selectedChallenge = challenges.find(c => c._id === selectedChallengeId) || challenges[0] || {};

  const domains = [
    'All', 
    'Healthcare & MedTech', 
    'Hospital Workflow Automation & Computer Vision AI',
    'Agriculture & Irrigation', 
    'School Education & Skills', 
    'Water & Sanitation', 
    'Smart Governance & ULBs'
  ];

  const handleToggleShortlist = async (startupId) => {
    if (!selectedChallengeId) {
      alert('Please select a published challenge to shortlist startups for.');
      return;
    }

    try {
      await axios.post(`/api/startups/${startupId}/shortlist`, {
        challengeId: selectedChallengeId
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!inviteModalStartup || !selectedChallengeId) return;

    setInviteSending(true);
    try {
      await axios.post(`/api/startups/${inviteModalStartup._id}/invite`, {
        challengeId: selectedChallengeId,
        challengeTitle: selectedChallenge.title,
        departmentName: selectedChallenge.department || 'Government of Maharashtra',
        inviteMessage: inviteMessage || `Direct innovation invitation for ${selectedChallenge.title}`
      });

      alert(`Official Innovation Challenge Invitation sent to ${inviteModalStartup.name}!`);
      setInviteModalStartup(null);
      setInviteMessage('');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to send invitation.');
    } finally {
      setInviteSending(false);
    }
  };

  const filteredStartups = startups.filter(s => {
    const matchesSearch = (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.industryDomain || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.technologies?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDomain = domainFilter === 'All' || s.industryDomain === domainFilter;
    const matchesDpiit = dpiitFilter === 'All' || (dpiitFilter === 'DPIIT Verified' && (s.dpiitRecognized || s.verificationStatus === 'DPIIT Verified'));

    const isShortlistedForCurrentChallenge = s.shortlistedChallenges?.some(sc => sc.challengeId === selectedChallengeId);
    const matchesShortlist = !shortlistOnly || isShortlistedForCurrentChallenge;

    return matchesSearch && matchesDomain && matchesDpiit && matchesShortlist;
  });

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-navy">Phase 2 Discovery</span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
            Startup Discovery & Semantic Matchmaking Portal
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
          Discover DPIIT & DigiLocker verified startups, rank compatibility against published outcome challenges, shortlist entities, and issue direct pilot trial invitations.
        </p>
      </div>

      {/* Challenge Context Selector Bar */}
      <div style={{
        backgroundColor: '#0A2540',
        color: '#FFFFFF',
        borderRadius: '10px',
        padding: '1rem 1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        borderLeft: '5px solid #FF9933'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: 'rgba(255, 153, 51, 0.2)', padding: '0.5rem', borderRadius: '50%' }}>
            <Layers size={20} color="#FF9933" />
          </div>
          <div>
            <span style={{ fontSize: '0.725rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
              ACTIVE TARGET CHALLENGE CONTEXT:
            </span>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
              {selectedChallenge.title || 'Select a Government Challenge'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Select Challenge:</span>
          <select
            value={selectedChallengeId}
            onChange={e => setSelectedChallengeId(e.target.value)}
            style={{
              backgroundColor: '#1E3A8A',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              padding: '0.5rem 0.85rem',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {challenges.map(c => (
              <option key={c._id} value={c._id}>{formatText(c.title)} ({c.department})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search & Multi-Criteria Discovery Filter Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}>
        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          {/* Search input */}
          <div style={{ flex: 2, minWidth: '260px', position: 'relative' }}>
            <Search size={18} color="#64748B" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <input
              type="text"
              placeholder="Search startups by name, domain, or technology capabilities..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Domain Filter */}
          <select
            value={domainFilter}
            onChange={e => setDomainFilter(e.target.value)}
            className="form-select"
            style={{ flex: 1, minWidth: '180px' }}
          >
            {domains.map(d => (
              <option key={d} value={d}>{d === 'All' ? 'All Domains' : d}</option>
            ))}
          </select>

          {/* DPIIT Filter */}
          <select
            value={dpiitFilter}
            onChange={e => setDpiitFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '170px' }}
          >
            <option value="All">All Entities</option>
            <option value="DPIIT Verified">DPIIT Verified Only</option>
          </select>

          {/* Shortlisted Only Toggle Button */}
          <button
            onClick={() => setShortlistOnly(!shortlistOnly)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: shortlistOnly ? '1px solid #D97706' : '1px solid #CBD5E1',
              backgroundColor: shortlistOnly ? '#FFFBEB' : '#FFFFFF',
              color: shortlistOnly ? '#B45309' : '#475569',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Star size={15} color={shortlistOnly ? '#D97706' : '#64748B'} fill={shortlistOnly ? '#D97706' : 'none'} />
            <span>Shortlisted Only</span>
          </button>
        </div>

        {/* Counter Summary Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.775rem', color: '#64748B', borderTop: '1px solid #F1F5F9', paddingTop: '0.5rem' }}>
          <span>
            Showing <strong>{filteredStartups.length}</strong> matching startups for challenge: <strong style={{ color: '#0A2540' }}>{selectedChallenge.title}</strong>
          </span>
          <span>
            DPIIT GFR Turnover & Experience Waivers Automatically Applied
          </span>
        </div>
      </div>

      {/* Startups Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {filteredStartups.map((s) => {
          const dynamicMatch = matchScoresMap[s._id] || { matchScore: s.matchScore || 88, reasons: s.matchJustification || [] };
          const isShortlisted = s.shortlistedChallenges?.some(sc => sc.challengeId === selectedChallengeId);
          const isInvited = s.invitedChallenges?.some(ic => ic.challengeId === selectedChallengeId);
          const isDigiLockerVerified = s.digilockerVerification?.status === 'Verified';

          return (
            <div key={s._id} className="gov-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: isShortlisted ? '2px solid #D97706' : '1px solid #E2E8F0' }}>
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                        {formatText(s.name)}
                      </h3>
                      {isShortlisted && (
                        <Star size={16} color="#D97706" fill="#D97706" title="Shortlisted for this challenge" />
                      )}
                    </div>
                    <span style={{ fontSize: '0.775rem', color: '#64748B', fontWeight: 500 }}>
                      {formatText(s.industryDomain)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                    <span className="badge badge-dpiit">
                      <ShieldCheck size={13} /> {formatText(s.verificationStatus)}
                    </span>
                    {isDigiLockerVerified && (
                      <span className="badge badge-emerald" style={{ fontSize: '0.625rem' }}>
                        ✓ DigiLocker Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Match Score & Specs Box */}
                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.85rem', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #CBD5E1', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 700 }}>AI COMPATIBILITY MATCH</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: dynamicMatch.matchScore > 85 ? '#059669' : '#D97706' }}>
                      {dynamicMatch.matchScore}% Match
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.775rem' }}>
                    <div>
                      <span style={{ color: '#64748B' }}>DPIIT Reg:</span>
                      <strong style={{ display: 'block', color: '#0A2540' }}>{s.dpiitNumber}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Location:</span>
                      <strong style={{ display: 'block' }}>{formatText(s.location)}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Team Size:</span>
                      <strong style={{ display: 'block' }}>{s.teamSize} Experts ({s.foundingYear})</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Govt Track Record:</span>
                      <strong style={{ display: 'block', color: '#0A2540' }}>{s.previousGovtProjects?.length || 0} Projects</strong>
                    </div>
                  </div>
                </div>

                {/* Tech Stack */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                  {s.technologies?.map((tech, idx) => (
                    <span key={idx} style={{ backgroundColor: '#EFF6FF', color: '#1E3A8A', fontSize: '0.725rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      {formatText(tech)}
                    </span>
                  ))}
                </div>

                {/* Invitation Sent Badge */}
                {isInvited && (
                  <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', color: '#92400E', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
                    <Send size={13} color="#D97706" /> Challenge Invitation Sent
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {/* Shortlist Button */}
                  <button
                    onClick={() => handleToggleShortlist(s._id)}
                    className="btn-secondary"
                    style={{
                      flex: 1,
                      fontSize: '0.775rem',
                      justify: 'center',
                      borderColor: isShortlisted ? '#D97706' : '#CBD5E1',
                      backgroundColor: isShortlisted ? '#FFFBEB' : '#FFFFFF',
                      color: isShortlisted ? '#B45309' : '#0A2540'
                    }}
                  >
                    <Star size={14} color={isShortlisted ? '#D97706' : '#64748B'} fill={isShortlisted ? '#D97706' : 'none'} />
                    <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
                  </button>

                  {/* Invite Button */}
                  <button
                    onClick={() => {
                      setInviteModalStartup(s);
                      setInviteMessage(`Official Invitation: Your startup ${s.name} has been shortlisted by our department for trial participation in "${selectedChallenge.title}".`);
                    }}
                    className="btn-primary"
                    style={{ flex: 1, fontSize: '0.775rem', justifyContent: 'center', backgroundColor: '#0A2540' }}
                  >
                    <Send size={14} />
                    <span>Invite</span>
                  </button>
                </div>

                {/* Inspect Profile Details Button */}
                <button
                  onClick={() => setSelectedStartup({ ...s, matchDetails: dynamicMatch })}
                  className="btn-secondary"
                  style={{ width: '100%', fontSize: '0.775rem', justifyContent: 'center' }}
                >
                  <Sparkles size={14} color="#D97706" /> Inspect Capabilities & AI Match Rationale
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Match & Capabilities Deep-Dive Modal */}
      {selectedStartup && (
        <div className="modal-overlay" onClick={() => setSelectedStartup(null)} style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '780px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                  Startup Capabilities & AI Rationale — {formatText(selectedStartup.name)}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Target Challenge: {selectedChallenge.title}
                </span>
              </div>
              <button onClick={() => setSelectedStartup(null)} className="btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>
                <X size={16} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Match Banner */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '1rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#059669' }}>
                  {selectedStartup.matchDetails?.matchScore || selectedStartup.matchScore}%
                </span>
                <div>
                  <h4 style={{ fontWeight: 700, color: '#065F46', margin: 0 }}>
                    High-Compatibility Qualified Startup
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#047857', margin: '0.2rem 0 0 0' }}>
                    Evaluated against Maharashtra State Innovation Procurement Rules & GFR Exemption Standards
                  </p>
                </div>
              </div>

              {/* Explainable Match Reasons */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.4rem' }}>
                  Explainable AI Match Rationale
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {(selectedStartup.matchDetails?.reasons || selectedStartup.matchJustification)?.map((reason, idx) => (
                    <li key={idx} style={{ fontSize: '0.825rem', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.65rem 0.85rem', borderRadius: '6px', color: '#334155', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <CheckCircle2 size={16} color="#059669" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                      <span>{formatText(reason)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Products & Previous Govt Projects */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 700 }}>PRODUCTS & SOLUTIONS</span>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                    {selectedStartup.products?.map((p, idx) => (
                      <span key={idx} className="badge badge-navy" style={{ fontSize: '0.725rem' }}>{p}</span>
                    )) || <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Flagship AI OPD Suite</span>}
                  </div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 700 }}>PAST GOVT PROJECTS</span>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A2540', margin: '0.35rem 0 0 0' }}>
                    {selectedStartup.previousGovtProjects?.join(', ') || 'Smart Hospital Queue Pilot (BMC)'}
                  </p>
                </div>
              </div>

              {/* Verified Documents */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.4rem' }}>
                  Verified Compliance Documents ({selectedStartup.documents?.length || 0})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedStartup.documents?.map((doc, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileCheck size={16} color="#1E3A8A" />
                        <div>
                          <strong style={{ fontSize: '0.825rem', color: '#0A2540' }}>{doc.title}</strong>
                          <span style={{ fontSize: '0.725rem', color: '#64748B', display: 'block' }}>{doc.type}</span>
                        </div>
                      </div>
                      <a href={doc.url} target="_blank" rel="noreferrer" className="btn-secondary" style={{ fontSize: '0.725rem', padding: '0.25rem 0.5rem' }}>
                        View <ExternalLink size={12} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setSelectedStartup(null)} className="btn-secondary">Close</button>
              <button
                onClick={() => {
                  const s = selectedStartup;
                  setSelectedStartup(null);
                  setInviteModalStartup(s);
                  setInviteMessage(`Official Invitation: Your startup ${s.name} has been shortlisted by our department for trial participation in "${selectedChallenge.title}".`);
                }}
                className="btn-primary"
                style={{ backgroundColor: '#0A2540' }}
              >
                <Send size={15} /> Issue Direct Challenge Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Challenge Invitation Modal */}
      {inviteModalStartup && (
        <div className="modal-overlay" onClick={() => setInviteModalStartup(null)} style={{ zIndex: 1150 }}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Send size={20} color="#FF9933" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                  Issue Challenge Invitation to Startup
                </h3>
              </div>
              <button onClick={() => setInviteModalStartup(null)} className="btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSendInvite}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', padding: '0.85rem', borderRadius: '6px' }}>
                  <p style={{ margin: 0, fontSize: '0.825rem', color: '#1E3A8A' }}>
                    Inviting: <strong style={{ color: '#0A2540' }}>{inviteModalStartup.name}</strong>
                  </p>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: '#1E3A8A' }}>
                    For Challenge: <strong style={{ color: '#0A2540' }}>{selectedChallenge.title}</strong>
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">Department Custom Invitation Message</label>
                  <textarea
                    rows="4"
                    required
                    value={inviteMessage}
                    onChange={e => setInviteMessage(e.target.value)}
                    className="form-textarea"
                    placeholder="Provide details on pilot scope, expected trial timeline, and direct proposal submission link..."
                  />
                </div>

                <div style={{ fontSize: '0.775rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Award size={14} color="#059669" />
                  <span>DPIIT Startup GFR turnover & prior experience relaxations apply automatically to this invite.</span>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setInviteModalStartup(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={inviteSending} style={{ backgroundColor: '#0A2540' }}>
                  <Send size={15} />
                  <span>{inviteSending ? 'Sending Invitation...' : 'Send Challenge Invitation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovtStartupDiscoveryTab;

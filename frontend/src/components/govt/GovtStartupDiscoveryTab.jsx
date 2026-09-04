import React, { useState } from 'react';
import { Search, Building, ShieldCheck, FileCheck, CheckCircle2, ExternalLink, Sparkles, Eye } from 'lucide-react';
import { formatText } from '../../utils/textUtils';

export const GovtStartupDiscoveryTab = ({ startups = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [activeDocModal, setActiveDocModal] = useState(null);

  const domains = ['All', 'Healthcare & AI Diagnostics', 'HealthTech & Operations', 'AgriTech & Remote Sensing', 'EdTech & Vernacular AI', 'Agri-Drone & Precision Farming'];

  const filteredStartups = startups.filter(s => {
    const matchesSearch = (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.industryDomain || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.technologies?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDomain = domainFilter === 'All' || s.industryDomain === domainFilter;

    return matchesSearch && matchesDomain;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0A2540' }}>
          Startup Discovery & DPIIT Qualification Portal
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
          Discover DPIIT-verified startups, explore AI semantic match ratings, and inspect uploaded compliance credentials
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={18} color="#64748B" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            placeholder="Search startups by name, domain, or technology..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <select
          value={domainFilter}
          onChange={e => setDomainFilter(e.target.value)}
          className="form-select"
          style={{ width: 'auto', minWidth: '220px' }}
        >
          {domains.map(d => (
            <option key={d} value={d}>{formatText(d)}</option>
          ))}
        </select>
      </div>

      {/* Startups Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredStartups.map((s) => (
          <div key={s._id} className="gov-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540' }}>{formatText(s.name)}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>{formatText(s.industryDomain)}</span>
                </div>
                <span className="badge badge-dpiit">
                  <ShieldCheck size={14} /> {formatText(s.verificationStatus)}
                </span>
              </div>

              {/* Specs Grid */}
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.75rem', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#64748B' }}>DPIIT Number:</span>
                  <strong style={{ color: '#0A2540' }}>{s.dpiitNumber}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#64748B' }}>Location:</span>
                  <strong>{formatText(s.location)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#64748B' }}>Team Size & Year:</span>
                  <span>{s.teamSize} members ({s.foundingYear})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem' }}>
                  <span style={{ color: '#64748B' }}>AI Compatibility Score:</span>
                  <strong style={{ color: '#059669' }}>{s.matchScore}% Match</strong>
                </div>
              </div>

              {/* Technologies */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                {s.technologies?.map((tech, idx) => (
                  <span key={idx} style={{ backgroundColor: '#EFF6FF', color: '#1E3A8A', fontSize: '0.725rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {formatText(tech)}
                  </span>
                ))}
              </div>

              {/* Previous Govt Projects */}
              {s.previousGovtProjects && s.previousGovtProjects.length > 0 && (
                <div style={{ fontSize: '0.775rem', color: '#475569', marginBottom: '0.85rem' }}>
                  <strong>Govt Projects:</strong> {s.previousGovtProjects.join(', ')}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
              <button
                onClick={() => setSelectedStartup(s)}
                className="btn-secondary"
                style={{ flex: 1, fontSize: '0.775rem', justifyContent: 'center' }}
              >
                <Sparkles size={14} color="#D97706" /> Match Details
              </button>
              <button
                onClick={() => setActiveDocModal(s)}
                className="btn-primary"
                style={{ flex: 1, fontSize: '0.775rem', justifyContent: 'center' }}
              >
                <FileCheck size={14} /> Documents ({s.documents?.length || 0})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Match Rationale Modal */}
      {selectedStartup && (
        <div className="modal-overlay" onClick={() => setSelectedStartup(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540' }}>
                AI Semantic Match Rating — {formatText(selectedStartup.name)}
              </h3>
              <button onClick={() => setSelectedStartup(null)} className="btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#ECFDF5', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#059669' }}>{selectedStartup.matchScore}%</span>
                <div>
                  <h4 style={{ fontWeight: 700, color: '#065F46' }}>DPIIT Qualified High-Match Startup</h4>
                  <p style={{ fontSize: '0.825rem', color: '#047857' }}>Verified against Maharashtra State Innovation Procurement Criteria</p>
                </div>
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>Explainable Match Reasons</h4>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem' }}>
                {selectedStartup.matchJustification?.map((reason, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#334155' }}>
                    {formatText(reason)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal-footer">
              <button onClick={() => setSelectedStartup(null)} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Documents Modal */}
      {activeDocModal && (
        <div className="modal-overlay" onClick={() => setActiveDocModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540' }}>
                Verified Credentials & Documents — {formatText(activeDocModal.name)}
              </h3>
              <button onClick={() => setActiveDocModal(null)} className="btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1rem' }}>
                State Innovation Society verified audit credentials and DPIIT registration certificates
              </p>
              {activeDocModal.documents?.length === 0 ? (
                <p>No documents uploaded.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {activeDocModal.documents?.map((doc, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.85rem' }}>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0A2540' }}>{formatText(doc.title)}</h4>
                        <span className="badge badge-navy" style={{ fontSize: '0.7rem' }}>{formatText(doc.type)}</span>
                      </div>
                      <a href={doc.url} target="_blank" rel="noreferrer" className="btn-secondary" style={{ fontSize: '0.775rem' }}>
                        <ExternalLink size={14} /> Open Document
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => setActiveDocModal(null)} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

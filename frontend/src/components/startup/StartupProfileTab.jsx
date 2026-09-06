import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Upload, 
  Edit3, 
  Save, 
  CheckCircle2, 
  FileText, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  Cpu, 
  ExternalLink,
  Award,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import { formatText } from '../../utils/textUtils';
import { StartupIndiaBadge } from '../Emblems';

export const StartupProfileTab = ({ primaryStartup = {}, onSaveProfile }) => {
  const [activeSubTab, setActiveSubTab] = useState('basic'); // 'basic' | 'company' | 'team' | 'tech' | 'docs'
  const [isEditing, setIsEditing] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('DPIIT Certificate');

  // Form State initialized with primaryStartup or default mock data
  const [profileData, setProfileData] = useState({
    name: primaryStartup.name || 'HealthAI Solutions Pvt Ltd',
    dpiitNumber: primaryStartup.dpiitNumber || 'DIPP10984',
    incorporationDate: primaryStartup.incorporationDate || '2021-04-14',
    cinNumber: primaryStartup.cinNumber || 'U72900PN2021PTC198421',
    industryDomain: primaryStartup.industryDomain || 'Healthcare & MedTech',
    subDomain: 'Hospital Workflow Automation & Computer Vision AI',
    stage: 'Growth / Scale-Stage (DPIIT Recognized)',
    location: primaryStartup.location || 'Pune, Maharashtra',
    address: '402, Synergy Tech Park, Baner-Pashan Link Road, Pune 411045',
    website: primaryStartup.website || 'https://healthai.in',
    contactEmail: primaryStartup.contactEmail || 'admin@healthai.in',
    contactPhone: primaryStartup.contactPhone || '+91 98200 98432',
    teamSize: primaryStartup.teamSize || 28,
    founderName: 'Dr. Vikram Deshmukh',
    founderBio: 'Ex-AIIMS HealthTech Specialist, Ph.D. in Biomedical Computer Vision (IIT Bombay). 12+ years leading AI in healthcare.',
    coFounders: 'Smt. Priya Nair (Ex-Microsoft Cloud Lead), Dr. Rajesh Solanki (Clinical Director)',
    products: primaryStartup.products || ['SmartOPD AI Triage', 'MedVision Imaging Suite', 'PulseCare Remote ICU Monitoring'],
    technologies: primaryStartup.technologies || ['Edge Computer Vision', 'TensorFlow Lite', 'MeitY Health Cloud', 'FHIR/HL7 Compliant APIs'],
    verificationStatus: primaryStartup.verificationStatus || 'DPIIT Verified',
    documents: primaryStartup.documents || [
      { title: 'DPIIT Recognition Certificate', type: 'DPIIT Certificate', number: 'DIPP10984', url: '#', date: '2021-04-20' },
      { title: 'Certificate of Incorporation', type: 'MCA Registration', number: 'U72900PN2021PTC198421', url: '#', date: '2021-04-14' },
      { title: 'GST Registration Certificate', type: 'Tax & Compliance', number: '27AAACH9843K1Z8', url: '#', date: '2021-05-01' },
      { title: 'ISO 27001 Cybersecurity Certification', type: 'Security Audit', number: 'ISO27001-2023-MH84', url: '#', date: '2023-11-10' }
    ]
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    if (onSaveProfile) onSaveProfile(profileData);
    alert('Startup Profile updated successfully!');
  };

  const handleAddDocument = (e) => {
    e.preventDefault();
    if (!newDocName) return;

    const newDoc = {
      title: newDocName,
      type: newDocType,
      number: `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
      url: '#',
      date: new Date().toISOString().split('T')[0]
    };

    setProfileData(prev => ({
      ...prev,
      documents: [...prev.documents, newDoc]
    }));

    setNewDocName('');
    setUploadModalOpen(false);
    alert(`Document "${newDocName}" uploaded successfully.`);
  };

  const handleDeleteDocument = (docIndex) => {
    setProfileData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, idx) => idx !== docIndex)
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner Card: Startup Identity & DPIIT Status */}
      <div className="gov-card" style={{ backgroundColor: '#0A2540', color: '#FFFFFF', border: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Building2 size={28} color="#FF9933" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {profileData.name}
              </h2>
              <StartupIndiaBadge />
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0 }}>
              DPIIT Reg: <strong style={{ color: '#FFFFFF' }}>{profileData.dpiitNumber}</strong> • CIN: {profileData.cinNumber} • Location: {profileData.location}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.5rem 0.85rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="#10B981" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10B981' }}>
                {profileData.verificationStatus}
              </span>
            </div>

            {isEditing ? (
              <button onClick={handleSave} className="btn-emerald">
                <Save size={16} /> Save Profile Changes
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="btn-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }}>
                <Edit3 size={16} /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Section Sub-Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'basic', label: 'Company Info & Contact', icon: Building2 },
          { id: 'team', label: 'Founders & Team', icon: Users },
          { id: 'tech', label: 'Products & Technologies', icon: Cpu },
          { id: 'dpiit', label: 'DPIIT & Exemptions', icon: Award },
          { id: 'docs', label: 'Compliance Documents', icon: FileText, count: profileData.documents.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isActive ? '#0A2540' : 'transparent',
                color: isActive ? '#FFFFFF' : '#475569',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} color={isActive ? '#FF9933' : '#64748B'} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="badge badge-navy" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Form Body */}
      <form onSubmit={handleSave}>
        {/* SUB TAB 1: Company Info & Contact */}
        {activeSubTab === 'basic' && (
          <div className="gov-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={20} color="#0A2540" /> Basic Company & Contact Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Startup Entity Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profileData.name}
                  onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Industry Domain</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profileData.industryDomain}
                  onChange={e => setProfileData({ ...profileData, industryDomain: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sub-Domain / Specialization</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profileData.subDomain}
                  onChange={e => setProfileData({ ...profileData, subDomain: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company Stage</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profileData.stage}
                  onChange={e => setProfileData({ ...profileData, stage: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official Website</label>
                <div style={{ position: 'relative' }}>
                  <Globe size={16} color="#64748B" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                  <input
                    type="url"
                    disabled={!isEditing}
                    value={profileData.website}
                    onChange={e => setProfileData({ ...profileData, website: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '2.25rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#64748B" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={profileData.contactEmail}
                    onChange={e => setProfileData({ ...profileData, contactEmail: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '2.25rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#64748B" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profileData.contactPhone}
                    onChange={e => setProfileData({ ...profileData, contactPhone: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '2.25rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">State & City Location</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} color="#64748B" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profileData.location}
                    onChange={e => setProfileData({ ...profileData, location: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '2.25rem' }}
                  />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '0.5rem' }}>
              <label className="form-label">Registered Office Address</label>
              <textarea
                rows="2"
                disabled={!isEditing}
                value={profileData.address}
                onChange={e => setProfileData({ ...profileData, address: e.target.value })}
                className="form-textarea"
              />
            </div>
          </div>
        )}

        {/* SUB TAB 2: Founders & Team */}
        {activeSubTab === 'team' && (
          <div className="gov-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="#0A2540" /> Founders & Core Team
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Lead Founder & CEO</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profileData.founderName}
                  onChange={e => setProfileData({ ...profileData, founderName: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Total Core Team Size</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  value={profileData.teamSize}
                  onChange={e => setProfileData({ ...profileData, teamSize: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Lead Founder Background & Profile</label>
              <textarea
                rows="3"
                disabled={!isEditing}
                value={profileData.founderBio}
                onChange={e => setProfileData({ ...profileData, founderBio: e.target.value })}
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Co-Founders & Technical Leadership</label>
              <input
                type="text"
                disabled={!isEditing}
                value={profileData.coFounders}
                onChange={e => setProfileData({ ...profileData, coFounders: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
        )}

        {/* SUB TAB 3: Products & Tech Stack */}
        {activeSubTab === 'tech' && (
          <div className="gov-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={20} color="#0A2540" /> Products, IP & Technology Stack
            </h3>

            <div>
              <label className="form-label">Core Flagship Products & Solutions</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                {profileData.products.map((p, idx) => (
                  <span key={idx} className="badge badge-navy" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <label className="form-label">Key Technologies & Infrastructure</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                {profileData.technologies.map((t, idx) => (
                  <span key={idx} className="badge badge-saffron" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUB TAB 4: DPIIT & Exemptions */}
        {activeSubTab === 'dpiit' && (
          <div className="gov-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} color="#0A2540" /> DPIIT Recognition & Maharashtra Exemption Privileges
            </h3>

            <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <CheckCircle2 size={20} color="#166534" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#166534', margin: 0 }}>
                  Verified DPIIT Recognized Startup Entity
                </h4>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#15803D', margin: 0, lineHeight: 1.5 }}>
                Under Maharashtra State Innovation Procurement Rules (Government Resolution 2024), this startup is entitled to:
              </p>
              <ul style={{ fontSize: '0.8rem', color: '#166534', margin: '0.5rem 0 0 1.25rem', padding: 0 }}>
                <li>100% Exemption from Prior Turnover Requirements in Government Tenders</li>
                <li>100% Exemption from Prior Experience Criteria for Innovation Pilots</li>
                <li>100% Earnest Money Deposit (EMD) Waiver</li>
                <li>Direct Eligibility for Outcome-Based Trial Milestones</li>
              </ul>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">DPIIT Recognition Number</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profileData.dpiitNumber}
                  onChange={e => setProfileData({ ...profileData, dpiitNumber: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Incorporation CIN Number</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profileData.cinNumber}
                  onChange={e => setProfileData({ ...profileData, cinNumber: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUB TAB 5: Compliance Documents */}
        {activeSubTab === 'docs' && (
          <div className="gov-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="#0A2540" /> Uploaded Verification Documents
              </h3>
              <button 
                type="button"
                onClick={() => setUploadModalOpen(true)}
                className="btn-primary" 
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
              >
                <Upload size={14} /> Upload / Replace Document
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {profileData.documents.map((doc, idx) => (
                <div key={idx} style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ backgroundColor: '#EFF6FF', padding: '0.5rem', borderRadius: '50%' }}>
                      <FileText size={20} color="#1E3A8A" />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: '#0A2540', display: 'block' }}>
                        {doc.title}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {doc.type} • Ref: {doc.number} • Uploaded: {doc.date}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-emerald" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      Verified <CheckCircle2 size={12} />
                    </span>
                    <a href={doc.url} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                      View Document <ExternalLink size={12} />
                    </a>
                    {isEditing && (
                      <button 
                        type="button" 
                        onClick={() => handleDeleteDocument(idx)} 
                        style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '0.25rem' }}
                        title="Remove Document"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Upload Document Modal */}
      {uploadModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                Upload Compliance Document
              </h3>
              <button onClick={() => setUploadModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748B" />
              </button>
            </div>

            <form onSubmit={handleAddDocument}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Document Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Audited Balance Sheet 2024"
                    value={newDocName}
                    onChange={e => setNewDocName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Document Category</label>
                  <select
                    value={newDocType}
                    onChange={e => setNewDocType(e.target.value)}
                    className="form-select"
                  >
                    <option value="DPIIT Certificate">DPIIT Certificate</option>
                    <option value="MCA Registration">MCA Registration</option>
                    <option value="Tax & Compliance">Tax & GST Compliance</option>
                    <option value="Security Audit">Security & ISO Audit</option>
                    <option value="Pitch Deck / Specs">Pitch Deck & Tech Specs</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Select File (PDF / DOCX)</label>
                  <input
                    type="file"
                    className="form-input"
                    accept=".pdf,.docx,.png,.jpg"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setUploadModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-emerald">
                  Upload & Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartupProfileTab;

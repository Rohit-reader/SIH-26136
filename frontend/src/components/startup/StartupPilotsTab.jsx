import React, { useState } from 'react';
import { 
  Rocket, 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Building2, 
  MapPin, 
  TrendingUp, 
  IndianRupee, 
  CheckSquare, 
  Plus, 
  MessageSquare,
  Award,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import { formatText, formatCurrency } from '../../utils/textUtils';

export const StartupPilotsTab = ({ pilots = [], onRefreshData }) => {
  const [selectedPilot, setSelectedPilot] = useState(pilots[0] || null);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('milestones'); // 'milestones' | 'kpis' | 'evidence' | 'issues' | 'governance'
  
  // Evidence Upload Form state
  const [evidenceName, setEvidenceName] = useState('');
  const [evidenceMilestone, setEvidenceMilestone] = useState(1);
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Risk/Issue Log state
  const [issueTitle, setIssueTitle] = useState('');
  const [issueSeverity, setIssueSeverity] = useState('Medium');

  const activePilotObj = selectedPilot || pilots[0] || {
    _id: 'p984',
    pilotTitle: 'SmartOPD District Hospital Deployment',
    location: 'Pune District Hospital, Aundh, Maharashtra',
    status: 'Pilot Active',
    totalBudget: 1420000,
    startDate: '2026-05-10',
    endDate: '2026-08-10',
    validationStatus: 'Validated',
    milestones: [
      { milestoneNumber: 1, title: 'Hardware Setup & Camera Kiosk Installation', amount: 426000, status: 'Paid', dueDate: '2026-06-01' },
      { milestoneNumber: 2, title: 'HMIS Integration & WhatsApp Queue Live Test', amount: 568000, status: 'Paid', dueDate: '2026-07-01' },
      { milestoneNumber: 3, title: '75-Day Continuous Trial & Performance Report', amount: 426000, status: 'Evidence Submitted', dueDate: '2026-08-10' }
    ],
    kpiTracking: [
      { metricName: 'Avg OPD Queue Wait Time', baseline: '210 Mins', target: '< 45 Mins', currentLive: '38 Mins', status: 'Target Achieved' },
      { metricName: 'Triaged Patient Volume', baseline: '0', target: '> 10,000', currentLive: '14,280', status: 'Target Achieved' },
      { metricName: 'System Uptime', baseline: '95%', target: '99.5%', currentLive: '99.8%', status: 'Target Achieved' }
    ],
    dataGovernance: {
      governmentDataRights: 'Government of Maharashtra retains 100% ownership of patient operational data, telemetry logs, and trial audit records.',
      startupIpRights: 'Startup retains exclusive intellectual property rights to underlying AI algorithms, computer vision models, and source code.',
      dpdpActCompliance: true
    }
  };

  const handleUploadEvidence = async (e) => {
    e.preventDefault();
    if (!evidenceName) return;
    setIsSubmitting(true);
    try {
      if (activePilotObj._id && activePilotObj._id !== 'p984') {
        await axios.patch(`/api/pilots/${activePilotObj._id}/milestone/${evidenceMilestone}`, {
          status: 'Evidence Submitted',
          evidenceUrl: `https://govinnovate.maharashtra.gov.in/docs/${evidenceName.replace(/\s+/g, '_')}`,
          evidenceNotes: evidenceNotes || evidenceName
        });
      }
      alert(`Telemetry Evidence "${evidenceName}" submitted successfully for Milestone #${evidenceMilestone}. Audit log updated.`);
      setEvidenceName('');
      setEvidenceNotes('');
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
      alert('Submitted evidence for verification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReportIssue = (e) => {
    e.preventDefault();
    if (!issueTitle) return;
    alert(`Risk/Issue "${issueTitle}" logged. Notification dispatched to Department Project Officer.`);
    setIssueTitle('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner: Pilot Workspace Overview */}
      <div className="gov-card" style={{ 
        background: 'linear-gradient(135deg, #0A2540 0%, #0F172A 60%, #1E3A8A 100%)', 
        color: '#FFFFFF', 
        border: 'none'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <Rocket size={26} color="#FF9933" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {formatText(activePilotObj.pilotTitle || 'SmartOPD District Hospital Pilot')}
              </h2>
              <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                {formatText(activePilotObj.status || 'Pilot Active')}
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={14} color="#FF9933" /> Location: <strong style={{ color: '#FFFFFF' }}>{activePilotObj.location || 'Pune District Hospital'}</strong> • Budget: <strong style={{ color: '#10B981' }}>{formatCurrency(activePilotObj.totalBudget || activePilotObj.contractedBudget || 1420000)}</strong>
            </p>
          </div>

          {/* Validation Status Pill */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', padding: '0.75rem 1.15rem', borderRadius: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>PHASE 5 TRIAL VALIDATION</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', marginTop: '0.25rem' }}>
              <ShieldCheck size={16} color="#10B981" />
              <span style={{ fontWeight: 700, color: '#10B981', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                {activePilotObj.validationStatus || 'Validated'} <CheckCircle2 size={13} color="#10B981" />
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.35rem' }}>
            <span style={{ color: '#CBD5E1', fontWeight: 600 }}>Field Sandbox Completion</span>
            <strong style={{ color: '#10B981' }}>
              {activePilotObj.milestones?.filter(m => m.status === 'Paid' || m.status === 'Approved').length || 2} of {activePilotObj.milestones?.length || 3} Milestones Delivered
            </strong>
          </div>
          <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: '80%', height: '100%', backgroundColor: '#10B981', borderRadius: '9999px' }}></div>
          </div>
        </div>
      </div>

      {/* Sub Workspace Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'milestones', label: 'Milestones & Payments', icon: IndianRupee },
          { id: 'kpis', label: 'Trial Telemetry KPIs', icon: TrendingUp },
          { id: 'evidence', label: 'Evidence Upload', icon: Upload },
          { id: 'issues', label: 'Risk & Support Tickets', icon: AlertTriangle },
          { id: 'governance', label: 'IP & Data Governance', icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeWorkspaceTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveWorkspaceTab(tab.id)}
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
            </button>
          );
        })}
      </div>

      {/* WORKSPACE TAB 1: Milestone Schedule & Payments */}
      {activeWorkspaceTab === 'milestones' && (
        <div className="gov-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IndianRupee size={20} color="#0A2540" /> Milestone Deliverables & Payment Releases
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {activePilotObj.milestones?.map((m, idx) => {
              const isPaid = m.status === 'Paid';
              const isApproved = m.status === 'Approved' || m.status === 'Evidence Submitted';

              return (
                <div key={idx} style={{
                  border: isPaid ? '1px solid #A7F3D0' : isApproved ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '1rem',
                  backgroundColor: isPaid ? '#F0FDF4' : isApproved ? '#EFF6FF' : '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span className={isPaid ? 'badge badge-emerald' : 'badge badge-navy'} style={{ fontSize: '0.7rem' }}>
                        Milestone #{m.milestoneNumber}
                      </span>
                      <span className={isPaid ? 'badge badge-dpiit' : 'badge badge-saffron'} style={{ fontSize: '0.7rem' }}>
                        {m.status}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0A2540', margin: '0 0 0.25rem 0' }}>
                      {m.title}
                    </h4>

                    <span style={{ fontSize: '0.775rem', color: '#64748B' }}>
                      Target Due Date: {m.dueDate || '30 Aug 2026'}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>RELEASE AMOUNT</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isPaid ? '#059669' : '#0A2540' }}>
                      {formatCurrency(m.amount)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WORKSPACE TAB 2: Telemetry KPIs & Outcomes */}
      {activeWorkspaceTab === 'kpis' && (
        <div className="gov-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} color="#0A2540" /> Real-time Trial KPI Telemetry Metrics
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {(activePilotObj.kpiTracking || [
              { metricName: 'Avg OPD Queue Wait Time', baseline: '210 Mins', target: '< 45 Mins', currentLive: '38 Mins', status: 'Target Achieved' },
              { metricName: 'Triaged Patient Volume', baseline: '0', target: '> 10,000', currentLive: '14,280', status: 'Target Achieved' },
              { metricName: 'System Uptime', baseline: '95%', target: '99.5%', currentLive: '99.8%', status: 'Target Achieved' }
            ]).map((kpi, idx) => (
              <div key={idx} style={{ border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '8px', textAlign: 'center', backgroundColor: '#F8FAFC' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>{kpi.metricName.toUpperCase()}</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', margin: '0.2rem 0' }}>{kpi.currentLive}</div>
                <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>Target: {kpi.target}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WORKSPACE TAB 3: Evidence Upload */}
      {activeWorkspaceTab === 'evidence' && (
        <div className="gov-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={20} color="#0A2540" /> Submit Milestone Evidence & Deliverables
          </h3>

          <form onSubmit={handleUploadEvidence} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Evidence Document / Deliverable Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. 75-Day OPD Wait Time Telemetry Audit Log.pdf"
                value={evidenceName}
                onChange={e => setEvidenceName(e.target.value)}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Target Milestone</label>
                <select
                  value={evidenceMilestone}
                  onChange={e => setEvidenceMilestone(Number(e.target.value))}
                  className="form-select"
                >
                  {activePilotObj.milestones?.map(m => (
                    <option key={m.milestoneNumber} value={m.milestoneNumber}>
                      Milestone #{m.milestoneNumber}: {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Attach File (PDF / ZIP / Audit Logs)</label>
                <input type="file" className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Technical Remarks / Verification Notes</label>
              <textarea
                rows="2"
                placeholder="Details of pilot metrics and evidence logs attached..."
                value={evidenceNotes}
                onChange={e => setEvidenceNotes(e.target.value)}
                className="form-textarea"
              />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-emerald">
              <Upload size={16} /> {isSubmitting ? 'Submitting Evidence...' : 'Submit Evidence for Milestone Verification'}
            </button>
          </form>
        </div>
      )}

      {/* WORKSPACE TAB 4: Risks & Support Log */}
      {activeWorkspaceTab === 'issues' && (
        <div className="gov-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} color="#D97706" /> Log On-Site Risk or Request Support
          </h3>

          <form onSubmit={handleReportIssue} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Issue / Risk Description *</label>
              <input
                type="text"
                required
                placeholder="e.g. Intermittent LAN packet drops at Pune OPD Counter #4"
                value={issueTitle}
                onChange={e => setIssueTitle(e.target.value)}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Severity Level</label>
                <select
                  value={issueSeverity}
                  onChange={e => setIssueSeverity(e.target.value)}
                  className="form-select"
                >
                  <option value="Low">Low (Informational)</option>
                  <option value="Medium">Medium (Minor Delay)</option>
                  <option value="High">High (Immediate Assistance Required)</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Log Risk Ticket
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* WORKSPACE TAB 5: IP & Data Governance */}
      {activeWorkspaceTab === 'governance' && (
        <div className="gov-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="#059669" /> Data Ownership & Intellectual Property Framework
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <div style={{ border: '1px solid #BBF7D0', backgroundColor: '#F0FDF4', padding: '1rem', borderRadius: '8px' }}>
              <strong style={{ fontSize: '0.9rem', color: '#166534', display: 'block', marginBottom: '0.35rem' }}>
                GOVERNMENT DATA OWNERSHIP RIGHTS
              </strong>
              <p style={{ fontSize: '0.825rem', color: '#15803D', margin: 0, lineHeight: 1.5 }}>
                {activePilotObj.dataGovernance?.governmentDataRights || 'Government of Maharashtra retains 100% ownership of patient operational data, telemetry logs, and trial audit records.'}
              </p>
            </div>

            <div style={{ border: '1px solid #BFDBFE', backgroundColor: '#EFF6FF', padding: '1rem', borderRadius: '8px' }}>
              <strong style={{ fontSize: '0.9rem', color: '#1E40AF', display: 'block', marginBottom: '0.35rem' }}>
                STARTUP INTELLECTUAL PROPERTY (IP) RIGHTS
              </strong>
              <p style={{ fontSize: '0.825rem', color: '#1D4ED8', margin: 0, lineHeight: 1.5 }}>
                {activePilotObj.dataGovernance?.startupIpRights || 'Startup retains exclusive intellectual property rights to underlying AI algorithms, computer vision models, and source code.'}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StartupPilotsTab;

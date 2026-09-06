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
  DollarSign, 
  CheckSquare, 
  Plus, 
  MessageSquare,
  Award,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { formatText, formatCurrency } from '../../utils/textUtils';

export const StartupPilotsTab = ({ pilots = [], onRefreshData }) => {
  const [selectedPilot, setSelectedPilot] = useState(pilots[0] || null);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('milestones'); // 'milestones' | 'kpis' | 'evidence' | 'issues'
  
  // Evidence Upload Form state
  const [evidenceName, setEvidenceName] = useState('');
  const [evidenceMilestone, setEvidenceMilestone] = useState(1);
  const [evidenceNotes, setEvidenceNotes] = useState('');

  // Risk/Issue Log state
  const [issueTitle, setIssueTitle] = useState('');
  const [issueSeverity, setIssueSeverity] = useState('Medium');

  const activePilotObj = selectedPilot || pilots[0] || {
    pilotTitle: 'SmartOPD District Hospital Deployment',
    location: 'Pune District Hospital, Aundh, Maharashtra',
    status: 'In Progress',
    contractedBudget: 1420000,
    startDate: '2026-05-10',
    endDate: '2026-08-10',
    validationStatus: 'Under Active Evaluation',
    milestones: [
      { milestoneNumber: 1, title: 'Hardware Setup & Camera Kiosk Installation', amount: 426000, status: 'Paid', dueDate: '2026-06-01' },
      { milestoneNumber: 2, title: 'HMIS Integration & WhatsApp Queue Live Test', amount: 568000, status: 'Paid', dueDate: '2026-07-01' },
      { milestoneNumber: 3, title: '75-Day Continuous Trial & Performance Report', amount: 426000, status: 'In Progress', dueDate: '2026-08-10' }
    ]
  };

  const handleUploadEvidence = (e) => {
    e.preventDefault();
    if (!evidenceName) return;
    alert(`Telemetry Evidence "${evidenceName}" submitted successfully for Milestone #${evidenceMilestone}. Audit log updated.`);
    setEvidenceName('');
    setEvidenceNotes('');
  };

  const handleReportIssue = (e) => {
    e.preventDefault();
    if (!issueTitle) return;
    alert(`Risk/Issue "${issueTitle}" logged. Notification sent to Department Project Officer.`);
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
              <Rocket size={26} color="#FF9933" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {formatText(activePilotObj.pilotTitle || 'SmartOPD District Hospital Pilot')}
              </h2>
              <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                {formatText(activePilotObj.status || 'In Progress')}
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={14} color="#FF9933" /> Location: <strong style={{ color: '#FFFFFF' }}>{activePilotObj.location || 'Pune District Hospital'}</strong> • Start Date: {activePilotObj.startDate || 'May 2026'}
            </p>
          </div>

          {/* Validation Status Pill */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', padding: '0.75rem 1.15rem', borderRadius: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>QUALITY CONTROL BOARD VALIDATION</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', marginTop: '0.25rem' }}>
              <ShieldCheck size={16} color="#10B981" />
              <span style={{ fontWeight: 700, color: '#10B981', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                {activePilotObj.validationStatus || <>Field Audit Passed <CheckCircle2 size={13} color="#10B981" /></>}
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.35rem' }}>
            <span style={{ color: '#CBD5E1', fontWeight: 600 }}>Field Trial Completion</span>
            <strong style={{ color: '#10B981' }}>2 of 3 Milestones Delivered (70%)</strong>
          </div>
          <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: '70%', height: '100%', backgroundColor: '#10B981', borderRadius: '9999px' }}></div>
          </div>
        </div>
      </div>

      {/* Sub Workspace Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'milestones', label: 'Milestone Schedule & Payments', icon: DollarSign },
          { id: 'kpis', label: 'Telemetry KPIs & Outcomes', icon: TrendingUp },
          { id: 'evidence', label: 'Evidence & Deliverables Upload', icon: Upload },
          { id: 'issues', label: 'Risks & Support Log', icon: AlertTriangle }
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
            <DollarSign size={20} color="#0A2540" /> Contracted Milestones & Payment Track
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {activePilotObj.milestones?.map((m, idx) => {
              const isPaid = m.status === 'Paid';
              const isInProgress = m.status === 'In Progress' || m.status === 'Approved';

              return (
                <div key={idx} style={{
                  border: isPaid ? '1px solid #A7F3D0' : isInProgress ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '1rem',
                  backgroundColor: isPaid ? '#F0FDF4' : isInProgress ? '#EFF6FF' : '#FFFFFF',
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
            <div style={{ border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '8px', textAlign: 'center', backgroundColor: '#F8FAFC' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>AVG OPD WAIT TIME</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', margin: '0.2rem 0' }}>38 Mins</div>
              <span style={{ fontSize: '0.725rem', color: '#059669', fontWeight: 600 }}>↓ 72% Baseline Reduction</span>
            </div>

            <div style={{ border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '8px', textAlign: 'center', backgroundColor: '#F8FAFC' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>TRIAGED PATIENTS</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0A2540', margin: '0.2rem 0' }}>14,280</div>
              <span style={{ fontSize: '0.725rem', color: '#64748B' }}>Across 3 District Hospitals</span>
            </div>

            <div style={{ border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '8px', textAlign: 'center', backgroundColor: '#F8FAFC' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>SYSTEM UPTIME</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#166534', margin: '0.2rem 0' }}>99.8%</div>
              <span style={{ fontSize: '0.725rem', color: '#166534', fontWeight: 600 }}>Zero Data Breaches</span>
            </div>
          </div>
        </div>
      )}

      {/* WORKSPACE TAB 3: Evidence Upload */}
      {activeWorkspaceTab === 'evidence' && (
        <div className="gov-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={20} color="#0A2540" /> Submit Milestone Evidence & Results
          </h3>

          <form onSubmit={handleUploadEvidence} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Evidence Title / Deliverable Name *</label>
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
                  onChange={e => setEvidenceMilestone(e.target.value)}
                  className="form-select"
                >
                  <option value={1}>Milestone #1: Hardware Setup</option>
                  <option value={2}>Milestone #2: HMIS Integration</option>
                  <option value={3}>Milestone #3: 75-Day Performance Report</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Attach File (PDF / ZIP / Logs)</label>
                <input type="file" className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Technical Notes / Verification Remarks</label>
              <textarea
                rows="2"
                placeholder="Details of pilot metrics and evidence logs attached..."
                value={evidenceNotes}
                onChange={e => setEvidenceNotes(e.target.value)}
                className="form-textarea"
              />
            </div>

            <button type="submit" className="btn-emerald">
              <Upload size={16} /> Submit Evidence for Milestone Verification
            </button>
          </form>
        </div>
      )}

      {/* WORKSPACE TAB 4: Risks & Support Log */}
      {activeWorkspaceTab === 'issues' && (
        <div className="gov-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} color="#D97706" /> Log On-Site Risk or Request Technical Support
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

    </div>
  );
};

export default StartupPilotsTab;

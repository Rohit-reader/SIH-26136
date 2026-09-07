import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  IndianRupee, 
  TrendingUp, 
  ChevronRight, 
  Activity,
  LayoutDashboard,
  FileCheck,
  Plus,
  X,
  FileText,
  AlertTriangle,
  ExternalLink,
  MapPin,
  Check
} from 'lucide-react';
import axios from 'axios';
import { formatText, formatCurrency } from '../utils/textUtils';
import { InnovationFunnelChart } from '../components/charts/GovtAnalyticsCharts';
import { EvaluationCriteriaChart } from '../components/charts/RoleAnalyticsCharts';
import { RoleSidebar } from '../components/RoleSidebar';

export const ValidatorView = ({ onRefreshData, currentUser, onLogout, onOpenAudit }) => {
  const { t } = useTranslation();
  const [pilots, setPilots] = useState([]);
  const [validations, setValidations] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field Audit Form State
  const [auditFormData, setAuditFormData] = useState({
    pilotId: '',
    validatorName: 'Dr. Rameshwar Naik',
    validatorOrg: 'Maharashtra State Innovation Society (MSInS) Quality Control Board',
    coiDeclared: true,
    targetSites: '3 District Hospitals (Pune, Nashik, Thane)',
    sampleSize: '14,280 Live OPD Patient Transactions',
    periodCovered: '75-Day Continuous Controlled Pilot Trial',
    verifiedWaitTime: '38 Mins',
    verifiedTriageAccuracy: '97.4%',
    verifiedUptime: '99.8%',
    evidenceQuality: 'High',
    overallValidationScore: 94.6,
    recommendation: 'Recommended for Statewide Scale-Up',
    executiveSummary: 'Independent field audit verifies 72% reduction in OPD wait times with 99.8% system availability, high evidence confidence, and zero cyber vulnerabilities.'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resP, resV] = await Promise.all([
        axios.get('/api/pilots'),
        axios.get('/api/validations')
      ]);
      setPilots(resP.data || []);
      setValidations(resV.data || []);
    } catch (err) {
      console.error('Failed to fetch validator data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConductAudit = async (e) => {
    e.preventDefault();
    if (!auditFormData.pilotId) {
      alert('Please select a target pilot project for audit.');
      return;
    }

    if (!auditFormData.coiDeclared) {
      alert('You must declare No Conflict of Interest before certifying validation.');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post('/api/validations', {
        pilotId: auditFormData.pilotId,
        validatorName: auditFormData.validatorName,
        validatorOrg: auditFormData.validatorOrg,
        coiDeclared: auditFormData.coiDeclared,
        validationScope: {
          targetSites: auditFormData.targetSites,
          sampleSize: auditFormData.sampleSize,
          periodCovered: auditFormData.periodCovered
        },
        kpiVerifications: [
          { metricName: 'Avg OPD Queue Wait Time', baseline: '210 Mins', claimed: '38 Mins', verifiedLive: auditFormData.verifiedWaitTime, variancePct: 0, verificationStatus: 'Verified Pass', evidenceType: 'Server Telemetry Logs' },
          { metricName: 'Emergency Triage Accuracy', baseline: '70%', claimed: '98%', verifiedLive: auditFormData.verifiedTriageAccuracy, variancePct: 0.6, verificationStatus: 'Verified Pass', evidenceType: 'Doctor Inspection Audit' },
          { metricName: 'System Uptime SLA', baseline: '95%', claimed: '99.8%', verifiedLive: auditFormData.verifiedUptime, variancePct: 0, verificationStatus: 'Verified Pass', evidenceType: 'Network Monitoring Logs' }
        ],
        milestoneAudits: [
          { milestoneNumber: 1, deliverableTitle: 'Hardware & Camera Kiosk Setup', auditFinding: 'Verified physical deployment across all 3 district hospitals.', evidenceQuality: auditFormData.evidenceQuality, complianceStatus: 'Compliant' },
          { milestoneNumber: 2, deliverableTitle: 'HMIS & WhatsApp Queue Integration', auditFinding: 'API load test verified with 0 dropped packets.', evidenceQuality: auditFormData.evidenceQuality, complianceStatus: 'Compliant' },
          { milestoneNumber: 3, deliverableTitle: '75-Day Continuous Trial Audit', auditFinding: 'Outcome telemetry matches hospital admission register logs.', evidenceQuality: auditFormData.evidenceQuality, complianceStatus: 'Compliant' }
        ],
        securityAndComplianceAudit: {
          certInPassed: true,
          dpdpDataPrivacyPassed: true,
          vulnerabilityReport: 'Zero high/critical security vulnerabilities detected.',
          slaAchievedPct: 99.8
        },
        overallValidationScore: Number(auditFormData.overallValidationScore),
        recommendation: auditFormData.recommendation,
        executiveSummary: auditFormData.executiveSummary
      });

      alert('Independent Validation Report (IVR) Submitted Successfully! Ready for Phase 8 Scale-Up Decision.');
      setIsAuditModalOpen(false);
      fetchData();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to submit validation report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCertifyReport = async (validationId) => {
    try {
      await axios.patch(`/api/validations/${validationId}/certify`);
      alert('Report formally certified and handed off to Phase 8 Statewide Scale-Up Desk!');
      fetchData();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
      alert('Failed to certify report.');
    }
  };

  const currentPilot = pilots[0] || {};
  const currentValidation = validations[0] || null;

  const sidebarItems = [
    { id: 'dashboard', label: formatText('Validation Console'), icon: LayoutDashboard },
    { id: 'ivr', label: formatText('Validation Reports (IVR)'), icon: FileCheck, count: validations.length },
    { id: 'audits', label: formatText('Empirical KPI Audits'), icon: CheckCircle2, count: pilots.length },
    { id: 'coi', label: formatText('COI Declarations'), icon: ShieldCheck, count: validations.filter(v => v.coiDeclared).length }
  ];

  return (
    <div className="govt-layout">
      {/* Persistent Independent Validator Sidebar */}
      <RoleSidebar
        title="VALIDATOR PORTAL"
        subtitle={currentUser?.name || 'Independent Validator'}
        items={sidebarItems}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        currentUser={currentUser}
        onLogout={onLogout}
        onOpenAudit={onOpenAudit}
      />

      {/* Main Content Area */}
      <section className="govt-content-area">
        {/* Header Banner */}
        <div className="gov-card" style={{ backgroundColor: '#0A2540', color: '#FFFFFF', marginBottom: '1.5rem', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <ShieldCheck size={26} color="#FF9933" />
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {formatText('Phase 7 — Independent Quality & Evidence Validation Board')}
                </h2>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
                {formatText('Lead Validator')}: <strong style={{ color: '#FFFFFF' }}>{currentUser?.name || 'Dr. Rameshwar Naik'}</strong> • {formatText('Maharashtra State Innovation Society (MSInS)')}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '0.65rem 1.15rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>{formatText('Validation Index')}</span>
                <div style={{ fontWeight: 800, color: '#10B981', fontSize: '1.25rem', marginTop: '0.1rem' }}>
                  {currentValidation?.overallValidationScore ?? '—'} / 100
                </div>
              </div>

              <button onClick={() => {
                setAuditFormData({
                  ...auditFormData,
                  pilotId: currentPilot._id || ''
                });
                setIsAuditModalOpen(true);
              }} className="btn-emerald">
                <Plus size={16} /> {formatText('Conduct Independent Audit')}
              </button>
            </div>
          </div>
        </div>

        {/* Multi-Criteria Scoring & Funnel Charts */}
        {(activeTab === 'dashboard' || activeTab === 'audits') && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <InnovationFunnelChart 
              challengesCount={0}
              proposalsCount={0}
              evaluationsCount={0}
              pilotsCount={pilots.length}
              scaledCount={validations.filter(v => v.recommendation === 'Recommended for Statewide Scale-Up').length}
            />
            <EvaluationCriteriaChart 
              scores={{
                technicalFeasibility: 95,
                innovation: 96,
                expectedImpact: 98,
                scalability: 92,
                costEffectiveness: 90,
                security: 98,
                teamCapability: 94
              }} 
            />
          </div>
        )}

        {/* Independent Validation Reports (IVR) List */}
        {(activeTab === 'dashboard' || activeTab === 'ivr' || activeTab === 'audits') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A2540', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCheck size={20} color="#0A2540" /> Official Independent Validation Reports (IVR)
            </h3>

            {validations.length === 0 ? (
              <div className="gov-card" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
                <FileCheck size={36} color="#CBD5E1" style={{ marginBottom: '0.5rem' }} />
                <p style={{ margin: 0 }}>No validation reports submitted yet. Conduct an independent audit to generate an IVR.</p>
              </div>
            ) : validations.map(ivr => (
              <div key={ivr._id} className="gov-card" style={{ borderLeft: '4px solid #059669' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-emerald">{ivr.reportNumber}</span>
                      <span className="badge badge-navy">Quality Board Certified</span>
                      <span className="badge badge-saffron">{ivr.startupId?.name || ivr.startupName || 'HealthAI Solutions Pvt Ltd'}</span>
                    </div>

                    <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0A2540', margin: '0 0 0.2rem 0' }}>
                      {ivr.pilotId?.pilotTitle || ivr.pilotTitle || 'SmartOPD District Hospital Deployment'}
                    </h4>
                    <p style={{ fontSize: '0.825rem', color: '#64748B', margin: 0 }}>
                      Audited by: <strong>{ivr.validatorName}</strong> ({ivr.validatorOrg}) • Scope: {ivr.validationScope?.targetSites}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669' }}>{ivr.overallValidationScore} / 100</span>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748B' }}>VALIDATION CONFIDENCE SCORE</span>
                  </div>
                </div>

                {/* Executive Summary Card */}
                <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.825rem', color: '#166534' }}>
                  <strong style={{ display: 'block', marginBottom: '0.2rem' }}>EXECUTIVE VALIDATION FINDING:</strong>
                  {ivr.executiveSummary}
                </div>

                {/* Empirical KPI Verification Matrix */}
                <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.65rem' }}>
                  Empirical KPI Telemetry Audit & Verification Matrix
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                  {(ivr.kpiVerifications || []).map((kpi, idx) => (
                    <div key={idx} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                      <strong style={{ color: '#0A2540', display: 'block', marginBottom: '0.25rem' }}>{kpi.metricName}</strong>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                        <span>Baseline: {kpi.baseline}</span>
                        <span>Claimed: {kpi.claimed}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                        <strong style={{ color: '#059669', fontSize: '0.9rem' }}>Verified: {kpi.verifiedLive}</strong>
                        <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>✓ Pass</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommendation & Handoff Action */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Official Recommendation:</span>
                    <span className="badge badge-navy" style={{ fontSize: '0.8rem' }}>
                      {ivr.recommendation}
                    </span>
                  </div>

                  <button 
                    onClick={() => handleCertifyReport(ivr._id)} 
                    className="btn-emerald"
                    style={{ fontSize: '0.825rem', padding: '0.45rem 0.95rem' }}
                  >
                    <TrendingUp size={15} /> Certify & Hand off to Phase 8 Scale-Up Desk →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* Conduct Independent Field Audit Modal */}
      {isAuditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAuditModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '750px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540' }}>Conduct Independent Field Audit & Generate IVR</h3>
              <button onClick={() => setIsAuditModalOpen(false)} className="btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleConductAudit}>
              <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                
                {/* Conflict of Interest Checkbox */}
                <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={auditFormData.coiDeclared}
                      onChange={e => setAuditFormData({ ...auditFormData, coiDeclared: e.target.checked })}
                      style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#059669' }}
                    />
                    <div>
                      <strong style={{ color: '#065F46', fontSize: '0.875rem', display: 'block' }}>
                        Mandatory Conflict of Interest (COI) Declaration
                      </strong>
                      <span style={{ fontSize: '0.775rem', color: '#047857' }}>
                        "I declare that the Quality Control Board has no commercial interest in the audited startup entity."
                      </span>
                    </div>
                  </label>
                </div>

                <div className="form-group">
                  <label className="form-label">Select Pilot Project for Audit *</label>
                  <select
                    value={auditFormData.pilotId}
                    onChange={e => setAuditFormData({ ...auditFormData, pilotId: e.target.value })}
                    className="form-select"
                    required
                  >
                    <option value="">-- Choose Pilot --</option>
                    {pilots.map(p => (
                      <option key={p._id} value={p._id}>
                        {formatText(p.pilotTitle)} ({formatText(p.location)})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Audited OPD Wait Time *</label>
                    <input
                      type="text"
                      required
                      value={auditFormData.verifiedWaitTime}
                      onChange={e => setAuditFormData({ ...auditFormData, verifiedWaitTime: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Audited Triage Accuracy *</label>
                    <input
                      type="text"
                      required
                      value={auditFormData.verifiedTriageAccuracy}
                      onChange={e => setAuditFormData({ ...auditFormData, verifiedTriageAccuracy: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Overall Validation Score (0-100) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={auditFormData.overallValidationScore}
                      onChange={e => setAuditFormData({ ...auditFormData, overallValidationScore: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Validation Recommendation *</label>
                    <select
                      value={auditFormData.recommendation}
                      onChange={e => setAuditFormData({ ...auditFormData, recommendation: e.target.value })}
                      className="form-select"
                    >
                      <option value="Recommended for Statewide Scale-Up">Recommended for Statewide Scale-Up</option>
                      <option value="Recommended with Minor Conditions">Recommended with Minor Conditions</option>
                      <option value="Requires Further Trial/Evidence">Requires Further Trial/Evidence</option>
                      <option value="Not Recommended for Procurement">Not Recommended for Procurement</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Executive Validation Summary *</label>
                  <textarea
                    rows="3"
                    required
                    value={auditFormData.executiveSummary}
                    onChange={e => setAuditFormData({ ...auditFormData, executiveSummary: e.target.value })}
                    className="form-textarea"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsAuditModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? 'Submitting IVR...' : 'Submit Independent Validation Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidatorView;

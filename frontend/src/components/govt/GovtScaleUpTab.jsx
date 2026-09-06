import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Plus, 
  MapPin, 
  Building, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  FileText, 
  Award, 
  AlertTriangle, 
  ShoppingBag, 
  DollarSign, 
  Users, 
  Clock, 
  Filter, 
  ExternalLink, 
  Check, 
  PauseCircle, 
  PlayCircle, 
  RefreshCw, 
  Lock, 
  Download, 
  HelpCircle,
  BarChart3,
  Sliders,
  Layers,
  History,
  Info
} from 'lucide-react';
import axios from 'axios';
import { formatText, formatCurrency } from '../../utils/textUtils';

export const GovtScaleUpTab = ({ 
  scaleUps = [], 
  scaleDecisions = [], 
  pilots = [], 
  challenges = [],
  startups = [],
  currentUser,
  onRefresh 
}) => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [activeDossierTab, setActiveDossierTab] = useState('overview'); // 'overview' | 'evidence' | 'readiness' | 'procurement' | 'decision' | 'scaleplan' | 'deployments' | 'package' | 'history'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false);
  const [selectedPilotForInitiation, setSelectedPilotForInitiation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Evidence state for deep dive
  const [aggregatedEvidence, setAggregatedEvidence] = useState(null);
  const [loadingEvidence, setLoadingEvidence] = useState(false);

  // Decision Form State
  const [decisionAction, setDecisionAction] = useState('SCALE_AND_PROCURE');
  const [decisionRationale, setDecisionRationale] = useState('');
  const [overrideReason, setOverrideReason] = useState('');

  // Condition Form State
  const [newCondition, setNewCondition] = useState({
    description: '',
    owner: 'Startup',
    dueDate: '',
    isRequired: true
  });

  // Deployment Form State
  const [newDeployment, setNewDeployment] = useState({
    location: '',
    department: 'Department of Public Health',
    targetUsers: '100,000 Beneficiaries',
    budgetAllocated: 5000000,
    startDate: '',
    endDate: '',
    owner: 'District Officer'
  });

  // Procurement Reference State
  const [newProcRef, setNewProcRef] = useState({
    pathway: 'GEM_STARTUP_RUNWAY',
    marketplace: 'Government e-Marketplace (GeM)',
    sellerId: '',
    listingId: '',
    procurementRefNumber: '',
    orderRef: '',
    notes: ''
  });

  // Scale Readiness Edit State
  const [editableReadiness, setEditableReadiness] = useState([]);

  // Scale Plan Edit State
  const [editableScalePlan, setEditableScalePlan] = useState(null);

  // When a case is selected, fetch full aggregated evidence
  useEffect(() => {
    if (selectedCase) {
      fetchCaseEvidence(selectedCase._id);
      setDecisionAction(selectedCase.finalDecision?.decision || selectedCase.recommendation?.decision || 'SCALE_AND_PROCURE');
      setDecisionRationale(selectedCase.finalDecision?.rationale || selectedCase.recommendation?.rationale || '');
      setEditableReadiness(selectedCase.scaleReadiness?.categories || []);
      setEditableScalePlan(selectedCase.scaleUpPlan || {});
    }
  }, [selectedCase]);

  const fetchCaseEvidence = async (caseId) => {
    setLoadingEvidence(true);
    try {
      const res = await axios.get(`/api/scale-decisions/${caseId}/evidence`);
      setAggregatedEvidence(res.data);
    } catch (err) {
      console.error('Error fetching evidence:', err);
    } finally {
      setLoadingEvidence(false);
    }
  };

  const handleInitiateDecisionCase = async (e) => {
    e.preventDefault();
    if (!selectedPilotForInitiation) {
      alert('Please select a validated pilot to initiate scale decision.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await axios.post('/api/scale-decisions', {
        pilotId: selectedPilotForInitiation,
        actorName: currentUser?.name || 'Government Admin',
        actorRole: currentUser?.roleName || 'Government Officer'
      });
      alert(`Scale-Up Decision Case ${res.data.decisionId} created successfully!`);
      setIsInitiateModalOpen(false);
      setSelectedPilotForInitiation('');
      if (onRefresh) onRefresh();
      setSelectedCase(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to initiate decision case');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateReadinessScore = async () => {
    if (!selectedCase) return;
    try {
      const res = await axios.post(`/api/scale-decisions/${selectedCase._id}/readiness`, {
        categories: editableReadiness,
        actorName: currentUser?.name || 'Readiness Reviewer'
      });
      setSelectedCase(res.data);
      alert(`Scale Readiness updated successfully! New Score: ${res.data.scaleReadiness?.overallScore}/100`);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to update scale readiness');
    }
  };

  const handleRecordAuthorizedDecision = async (e) => {
    e.preventDefault();
    if (!decisionRationale) {
      alert('Mandatory decision rationale is required.');
      return;
    }
    try {
      const res = await axios.post(`/api/scale-decisions/${selectedCase._id}/approve`, {
        decision: decisionAction,
        rationale: decisionRationale,
        overrideReason: overrideReason,
        actorName: currentUser?.name || 'Authorized Decision Maker',
        actorRole: currentUser?.roleName || 'Principal Secretary'
      });
      setSelectedCase(res.data);
      alert(`Authorized decision "${decisionAction}" recorded successfully with status "${res.data.status}".`);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to record decision');
    }
  };

  const handleAddCondition = async (e) => {
    e.preventDefault();
    if (!newCondition.description) return;
    try {
      const res = await axios.post(`/api/scale-decisions/${selectedCase._id}/conditions`, {
        ...newCondition,
        actorName: currentUser?.name || 'Government Officer'
      });
      setSelectedCase(res.data);
      setNewCondition({ description: '', owner: 'Startup', dueDate: '', isRequired: true });
      alert('Condition added successfully.');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to add condition');
    }
  };

  const handleUpdateConditionStatus = async (condId, status) => {
    try {
      const res = await axios.patch(`/api/scale-decisions/${selectedCase._id}/conditions/${condId}`, {
        status,
        actorName: currentUser?.name || 'Government Officer'
      });
      setSelectedCase(res.data);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to update condition status');
    }
  };

  const handleToggleGate = async (gateNumber, currentStatus) => {
    const nextStatus = currentStatus === 'PASSED' ? 'FAILED' : 'PASSED';
    try {
      const res = await axios.patch(`/api/scale-decisions/${selectedCase._id}/gates/${gateNumber}`, {
        status: nextStatus,
        actorName: currentUser?.name || 'Gate Inspector',
        notes: `Gate #${gateNumber} status set to ${nextStatus}`
      });
      setSelectedCase(res.data);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to toggle gate status');
    }
  };

  const handleAddDeployment = async (e) => {
    e.preventDefault();
    if (!newDeployment.location) return;
    try {
      const res = await axios.post(`/api/scale-decisions/${selectedCase._id}/deployments`, {
        ...newDeployment,
        actorName: currentUser?.name || 'Rollout Lead'
      });
      setSelectedCase(res.data);
      setNewDeployment({ location: '', department: 'Department of Public Health', targetUsers: '100,000 Beneficiaries', budgetAllocated: 5000000, startDate: '', endDate: '', owner: 'District Officer' });
      alert(`District deployment for ${newDeployment.location} activated.`);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to add deployment');
    }
  };

  const handleUpdateDeploymentStatus = async (depId, status, pauseReason = '') => {
    try {
      const res = await axios.patch(`/api/scale-decisions/${selectedCase._id}/deployments/${depId}`, {
        status,
        pauseReason,
        actorName: currentUser?.name || 'District Coordinator'
      });
      setSelectedCase(res.data);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to update deployment status');
    }
  };

  const handleSaveScalePlan = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/scale-decisions/${selectedCase._id}/scale-plan`, {
        scaleUpPlan: editableScalePlan,
        actorName: currentUser?.name || 'Scale Planner'
      });
      setSelectedCase(res.data);
      alert('Scale-Up Master Plan & Budget updated successfully!');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to save scale plan');
    }
  };

  const handleAddProcurementReference = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/scale-decisions/${selectedCase._id}/procurement-reference`, {
        ...newProcRef,
        actorName: currentUser?.name || 'Procurement Officer'
      });
      setSelectedCase(res.data);
      setNewProcRef({ pathway: 'GEM_STARTUP_RUNWAY', marketplace: 'Government e-Marketplace (GeM)', sellerId: '', listingId: '', procurementRefNumber: '', orderRef: '', notes: '' });
      alert('Procurement Marketplace Reference linked successfully.');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to add procurement reference');
    }
  };

  // Filtered Decision Cases
  const filteredCases = scaleDecisions.filter(c => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const sName = c.startupId?.name?.toLowerCase() || '';
      const cTitle = c.challengeId?.title?.toLowerCase() || '';
      const dId = c.decisionId?.toLowerCase() || '';
      if (!sName.includes(q) && !cTitle.includes(q) && !dId.includes(q)) return false;
    }
    return true;
  });

  // Calculate High-level statistics
  const totalSanctionedBudget = scaleDecisions.reduce((acc, c) => acc + (c.scaleUpPlan?.budgetSummary?.totalBudget || 0), 0);
  const totalDeploymentsCount = scaleDecisions.reduce((acc, c) => acc + (c.deployments ? c.deployments.length : 0), 0);
  const pendingApprovalCount = scaleDecisions.filter(c => c.status === 'PENDING_APPROVAL' || c.status === 'UNDER_REVIEW' || c.status === 'RECOMMENDATION_READY').length;
  const approvedCount = scaleDecisions.filter(c => c.status === 'APPROVED' || c.status === 'APPROVED_WITH_CONDITIONS' || c.status === 'EXECUTION_IN_PROGRESS' || c.status === 'COMPLETED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-emerald">Phase 8 Framework</span>
            <span className="badge badge-navy">Statewide Scale & GeM Integration</span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0A2540', margin: 0 }}>
            Phase 8 — Scale-Up & Evidence-Based Procurement Decision Desk
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
            Aggregating evidence across Phases 2–7 for transparent, auditable scaling, GeM Startup Runway procurement, and district deployment tracking
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => setIsInitiateModalOpen(true)} 
            className="btn-emerald"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
          >
            <Plus size={16} />
            <span>Initiate Scale Decision Case</span>
          </button>
        </div>
      </div>

      {/* Top KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="gov-card" style={{ borderLeft: '4px solid #0A2540' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Scale Cases</span>
            <Layers size={18} color="#0A2540" />
          </div>
          <p style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0A2540', margin: '0.25rem 0' }}>{scaleDecisions.length}</p>
          <span style={{ fontSize: '0.725rem', color: '#64748B' }}>Evidence Dossiers in Registry</span>
        </div>

        <div className="gov-card" style={{ borderLeft: '4px solid #D97706' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase' }}>Pending Review / Approval</span>
            <Clock size={18} color="#D97706" />
          </div>
          <p style={{ fontSize: '1.65rem', fontWeight: 800, color: '#D97706', margin: '0.25rem 0' }}>{pendingApprovalCount}</p>
          <span style={{ fontSize: '0.725rem', color: '#64748B' }}>Awaiting Authorized Decision</span>
        </div>

        <div className="gov-card" style={{ borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>Sanctioned Scale Budget</span>
            <DollarSign size={18} color="#059669" />
          </div>
          <p style={{ fontSize: '1.65rem', fontWeight: 800, color: '#059669', margin: '0.25rem 0' }}>{formatCurrency(totalSanctionedBudget)}</p>
          <span style={{ fontSize: '0.725rem', color: '#059669', fontWeight: 600 }}>{approvedCount} Sanctioned Orders</span>
        </div>

        <div className="gov-card" style={{ borderLeft: '4px solid #2563EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>District Deployments</span>
            <MapPin size={18} color="#2563EB" />
          </div>
          <p style={{ fontSize: '1.65rem', fontWeight: 800, color: '#2563EB', margin: '0.25rem 0' }}>{totalDeploymentsCount}</p>
          <span style={{ fontSize: '0.725rem', color: '#64748B' }}>Active Rollout Nodes</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', backgroundColor: '#FFFFFF', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['ALL', 'APPROVED', 'UNDER_REVIEW', 'RE_PILOT_REQUIRED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={statusFilter === st ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Search by Startup, Challenge or Case ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ width: '280px', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
          />
        </div>
      </div>

      {/* Scale Decision Cases List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredCases.length === 0 ? (
          <div className="gov-card" style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
            <Layers size={40} color="#CBD5E1" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ color: '#0A2540', margin: '0 0 0.25rem 0' }}>No Phase 8 Decision Cases Found</h4>
            <p style={{ fontSize: '0.85rem', margin: 0 }}>Click "Initiate Scale Decision Case" above to evaluate and scale validated Phase 7 pilots.</p>
          </div>
        ) : (
          filteredCases.map((c) => {
            const startupName = c.startupId?.name || 'AgriSense Technologies';
            const challengeTitle = c.challengeId?.title || 'Innovation Challenge';
            const readinessScore = c.scaleReadiness?.overallScore || 85;
            const procStatus = c.procurementReadiness?.overallStatus || 'READY';
            const finalDec = c.finalDecision?.decision || c.recommendation?.decision || 'PENDING';
            const totalBudget = c.scaleUpPlan?.budgetSummary?.totalBudget || 0;
            const deploymentsCount = c.deployments?.length || 0;

            const isApproved = c.status === 'APPROVED' || c.status === 'APPROVED_WITH_CONDITIONS' || c.status === 'EXECUTION_IN_PROGRESS';
            const isRePilot = c.status === 'RE_PILOT_REQUIRED';

            return (
              <div 
                key={c._id} 
                className="gov-card" 
                style={{ 
                  borderLeft: isApproved ? '4px solid #059669' : isRePilot ? '4px solid #D97706' : '4px solid #0A2540',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-navy">{c.decisionId}</span>
                      <span className={`badge ${isApproved ? 'badge-emerald' : isRePilot ? 'badge-saffron' : 'badge-navy'}`}>
                        {formatText(c.status)}
                      </span>
                      <span className="badge badge-saffron">{formatText(startupName)}</span>
                      <span className="badge badge-dpiit">Pathway: {c.procurementReadiness?.pathwayRecommended || 'GeM'}</span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0A2540', margin: '0 0 0.25rem 0' }}>
                      {formatText(challengeTitle)}
                    </h3>
                    <p style={{ fontSize: '0.825rem', color: '#64748B', margin: 0 }}>
                      Pilot Reference: <strong>{formatText(c.pilotId?.pilotTitle || 'Controlled Pilot')}</strong>
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center', backgroundColor: '#F8FAFC', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '0.675rem', color: '#64748B', fontWeight: 700, display: 'block' }}>SCALE READINESS</span>
                      <strong style={{ fontSize: '1.15rem', color: readinessScore >= 80 ? '#059669' : '#D97706' }}>
                        {readinessScore} / 100
                      </strong>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.35rem', fontWeight: 800, color: isApproved ? '#059669' : '#0A2540' }}>
                        {formatCurrency(totalBudget)}
                      </span>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>
                        {isApproved ? 'SANCTIONED SCALE BUDGET' : 'PROJECTED SCALE BUDGET'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metric Strip */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', backgroundColor: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #E2E8F0', marginBottom: '1rem', fontSize: '0.8rem' }}>
                  <div>
                    <span style={{ color: '#64748B', fontSize: '0.7rem', fontWeight: 700, display: 'block' }}>AUTHORIZED DECISION</span>
                    <strong style={{ color: '#0A2540' }}>{finalDec.replace(/_/g, ' ')}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', fontSize: '0.7rem', fontWeight: 700, display: 'block' }}>PROCUREMENT STATUS</span>
                    <strong style={{ color: procStatus === 'READY' ? '#059669' : '#D97706' }}>{procStatus.replace(/_/g, ' ')}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', fontSize: '0.7rem', fontWeight: 700, display: 'block' }}>DISTRICT NODES</span>
                    <strong style={{ color: '#2563EB' }}>{deploymentsCount} Active Districts</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', fontSize: '0.7rem', fontWeight: 700, display: 'block' }}>CONDITIONS & GATES</span>
                    <strong style={{ color: '#0A2540' }}>{c.conditions?.length || 0} Conditions • {c.gates?.filter(g => g.status === 'PASSED').length || 0}/6 Gates</strong>
                  </div>
                </div>

                {/* Bottom Action Strip */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        setSelectedCase(c);
                        setActiveDossierTab('overview');
                      }}
                      className="btn-primary"
                      style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <FileText size={14} />
                      <span>Inspect Case Dossier</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCase(c);
                        setActiveDossierTab('decision');
                      }}
                      className="btn-emerald"
                      style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Award size={14} />
                      <span>Authorized Decision Console</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCase(c);
                        setActiveDossierTab('deployments');
                      }}
                      className="btn-secondary"
                      style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <MapPin size={14} />
                      <span>District Deployments ({deploymentsCount})</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCase(c);
                      setActiveDossierTab('package');
                    }}
                    className="btn-secondary"
                    style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Download size={14} />
                    <span>Export Procurement / Scale Package</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Multi-Startup Comparison Table (Step 51) */}
      <div className="gov-card" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
              Multi-Startup Scale & Procurement Comparison Matrix
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
              Finalized evidence comparison across candidate solutions for public sector decision-makers
            </p>
          </div>
          <span className="badge badge-emerald">Statutory GFR 173(i) QCBS Framework</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="gov-table" style={{ width: '100%', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F1F5F9' }}>
                <th style={{ padding: '0.65rem 0.75rem', textAlign: 'left' }}>Startup & Solution</th>
                <th style={{ padding: '0.65rem 0.75rem', textAlign: 'left' }}>Challenge Sector</th>
                <th style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>Phase 7 IVR Score</th>
                <th style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>Pilot KPI Outcome</th>
                <th style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>Scale Readiness</th>
                <th style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>Procurement Pathway</th>
                <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>Sanction Budget</th>
                <th style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>Final Decision</th>
              </tr>
            </thead>
            <tbody>
              {scaleDecisions.map(sc => (
                <tr key={sc._id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: '#0A2540' }}>
                    {sc.startupId?.name || 'Startup'}
                    <span style={{ display: 'block', fontSize: '0.725rem', color: '#64748B', fontWeight: 500 }}>
                      {sc.decisionId}
                    </span>
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>{formatText(sc.challengeId?.title || 'Agriculture / Health')}</td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center', fontWeight: 700, color: '#059669' }}>
                    {sc.validationId?.overallValidationScore || 94.8} / 100
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>
                    <span className="badge badge-emerald">Target Achieved</span>
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center', fontWeight: 700, color: '#0A2540' }}>
                    {sc.scaleReadiness?.overallScore || 90}/100
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>
                    <span className="badge badge-navy">{sc.procurementReadiness?.pathwayRecommended || 'GeM Startup Runway'}</span>
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 800, color: '#059669' }}>
                    {formatCurrency(sc.scaleUpPlan?.budgetSummary?.totalBudget || 0)}
                  </td>
                  <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>
                    <span className={`badge ${sc.status === 'APPROVED' ? 'badge-emerald' : 'badge-saffron'}`}>
                      {(sc.finalDecision?.decision || sc.recommendation?.decision || sc.status).replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CASE DOSSIER MODAL (Full 9-Tab Deep Dive Console)                          */}
      {/* ========================================================================= */}
      {selectedCase && (
        <div className="modal-overlay" onClick={() => setSelectedCase(null)}>
          <div 
            className="modal-content" 
            onClick={e => e.stopPropagation()} 
            style={{ maxWidth: '980px', width: '95vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
          >
            {/* Modal Top Header */}
            <div className="modal-header" style={{ borderBottom: '1px solid #E2E8F0', padding: '1rem 1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span className="badge badge-navy">{selectedCase.decisionId}</span>
                  <span className="badge badge-emerald">{formatText(selectedCase.status)}</span>
                  <span className="badge badge-saffron">{selectedCase.startupId?.name}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0A2540', margin: 0 }}>
                  Scale-Up & Procurement Dossier — {selectedCase.challengeId?.title}
                </h3>
              </div>
              <button onClick={() => setSelectedCase(null)} className="btn-secondary" style={{ padding: '0.3rem 0.6rem' }}>
                <X size={18} />
              </button>
            </div>

            {/* Dossier Navigation Sub-Tabs */}
            <div style={{ display: 'flex', overflowX: 'auto', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '0.5rem 1rem', gap: '0.5rem' }}>
              {[
                { id: 'overview', label: 'Executive Dossier & Gates', icon: Layers },
                { id: 'evidence', label: 'Evidence Traceability (Phases 3-7)', icon: FileText },
                { id: 'readiness', label: 'Scale Readiness Scoring', icon: Sliders },
                { id: 'procurement', label: 'Procurement Readiness & GeM', icon: ShoppingBag },
                { id: 'decision', label: 'Decision Review & Approval', icon: Award },
                { id: 'scaleplan', label: 'Scale Plan & Budget', icon: DollarSign },
                { id: 'deployments', label: `District Rollouts (${selectedCase.deployments?.length || 0})`, icon: MapPin },
                { id: 'package', label: 'Dossier Packages & Export', icon: Download },
                { id: 'history', label: 'Audit Trail & History', icon: History }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeDossierTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDossierTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 0.75rem',
                      fontSize: '0.775rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#0A2540' : '#64748B',
                      backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                      border: isActive ? '1px solid #CBD5E1' : '1px solid transparent',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Icon size={14} color={isActive ? '#0A2540' : '#64748B'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body: Dynamic Tab Content */}
            <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
              
              {/* TAB 1: EXECUTIVE DOSSIER & GATES */}
              {activeDossierTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Executive Summary Card */}
                  <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.5rem' }}>
                      Executive Decision Snapshot
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.825rem' }}>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>RECOMMENDED DECISION</span>
                        <strong style={{ color: '#0A2540' }}>{selectedCase.recommendation?.decision?.replace(/_/g, ' ') || 'Pending'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>FINAL AUTHORIZED DECISION</span>
                        <strong style={{ color: '#059669' }}>{selectedCase.finalDecision?.decision?.replace(/_/g, ' ') || 'Awaiting Authorization'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>DECISION MAKER</span>
                        <strong style={{ color: '#0A2540' }}>{selectedCase.finalDecision?.decidedBy || selectedCase.decisionMaker || 'Authorized Committee'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>TOTAL SCALE SANCTION</span>
                        <strong style={{ color: '#059669', fontSize: '1rem' }}>{formatCurrency(selectedCase.scaleUpPlan?.budgetSummary?.totalBudget || 0)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* 6 Mandatory Scale Gates (Step 24) */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.65rem' }}>
                      Statutory Scale Gates (Passage Required for Statewide Execution)
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                      {selectedCase.gates?.map((gate) => {
                        const isPassed = gate.status === 'PASSED';
                        return (
                          <div 
                            key={gate.gateNumber} 
                            style={{ 
                              border: '1px solid #E2E8F0', 
                              borderRadius: '6px', 
                              padding: '0.75rem', 
                              backgroundColor: isPassed ? '#F0FDF4' : '#FFFBEB',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                                <strong style={{ fontSize: '0.825rem', color: '#0A2540' }}>{gate.name}</strong>
                                <span className={`badge ${isPassed ? 'badge-emerald' : 'badge-saffron'}`} style={{ fontSize: '0.65rem' }}>
                                  {gate.status}
                                </span>
                              </div>
                              <span style={{ fontSize: '0.725rem', color: '#64748B' }}>
                                {gate.notes || 'Verification pending'} • {gate.isMandatory ? 'Mandatory' : 'Optional'}
                              </span>
                            </div>

                            <button
                              onClick={() => handleToggleGate(gate.gateNumber, gate.status)}
                              className={isPassed ? 'btn-secondary' : 'btn-emerald'}
                              style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                            >
                              {isPassed ? 'Revoke Pass' : 'Verify Pass'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Conditional Gates & Requirements (Step 14) */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                        Assigned Decision Conditions ({selectedCase.conditions?.length || 0})
                      </h4>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                      {selectedCase.conditions?.length === 0 ? (
                        <p style={{ fontSize: '0.8rem', color: '#64748B', fontStyle: 'italic', margin: 0 }}>No conditional gates assigned.</p>
                      ) : (
                        selectedCase.conditions.map(cond => {
                          const isComp = cond.status === 'COMPLETED';
                          return (
                            <div key={cond.conditionId} style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.75rem', backgroundColor: isComp ? '#F0FDF4' : '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                                  <strong style={{ fontSize: '0.825rem', color: '#0A2540' }}>{cond.conditionId}: {cond.description}</strong>
                                  <span className={`badge ${isComp ? 'badge-emerald' : 'badge-saffron'}`} style={{ fontSize: '0.65rem' }}>
                                    {cond.status}
                                  </span>
                                </div>
                                <span style={{ fontSize: '0.725rem', color: '#64748B' }}>
                                  Owner: <strong>{cond.owner}</strong> • Due Date: {cond.dueDate || 'Immediate'} {cond.notes && `• Notes: ${cond.notes}`}
                                </span>
                              </div>

                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                {!isComp && (
                                  <button
                                    onClick={() => handleUpdateConditionStatus(cond.conditionId, 'COMPLETED')}
                                    className="btn-emerald"
                                    style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                                  >
                                    Mark Completed
                                  </button>
                                )}
                                {isComp && (
                                  <span style={{ fontSize: '0.725rem', color: '#059669', fontWeight: 700 }}>✓ Verified Satisfied</span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Add Condition Form */}
                    <form onSubmit={handleAddCondition} style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Condition requirement description..."
                        required
                        value={newCondition.description}
                        onChange={e => setNewCondition({ ...newCondition, description: e.target.value })}
                        className="form-input"
                        style={{ flex: 2, minWidth: '220px', fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
                      />
                      <input
                        type="text"
                        placeholder="Owner (e.g. Startup / Dept)"
                        value={newCondition.owner}
                        onChange={e => setNewCondition({ ...newCondition, owner: e.target.value })}
                        className="form-input"
                        style={{ flex: 1, minWidth: '130px', fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
                      />
                      <input
                        type="date"
                        value={newCondition.dueDate}
                        onChange={e => setNewCondition({ ...newCondition, dueDate: e.target.value })}
                        className="form-input"
                        style={{ width: '130px', fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
                      />
                      <button type="submit" className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}>
                        Add Condition
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 2: EVIDENCE AGGREGATION & TRACEABILITY (Phases 3-7) */}
              {activeDossierTab === 'evidence' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {loadingEvidence ? (
                    <p style={{ color: '#64748B', textAlign: 'center' }}>Loading aggregated multi-phase evidence...</p>
                  ) : !aggregatedEvidence ? (
                    <p style={{ color: '#64748B' }}>Evidence data unavailable.</p>
                  ) : (
                    <>
                      {/* Phase 3 */}
                      <div className="gov-card" style={{ borderLeft: '4px solid #0A2540' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                            Phase 3 — Statutory Eligibility & DPIIT Exemption Verification
                          </h4>
                          <span className="badge badge-emerald">{aggregatedEvidence.phase3_eligibility?.screeningStatus}</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>
                          GFR Rule 173(i) Turnover & Prior Experience Exemption Applied. DigiLocker & DPIIT Registration verified with zero non-compliances.
                        </p>
                      </div>

                      {/* Phase 4 */}
                      <div className="gov-card" style={{ borderLeft: '4px solid #D97706' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#D97706', margin: 0 }}>
                            Phase 4 — Expert Technical & Security Evaluation
                          </h4>
                          <span className="badge badge-saffron">Score: {aggregatedEvidence.phase4_evaluation?.aggregateScore}/100</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
                          {aggregatedEvidence.phase4_evaluation?.evaluatorFindings?.map((ev, i) => (
                            <div key={i} style={{ backgroundColor: '#F8FAFC', padding: '0.4rem 0.6rem', borderRadius: '4px' }}>
                              <strong>{ev.evaluator} ({ev.role}):</strong> Awarded {ev.score}/100. <em>"{ev.comments}"</em>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Phase 5 */}
                      <div className="gov-card" style={{ borderLeft: '4px solid #2563EB' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2563EB', margin: 0 }}>
                            Phase 5 — Controlled Field Pilot Outcome
                          </h4>
                          <span className="badge badge-navy">Pilot Score: {aggregatedEvidence.phase5_pilot?.pilotSuccessScore}/100</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.8rem' }}>
                          {aggregatedEvidence.phase5_pilot?.kpiResults?.map((kpi, idx) => (
                            <div key={idx} style={{ backgroundColor: '#EFF6FF', padding: '0.5rem', borderRadius: '4px', border: '1px solid #BFDBFE' }}>
                              <strong style={{ color: '#1E40AF', display: 'block' }}>{kpi.metricName}</strong>
                              <span style={{ fontSize: '0.725rem', color: '#475569' }}>
                                Baseline: {kpi.baseline} → Target: {kpi.target} → <strong>Live: {kpi.currentLive}</strong>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Phase 6 */}
                      <div className="gov-card" style={{ borderLeft: '4px solid #059669' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#059669', margin: 0 }}>
                            Phase 6 — Contract Execution & Treasury Disbursements
                          </h4>
                          <span className="badge badge-emerald">{aggregatedEvidence.phase6_contract?.contractNumber || 'Contract Active'}</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>
                          Total Contract Value: <strong>{formatCurrency(aggregatedEvidence.phase6_contract?.totalValue || 0)}</strong> • SLA Uptime: <strong>{aggregatedEvidence.phase6_contract?.slaUptime}%</strong>. All milestone deliverables verified against treasury accounts.
                        </p>
                      </div>

                      {/* Phase 7 */}
                      <div className="gov-card" style={{ borderLeft: '4px solid #166534' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#166534', margin: 0 }}>
                            Phase 7 — Independent Validation Report (IVR Audit)
                          </h4>
                          <span className="badge badge-emerald">IVR Score: {aggregatedEvidence.phase7_validation?.overallValidationScore}/100</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600, margin: '0 0 0.5rem 0' }}>
                          Audited by: {aggregatedEvidence.phase7_validation?.validatorName} ({aggregatedEvidence.phase7_validation?.validatorOrg})
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
                          {aggregatedEvidence.phase7_validation?.verifiedKpis?.map((vk, i) => (
                            <div key={i} style={{ backgroundColor: '#F0FDF4', padding: '0.4rem 0.6rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                              <span><strong>{vk.metricName}:</strong> Baseline {vk.baseline} → Verified {vk.verifiedLive}</span>
                              <span style={{ color: '#059669', fontWeight: 700 }}>✓ Verified Pass</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TAB 3: SCALE READINESS & 10-POINT SCORING MATRIX */}
              {activeDossierTab === 'readiness' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                        10-Point Scale-Readiness Scoring Matrix (Step 8 & 9)
                      </h4>
                      <p style={{ fontSize: '0.775rem', color: '#64748B', margin: '0.15rem 0 0 0' }}>
                        Weighted score normalization (0–100) based on verified technical, operational, financial, and security evidence.
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669' }}>
                        {selectedCase.scaleReadiness?.overallScore || 85} / 100
                      </span>
                      <span style={{ display: 'block', fontSize: '0.675rem', color: '#64748B', fontWeight: 700 }}>OVERALL READINESS SCORE</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {editableReadiness.map((cat, idx) => (
                      <div key={cat.key || idx} style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.75rem', backgroundColor: '#FFFFFF' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <strong style={{ fontSize: '0.85rem', color: '#0A2540' }}>{cat.name} (Weight: {cat.weight}%)</strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Score:</span>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={cat.score}
                              onChange={e => {
                                const newCats = [...editableReadiness];
                                newCats[idx].score = Number(e.target.value);
                                setEditableReadiness(newCats);
                              }}
                              className="form-input"
                              style={{ width: '65px', fontSize: '0.8rem', padding: '0.2rem 0.4rem', textAlign: 'center' }}
                            />
                            <select
                              value={cat.status}
                              onChange={e => {
                                const newCats = [...editableReadiness];
                                newCats[idx].status = e.target.value;
                                setEditableReadiness(newCats);
                              }}
                              className="form-select"
                              style={{ fontSize: '0.75rem', padding: '0.2rem 0.4rem' }}
                            >
                              <option value="READY">READY</option>
                              <option value="READY_WITH_CONDITIONS">READY WITH CONDITIONS</option>
                              <option value="NOT_READY">NOT READY</option>
                              <option value="INSUFFICIENT_EVIDENCE">INSUFFICIENT EVIDENCE</option>
                            </select>
                          </div>
                        </div>

                        <p style={{ fontSize: '0.775rem', color: '#64748B', margin: '0 0 0.25rem 0' }}>{cat.description}</p>
                        <span style={{ fontSize: '0.725rem', color: '#059669', fontWeight: 600 }}>
                          Evidence Source: {cat.evidenceSource || 'Phase 7 IVR'}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <button onClick={handleUpdateReadinessScore} className="btn-primary" style={{ fontSize: '0.8rem' }}>
                      Recalculate & Save Scale Readiness
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: PROCUREMENT READINESS & GEM PATHWAY */}
              {activeDossierTab === 'procurement' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                        Procurement Readiness Checklist & Statutory Route (Step 10 & 25)
                      </h4>
                      <p style={{ fontSize: '0.775rem', color: '#64748B', margin: '0.15rem 0 0 0' }}>
                        Verifies legal compliance, DPIIT exemptions, and Government e-Marketplace (GeM) integration pathway.
                      </p>
                    </div>
                    <span className="badge badge-emerald">Status: {selectedCase.procurementReadiness?.overallStatus || 'READY'}</span>
                  </div>

                  {/* Checklist */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selectedCase.procurementReadiness?.criteria?.map((crit, idx) => (
                      <div key={crit.key || idx} style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
                        <div>
                          <strong style={{ fontSize: '0.825rem', color: '#0A2540', display: 'block' }}>{crit.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{crit.description}</span>
                        </div>
                        <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                          ✓ {crit.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Recommended Pathway */}
                  <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '6px', padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <ShoppingBag size={18} color="#1E40AF" />
                      <strong style={{ fontSize: '0.85rem', color: '#1E40AF' }}>
                        Selected Procurement Channel: {selectedCase.procurementReadiness?.pathwayRecommended || 'GeM Startup Runway'}
                      </strong>
                    </div>
                    <p style={{ fontSize: '0.775rem', color: '#334155', margin: 0 }}>
                      Under Maharashtra State Innovation Procurement Rules & GFR Rule 173(i), DPIIT-recognized startups with certified IVR audit qualify for direct government purchase order without conventional tender bid guarantee.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 5: DECISION REVIEW & AUTHORIZATION CONSOLE */}
              {activeDossierTab === 'decision' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* System Recommendation Card */}
                  <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                        AI Decision Support Engine Recommendation (Step 12)
                      </span>
                      <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                        {selectedCase.recommendation?.decision?.replace(/_/g, ' ') || 'SCALE AND PROCURE'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.825rem', color: '#14532D', margin: '0 0 0.5rem 0' }}>
                      "{selectedCase.recommendation?.rationale || 'Independent validation confirms 100% KPI achievement with exceptional reliability.'}"
                    </p>
                    <span style={{ fontSize: '0.7rem', color: '#166534' }}>
                      Generated by: {selectedCase.recommendation?.generatedBy || 'GovInnovate Decision Intelligence'}
                    </span>
                  </div>

                  {/* Decision Maker Approval Form */}
                  <form onSubmit={handleRecordAuthorizedDecision} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                      Record Statutory Authorized Decision (Step 11 & 31)
                    </h4>

                    <div className="form-group">
                      <label className="form-label">Statutory Decision Option *</label>
                      <select
                        value={decisionAction}
                        onChange={e => setDecisionAction(e.target.value)}
                        className="form-select"
                        required
                      >
                        <option value="SCALE_AND_PROCURE">SCALE & PROCURE (Expand statewide + GeM Purchase Order)</option>
                        <option value="SCALE">SCALE (Expand validated solution across additional districts)</option>
                        <option value="PROCURE">PROCURE (Proceed with direct procurement route)</option>
                        <option value="EXTEND_PILOT">EXTEND PILOT (Collect additional field evidence)</option>
                        <option value="RE_PILOT">RE-PILOT (Conduct controlled re-trial for specific criteria)</option>
                        <option value="MODIFY_AND_RETEST">MODIFY & RETEST (Modify solution specs and re-test)</option>
                        <option value="DO_NOT_PROCEED">DO NOT PROCEED (Stop further deployment)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Mandatory Decision Rationale & Justification *</label>
                      <textarea
                        rows={3}
                        required
                        value={decisionRationale}
                        onChange={e => setDecisionRationale(e.target.value)}
                        className="form-textarea"
                        placeholder="Record detailed administrative justification citing IVR findings, district readiness, and budget availability..."
                      />
                    </div>

                    {/* Step 32: Decision Override Detection */}
                    {selectedCase.recommendation?.decision && decisionAction !== selectedCase.recommendation?.decision && (
                      <div className="form-group" style={{ backgroundColor: '#FEF3C7', padding: '0.75rem', borderRadius: '6px', border: '1px solid #FCD34D' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                          <AlertTriangle size={16} color="#D97706" />
                          <strong style={{ fontSize: '0.8rem', color: '#92400E' }}>Administrative Decision Override Detected</strong>
                        </div>
                        <label className="form-label" style={{ color: '#92400E' }}>Override Reason (Mandatory) *</label>
                        <input
                          type="text"
                          required
                          value={overrideReason}
                          onChange={e => setOverrideReason(e.target.value)}
                          placeholder="Provide statutory justification for deviating from recommendation..."
                          className="form-input"
                        />
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button type="submit" className="btn-emerald" style={{ fontWeight: 700 }}>
                        Execute & Authorize Decision
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 6: SCALE-UP MASTER PLAN & BUDGETING */}
              {activeDossierTab === 'scaleplan' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                      Scale-Up Master Plan & Decimal-Safe Budget Allocation (Step 16 & 20)
                    </h4>
                    <span className="badge badge-emerald">
                      Total Sanctioned: {formatCurrency(selectedCase.scaleUpPlan?.budgetSummary?.totalBudget || 0)}
                    </span>
                  </div>

                  {/* 10 Budget Components */}
                  <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.65rem' }}>
                      Itemized Budget Breakdown
                    </h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.8rem' }}>
                      {Object.entries(selectedCase.scaleUpPlan?.budgetSummary || {}).filter(([k]) => !['totalBudget', 'budgetApproved', 'financeApprover', 'financeApprovalDate'].includes(k)).map(([key, val]) => (
                        <div key={key} style={{ backgroundColor: '#FFFFFF', padding: '0.5rem', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                          <span style={{ color: '#64748B', fontSize: '0.7rem', textTransform: 'capitalize', display: 'block' }}>
                            {key.replace(/([A-Z])/g, ' $1')}
                          </span>
                          <strong style={{ color: '#0A2540' }}>{formatCurrency(Number(val) || 0)}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefit Projections vs Baseline (Step 21) */}
                  <div>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.5rem' }}>
                      Benefit Projections vs Baseline
                    </h5>
                    <table className="gov-table" style={{ width: '100%', fontSize: '0.8rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F1F5F9' }}>
                          <th style={{ textAlign: 'left', padding: '0.5rem' }}>Metric Name</th>
                          <th style={{ textAlign: 'left', padding: '0.5rem' }}>Baseline</th>
                          <th style={{ textAlign: 'left', padding: '0.5rem' }}>Pilot Outcome</th>
                          <th style={{ textAlign: 'left', padding: '0.5rem' }}>Projected Scale</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCase.scaleUpPlan?.benefitProjections?.map((bp, i) => (
                          <tr key={i}>
                            <td style={{ padding: '0.5rem', fontWeight: 600 }}>{bp.metricName}</td>
                            <td style={{ padding: '0.5rem', color: '#64748B' }}>{bp.baseline}</td>
                            <td style={{ padding: '0.5rem', color: '#2563EB', fontWeight: 600 }}>{bp.pilotResult}</td>
                            <td style={{ padding: '0.5rem', color: '#059669', fontWeight: 700 }}>{bp.projectedScale}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Scale Milestones */}
                  <div>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.5rem' }}>
                      Scale-Up Milestones Schedule
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
                      {selectedCase.scaleUpPlan?.milestones?.map((ms, i) => (
                        <div key={i} style={{ border: '1px solid #E2E8F0', padding: '0.5rem 0.75rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                          <div>
                            <strong>Milestone #{ms.milestoneNumber}: {ms.name}</strong>
                            <span style={{ display: 'block', fontSize: '0.725rem', color: '#64748B' }}>{ms.description} • Planned: {ms.plannedDate}</span>
                          </div>
                          <span className="badge badge-emerald">{ms.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: DISTRICT ROLLOUTS & DEPLOYMENTS */}
              {activeDossierTab === 'deployments' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                      Multi-District Deployment Expansion (Step 17 & 33)
                    </h4>
                    <span className="badge badge-navy">
                      {selectedCase.deployments?.length || 0} Districts Active
                    </span>
                  </div>

                  {/* Deployments List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {selectedCase.deployments?.map(dep => {
                      const isActive = dep.status === 'ACTIVE';
                      const isPaused = dep.status === 'PAUSED';

                      return (
                        <div key={dep.deploymentId} style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.75rem', backgroundColor: isActive ? '#F0FDF4' : isPaused ? '#FEF2F2' : '#FFFFFF' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                                <strong style={{ fontSize: '0.9rem', color: '#0A2540' }}>{dep.location}</strong>
                                <span className={`badge ${isActive ? 'badge-emerald' : isPaused ? 'badge-saffron' : 'badge-navy'}`} style={{ fontSize: '0.65rem' }}>
                                  {dep.status}
                                </span>
                              </div>
                              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                {dep.department} • Allocated Budget: <strong>{formatCurrency(dep.budgetAllocated)}</strong> • Target: {dep.targetUsers}
                              </span>
                            </div>

                            {/* Pause / Resume Controls (Step 37) */}
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                              {isActive && (
                                <button
                                  onClick={() => {
                                    const reason = prompt('Enter stop/pause condition reason (e.g., Critical security issue, hardware failure):');
                                    if (reason) handleUpdateDeploymentStatus(dep.deploymentId, 'PAUSED', reason);
                                  }}
                                  className="btn-secondary"
                                  style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', color: '#DC2626', borderColor: '#FCA5A5' }}
                                >
                                  <PauseCircle size={12} /> Pause Rollout
                                </button>
                              )}
                              {isPaused && (
                                <button
                                  onClick={() => handleUpdateDeploymentStatus(dep.deploymentId, 'ACTIVE')}
                                  className="btn-emerald"
                                  style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                                >
                                  <PlayCircle size={12} /> Resume Rollout
                                </button>
                              )}
                            </div>
                          </div>

                          {isPaused && dep.pauseReason && (
                            <div style={{ backgroundColor: '#FEF2F2', padding: '0.4rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', color: '#991B1B', marginBottom: '0.4rem' }}>
                              <strong>Pause Condition:</strong> {dep.pauseReason}
                            </div>
                          )}

                          {/* Telemetry Strip */}
                          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.725rem', color: '#475569', backgroundColor: '#F8FAFC', padding: '0.4rem 0.6rem', borderRadius: '4px' }}>
                            <span>Infrastructure: <strong>{dep.infrastructureStatus}</strong></span>
                            <span>KPI Status: <strong>{dep.kpiStatus}</strong></span>
                            <span>Risk Status: <strong>{dep.riskStatus}</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Deployment Form */}
                  <form onSubmit={handleAddDeployment} style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '6px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <h5 style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>Add New District Deployment Node</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="District / Facility Location *"
                        required
                        value={newDeployment.location}
                        onChange={e => setNewDeployment({ ...newDeployment, location: e.target.value })}
                        className="form-input"
                        style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
                      />
                      <input
                        type="text"
                        placeholder="Target Beneficiaries Count"
                        value={newDeployment.targetUsers}
                        onChange={e => setNewDeployment({ ...newDeployment, targetUsers: e.target.value })}
                        className="form-input"
                        style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
                      />
                      <input
                        type="number"
                        placeholder="Allocated Budget (₹)"
                        value={newDeployment.budgetAllocated}
                        onChange={e => setNewDeployment({ ...newDeployment, budgetAllocated: Number(e.target.value) })}
                        className="form-input"
                        style={{ fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
                      />
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <button type="submit" className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
                        Activate Deployment Node
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 8: DOSSIER PACKAGES & EXPORT */}
              {activeDossierTab === 'package' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                      Structured Procurement & Scale Dossier Packages (Step 28 & 29)
                    </h4>
                    <span className="badge badge-emerald">Ready for e-Publishing</span>
                  </div>

                  {/* GeM / CPPP Reference Manager */}
                  <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                    <h5 style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.5rem' }}>
                      Linked Marketplace & Tender References ({selectedCase.procurementReferences?.length || 0})
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.75rem' }}>
                      {selectedCase.procurementReferences?.map((ref, idx) => (
                        <div key={idx} style={{ backgroundColor: '#FFFFFF', padding: '0.5rem', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '0.775rem' }}>
                          <strong>{ref.marketplace} ({ref.pathway})</strong> • Ref: {ref.procurementRefNumber || ref.orderRef || ref.referenceId}
                          <span style={{ display: 'block', fontSize: '0.7rem', color: '#059669' }}>{ref.externalStatus}</span>
                        </div>
                      ))}
                    </div>

                    {/* Add Reference */}
                    <form onSubmit={handleAddProcurementReference} style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <select
                        value={newProcRef.pathway}
                        onChange={e => setNewProcRef({ ...newProcRef, pathway: e.target.value })}
                        className="form-select"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
                      >
                        <option value="GEM_STARTUP_RUNWAY">GeM Startup Runway</option>
                        <option value="GEM">GeM Standard</option>
                        <option value="CPPP">CPPP e-Tender</option>
                        <option value="STATE_EPROCUREMENT">Maharashtra e-Procurement</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Procurement / Order Ref Number"
                        value={newProcRef.procurementRefNumber}
                        onChange={e => setNewProcRef({ ...newProcRef, procurementRefNumber: e.target.value })}
                        className="form-input"
                        style={{ flex: 1, minWidth: '180px', fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
                      />
                      <button type="submit" className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}>
                        Link Reference
                      </button>
                    </form>
                  </div>

                  {/* Actions to Download / Inspect Package */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div style={{ border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                      <ShoppingBag size={24} color="#0A2540" style={{ marginBottom: '0.35rem' }} />
                      <h5 style={{ margin: '0 0 0.25rem 0', color: '#0A2540' }}>Statutory Procurement Package</h5>
                      <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0 0 0.75rem 0' }}>
                        Complete dossier for Treasury, GeM, and State Procurement Cell.
                      </p>
                      <button 
                        onClick={() => window.open(`/api/scale-decisions/${selectedCase._id}/procurement-package`, '_blank')} 
                        className="btn-primary" 
                        style={{ fontSize: '0.75rem' }}
                      >
                        View Full Procurement JSON Dossier
                      </button>
                    </div>

                    <div style={{ border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                      <Award size={24} color="#059669" style={{ marginBottom: '0.35rem' }} />
                      <h5 style={{ margin: '0 0 0.25rem 0', color: '#0A2540' }}>Executive Scale-Up Dossier</h5>
                      <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0 0 0.75rem 0' }}>
                        High-level dossier for Minister and Cabinet Steering Committee.
                      </p>
                      <button 
                        onClick={() => window.open(`/api/scale-decisions/${selectedCase._id}/scale-package`, '_blank')} 
                        className="btn-emerald" 
                        style={{ fontSize: '0.75rem' }}
                      >
                        View Executive Scale Dossier
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 9: AUDIT TRAIL & HISTORY */}
              {activeDossierTab === 'history' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                    Immutable Decision History & Transparency Audit Trail (Step 38 & 43)
                  </h4>

                  {/* Decision History Versions */}
                  <div>
                    <h5 style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.4rem' }}>Decision Versions</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {selectedCase.decisionHistory?.map((dh, i) => (
                        <div key={i} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.775rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                            <strong>Version #{dh.version}: {dh.decisionType} — {dh.decision}</strong>
                            <span style={{ color: '#64748B' }}>{new Date(dh.timestamp).toLocaleString('en-IN')}</span>
                          </div>
                          <p style={{ margin: '0 0 0.15rem 0', color: '#334155' }}>"{dh.rationale}"</p>
                          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Actor: {dh.actor} ({dh.role})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Immutable Audit Log */}
                  <div>
                    <h5 style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.4rem' }}>System Audit Events</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '200px', overflowY: 'auto' }}>
                      {selectedCase.auditTrail?.map((log, i) => (
                        <div key={i} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', padding: '0.4rem 0.6rem', borderRadius: '4px', fontSize: '0.725rem' }}>
                          <span style={{ color: '#059669', fontWeight: 700 }}>[{log.action}]</span> {log.details}
                          <span style={{ color: '#64748B', display: 'block' }}>By: {log.actor} ({log.role}) • {new Date(log.timestamp).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer" style={{ borderTop: '1px solid #E2E8F0', padding: '0.75rem 1.25rem' }}>
              <button onClick={() => setSelectedCase(null)} className="btn-secondary">
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INITIATE SCALE DECISION MODAL                                             */}
      {/* ========================================================================= */}
      {isInitiateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsInitiateModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540' }}>
                Initiate Phase 8 Scale-Up & Procurement Decision Case
              </h3>
              <button onClick={() => setIsInitiateModalOpen(false)} className="btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleInitiateDecisionCase}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Validated Pilot Project *</label>
                  <select
                    value={selectedPilotForInitiation}
                    onChange={e => setSelectedPilotForInitiation(e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="">-- Choose Validated Pilot --</option>
                    {pilots.map(p => (
                      <option key={p._id} value={p._id}>
                        {formatText(p.pilotTitle)} (Score: {p.pilotSuccessScore || 90}/100 - Status: {p.validationStatus})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ backgroundColor: '#EFF6FF', padding: '0.75rem', borderRadius: '6px', border: '1px solid #BFDBFE', fontSize: '0.8rem', color: '#1E40AF' }}>
                  <strong>Statutory Notice:</strong> Initiating this case will automatically aggregate finalized data from Phases 2–7, compute baseline scale-readiness scoring, and configure GeM Startup Runway procurement pathways.
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsInitiateModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-emerald">
                  {isSubmitting ? 'Initializing Case...' : 'Initialize Scale Decision Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovtScaleUpTab;

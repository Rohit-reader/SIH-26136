import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  MapPin, 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  ShoppingBag, 
  FileText,
  Building,
  ShieldCheck,
  Check
} from 'lucide-react';
import axios from 'axios';
import { formatText, formatCurrency } from '../../utils/textUtils';

export const StartupScaleUpTab = ({ primaryStartup, onRefresh }) => {
  const [scaleDecisions, setScaleDecisions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDecisions();
  }, [primaryStartup]);

  const fetchDecisions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/scale-decisions');
      // Filter for this startup if startup ID is available
      const myDecisions = res.data.filter(d => 
        !primaryStartup?._id || 
        d.startupId?._id === primaryStartup._id || 
        d.startupId === primaryStartup._id
      );
      setScaleDecisions(myDecisions.length > 0 ? myDecisions : res.data);
    } catch (err) {
      console.error('Failed to fetch startup scale decisions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConditionStatus = async (caseId, condId, status, notes) => {
    try {
      await axios.patch(`/api/scale-decisions/${caseId}/conditions/${condId}`, {
        status,
        notes: notes || 'Evidence submitted by startup partner.',
        actorName: primaryStartup?.name || 'Startup Admin'
      });
      alert('Condition response recorded and submitted to Government Desk.');
      fetchDecisions();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to update condition status');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-emerald">Phase 8</span>
          <span className="badge badge-navy">Statewide Scale-Up & Procurement</span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0A2540', margin: 0 }}>
          Scale-Up Decisions & Multi-District Rollout Status
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
          View statutory government scale-up decisions, track GeM Startup Runway purchase orders, respond to conditions, and monitor district deployments
        </p>
      </div>

      {loading ? (
        <div className="gov-card" style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
          Loading scale decisions and rollout status...
        </div>
      ) : scaleDecisions.length === 0 ? (
        <div className="gov-card" style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
          <TrendingUp size={36} color="#CBD5E1" style={{ marginBottom: '0.5rem' }} />
          <h4 style={{ color: '#0A2540', margin: '0 0 0.25rem 0' }}>No Scale-Up Decisions Issued Yet</h4>
          <p style={{ fontSize: '0.85rem', margin: 0 }}>
            Once your Phase 5 pilot and Phase 7 independent validation are certified, government sanction orders will appear here.
          </p>
        </div>
      ) : (
        scaleDecisions.map((dec) => {
          const isApproved = dec.status === 'APPROVED' || dec.status === 'APPROVED_WITH_CONDITIONS' || dec.status === 'EXECUTION_IN_PROGRESS';
          const isRePilot = dec.status === 'RE_PILOT_REQUIRED';
          const finalDecision = dec.finalDecision?.decision || dec.recommendation?.decision || dec.status;

          return (
            <div key={dec._id} className="gov-card" style={{ borderLeft: isApproved ? '4px solid #059669' : isRePilot ? '4px solid #D97706' : '4px solid #0A2540' }}>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-navy">{dec.decisionId}</span>
                    <span className={`badge ${isApproved ? 'badge-emerald' : isRePilot ? 'badge-saffron' : 'badge-navy'}`}>
                      {formatText(dec.status)}
                    </span>
                    <span className="badge badge-dpiit">Channel: {dec.procurementReadiness?.pathwayRecommended || 'GeM Startup Runway'}</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0A2540', margin: '0 0 0.2rem 0' }}>
                    {formatText(dec.challengeId?.title || 'State Innovation Challenge')}
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: '#64748B', margin: 0 }}>
                    Pilot Reference: <strong>{formatText(dec.pilotId?.pilotTitle || 'Field Pilot')}</strong>
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: isApproved ? '#059669' : '#0A2540' }}>
                    {formatCurrency(dec.scaleUpPlan?.budgetSummary?.totalBudget || 0)}
                  </span>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>
                    APPROVED SCALE BUDGET
                  </span>
                </div>
              </div>

              {/* Authorized Decision Justification */}
              <div style={{ backgroundColor: isApproved ? '#F0FDF4' : '#FFFBEB', border: isApproved ? '1px solid #BBF7D0' : '1px solid #FDE68A', padding: '0.85rem 1rem', borderRadius: '6px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: isApproved ? '#166534' : '#92400E' }}>
                    Government Statutory Decision: {finalDecision.replace(/_/g, ' ')}
                  </strong>
                  <span style={{ fontSize: '0.725rem', color: '#64748B' }}>
                    Authorized by: <strong>{dec.finalDecision?.decidedBy || 'State Committee'}</strong>
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#334155', margin: 0, fontStyle: 'italic' }}>
                  "{dec.finalDecision?.rationale || dec.recommendation?.rationale || 'Independent validation confirms performance targets met.'}"
                </p>
              </div>

              {/* Startup Assigned Conditions (Step 14) */}
              {dec.conditions && dec.conditions.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.5rem' }}>
                    Compliance Conditions & Startup Action Items ({dec.conditions.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {dec.conditions.map(c => {
                      const isCompleted = c.status === 'COMPLETED';
                      return (
                        <div key={c.conditionId} style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem', backgroundColor: isCompleted ? '#F0FDF4' : '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                              <strong style={{ fontSize: '0.825rem', color: '#0A2540' }}>{c.conditionId}: {c.description}</strong>
                              <span className={`badge ${isCompleted ? 'badge-emerald' : 'badge-saffron'}`} style={{ fontSize: '0.65rem' }}>
                                {c.status}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.725rem', color: '#64748B' }}>
                              Assigned Owner: <strong>{c.owner}</strong> • Due: {c.dueDate || 'Immediate'}
                            </span>
                          </div>

                          {!isCompleted && (
                            <button
                              onClick={() => {
                                const note = prompt('Enter response / evidence notes for condition compliance:');
                                if (note !== null) handleUpdateConditionStatus(dec._id, c.conditionId, 'COMPLETED', note);
                              }}
                              className="btn-emerald"
                              style={{ fontSize: '0.725rem', padding: '0.3rem 0.6rem' }}
                            >
                              Submit Compliance Proof
                            </button>
                          )}
                          {isCompleted && (
                            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
                              ✓ Compliance Verified
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* District Deployments Progress (Step 33) */}
              {dec.deployments && dec.deployments.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.5rem' }}>
                    Active District Deployments ({dec.deployments.length})
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                    {dec.deployments.map(dep => (
                      <div key={dep.deploymentId} style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.75rem', backgroundColor: '#F8FAFC' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <strong style={{ fontSize: '0.85rem', color: '#0A2540' }}>{dep.location}</strong>
                          <span className={`badge ${dep.status === 'ACTIVE' ? 'badge-emerald' : 'badge-saffron'}`} style={{ fontSize: '0.65rem' }}>
                            {dep.status}
                          </span>
                        </div>
                        <span style={{ display: 'block', fontSize: '0.725rem', color: '#64748B', marginBottom: '0.25rem' }}>
                          Target: {dep.targetUsers} • Budget: {formatCurrency(dep.budgetAllocated)}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>
                          ✓ {dep.infrastructureStatus} • {dep.kpiStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default StartupScaleUpTab;

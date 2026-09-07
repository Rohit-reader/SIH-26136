import React, { useState, useEffect } from 'react';
import { ShoppingBag, FileText, CheckCircle2, ShieldCheck, IndianRupee, ExternalLink, Plus, X, Award, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { formatText, formatCurrency } from '../../utils/textUtils';

export const GovtProcurementTab = ({ pilots = [], proposals = [], onRefresh }) => {
  const [contracts, setContracts] = useState([]);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newContractData, setNewContractData] = useState({
    proposalId: '',
    pilotId: '',
    contractTitle: '',
    templateType: 'Standard Innovation Procurement Agreement',
    totalValue: 1420000,
    startDate: '2026-05-15',
    endDate: '2026-11-15'
  });

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const res = await axios.get('/api/contracts');
      setContracts(res.data || []);
    } catch (err) {
      console.error('Failed to fetch contracts:', err);
    }
  };

  const handleVerifyMilestone = async (contractId, milestoneNumber) => {
    try {
      await axios.patch(`/api/contracts/${contractId}/milestone/${milestoneNumber}/verify`, {
        approvedBy: 'State Procurement & Legal Desk'
      });
      alert(`Milestone #${milestoneNumber} verified successfully! Sent to Treasury for disbursement.`);
      fetchContracts();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to verify milestone deliverable.');
    }
  };

  const handleDisbursePayment = async (contractId, milestoneNumber) => {
    try {
      const res = await axios.patch(`/api/contracts/${contractId}/milestone/${milestoneNumber}/disburse`);
      alert(res.data?.message || `Payment disbursed via Treasury e-Kosh successfully!`);
      fetchContracts();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to disburse milestone payment.');
    }
  };

  const handleCreateContract = async (e) => {
    e.preventDefault();
    if (!newContractData.proposalId) {
      alert('Please select a proposal to contract');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedProp = proposals.find(p => p._id === newContractData.proposalId);
      const selectedPilot = pilots.find(p => p.proposalId?._id === newContractData.proposalId || p.proposalId === newContractData.proposalId);

      await axios.post('/api/contracts', {
        ...newContractData,
        pilotId: selectedPilot?._id || newContractData.pilotId || null,
        proposalId: selectedProp?._id || newContractData.proposalId,
        milestones: [
          { milestoneNumber: 1, title: 'Phase 1: Setup & Infrastructure', deliverables: 'Hardware installation & initial testing', dueDate: '2026-06-15', amount: Math.round(newContractData.totalValue * 0.3), status: 'Pending' },
          { milestoneNumber: 2, title: 'Phase 2: Live HMIS Trial', deliverables: 'WhatsApp broadcast & live queue triage', dueDate: '2026-08-15', amount: Math.round(newContractData.totalValue * 0.4), status: 'Pending' },
          { milestoneNumber: 3, title: 'Phase 3: Performance Audit', deliverables: 'Target wait time reduction audit signoff', dueDate: '2026-11-15', amount: Math.round(newContractData.totalValue * 0.3), status: 'Pending' }
        ],
        slaTerms: {
          uptimeSlaPct: 99.5,
          performanceTargetThreshold: '75% OPD wait time reduction',
          penaltyClause: '0.5% deduction per 24h delay beyond milestone target'
        },
        dataGovernance: {
          governmentDataOwnership: '100% Patient logs & telemetry belong to Govt of Maharashtra.',
          startupIpProtection: 'Proprietary AI code & computer vision IP belong exclusively to Startup.',
          certInMandatory: true
        }
      });

      alert('Innovation Procurement Contract executed and activated successfully!');
      setIsContractModalOpen(false);
      fetchContracts();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to instantiate contract');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0A2540' }}>
            Phase 6 — Contracting, Milestone Management & Treasury Payments
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Legally binding agreements, milestone deliverable verifications, SLA tracking, and direct e-Kosh treasury payment disbursements
          </p>
        </div>

        <button onClick={() => setIsContractModalOpen(true)} className="btn-primary">
          <Plus size={16} />
          <span>Instantiate Innovation Contract</span>
        </button>
      </div>

      {/* GeM Integration & Procurement Exemption Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <div className="gov-card" style={{ borderLeft: '4px solid #0A2540' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <ShoppingBag size={22} color="#0A2540" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540' }}>GeM Innovation Portal Reference</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '0.75rem' }}>
            Sanction Ref: <strong>GEM-MSINS-2026-AGRI-00982</strong>
          </p>
          <span className="badge badge-emerald">Direct Contract Sanction Active</span>
        </div>

        <div className="gov-card" style={{ borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <ShieldCheck size={22} color="#059669" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#059669' }}>State Procurement Exemption Status</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '0.75rem' }}>
            GFR Rule 173(i) Waiver Applied under Maharashtra Innovation Procurement Rules 2024
          </p>
          <span className="badge badge-dpiit">DPIIT Compliant (Turnover & EMD Waived)</span>
        </div>
      </div>

      {/* Contracts Desk */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
          Active Executed Innovation Contracts & Deliverable Schedules
        </h3>

        {contracts.length === 0 ? (
          <div className="gov-card" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
            <FileText size={36} color="#CBD5E1" style={{ marginBottom: '0.5rem' }} />
            <p style={{ margin: 0 }}>No active contracts created yet. Instantiate a contract from Phase 5 pilots above.</p>
          </div>
        ) : (
          contracts.map(contract => {
            const startupName = contract.startupId?.name || 'HealthAI Solutions Pvt Ltd';

            return (
              <div key={contract._id} className="gov-card" style={{ borderLeft: '4px solid #059669' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-emerald">{contract.contractNumber}</span>
                      <span className="badge badge-navy">{formatText(contract.status)}</span>
                      <span className="badge badge-saffron">{formatText(startupName)}</span>
                    </div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                      {formatText(contract.contractTitle)}
                    </h4>
                    <p style={{ fontSize: '0.825rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
                      Template: <strong>{contract.templateType}</strong> • Period: {contract.startDate} to {contract.endDate}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>{formatCurrency(contract.totalValue)}</span>
                    <span style={{ display: 'block', fontSize: '0.725rem', color: '#64748B' }}>TOTAL CONTRACT VALUE</span>
                  </div>
                </div>

                {/* SLA & Governance Summary */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #E2E8F0', marginBottom: '1rem', fontSize: '0.8rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>SLA TARGET</span>
                    <strong style={{ color: '#0A2540' }}>{contract.slaTerms?.uptimeSlaPct || 99.5}% Uptime • {contract.slaTerms?.performanceTargetThreshold}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>DATA RIGHTS</span>
                    <strong style={{ color: '#059669' }}>✓ 100% Government Patient Data Ownership</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>IP CLAUSE</span>
                    <strong style={{ color: '#2563EB' }}>✓ Startup Retains Software & Model IP</strong>
                  </div>
                </div>

                {/* Milestone Schedule */}
                <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.65rem' }}>
                  Milestone Deliverables Verification & Payment Schedule
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {contract.milestones?.map((m) => {
                    const isDisbursed = m.status === 'Disbursed';
                    const isApproved = m.status === 'Payment Approved' || m.status === 'Verified';
                    const isSubmitted = m.status === 'Deliverable Submitted';

                    return (
                      <div key={m.milestoneNumber} style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.75rem 0.85rem', backgroundColor: isDisbursed ? '#F0FDF4' : isApproved ? '#EFF6FF' : '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                            <strong style={{ fontSize: '0.875rem', color: '#0A2540' }}>Milestone #{m.milestoneNumber}: {formatText(m.title)}</strong>
                            <span className={`badge ${isDisbursed ? 'badge-emerald' : isApproved ? 'badge-saffron' : isSubmitted ? 'badge-navy' : 'badge-dpiit'}`} style={{ fontSize: '0.675rem' }}>
                              {m.status}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0 0 0.2rem 0' }}>{formatText(m.deliverables)}</p>
                          <span style={{ fontSize: '0.725rem', color: '#64748B' }}>
                            Due: {m.dueDate} | Amount: <strong>{formatCurrency(m.amount)}</strong>
                            {m.treasuryRefNo && <span style={{ color: '#059669', marginLeft: '0.5rem', fontWeight: 700 }}>Treasury e-Kosh: {m.treasuryRefNo}</span>}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          {isSubmitted && (
                            <button onClick={() => handleVerifyMilestone(contract._id, m.milestoneNumber)} className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
                              <CheckCircle2 size={13} /> Verify Deliverable
                            </button>
                          )}
                          {isApproved && !isDisbursed && (
                            <button onClick={() => handleDisbursePayment(contract._id, m.milestoneNumber)} className="btn-emerald" style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
                              <IndianRupee size={13} /> Disburse e-Kosh Treasury Payment
                            </button>
                          )}
                          {isDisbursed && (
                            <span className="badge badge-emerald" style={{ fontSize: '0.725rem' }}>
                              ✓ Payment Disbursed ({m.treasuryRefNo})
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Instantiate Contract Modal */}
      {isContractModalOpen && (
        <div className="modal-overlay" onClick={() => setIsContractModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540' }}>Instantiate Innovation Procurement Contract</h3>
              <button onClick={() => setIsContractModalOpen(false)} className="btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateContract}>
              <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                <div className="form-group">
                  <label className="form-label">Select Proposal / Pilot Project *</label>
                  <select
                    value={newContractData.proposalId}
                    onChange={e => {
                      const sel = proposals.find(p => p._id === e.target.value);
                      setNewContractData({
                        ...newContractData,
                        proposalId: e.target.value,
                        contractTitle: sel ? `Innovation Agreement: ${sel.solutionTitle}` : newContractData.contractTitle,
                        totalValue: sel ? sel.proposedBudget : newContractData.totalValue
                      });
                    }}
                    className="form-select"
                    required
                  >
                    <option value="">-- Choose Proposal --</option>
                    {proposals.map(p => (
                      <option key={p._id} value={p._id}>
                        {formatText(p.solutionTitle)} ({formatCurrency(p.proposedBudget)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Contract Title *</label>
                  <input
                    type="text"
                    required
                    value={newContractData.contractTitle}
                    onChange={e => setNewContractData({ ...newContractData, contractTitle: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contract Template Type</label>
                  <select
                    value={newContractData.templateType}
                    onChange={e => setNewContractData({ ...newContractData, templateType: e.target.value })}
                    className="form-select"
                  >
                    <option value="Standard Innovation Procurement Agreement">Standard Innovation Procurement Agreement</option>
                    <option value="Sandbox Pilot Scale Contract">Sandbox Pilot Scale Contract</option>
                    <option value="Custom Direct Sanction">Custom Direct Sanction Order</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      value={newContractData.startDate}
                      onChange={e => setNewContractData({ ...newContractData, startDate: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      value={newContractData.endDate}
                      onChange={e => setNewContractData({ ...newContractData, endDate: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Total Contract Amount (₹)</label>
                  <input
                    type="number"
                    value={newContractData.totalValue}
                    onChange={e => setNewContractData({ ...newContractData, totalValue: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsContractModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? 'Activating Contract...' : 'Activate Contract'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovtProcurementTab;

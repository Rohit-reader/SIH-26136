import React, { useState, useEffect } from 'react';
import { 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Download, 
  Building2, 
  ShieldCheck, 
  ArrowUpRight,
  Receipt,
  Upload,
  X
} from 'lucide-react';
import axios from 'axios';
import { formatText, formatCurrency } from '../../utils/textUtils';

export const StartupPaymentsTab = ({ pilots = [], onRefresh }) => {
  const [contracts, setContracts] = useState([]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState('');
  const [selectedMilestoneNum, setSelectedMilestoneNum] = useState(1);
  const [evidenceName, setEvidenceName] = useState('');
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleMilestoneSubmit = async (e) => {
    e.preventDefault();
    if (!selectedContractId || !evidenceName) return;

    setIsSubmitting(true);
    try {
      await axios.patch(`/api/contracts/${selectedContractId}/milestone/${selectedMilestoneNum}/submit`, {
        evidenceUrl: `https://govinnovate.maharashtra.gov.in/docs/${evidenceName.replace(/\s+/g, '_')}`,
        evidenceNotes
      });
      alert(`Deliverable evidence "${evidenceName}" submitted successfully for Milestone #${selectedMilestoneNum}!`);
      setIsSubmitModalOpen(false);
      setEvidenceName('');
      setEvidenceNotes('');
      fetchContracts();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to submit milestone deliverable.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute totals across real contracts or fallback
  let totalContracted = 0;
  let totalReceived = 0;
  let totalPending = 0;

  const paymentRecords = [];

  if (contracts.length > 0) {
    contracts.forEach(ct => {
      totalContracted += (ct.totalValue || 0);
      ct.milestones?.forEach(m => {
        const isDisbursed = m.status === 'Disbursed';
        if (isDisbursed) {
          totalReceived += (m.amount || 0);
        } else {
          totalPending += (m.amount || 0);
        }

        paymentRecords.push({
          id: m.treasuryRefNo || `PAY-${m.milestoneNumber}84${ct._id.substring(0, 3)}`,
          contractTitle: ct.contractTitle,
          contractNumber: ct.contractNumber,
          milestone: `Milestone #${m.milestoneNumber}: ${m.title}`,
          amount: m.amount,
          status: m.status,
          isDisbursed,
          releasedDate: isDisbursed ? 'Disbursed via e-Kosh' : 'Pending Verification',
          sanctionOrderNo: m.treasuryRefNo ? `e-Kosh: ${m.treasuryRefNo}` : 'Treasury Desk',
          invoiceNo: `INV-2026-0${m.milestoneNumber}`
        });
      });
    });
  } else {
    // No contracts yet — show zero values
    totalContracted = 0;
    totalReceived = 0;
    totalPending = 0;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Page Title Card */}
      <div className="gov-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A2540', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IndianRupee size={22} color="#059669" /> Financial Contracts & Treasury Disbursements
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
              Phase 6 Official Government contract execution & e-Kosh direct electronic transfer releases
            </p>
          </div>

          <button onClick={() => setIsSubmitModalOpen(true)} className="btn-emerald">
            <Upload size={16} /> Submit Deliverable for Payment
          </button>
        </div>
      </div>

      {/* 3 Metric Financial Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {/* Total Contracted */}
        <div className="gov-card" style={{ borderLeft: '4px solid #0A2540' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>TOTAL CONTRACTED VALUE</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0A2540', margin: '0.2rem 0' }}>
            {formatCurrency(totalContracted)}
          </div>
          <span style={{ fontSize: '0.725rem', color: '#64748B' }}>
            Executed State Contracts
          </span>
        </div>

        {/* Amount Received */}
        <div className="gov-card" style={{ borderLeft: '4px solid #059669' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>AMOUNT RECEIVED (DISBURSED)</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', margin: '0.2rem 0' }}>
            {formatCurrency(totalReceived)}
          </div>
          <span style={{ fontSize: '0.725rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <CheckCircle2 size={12} /> Transferred via Treasury e-Kosh
          </span>
        </div>

        {/* Pending Amount */}
        <div className="gov-card" style={{ borderLeft: '4px solid #D97706' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>UPCOMING / PENDING AMOUNT</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D97706', margin: '0.2rem 0' }}>
            {formatCurrency(totalPending)}
          </div>
          <span style={{ fontSize: '0.725rem', color: '#D97706', fontWeight: 600 }}>
            Milestone Deliverables Pending Release
          </span>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="gov-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Receipt size={18} color="#0A2540" /> Treasury Disbursement Log & Sanction Vouchers
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569' }}>
                <th style={{ padding: '0.75rem' }}>Treasury / Ref ID</th>
                <th style={{ padding: '0.75rem' }}>Milestone Deliverable</th>
                <th style={{ padding: '0.75rem' }}>Contract Ref</th>
                <th style={{ padding: '0.75rem' }}>Amount</th>
                <th style={{ padding: '0.75rem' }}>Disbursement Status</th>
                <th style={{ padding: '0.75rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paymentRecords.map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0A2540' }}>{p.id}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <strong style={{ display: 'block', color: '#0A2540' }}>{p.milestone}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{p.contractTitle}</span>
                  </td>
                  <td style={{ padding: '0.75rem', color: '#475569', fontSize: '0.8rem' }}>{p.contractNumber}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: p.isDisbursed ? '#059669' : '#D97706' }}>
                    {formatCurrency(p.amount)}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={p.isDisbursed ? 'badge badge-emerald' : 'badge badge-saffron'} style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      {p.isDisbursed ? <>Disbursed <CheckCircle2 size={12} /></> : formatText(p.status || 'Under Review')}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <button 
                      onClick={() => alert(`Downloading Treasury Voucher PDF & Sanction Order for ${p.id}`)}
                      className="btn-secondary" 
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      <Download size={12} /> Voucher PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Milestone Deliverable Modal */}
      {isSubmitModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSubmitModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540' }}>Submit Milestone Deliverable</h3>
              <button onClick={() => setIsSubmitModalOpen(false)} className="btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleMilestoneSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Active Contract *</label>
                  <select
                    value={selectedContractId}
                    onChange={e => setSelectedContractId(e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="">-- Choose Contract --</option>
                    {contracts.map(c => (
                      <option key={c._id} value={c._id}>
                        {c.contractNumber} — {formatText(c.contractTitle)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Milestone Number *</label>
                  <select
                    value={selectedMilestoneNum}
                    onChange={e => setSelectedMilestoneNum(Number(e.target.value))}
                    className="form-select"
                  >
                    <option value={1}>Milestone #1: Phase 1 Setup & Deployment</option>
                    <option value={2}>Milestone #2: Phase 2 HMIS Trial Integration</option>
                    <option value={3}>Milestone #3: Phase 3 Performance Audit</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Deliverable Document Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Phase 1 OPD Hardware & Camera Installation Report.pdf"
                    value={evidenceName}
                    onChange={e => setEvidenceName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Technical Deliverable Notes</label>
                  <textarea
                    rows="2"
                    placeholder="Summary of completed milestones and verification logs..."
                    value={evidenceNotes}
                    onChange={e => setEvidenceNotes(e.target.value)}
                    className="form-textarea"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsSubmitModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-emerald">
                  <Upload size={16} /> {isSubmitting ? 'Submitting Deliverable...' : 'Submit Deliverable for Verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StartupPaymentsTab;

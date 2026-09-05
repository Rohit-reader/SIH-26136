import React from 'react';
import { 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Download, 
  Building2, 
  ShieldCheck, 
  ArrowUpRight,
  Receipt
} from 'lucide-react';
import { formatText, formatCurrency } from '../../utils/textUtils';

export const StartupPaymentsTab = ({ pilots = [] }) => {
  // Aggregate payment totals across active pilots or fallback defaults
  let totalContracted = 0;
  let totalReceived = 0;
  let totalPending = 0;

  const paymentRecords = [];

  if (pilots.length === 0) {
    totalContracted = 1420000;
    totalReceived = 994000;
    totalPending = 426000;

    paymentRecords.push(
      {
        id: 'PAY-8421',
        pilotName: 'SmartOPD District Hospital Pilot',
        milestone: 'Milestone #1: Hardware & Kiosk Setup',
        amount: 426000,
        status: 'Paid',
        releasedDate: '2026-06-05',
        sanctionOrderNo: 'MH-FIN-2026-SO-8411',
        invoiceNo: 'INV-2026-001'
      },
      {
        id: 'PAY-8422',
        pilotName: 'SmartOPD District Hospital Pilot',
        milestone: 'Milestone #2: HMIS Integration & WhatsApp Live',
        amount: 568000,
        status: 'Paid',
        releasedDate: '2026-07-08',
        sanctionOrderNo: 'MH-FIN-2026-SO-8924',
        invoiceNo: 'INV-2026-002'
      },
      {
        id: 'PAY-8423',
        pilotName: 'SmartOPD District Hospital Pilot',
        milestone: 'Milestone #3: 75-Day Trial & Performance Audit',
        amount: 426000,
        status: 'Pending',
        releasedDate: 'Expected Aug 2026',
        sanctionOrderNo: 'Pending Treasury Clearance',
        invoiceNo: 'DRAFT-INV-003'
      }
    );
  } else {
    pilots.forEach(pilot => {
      totalContracted += (pilot.contractedBudget || 0);
      pilot.milestones?.forEach(m => {
        if (m.status === 'Paid') {
          totalReceived += (m.amount || 0);
        } else {
          totalPending += (m.amount || 0);
        }

        paymentRecords.push({
          id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
          pilotName: pilot.pilotTitle || 'Field Pilot',
          milestone: `Milestone #${m.milestoneNumber}: ${m.title}`,
          amount: m.amount,
          status: m.status === 'Paid' ? 'Paid' : 'Pending',
          releasedDate: m.status === 'Paid' ? 'Released' : 'Pending Verification',
          sanctionOrderNo: m.approvedBy ? `MH-FIN-2026-SO-${m.milestoneNumber}04` : 'Treasury Desk',
          invoiceNo: `INV-2026-0${m.milestoneNumber}`
        });
      });
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Page Title Card */}
      <div className="gov-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A2540', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DollarSign size={22} color="#059669" /> Financial Track & Milestone Disbursements
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
              Official government treasury release schedule for outcome-based field trials
            </p>
          </div>

          <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
            Direct Treasury Electronic Transfer (e-Kosh)
          </span>
        </div>
      </div>

      {/* 3 Metric Financial Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        
        {/* Total Contracted */}
        <div className="gov-card" style={{ borderLeft: '4px solid #0A2540' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>TOTAL CONTRACTED AMOUNT</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0A2540', margin: '0.2rem 0' }}>
            {formatCurrency(totalContracted)}
          </div>
          <span style={{ fontSize: '0.725rem', color: '#64748B' }}>
            Across Active Field Pilots
          </span>
        </div>

        {/* Amount Received */}
        <div className="gov-card" style={{ borderLeft: '4px solid #059669' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>AMOUNT RECEIVED (DISBURSED)</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', margin: '0.2rem 0' }}>
            {formatCurrency(totalReceived)}
          </div>
          <span style={{ fontSize: '0.725rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <CheckCircle2 size={12} /> Transferred to Bank Account
          </span>
        </div>

        {/* Pending Amount */}
        <div className="gov-card" style={{ borderLeft: '4px solid #D97706' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>UPCOMING / PENDING AMOUNT</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D97706', margin: '0.2rem 0' }}>
            {formatCurrency(totalPending)}
          </div>
          <span style={{ fontSize: '0.725rem', color: '#D97706', fontWeight: 600 }}>
            Milestone #3 Verification Due
          </span>
        </div>

      </div>

      {/* Payment History Table */}
      <div className="gov-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Receipt size={18} color="#0A2540" /> Disbursement Schedule & Payment History
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569' }}>
                <th style={{ padding: '0.75rem' }}>Payment ID</th>
                <th style={{ padding: '0.75rem' }}>Milestone / Description</th>
                <th style={{ padding: '0.75rem' }}>Sanction Order Ref</th>
                <th style={{ padding: '0.75rem' }}>Amount</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paymentRecords.map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0A2540' }}>{p.id}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <strong style={{ display: 'block', color: '#0A2540' }}>{p.milestone}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{p.pilotName}</span>
                  </td>
                  <td style={{ padding: '0.75rem', color: '#475569', fontSize: '0.8rem' }}>{p.sanctionOrderNo}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: p.status === 'Paid' ? '#059669' : '#D97706' }}>
                    {formatCurrency(p.amount)}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={p.status === 'Paid' ? 'badge badge-emerald' : 'badge badge-saffron'} style={{ fontSize: '0.7rem' }}>
                      {p.status === 'Paid' ? 'Disbursed ✓' : 'Under Treasury Review'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <button 
                      onClick={() => alert(`Downloading Sanction Order PDF & Invoice ${p.invoiceNo}`)}
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

    </div>
  );
};

export default StartupPaymentsTab;

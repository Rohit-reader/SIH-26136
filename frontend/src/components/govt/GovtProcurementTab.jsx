import React from 'react';
import { ShoppingBag, FileText, CheckCircle2, ShieldCheck, IndianRupee, ExternalLink } from 'lucide-react';
import { formatText, formatCurrency } from '../../utils/textUtils';

export const GovtProcurementTab = ({ pilots = [], scaleUps = [], auditLogs = [] }) => {
  const paidMilestones = pilots.flatMap(p => p.milestones.filter(m => m.status === 'Paid').map(m => ({
    ...m,
    pilotTitle: p.pilotTitle,
    startupName: p.startupId?.name || 'HealthAI Solutions Pvt Ltd'
  })));

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0A2540' }}>
          State Procurement & GeM Marketplace Integration Desk
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
          GeM Innovation Runway contract references, milestone payment audit history, and direct MSINS sanction orders
        </p>
      </div>

      {/* GeM Integration & Procurement Recommendation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <div className="gov-card" style={{ borderLeft: '4px solid #0A2540' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <ShoppingBag size={22} color="#0A2540" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540' }}>GeM Innovation Portal Reference</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '0.75rem' }}>
            Reference Number: <strong>GEM-MSINS-2026-AGRI-00982</strong>
          </p>
          <span className="badge badge-emerald">Direct Contract Sanction Active</span>
        </div>

        <div className="gov-card" style={{ borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <ShieldCheck size={22} color="#059669" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#059669' }}>Procurement Relaxation Status</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '0.75rem' }}>
            Prior Turnover & Experience Exemption Applied under Maharashtra Startup Policy 2026
          </p>
          <span className="badge badge-dpiit">DPIIT Compliant</span>
        </div>
      </div>

      {/* Milestone Payment Audit History */}
      <div className="gov-card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', marginBottom: '1rem' }}>
          Disbursed Milestone Payment Audit History
        </h3>
        <table className="gov-table">
          <thead>
            <tr>
              <th>Pilot & Startup</th>
              <th>Milestone Title</th>
              <th>Disbursed Amount</th>
              <th>Status</th>
              <th>Approved By</th>
            </tr>
          </thead>
          <tbody>
            {paidMilestones.map((m, idx) => (
              <tr key={idx}>
                <td>
                  <span style={{ fontWeight: 700, color: '#0A2540' }}>{formatText(m.startupName)}</span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B' }}>{formatText(m.pilotTitle)}</span>
                </td>
                <td><strong style={{ color: '#0F172A' }}>#{m.milestoneNumber}: {formatText(m.title)}</strong></td>
                <td><span style={{ fontWeight: 800, color: '#059669' }}>{formatCurrency(m.amount)}</span></td>
                <td><span className="badge badge-emerald"><CheckCircle2 size={12} /> {formatText(m.status)}</span></td>
                <td><span style={{ fontSize: '0.8rem', color: '#475569' }}>{m.approvedBy || 'Procurement Desk'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React from 'react';
import { formatText, formatCurrency } from '../../utils/textUtils';

/**
 * Startup Funding & Milestone Progress Donut/Segment Chart
 */
export const StartupFundingChart = ({ paidAmount = 994000, totalAmount = 1420000 }) => {
  const percent = Math.round((paidAmount / totalAmount) * 100);
  const strokeDasharray = `${percent} 100`;

  return (
    <div className="gov-card">
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.35rem' }}>
        Milestone Grant Disbursement Analytics
      </h3>
      <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem' }}>
        Approved milestone funding vs remaining pilot budget
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* SVG Donut Ring */}
        <div style={{ position: 'relative', width: '130px', height: '130px' }}>
          <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="3.8"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#059669"
              strokeWidth="3.8"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
            />
          </svg>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>{percent}%</span>
            <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700 }}>DISBURSED</span>
          </div>
        </div>

        {/* Breakdown details */}
        <div style={{ flex: 1, minWidth: '180px' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>PAID MILESTONES</span>
            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>{formatCurrency(paidAmount)}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>TOTAL PILOT SANCTION</span>
            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0A2540' }}>{formatCurrency(totalAmount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Multi-Criteria Evaluation Scores Horizontal Radar Bar Chart
 */
export const EvaluationCriteriaChart = ({ scores = {} }) => {
  const criteria = [
    { name: 'Technical Feasibility (20%)', score: scores.technicalFeasibility || 94, color: '#0A2540' },
    { name: 'Innovation & IP (20%)', score: scores.innovation || 95, color: '#2563EB' },
    { name: 'Expected Impact (20%)', score: scores.expectedImpact || 96, color: '#059669' },
    { name: 'Scalability (15%)', score: scores.scalability || 90, color: '#7C3AED' },
    { name: 'Cost Effectiveness (10%)', score: scores.costEffectiveness || 88, color: '#D97706' },
    { name: 'Cybersecurity (10%)', score: scores.security || 98, color: '#0284C7' },
    { name: 'Team Capability (5%)', score: scores.teamCapability || 95, color: '#166534' }
  ];

  return (
    <div className="gov-card">
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.35rem' }}>
        Multi-Criteria Evaluation Score Distribution
      </h3>
      <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem' }}>
        Standardized 7-dimension scoring weights for technical proposal evaluation
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {criteria.map((c) => (
          <div key={c.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
              <span style={{ fontWeight: 600, color: '#334155' }}>{c.name}</span>
              <strong style={{ color: c.color }}>{c.score} / 100</strong>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${c.score}%`, 
                  height: '100%', 
                  backgroundColor: c.color, 
                  borderRadius: '9999px',
                  transition: 'width 0.6s ease'
                }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

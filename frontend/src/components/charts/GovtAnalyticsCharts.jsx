import React from 'react';
import { formatText, formatCurrency } from '../../utils/textUtils';

/**
 * Interactive Budget Allocation Bar Chart
 */
export const DepartmentBudgetChart = ({ departments = [] }) => {
  const maxBudget = Math.max(...departments.map(d => d.annualInnovationBudget || 15000000), 25000000);

  return (
    <div className="gov-card">
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.35rem' }}>
        Department Innovation Budget Allocation
      </h3>
      <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem' }}>
        Annual allocated innovation funds across Maharashtra government departments
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {departments.map((dept, idx) => {
          const budget = dept.annualInnovationBudget || (idx === 0 ? 15000000 : idx === 1 ? 20000000 : 12000000);
          const percent = Math.min(Math.round((budget / maxBudget) * 100), 100);
          const barColor = idx === 0 ? '#0A2540' : idx === 1 ? '#D97706' : '#2563EB';

          return (
            <div key={dept._id || idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>{formatText(dept.name)}</span>
                <strong style={{ color: barColor }}>{formatCurrency(budget)}</strong>
              </div>
              <div style={{ width: '100%', height: '12px', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${percent}%`, 
                    height: '100%', 
                    backgroundColor: barColor, 
                    borderRadius: '9999px',
                    transition: 'width 0.6s ease'
                  }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Innovation Funnel Stage Conversion Bar Chart
 */
export const InnovationFunnelChart = ({ 
  challengesCount = 5, 
  proposalsCount = 5, 
  evaluationsCount = 5, 
  pilotsCount = 2, 
  scaledCount = 1 
}) => {
  const stages = [
    { label: 'Published Challenges', count: challengesCount, color: '#0A2540', max: 5 },
    { label: 'Startup Applications', count: proposalsCount, color: '#2563EB', max: 5 },
    { label: 'Expert Evaluations', count: evaluationsCount, color: '#7C3AED', max: 5 },
    { label: 'Controlled Pilots', count: pilotsCount, color: '#059669', max: 5 },
    { label: 'Statewide Scaled', count: scaledCount, color: '#166534', max: 5 }
  ];

  return (
    <div className="gov-card">
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.35rem' }}>
        Innovation Procurement Funnel Velocity
      </h3>
      <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1.25rem' }}>
        Conversion rate across lifecycle stages from Problem Discovery to Statewide Scale
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {stages.map((stage) => {
          const widthPct = Math.max(Math.round((stage.count / stage.max) * 100), 15);

          return (
            <div key={stage.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>{stage.label}</span>
                <strong style={{ color: stage.color }}>{stage.count} Projects ({widthPct}%)</strong>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${widthPct}%`, 
                    height: '100%', 
                    backgroundColor: stage.color, 
                    borderRadius: '9999px',
                    transition: 'width 0.6s ease'
                  }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

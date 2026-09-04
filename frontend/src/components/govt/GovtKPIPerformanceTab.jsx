import React from 'react';
import { Activity, CheckCircle2, TrendingUp, ShieldCheck, DollarSign } from 'lucide-react';
import { formatText } from '../../utils/textUtils';

export const GovtKPIPerformanceTab = ({ pilots = [] }) => {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0A2540' }}>
          KPI Telemetry & Pilot Performance Metrics Dashboard
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
          Live field performance metrics, baseline vs target telemetry tracking, and pilot outcome success scores
        </p>
      </div>

      {/* KPI Overview Grid per Pilot */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {pilots.map((pilot) => {
          const scoreBreakdown = pilot.scoreBreakdown || {
            kpiAchievement: 95,
            technicalPerformance: 92,
            costEfficiency: 84,
            security: 90,
            scalability: 88
          };

          return (
            <div key={pilot._id} className="gov-card">
              {/* Pilot Title & Success Score */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span className="badge badge-navy" style={{ marginBottom: '0.4rem' }}>{formatText(pilot.validationStatus)}</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0A2540' }}>{formatText(pilot.pilotTitle)}</h3>
                  <p style={{ fontSize: '0.825rem', color: '#64748B' }}>Location: {formatText(pilot.location)}</p>
                </div>
                <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '10px', padding: '0.75rem 1.25rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669' }}>{pilot.pilotSuccessScore || 92.5}</span>
                  <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#047857' }}>PILOT SUCCESS SCORE</span>
                </div>
              </div>

              {/* KPI Telemetry Rows */}
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.75rem' }}>
                Live KPI Baseline vs Target Performance Telemetry
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {pilot.kpiTracking?.map((kpi, idx) => (
                  <div key={idx} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 700, color: '#0A2540', fontSize: '0.9rem' }}>{formatText(kpi.metricName)}</span>
                      <span className="badge badge-emerald"><CheckCircle2 size={12} /> {formatText(kpi.status)}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                      <div>Baseline: <strong style={{ color: '#DC2626' }}>{kpi.baseline}</strong></div>
                      <div>Target: <strong style={{ color: '#2563EB' }}>{kpi.target}</strong></div>
                      <div>Current Live: <strong style={{ color: '#059669' }}>{kpi.currentLive}</strong></div>
                    </div>

                    {/* Telemetry Progress Bar */}
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#CBD5E1', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '100%', backgroundColor: '#059669', borderRadius: '9999px' }}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Performance Radar Breakdown */}
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.75rem' }}>
                Technical & Operational Score Breakdown
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>KPI ACHIEVEMENT</span>
                  <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0A2540' }}>{scoreBreakdown.kpiAchievement}%</p>
                </div>
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>TECH PERFORMANCE</span>
                  <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563EB' }}>{scoreBreakdown.technicalPerformance}%</p>
                </div>
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>COST EFFECTIVENESS</span>
                  <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#D97706' }}>{scoreBreakdown.costEfficiency}%</p>
                </div>
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>CYBERSECURITY</span>
                  <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>{scoreBreakdown.security}%</p>
                </div>
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>SCALABILITY</span>
                  <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#7C3AED' }}>{scoreBreakdown.scalability}%</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

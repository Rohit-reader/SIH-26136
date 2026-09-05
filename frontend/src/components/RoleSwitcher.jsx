import React from 'react';
import { Building2, Rocket, Scale, ShieldCheck, Eye } from 'lucide-react';

export const RoleSwitcher = ({ currentRole, onRoleChange }) => {
  const roles = [
    { id: 'govt', label: 'Government Officer', icon: Building2, desc: 'Challenge Builder & AI Assistant' },
    { id: 'startup', label: 'Startup Admin', icon: Rocket, desc: 'AI Semantic Discovery & Proposal' },
    { id: 'evaluator', label: 'Domain Evaluator', icon: Scale, desc: 'COI Declaration & Scorecard' },
    { id: 'validator', label: 'Independent Validator', icon: ShieldCheck, desc: 'Pilot Score & Statewide Scale' },
    { id: 'public', label: 'Public Portal', icon: Eye, desc: 'Open Transparency View' }
  ];

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      padding: '0.75rem 1.5rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Interactive Demo Role:
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = currentRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => onRoleChange(role.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isActive ? '1px solid #0A2540' : '1px solid #CBD5E1',
                  backgroundColor: isActive ? '#0A2540' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#334155',
                  boxShadow: isActive ? '0 2px 4px rgba(10,37,64,0.15)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} color={isActive ? '#FF9933' : '#0A2540'} />
                <span>{role.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

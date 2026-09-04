import React, { useState } from 'react';
import { LogIn, Shield, Building2, Rocket, Scale, ShieldCheck, Lock, User } from 'lucide-react';
import { formatText } from '../utils/textUtils';

export const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const demoAccounts = [
    {
      roleId: 'govt',
      roleName: 'Government Officer',
      name: 'Dr. Radhakishan Pawar',
      dept: 'Public Health Department',
      email: 'health.officer@maharashtra.gov.in',
      icon: Building2,
      badgeColor: '#EFF6FF',
      textColor: '#1E3A8A'
    },
    {
      roleId: 'startup',
      roleName: 'Startup Admin',
      name: 'Dr. Vikram Deshmukh',
      dept: 'HealthAI Solutions Pvt Ltd',
      email: 'admin@healthai.in',
      icon: Rocket,
      badgeColor: '#FFFBEB',
      textColor: '#D97706'
    },
    {
      roleId: 'evaluator',
      roleName: 'Domain Evaluator',
      name: 'Dr. Anand Sharma',
      dept: 'IIT Bombay / HealthTech Expert',
      email: 'anand.eval@iitb.ac.in',
      icon: Scale,
      badgeColor: '#F5F3FF',
      textColor: '#7C3AED'
    },
    {
      roleId: 'validator',
      roleName: 'Independent Validator',
      name: 'Dr. Rameshwar Naik',
      dept: 'Maharashtra Quality Control Board',
      email: 'validator@msins.in',
      icon: ShieldCheck,
      badgeColor: '#ECFDF5',
      textColor: '#059669'
    }
  ];

  const handleCustomLogin = (e) => {
    e.preventDefault();
    if (!email) return alert('Please enter your official email address');
    
    // Find matching demo account or default to govt officer
    const matched = demoAccounts.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      onLoginSuccess(matched);
    } else {
      onLoginSuccess({
        roleId: 'govt',
        roleName: 'Government Officer',
        name: 'Government Officer',
        dept: 'Government Department',
        email: email
      });
    }
    onClose();
  };

  const handleSelectPreset = (account) => {
    onLoginSuccess(account);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        {/* Modal Header */}
        <div className="modal-header" style={{ backgroundColor: '#0A2540', color: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '0.5rem', borderRadius: '50%' }}>
              <Shield size={22} color="#FF9933" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF' }}>
                GovInnovate Portal Authentication
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Government of Maharashtra Official Sign-In
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="btn-secondary" 
            style={{ padding: '0.2rem 0.5rem', backgroundColor: 'transparent', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Quick Official Role Preset Sign-In Buttons */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '0.65rem' }}>
              Select Authorized Official Account to Sign In:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {demoAccounts.map((acc) => {
                const Icon = acc.icon;
                return (
                  <button
                    key={acc.roleId}
                    onClick={() => handleSelectPreset(acc)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      padding: '0.75rem 1rem',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseOver={e => e.currentTarget.style.borderColor = '#0A2540'}
                    onMouseOut={e => e.currentTarget.style.borderColor = '#E2E8F0'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ backgroundColor: acc.badgeColor, padding: '0.5rem', borderRadius: '50%' }}>
                        <Icon size={18} color={acc.textColor} />
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.9rem', color: '#0A2540', display: 'block' }}>
                          {acc.name}
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                          {acc.roleName} • {acc.dept}
                        </span>
                      </div>
                    </div>
                    <span className="badge badge-navy" style={{ fontSize: '0.7rem' }}>
                      Sign In →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.25rem 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }}></div>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>OR LOGIN WITH EMAIL</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }}></div>
          </div>

          {/* Custom Credentials Form */}
          <form onSubmit={handleCustomLogin}>
            <div className="form-group">
              <label className="form-label">Official Email Address</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#64748B" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                <input
                  type="email"
                  placeholder="e.g. officer@maharashtra.gov.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
              <span style={{ fontSize: '0.725rem', color: '#64748B', marginTop: '0.25rem', display: 'block' }}>
                Development Master Password: <code>GovInnovate@2026</code>
              </span>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
              <LogIn size={16} /> Sign In to Portal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

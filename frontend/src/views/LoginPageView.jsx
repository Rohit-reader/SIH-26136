import React, { useState } from 'react';
import { 
  Shield, 
  LogIn, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Building2, 
  Rocket, 
  Scale, 
  ShieldCheck, 
  UserCheck, 
  HelpCircle,
  ArrowLeft,
  KeyRound,
  AlertCircle,
  X,
  ArrowRight
} from 'lucide-react';
import { MaharashtraEmblem } from '../components/Emblems';
import { formatText } from '../utils/textUtils';

export const LoginPageView = ({ onLoginSuccess, onNavigateToLanding, isModal = false, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const demoAccounts = [
    {
      id: 'govt_1',
      roleId: 'govt',
      category: 'govt',
      roleName: 'Government Officer',
      name: 'Dr. Radhakishan Pawar',
      dept: 'Public Health Department, Govt of MH',
      email: 'health.officer@maharashtra.gov.in',
      defaultPassword: 'GovInnovate@2026',
      icon: Building2,
      badgeColor: '#EFF6FF',
      textColor: '#1E3A8A',
      accentBorder: '#3B82F6',
      description: 'Publishes outcome challenges & manages pilot allocations'
    },
    {
      id: 'govt_2',
      roleId: 'govt',
      category: 'govt',
      roleName: 'Government Admin',
      name: 'Sanjay Khandare, IAS',
      dept: 'Maharashtra State Innovation Society (MSInS)',
      email: 'govtadmin@maharashtra.gov.in',
      defaultPassword: 'GovInnovate@2026',
      icon: Building2,
      badgeColor: '#EFF6FF',
      textColor: '#1E3A8A',
      accentBorder: '#2563EB',
      description: 'Supervises statewide innovation policy & departmental workflows'
    },
    {
      id: 'startup_1',
      roleId: 'startup',
      category: 'startup',
      roleName: 'Startup Admin / Innovator',
      name: 'Dr. Vikram Deshmukh',
      dept: 'HealthAI Solutions Pvt Ltd (DPIIT Reg: DIPP10984)',
      email: 'admin@healthai.in',
      defaultPassword: 'GovInnovate@2026',
      icon: Rocket,
      badgeColor: '#FFFBEB',
      textColor: '#D97706',
      accentBorder: '#F59E0B',
      description: 'Discovers govt challenges, submits technical & financial proposals'
    },
    {
      id: 'evaluator_1',
      roleId: 'evaluator',
      category: 'evaluator',
      roleName: 'Technical & Domain Evaluator',
      name: 'Dr. Anand Sharma',
      dept: 'IIT Bombay / HealthTech Expert',
      email: 'anand.eval@iitb.ac.in',
      defaultPassword: 'GovInnovate@2026',
      icon: Scale,
      badgeColor: '#F5F3FF',
      textColor: '#7C3AED',
      accentBorder: '#8B5CF6',
      description: 'Evaluates proposals, signs COI declarations & submits scorecards'
    },
    {
      id: 'validator_1',
      roleId: 'validator',
      category: 'validator',
      roleName: 'Independent Quality Validator',
      name: 'Dr. Rameshwar Naik',
      dept: 'Maharashtra Quality Control Board',
      email: 'validator@msins.in',
      defaultPassword: 'GovInnovate@2026',
      icon: ShieldCheck,
      badgeColor: '#ECFDF5',
      textColor: '#059669',
      accentBorder: '#10B981',
      description: 'Inspects field pilot KPI data & approves statewide GeM scale-up'
    },
    {
      id: 'superadmin_1',
      roleId: 'govt',
      category: 'admin',
      roleName: 'Platform Super Admin',
      name: 'Rajesh V. Sharma',
      dept: 'State IT & Innovation Cell',
      email: 'superadmin@govinnovate.maharashtra.gov.in',
      defaultPassword: 'GovInnovate@2026',
      icon: UserCheck,
      badgeColor: '#FEF2F2',
      textColor: '#991B1B',
      accentBorder: '#EF4444',
      description: 'Full platform administration, audit logs & system metrics'
    }
  ];

  const filteredAccounts = activeCategory === 'all' 
    ? demoAccounts 
    : demoAccounts.filter(acc => acc.category === activeCategory);

  const handleSelectDemoUser = (account) => {
    setSelectedDemo(account);
    setEmail(account.email);
    setPassword(account.defaultPassword);
    setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Find matching demo account or create user payload
      const matched = demoAccounts.find(a => a.email.toLowerCase() === email.trim().toLowerCase());
      
      let userAccount;
      if (matched) {
        userAccount = matched;
      } else if (selectedDemo) {
        userAccount = selectedDemo;
      } else {
        // Fallback user matching email pattern
        const isStartupEmail = email.toLowerCase().includes('startup') || email.toLowerCase().includes('admin@');
        const isEvalEmail = email.toLowerCase().includes('eval') || email.toLowerCase().includes('iit');
        const isValEmail = email.toLowerCase().includes('validator') || email.toLowerCase().includes('qc');

        let defaultRole = 'govt';
        let defaultRoleName = 'Government Officer';
        if (isStartupEmail) { defaultRole = 'startup'; defaultRoleName = 'Startup Admin'; }
        else if (isEvalEmail) { defaultRole = 'evaluator'; defaultRoleName = 'Domain Evaluator'; }
        else if (isValEmail) { defaultRole = 'validator'; defaultRoleName = 'Independent Validator'; }

        userAccount = {
          roleId: defaultRole,
          roleName: defaultRoleName,
          name: email.split('@')[0].replace('.', ' ').toUpperCase(),
          dept: 'Government Department',
          email: email.trim()
        };
      }

      setIsLoading(false);
      onLoginSuccess(userAccount);
      if (onClose) onClose();
    }, 400);
  };

  return (
    <div style={{
      minHeight: isModal ? 'auto' : '100vh',
      backgroundColor: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Top Banner (Only in non-modal view) */}
      {!isModal && (
        <header style={{
          backgroundColor: '#0A2540',
          color: '#FFFFFF',
          padding: '1rem 1.5rem',
          borderBottom: '4px solid #FF9933',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <MaharashtraEmblem className="govt-emblem-img" style={{ width: '40px', height: '40px' }} />
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  GovInnovate Portal
                </h1>
                <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>
                  Government of Maharashtra • Unified User Authentication Portal
                </p>
              </div>
            </div>

            {onNavigateToLanding && (
              <button 
                onClick={onNavigateToLanding}
                className="btn-secondary"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)', padding: '0.4rem 0.85rem' }}
              >
                <ArrowLeft size={16} /> Back to Landing Page
              </button>
            )}
          </div>
        </header>
      )}

      {/* Main Login Workspace Container */}
      <div style={{
        flex: 1,
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: isModal ? '1rem' : '2.5rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: isModal ? '1fr' : 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Left Column: Portal Overview & Credentials Form */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 25px -5px rgba(10,37,64,0.08)',
            overflow: 'hidden'
          }}>
            {/* Header Section */}
            <div style={{
              backgroundColor: '#0A2540',
              padding: '1.5rem 1.75rem',
              color: '#FFFFFF',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ backgroundColor: 'rgba(255,153,51,0.2)', padding: '0.5rem', borderRadius: '50%' }}>
                  <Shield size={24} color="#FF9933" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                    User Account Sign-In
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>
                    Enter your email & password or select a demo role profile
                  </p>
                </div>
              </div>

              {isModal && onClose && (
                <button 
                  onClick={onClose} 
                  style={{
                    position: 'absolute',
                    top: '1.25rem',
                    right: '1.25rem',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Form Section */}
            <div style={{ padding: '1.75rem' }}>
              {errorMessage && (
                <div style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#991B1B',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertCircle size={16} color="#DC2626" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {selectedDemo && (
                <div style={{
                  backgroundColor: selectedDemo.badgeColor,
                  border: `1px solid ${selectedDemo.accentBorder}`,
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <CheckCircle2 size={18} color={selectedDemo.textColor} />
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: selectedDemo.textColor, display: 'block' }}>
                        SELECTED DEMO USER PROFILE
                      </span>
                      <strong style={{ fontSize: '0.875rem', color: '#0A2540' }}>
                        {selectedDemo.name} ({selectedDemo.roleName})
                      </strong>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedDemo(null);
                      setEmail('');
                      setPassword('');
                    }}
                    style={{ fontSize: '0.75rem', color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Clear
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ fontWeight: 600, color: '#334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Email Address</span>
                    <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Official / Registered Email</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      required
                      placeholder="e.g. officer@maharashtra.gov.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '2.5rem', width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ fontWeight: 600, color: '#334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Password</span>
                    <button 
                      type="button" 
                      onClick={() => setPassword('GovInnovate@2026')}
                      style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.725rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Fill Master Password
                    </button>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', width: '100%', boxSizing: 'border-box' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#64748B',
                        cursor: 'pointer'
                      }}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                    <span style={{ fontSize: '0.725rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <KeyRound size={12} color="#059669" /> Demo Password: <code style={{ backgroundColor: '#F1F5F9', padding: '0.1rem 0.35rem', borderRadius: '4px', color: '#0F172A' }}>GovInnovate@2026</code>
                    </span>
                  </div>
                </div>

                {/* Remember Me & Options */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: '#475569', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ borderRadius: '4px', cursor: 'pointer' }}
                    />
                    Remember credentials
                  </label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('For demo environment, use any official email with password: GovInnovate@2026 or pick a Demo User below.'); }} style={{ fontSize: '0.8rem', color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '0.85rem',
                    fontSize: '1rem',
                    boxShadow: '0 4px 12px rgba(10,37,64,0.2)',
                    cursor: isLoading ? 'wait' : 'pointer'
                  }}
                >
                  {isLoading ? (
                    <span>Authenticating User...</span>
                  ) : (
                    <>
                      <LogIn size={18} /> Sign In to Portal
                    </>
                  )}
                </button>
              </form>

              {/* Quick Auto Login shortcut if demo user is picked */}
              {selectedDemo && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn-emerald"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    fontSize: '0.9rem'
                  }}
                >
                  <UserCheck size={16} /> Instant Log In as {selectedDemo.name.split(' ')[0]}
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Demo User Select Option */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 25px -5px rgba(10,37,64,0.08)',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                  Demo User Select Option
                </h3>
                <p style={{ fontSize: '0.775rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
                  Select any pre-configured official profile to auto-fill credentials:
                </p>
              </div>
              <span className="badge badge-saffron" style={{ fontSize: '0.7rem' }}>
                6 Roles Available
              </span>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              {[
                { id: 'all', label: 'All Roles' },
                { id: 'govt', label: 'Govt Officer' },
                { id: 'startup', label: 'Startup Admin' },
                { id: 'evaluator', label: 'Evaluator' },
                { id: 'validator', label: 'Validator' },
                { id: 'admin', label: 'Super Admin' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: '0.3rem 0.65rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    border: activeCategory === cat.id ? '1px solid #0A2540' : '1px solid #CBD5E1',
                    backgroundColor: activeCategory === cat.id ? '#0A2540' : '#F8FAFC',
                    color: activeCategory === cat.id ? '#FFFFFF' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Demo User Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.25rem' }}>
              {filteredAccounts.map((acc) => {
                const Icon = acc.icon;
                const isSelected = selectedDemo?.id === acc.id;

                return (
                  <div
                    key={acc.id}
                    onClick={() => handleSelectDemoUser(acc)}
                    style={{
                      border: isSelected ? `2px solid ${acc.accentBorder}` : '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '0.85rem 1rem',
                      backgroundColor: isSelected ? acc.badgeColor : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                    }}
                    onMouseOver={(e) => {
                      if (!isSelected) e.currentTarget.style.borderColor = '#94A3B8';
                    }}
                    onMouseOut={(e) => {
                      if (!isSelected) e.currentTarget.style.borderColor = '#E2E8F0';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <div style={{
                          backgroundColor: acc.badgeColor,
                          border: `1px solid ${acc.accentBorder}`,
                          padding: '0.5rem',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Icon size={18} color={acc.textColor} />
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: '#0A2540', display: 'block', lineHeight: 1.2 }}>
                            {acc.name}
                          </strong>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: acc.textColor, display: 'block', marginTop: '0.15rem' }}>
                            {acc.roleName}
                          </span>
                          <span style={{ fontSize: '0.725rem', color: '#64748B', display: 'block', marginTop: '0.15rem' }}>
                            {acc.dept}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectDemoUser(acc);
                        }}
                        className={isSelected ? 'badge badge-emerald' : 'badge badge-navy'}
                        style={{ fontSize: '0.7rem', flexShrink: 0 }}
                      >
                        {isSelected ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>Selected <CheckCircle2 size={12} /></span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>Select User <ArrowRight size={12} /></span>
                        )}
                      </button>
                    </div>

                    <div style={{
                      marginTop: '0.65rem',
                      paddingTop: '0.5rem',
                      borderTop: '1px dashed #E2E8F0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.725rem',
                      color: '#64748B'
                    }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><Mail size={12} color="#64748B" /> {acc.email}</span>
                      <span style={{ fontStyle: 'italic', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><KeyRound size={12} color="#64748B" /> Master Password</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Help Note Footer */}
            <div style={{
              marginTop: '1.25rem',
              padding: '0.75rem',
              backgroundColor: '#F8FAFC',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              fontSize: '0.75rem',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <HelpCircle size={16} color="#0A2540" />
              <span>Selecting a demo user populates official credentials for instant testing of all RBAC permissions.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPageView;

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Building, 
  Rocket, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  Globe, 
  FileText, 
  TrendingUp, 
  Lock, 
  LogIn 
} from 'lucide-react';
import axios from 'axios';
import { formatText, formatCurrency } from '../utils/textUtils';

export const LandingPageView = ({ onOpenLogin }) => {
  const { t } = useTranslation();
  const [challenges, setChallenges] = useState([]);
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicData();
  }, []);

  const fetchPublicData = async () => {
    try {
      const [resC, resS] = await Promise.all([
        axios.get('/api/challenges'),
        axios.get('/api/startups')
      ]);
      setChallenges(resC.data || []);
      setStartups(resS.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      {/* Hero Banner Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0A2540 0%, #0F172A 60%, #1E3A8A 100%)',
        color: '#FFFFFF',
        padding: '3.5rem 1.5rem 4rem 1.5rem',
        boxShadow: '0 10px 25px -5px rgba(10,37,64,0.25)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem' }}>
            <Award size={14} color="#FF9933" /> <span style={{ color: '#FF9933' }}>{t('landing.badge')}</span>
          </div>

          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.25, letterSpacing: '0.5px', marginBottom: '1rem', color: '#FFFFFF' }}>
            {t('landing.heroTitle')}
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#94A3B8', maxWidth: '840px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            {t('landing.heroSubtitle')}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={onOpenLogin} className="btn-emerald" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}>
              <LogIn size={18} /> {t('landing.getStarted')}
            </button>
            <a href="#challenges-showcase" className="btn-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)', padding: '0.85rem 1.75rem', fontSize: '1rem', textDecoration: 'none' }}>
              <Search size={18} /> {t('landing.exploreChallenges')}
            </a>
          </div>
        </div>
      </section>

      {/* Platform Stats Bar */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '1.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          <div>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0A2540' }}>{challenges.length}</span>
            <p style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>{t('landing.statsChallenges')}</p>
          </div>
          <div>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#D97706' }}>{startups.length}</span>
            <p style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>{t('landing.statsStartups')}</p>
          </div>
          <div>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#059669' }}>94.8%</span>
            <p style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>{t('landing.statsPilots')}</p>
          </div>
          <div>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#166534' }}>₹4.5 Cr</span>
            <p style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>{t('landing.statsScale')}</p>
          </div>
        </div>
      </section>

      {/* Innovation Lifecycle Overview */}
      <section style={{ padding: '3.5rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.5rem' }}>
            Structured Innovation Procurement Pathway
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#64748B', maxWidth: '700px', margin: '0 auto' }}>
            A transparent and legally compliant digital workflow connecting government needs to startup technology
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div className="gov-card" style={{ borderTop: '4px solid #0A2540' }}>
            <div style={{ backgroundColor: '#EFF6FF', width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Building size={22} color="#0A2540" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.5rem' }}>
              1. Outcome Challenges
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              Government departments define operational problems, baseline metrics, expected outcomes, and allocated pilot budgets.
            </p>
          </div>

          <div className="gov-card" style={{ borderTop: '4px solid #D97706' }}>
            <div style={{ backgroundColor: '#FFFBEB', width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Rocket size={22} color="#D97706" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.5rem' }}>
              2. Startup Discovery & Matching
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              DPIIT recognized startups discover challenges and submit technical proposals with turnover and EMD exemptions applied.
            </p>
          </div>

          <div className="gov-card" style={{ borderTop: '4px solid #059669' }}>
            <div style={{ backgroundColor: '#ECFDF5', width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Award size={22} color="#059669" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.5rem' }}>
              3. Controlled Field Pilot
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              Milestone-based pilot deployment in district hospitals, schools, or farms with real-time KPI telemetry tracking.
            </p>
          </div>

          <div className="gov-card" style={{ borderTop: '4px solid #166534' }}>
            <div style={{ backgroundColor: '#F0FDF4', width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <TrendingUp size={22} color="#166534" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.5rem' }}>
              4. Independent Scale-Up
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              Quality Control Board validates pilot outcome scores and triggers statewide procurement via GeM Innovation Portal.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Published Challenges Showcase */}
      <section id="challenges-showcase" style={{ backgroundColor: '#FFFFFF', padding: '3.5rem 1.5rem', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0A2540' }}>
                Open Government Innovation Challenges
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
                Published by Maharashtra Government Departments for eligible DPIIT startups
              </p>
            </div>
            <button onClick={onOpenLogin} className="btn-primary">
              Sign In to Submit Proposal →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {challenges.slice(0, 3).map((c) => (
              <div key={c._id} className="gov-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <span className="badge badge-navy">{formatText(c.status)}</span>
                      <span className="badge badge-saffron">{formatText(c.department)}</span>
                      <span className="badge badge-emerald">{formatText(c.location)}</span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.4rem' }}>
                      {formatText(c.title)}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#334155', marginBottom: '0.85rem' }}>
                      {formatText(c.problemDescription)}
                    </p>

                    <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.75rem 1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>BASELINE</span>
                        <p style={{ fontWeight: 700, color: '#DC2626' }}>{c.currentSituation}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>EXPECTED OUTCOME</span>
                        <p style={{ fontWeight: 700, color: '#059669' }}>{formatText(c.expectedOutcome)}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>ESTIMATED BUDGET</span>
                        <p style={{ fontWeight: 700, color: '#0A2540' }}>{formatCurrency(c.estimatedBudget)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured DPIIT Startups Showcase */}
      <section style={{ padding: '3.5rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0A2540' }}>
            Verified DPIIT Startup Solutions
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
            Registered Indian startups verified under Maharashtra State Innovation Procurement Framework
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {startups.slice(0, 3).map((s) => (
            <div key={s._id} className="gov-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540' }}>{formatText(s.name)}</h3>
                <span className="badge badge-dpiit"><ShieldCheck size={12} /> DPIIT Verified</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '0.75rem' }}>{formatText(s.industryDomain)} • {formatText(s.location)}</p>
              
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {s.technologies?.map((tech, idx) => (
                  <span key={idx} style={{ backgroundColor: '#EFF6FF', color: '#1E3A8A', fontSize: '0.725rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {formatText(tech)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0A2540', color: '#94A3B8', padding: '2.5rem 1.5rem 1.5rem 1.5rem', borderTop: '4px solid #FF9933' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 700 }}>GovInnovate Platform</h4>
            <p style={{ fontSize: '0.825rem', marginTop: '0.25rem' }}>
              Maharashtra State Innovation Society • Department of Skills, Employment, Entrepreneurship and Innovation
            </p>
          </div>
          <button onClick={onOpenLogin} className="btn-secondary" style={{ backgroundColor: '#1E293B', color: '#FFFFFF', borderColor: '#334155' }}>
            <LogIn size={16} color="#FF9933" /> Sign In to Portal
          </button>
        </div>
        <div style={{ maxWidth: '1280px', margin: '1.5rem auto 0 auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', fontSize: '0.75rem' }}>
          © 2026 Government of Maharashtra. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

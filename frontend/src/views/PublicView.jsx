import React, { useState, useEffect } from 'react';
import { Eye, Search, Building2, CheckCircle2, ShieldCheck, Globe } from 'lucide-react';
import axios from 'axios';
import { formatText, formatCurrency } from '../utils/textUtils';

export const PublicView = () => {
  const [challenges, setChallenges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const res = await axios.get('/api/challenges');
      setChallenges(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = challenges.filter(c => 
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Public Banner */}
      <div className="gov-card" style={{ backgroundColor: '#F8FAFC', borderLeft: '4px solid #0A2540', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <Globe size={24} color="#0A2540" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0A2540' }}>
                Open Government Transparency Portal
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>
              Public portal for tracking outcome-based government challenges, startup participation, and pilot results across Maharashtra.
            </p>
          </div>
          <span className="badge badge-emerald" style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}>
            Audited Public Data
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1.25rem', position: 'relative' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Search government challenges by keyword, department, or location..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '2.5rem', fontSize: '0.95rem' }}
        />
        <Search size={18} color="#64748B" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
      </div>

      {/* Public Challenge Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map((c) => (
          <div key={c._id} className="gov-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-navy">{formatText(c.status)}</span>
                  <span className="badge badge-saffron">{formatText(c.department)}</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.4rem' }}>
                  {formatText(c.title)}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#334155' }}>
                  {formatText(c.problemDescription)}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>PILOT BUDGET</span>
                <p style={{ fontWeight: 800, color: '#0A2540', fontSize: '1.1rem' }}>
                  {formatCurrency(c.estimatedBudget)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

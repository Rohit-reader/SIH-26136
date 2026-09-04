import React from 'react';
import { MaharashtraEmblem } from './Emblems';
import { Shield, LogIn, LogOut, FileText, User } from 'lucide-react';
import { formatText } from '../utils/textUtils';

export const Navbar = ({ currentUser, onOpenAuth, onLogout, onOpenAudit }) => {
  return (
    <header>
      <div className="header-banner">
        <div className="header-inner">
          {/* Logo & Title */}
          <div className="govt-title-block">
            <MaharashtraEmblem className="govt-emblem-img" />
            <div className="title-text-group">
              <h1>
                GovInnovate
                <span className="badge badge-saffron" style={{ fontSize: '0.7rem' }}>
                  SIH 26136
                </span>
              </h1>
              <p>Maharashtra State Innovation Society • Department of Skills, Employment, Entrepreneurship & Innovation</p>
            </div>
          </div>

          {/* Right Header Navigation & Auth Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {currentUser ? (
              <>
                {/* Logged in User Badge */}
                <div style={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '0.4rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem'
                }}>
                  <div style={{ backgroundColor: '#0A2540', padding: '0.35rem', borderRadius: '50%', border: '1px solid #FF9933' }}>
                    <User size={16} color="#FF9933" />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: '#FFFFFF', display: 'block', lineHeight: 1.2 }}>
                      {currentUser.name}
                    </strong>
                    <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                      {formatText(currentUser.roleName)} • {formatText(currentUser.dept)}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={onOpenAudit} 
                  className="btn-secondary"
                  style={{ backgroundColor: '#1E293B', color: '#FFFFFF', borderColor: '#334155' }}
                >
                  <FileText size={16} color="#FF9933" />
                  <span>Audit Log</span>
                </button>

                <button 
                  onClick={onLogout} 
                  className="btn-secondary"
                  style={{ backgroundColor: '#0F172A', color: '#F87171', borderColor: '#7F1D1D' }}
                  title="Sign Out of Portal"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={onOpenAudit} 
                  className="btn-secondary"
                  style={{ backgroundColor: '#1E293B', color: '#FFFFFF', borderColor: '#334155' }}
                >
                  <FileText size={16} color="#FF9933" />
                  <span>Public Audit Log</span>
                </button>

                <button 
                  onClick={onOpenAuth} 
                  className="btn-emerald"
                  style={{ padding: '0.55rem 1.15rem' }}
                >
                  <LogIn size={16} />
                  <span>Sign In to Portal</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  FileText,
  User
} from 'lucide-react';
import { MaharashtraEmblem } from './Emblems';
import { formatText } from '../utils/textUtils';

export const RoleSidebar = ({ 
  title, 
  subtitle, 
  items = [], 
  activeTab, 
  onSelectTab, 
  collapsed, 
  onToggleCollapse,
  currentUser,
  onLogout,
  onOpenAudit
}) => {
  return (
    <aside className={`govt-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand & Sidebar Header */}
      <div className="govt-sidebar-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MaharashtraEmblem style={{ height: '32px', width: 'auto' }} />
            {!collapsed && (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1 }}>
                  GovInnovate
                </h3>
                <span className="badge badge-saffron" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                  SIH 26136
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px'
            }}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {!collapsed && (
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', color: '#93C5FD', textTransform: 'uppercase' }}>
              {title}
            </h4>
            {subtitle && (
              <p style={{ fontSize: '0.675rem', color: '#94A3B8', fontWeight: 500 }}>
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <div
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`govt-sidebar-item ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} color={isActive ? '#0A2540' : '#FFFFFF'} />
                {!collapsed && <span>{item.label}</span>}
              </div>
              
              {!collapsed && item.count !== undefined && item.count > 0 && (
                <span className="badge-count">
                  {item.count}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer: User Info + Audit Log & Logout Buttons */}
      <div style={{
        marginTop: 'auto',
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        {currentUser && !collapsed && (
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            padding: '0.5rem 0.65rem',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{ backgroundColor: '#0A2540', padding: '0.3rem', borderRadius: '50%', border: '1px solid #FF9933', flexShrink: 0 }}>
              <User size={14} color="#FF9933" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <strong style={{ fontSize: '0.775rem', color: '#FFFFFF', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.name}
              </strong>
              <span style={{ fontSize: '0.675rem', color: '#94A3B8', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {formatText(currentUser.roleName || 'Portal User')}
              </span>
            </div>
          </div>
        )}

        {/* Audit Log Button */}
        {onOpenAudit && (
          <button
            onClick={onOpenAudit}
            className="sidebar-action-btn"
            title="Open Transparency Audit Trail Log"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: '0.65rem',
              width: '100%',
              padding: '0.6rem 0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.8rem',
              transition: 'all 0.15s ease'
            }}
          >
            <FileText size={16} color="#FF9933" />
            {!collapsed && <span>Audit Log</span>}
          </button>
        )}

        {/* Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="sidebar-action-btn"
            title="Sign Out of Portal"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: '0.65rem',
              width: '100%',
              padding: '0.6rem 0.75rem',
              backgroundColor: 'rgba(220, 38, 38, 0.15)',
              color: '#FCA5A5',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.8rem',
              transition: 'all 0.15s ease'
            }}
          >
            <LogOut size={16} color="#F87171" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        )}
      </div>
    </aside>
  );
};

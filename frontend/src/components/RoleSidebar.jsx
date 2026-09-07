import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  FileText,
  User
} from 'lucide-react';
import { MaharashtraEmblem } from './Emblems';
import { formatText, isAuditAdmin } from '../utils/textUtils';
import { LanguageSwitcher } from './LanguageSwitcher';

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
  const { t } = useTranslation();

  return (
    <aside className={`govt-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand & Sidebar Header */}
      <div className="govt-sidebar-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MaharashtraEmblem style={{ height: '32px', width: '32px' }} />
            {!collapsed && (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1 }}>
                  {t('app.title')}
                </h3>
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

        {/* Language Switcher in Sidebar */}
        <div style={{ display: 'flex', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <LanguageSwitcher isCollapsed={collapsed} />
        </div>
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

        {/* Audit Log Button (Restricted to Government Admin and Platform Admin) */}
        {isAuditAdmin(currentUser) && onOpenAudit && (
          <button
            onClick={onOpenAudit}
            className="sidebar-action-btn"
            title={t('nav.auditLog')}
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
            {!collapsed && <span>{t('nav.auditLog')}</span>}
          </button>
        )}

        {/* Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="sidebar-action-btn"
            title={t('common.signOut')}
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
            {!collapsed && <span>{t('common.signOut')}</span>}
          </button>
        )}
      </div>
    </aside>
  );
};

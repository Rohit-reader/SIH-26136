import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export const RoleSidebar = ({ title, subtitle, items = [], activeTab, onSelectTab, collapsed, onToggleCollapse }) => {
  return (
    <aside className={`govt-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="govt-sidebar-header">
        {!collapsed && (
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              {title}
            </h4>
            {subtitle && (
              <p style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 500 }}>
                {subtitle}
              </p>
            )}
          </div>
        )}
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

      {/* Navigation Items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
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
    </aside>
  );
};

import React from 'react';
import { 
  LayoutDashboard, 
  Target, 
  Search, 
  FileText, 
  Award, 
  Rocket, 
  Activity, 
  CheckCircle2, 
  ShoppingBag, 
  TrendingUp, 
  Bell,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const GovtSidebar = ({ activeTab, onSelectTab, counts = {}, collapsed, onToggleCollapse }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'challenges', label: 'Challenges', icon: Target, count: counts.challenges },
    { id: 'startups', label: 'Startup Discovery', icon: Search, count: counts.startups },
    { id: 'applications', label: 'Applications', icon: FileText, count: counts.proposals },
    { id: 'evaluations', label: 'Evaluations', icon: Award, count: counts.evaluations },
    { id: 'pilots', label: 'Pilots', icon: Rocket, count: counts.pilots },
    { id: 'kpis', label: 'KPI & Performance', icon: Activity },
    { id: 'validation', label: 'Validation', icon: CheckCircle2, count: counts.validations },
    { id: 'procurement', label: 'Procurement', icon: ShoppingBag },
    { id: 'scaleup', label: 'Scale-Up', icon: TrendingUp, count: counts.scaleUps },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: counts.notifications }
  ];

  return (
    <aside className={`govt-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="govt-sidebar-header">
        {!collapsed && (
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.5px' }}>
              GOVERNMENT OFFICER
            </h4>
            <p style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 500 }}>
              Innovation Lifecycle Desk
            </p>
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
        {menuItems.map((item) => {
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

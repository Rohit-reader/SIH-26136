import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Rocket, 
  DollarSign, 
  Award, 
  ShieldCheck, 
  Check, 
  Trash2,
  Filter
} from 'lucide-react';
import { formatText } from '../../utils/textUtils';

export const StartupNotificationsTab = ({ notifications = [], onNavigateTab }) => {
  const [localNotifications, setLocalNotifications] = useState(() => {
    if (notifications.length > 0) return notifications;
    return [
      {
        _id: 'n1',
        title: 'Payment Release Sanctioned',
        message: 'Milestone #2 payment of ₹5,68,000 for SmartOPD Pilot has been released by State Treasury.',
        category: 'payment',
        isRead: false,
        createdAt: '2026-09-04T10:30:00Z'
      },
      {
        _id: 'n2',
        title: 'Expert Evaluation Completed',
        message: 'Dr. Anand Sharma scored your SmartOPD Technical Proposal 93.4/100.',
        category: 'evaluation',
        isRead: false,
        createdAt: '2026-09-02T14:15:00Z'
      },
      {
        _id: 'n3',
        title: 'Field Pilot Launched',
        message: 'Pune District Hospital trial deployment status updated to Active In-Progress.',
        category: 'pilot',
        isRead: true,
        createdAt: '2026-08-28T09:00:00Z'
      },
      {
        _id: 'n4',
        title: 'New Government Challenge Published',
        message: 'Public Health Department published "AI Tele-ICU Monitoring for Rural Sub-Centers".',
        category: 'challenge',
        isRead: true,
        createdAt: '2026-08-25T11:45:00Z'
      }
    ];
  });

  const [activeCategory, setActiveCategory] = useState('all');

  const handleMarkAsRead = (id) => {
    setLocalNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = () => {
    setLocalNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const filteredNotifications = localNotifications.filter(n => {
    if (activeCategory === 'unread') return !n.isRead;
    if (activeCategory === 'all') return true;
    return (n.category || '').toLowerCase() === activeCategory.toLowerCase();
  });

  const unreadCount = localNotifications.filter(n => !n.isRead).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Bar */}
      <div className="gov-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A2540', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={22} color="#FF9933" /> Notifications & Activity Stream
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
              Real-time updates on proposal evaluations, milestone approvals, payment releases, and new challenges
            </p>
          </div>

          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllRead}
              className="btn-secondary"
              style={{ fontSize: '0.775rem', padding: '0.45rem 0.85rem' }}
            >
              <Check size={14} /> Mark All as Read ({unreadCount})
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {[
            { id: 'all', label: 'All Notifications' },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'payment', label: 'Payments' },
            { id: 'evaluation', label: 'Evaluations' },
            { id: 'pilot', label: 'Pilots' },
            { id: 'challenge', label: 'Challenges' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: activeCategory === cat.id ? '1px solid #0A2540' : '1px solid #CBD5E1',
                backgroundColor: activeCategory === cat.id ? '#0A2540' : '#FFFFFF',
                color: activeCategory === cat.id ? '#FFFFFF' : '#475569',
                cursor: 'pointer'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredNotifications.length === 0 ? (
          <div className="gov-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
            <Bell size={36} color="#CBD5E1" style={{ marginBottom: '0.5rem' }} />
            <p style={{ color: '#64748B', margin: 0, fontSize: '0.85rem' }}>No notifications found in this category.</p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div 
              key={n._id}
              style={{
                border: n.isRead ? '1px solid #E2E8F0' : '1px solid #BFDBFE',
                backgroundColor: n.isRead ? '#FFFFFF' : '#EFF6FF',
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '1rem',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <div style={{ 
                  backgroundColor: n.isRead ? '#F1F5F9' : '#DBEAFE', 
                  padding: '0.5rem', 
                  borderRadius: '50%',
                  flexShrink: 0
                }}>
                  <Bell size={18} color={n.isRead ? '#64748B' : '#1E3A8A'} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#0A2540' }}>
                      {formatText(n.title || n.message)}
                    </strong>
                    {!n.isRead && (
                      <span className="badge badge-navy" style={{ fontSize: '0.65rem' }}>
                        New Unread
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.825rem', color: '#334155', margin: '0 0 0.35rem 0', lineHeight: 1.5 }}>
                    {formatText(n.message)}
                  </p>

                  <span style={{ fontSize: '0.725rem', color: '#64748B' }}>
                    {n.createdAt ? new Date(n.createdAt).toLocaleString('en-IN') : 'Recent'}
                  </span>
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => handleMarkAsRead(n._id)}
                  style={{
                    background: 'none',
                    border: '1px solid #CBD5E1',
                    borderRadius: '4px',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.725rem',
                    color: '#1E3A8A',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default StartupNotificationsTab;

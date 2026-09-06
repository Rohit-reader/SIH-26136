import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Rocket, 
  IndianRupee, 
  Award, 
  ShieldCheck, 
  Check, 
  Trash2,
  Filter
} from 'lucide-react';
import axios from 'axios';
import { formatText } from '../../utils/textUtils';

export const StartupNotificationsTab = ({ notifications = [], onNavigateTab, onRefresh }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.patch('/api/notifications/mark-all-read');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeCategory === 'unread') return !n.isRead;
    if (activeCategory === 'all') return true;
    return (n.category || n.type || '').toLowerCase() === activeCategory.toLowerCase();
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

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

                  {(n.type === 'Challenge Invitation' || n.category === 'challenge') && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <button
                        onClick={() => onNavigateTab && onNavigateTab('challenges')}
                        className="btn-primary"
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', backgroundColor: '#0A2540' }}
                      >
                        <Rocket size={13} /> View Challenge & Submit Proposal
                      </button>
                    </div>
                  )}
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

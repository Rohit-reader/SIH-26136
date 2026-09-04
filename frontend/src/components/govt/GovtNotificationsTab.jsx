import React, { useState } from 'react';
import { Bell, CheckCircle2, FileText, Target, Award, Rocket, TrendingUp, Filter } from 'lucide-react';
import axios from 'axios';
import { formatText } from '../../utils/textUtils';

export const GovtNotificationsTab = ({ notifications = [], onRefresh }) => {
  const [filterType, setFilterType] = useState('All');

  const types = ['All', 'Challenge', 'Proposal', 'Evaluation', 'Milestone', 'Pilot', 'ScaleUp'];

  const filteredNotifications = filterType === 'All'
    ? notifications
    : notifications.filter(n => n.type === filterType);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Challenge': return <Target size={18} color="#0A2540" />;
      case 'Proposal': return <FileText size={18} color="#2563EB" />;
      case 'Evaluation': return <Award size={18} color="#7C3AED" />;
      case 'Milestone': return <CheckCircle2 size={18} color="#059669" />;
      case 'Pilot': return <Rocket size={18} color="#D97706" />;
      case 'ScaleUp': return <TrendingUp size={18} color="#166534" />;
      default: return <Bell size={18} color="#0A2540" />;
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0A2540' }}>
          Government System Notifications & Alerts Desk
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
          Real-time notification stream for milestone submissions, evaluations, and procurement scale sanctions
        </p>
      </div>

      {/* Type Filter Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`btn-secondary ${filterType === t ? 'btn-primary' : ''}`}
            style={{ 
              padding: '0.45rem 0.9rem', 
              fontSize: '0.8rem',
              backgroundColor: filterType === t ? '#0A2540' : '#FFFFFF',
              color: filterType === t ? '#FFFFFF' : '#0A2540'
            }}
          >
            {formatText(t)}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filteredNotifications.length === 0 ? (
          <div className="gov-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#64748B' }}>No notifications under type "{filterType}".</p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div 
              key={n._id} 
              className="gov-card"
              style={{ 
                borderLeft: `4px solid ${n.isRead ? '#CBD5E1' : '#0A2540'}`,
                backgroundColor: n.isRead ? '#FFFFFF' : '#F8FAFC'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: '#EFF6FF', padding: '0.65rem', borderRadius: '50%', flexShrink: 0 }}>
                    {getIcon(n.type)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span className="badge badge-navy">{formatText(n.type)}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>To: {formatText(n.recipientRole)}</span>
                    </div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.25rem' }}>
                      {formatText(n.title)}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '0.35rem' }}>
                      {formatText(n.message)}
                    </p>
                    <span style={{ fontSize: '0.725rem', color: '#94A3B8' }}>
                      {new Date(n.createdAt || Date.now()).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {!n.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(n._id)}
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

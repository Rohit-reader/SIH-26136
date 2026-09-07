import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ShieldCheck, Clock, FileText, AlertTriangle, Lock } from 'lucide-react';
import axios from 'axios';
import { formatText, isAuditAdmin } from '../utils/textUtils';

export const AuditLogModal = ({ isOpen, onClose, currentUser }) => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const hasAccess = isAuditAdmin(currentUser);

  useEffect(() => {
    if (isOpen && hasAccess) {
      fetchLogs();
    }
  }, [isOpen, hasAccess]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/audit');
      setLogs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (!hasAccess) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#DC2626', color: '#FFFFFF', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={20} color="#FFFFFF" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Access Restricted</h3>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <AlertTriangle size={24} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', color: '#0F172A', fontWeight: 700 }}>Administrative Clearance Required</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                  The Governance Transparency Audit Trail is strictly confidential and accessible exclusively to <strong>Government Administrators</strong> and <strong>Platform / Super Admins</strong>.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={onClose} className="btn-secondary">
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '900px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="#0A2540" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540' }}>
              {t('audit.title')}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#64748B" />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
            All lifecycle operations (challenge creation, capability matching, COI declarations, milestone approvals, payment releases, validator decisions) are recorded with timestamps.
          </p>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>Loading audit trail...</p>
          ) : (
            <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Action</th>
                    <th>Role</th>
                    <th>Actor Name</th>
                    <th>Event Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id}>
                      <td style={{ fontSize: '0.775rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                        {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td>
                        <span className="badge badge-navy">
                          {formatText(log.action)}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: '#0A2540' }}>{formatText(log.actorRole)}</td>
                      <td style={{ fontSize: '0.85rem' }}>{formatText(log.actorName)}</td>
                      <td style={{ fontSize: '0.825rem', color: '#334155' }}>{formatText(log.details)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

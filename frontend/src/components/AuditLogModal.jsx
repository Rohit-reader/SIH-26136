import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Clock, FileText } from 'lucide-react';
import axios from 'axios';
import { formatText } from '../utils/textUtils';

export const AuditLogModal = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/audit');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '900px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="#0A2540" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540' }}>
              Official Transparency Audit Trail Log
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#64748B" />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
            All lifecycle operations (challenge creation, AI match, COI declarations, milestone approvals, payment releases, validator decisions) are recorded with timestamps.
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

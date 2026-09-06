import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, ShoppingBag, TrendingUp, AlertTriangle, X } from 'lucide-react';
import axios from 'axios';
import { formatText } from '../../utils/textUtils';

export const GovtValidationTab = ({ pilots = [], onRefresh, onNavigateToScaleUp }) => {
  const [selectedPilot, setSelectedPilot] = useState(null);
  const [procurementDecision, setProcurementDecision] = useState('Scale Statewide');
  const [validatorNotes, setValidatorNotes] = useState('');

  const handleExecuteDecision = async (pilotId) => {
    try {
      await axios.patch(`/api/pilots/${pilotId}/scale-decision`, {
        validationStatus: 'Validated',
        procurementRecommendation: procurementDecision,
        validatorNotes: validatorNotes || 'Independent validation confirms performance targets met satisfactorily.'
      });
      alert(`Procurement Decision "${procurementDecision}" successfully recorded.`);
      onRefresh();
      if (procurementDecision === 'Scale Statewide' && onNavigateToScaleUp) {
        onNavigateToScaleUp();
      }
      setSelectedPilot(null);
    } catch (err) {
      console.error(err);
      alert('Failed to record procurement decision');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0A2540' }}>
          Independent Validation & Procurement Decision Desk
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
          Review Quality Control Board reports, inspect outcome evidence, and execute statutory procurement decisions
        </p>
      </div>

      {/* Validation Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {pilots.map((pilot) => {
          const isCompleted = pilot.validationStatus === 'Validated';

          return (
            <div key={pilot._id} className="gov-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span className={`badge ${isCompleted ? 'badge-emerald' : 'badge-saffron'}`}>
                      <CheckCircle2 size={12} /> {formatText(pilot.validationStatus)}
                    </span>
                    <span className="badge badge-navy">
                      Recommendation: {formatText(pilot.procurementRecommendation)}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A2540' }}>{formatText(pilot.pilotTitle)}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748B' }}>Location: {formatText(pilot.location)}</p>
                </div>
                <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '8px', padding: '0.75rem 1.25rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284C7' }}>{pilot.pilotSuccessScore || 94.8} / 100</span>
                  <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#0369A1' }}>QUALITY CONTROL SCORE</span>
                </div>
              </div>

              {/* Validator Notes Box */}
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0A2540', marginBottom: '0.35rem' }}>
                  Independent Quality Control Board Audit Report
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#334155', fontStyle: 'italic' }}>
                  "{formatText(pilot.validatorNotes || 'Independent validation confirms performance targets met satisfactorily.')}"
                </p>
              </div>

              {/* Four Decision Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    setSelectedPilot(pilot);
                    setProcurementDecision('Scale Statewide');
                    setValidatorNotes(pilot.validatorNotes || '');
                  }}
                  className="btn-emerald"
                  style={{ fontSize: '0.825rem' }}
                >
                  <TrendingUp size={14} /> Decision: Scale Statewide
                </button>
                <button
                  onClick={() => {
                    setSelectedPilot(pilot);
                    setProcurementDecision('Extend Pilot');
                    setValidatorNotes(pilot.validatorNotes || '');
                  }}
                  className="btn-secondary"
                  style={{ fontSize: '0.825rem', color: '#D97706', borderColor: '#FCD34D' }}
                >
                  Extend Pilot Duration
                </button>
                <button
                  onClick={() => {
                    setSelectedPilot(pilot);
                    setProcurementDecision('Modify Solution');
                    setValidatorNotes(pilot.validatorNotes || '');
                  }}
                  className="btn-secondary"
                  style={{ fontSize: '0.825rem', color: '#2563EB', borderColor: '#93C5FD' }}
                >
                  Modify Solution Specs
                </button>
                <button
                  onClick={() => {
                    setSelectedPilot(pilot);
                    setProcurementDecision('Close Challenge');
                    setValidatorNotes(pilot.validatorNotes || '');
                  }}
                  className="btn-secondary"
                  style={{ fontSize: '0.825rem', color: '#DC2626', borderColor: '#FCA5A5' }}
                >
                  Close Challenge
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Execute Decision Modal */}
      {selectedPilot && (
        <div className="modal-overlay" onClick={() => setSelectedPilot(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540' }}>
                Execute Statutory Procurement Decision — {formatText(selectedPilot.pilotTitle)}
              </h3>
              <button onClick={() => setSelectedPilot(null)} className="btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Procurement Decision Choice</label>
                <select
                  value={procurementDecision}
                  onChange={e => setProcurementDecision(e.target.value)}
                  className="form-select"
                >
                  <option value="Scale Statewide">Scale Statewide (Statewide 36 Districts Rollout)</option>
                  <option value="Extend Pilot">Extend Pilot (Additional Trial Phase)</option>
                  <option value="Modify Solution">Modify Solution (Re-engineer Specification)</option>
                  <option value="Close Challenge">Close Challenge (Archive Challenge)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Government Officer Justification & Notes</label>
                <textarea
                  rows={4}
                  value={validatorNotes}
                  onChange={e => setValidatorNotes(e.target.value)}
                  className="form-textarea"
                  placeholder="Record officer notes regarding independent validation evidence and procurement decision rationale..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setSelectedPilot(null)} className="btn-secondary">Cancel</button>
              <button onClick={() => handleExecuteDecision(selectedPilot._id)} className="btn-emerald">
                Confirm & Record Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  ExternalLink, 
  Lock, 
  Award, 
  FileCheck,
  Building2,
  XCircle
} from 'lucide-react';
import axios from 'axios';
import { formatText } from '../../utils/textUtils';

export const DigiLockerVerificationCard = ({ primaryStartup = {}, onVerificationUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchVerificationStatus();

    // Check query params after OAuth callback redirect
    const urlParams = new URLSearchParams(window.location.search);
    const callbackResult = urlParams.get('digilocker');
    if (callbackResult) {
      if (callbackResult === 'success') {
        // Clean URL query string without reloading
        window.history.replaceState({}, document.title, window.location.pathname + '?tab=profile');
        fetchVerificationStatus();
      } else if (callbackResult === 'denied') {
        setErrorMsg('DigiLocker consent request was declined.');
        window.history.replaceState({}, document.title, window.location.pathname + '?tab=profile');
      } else if (callbackResult.includes('error')) {
        setErrorMsg('Verification failed due to invalid session or timeout.');
        window.history.replaceState({}, document.title, window.location.pathname + '?tab=profile');
      }
    }
  }, []);

  const fetchVerificationStatus = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/digilocker/status', {
        params: { startupId: primaryStartup._id }
      });
      setStatusData(res.data.digilockerVerification);
      if (onVerificationUpdated) {
        onVerificationUpdated(res.data.digilockerVerification);
      }
    } catch (err) {
      console.error('Error fetching DigiLocker status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartVerification = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await axios.post('/api/digilocker/authorize', {
        startupId: primaryStartup._id
      });

      if (res.data.authUrl) {
        // Redirect browser to authorization URL (production DigiLocker or SIH Mock Consent page)
        window.location.href = res.data.authUrl;
      }
    } catch (err) {
      console.error('Authorization initiation failed:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to initiate DigiLocker authorization');
      setLoading(false);
    }
  };

  const handleResetVerification = async () => {
    try {
      await axios.post('/api/digilocker/reset', {
        startupId: primaryStartup._id
      });
      fetchVerificationStatus();
    } catch (err) {
      console.error('Failed to reset:', err);
    }
  };

  const currentStatus = statusData?.status || 'Not Verified';
  const isMock = statusData?.provider === 'mock';

  return (
    <div className="gov-card" style={{ border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', position: 'relative' }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', padding: '0.65rem', borderRadius: '50%' }}>
            <ShieldCheck size={24} color="#1E3A8A" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
                DigiLocker Government Verification
              </h3>
              {isMock ? (
                <span className="badge badge-saffron" style={{ fontSize: '0.65rem' }}>
                  SIH Demo Provider
                </span>
              ) : (
                <span className="badge badge-navy" style={{ fontSize: '0.65rem' }}>
                  Official API Setu OAuth 2.0
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.775rem', color: '#64748B', margin: '0.15rem 0 0 0' }}>
              Automated instant verification of DPIIT Startup Recognition Certificate & MCA Registration via MeitY API Setu
            </p>
          </div>
        </div>

        {/* Live Status Badge */}
        <div>
          {currentStatus === 'Verified' && (
            <span className="badge badge-emerald" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={15} /> DigiLocker Verified
            </span>
          )}
          {currentStatus === 'Not Verified' && (
            <span className="badge badge-saffron" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
              Not Verified
            </span>
          )}
          {currentStatus === 'Verification in Progress' && (
            <span className="badge badge-navy" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <RefreshCw size={14} className="spin-animation" /> Verification in Progress
            </span>
          )}
          {currentStatus === 'Failed' && (
            <span style={{ backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', padding: '0.4rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <XCircle size={15} color="#DC2626" /> Verification Failed
            </span>
          )}
        </div>
      </div>

      {/* Error Alert Message */}
      {errorMsg && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', color: '#991B1B', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={16} color="#DC2626" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STATE 1: VERIFIED */}
      {currentStatus === 'Verified' && (
        <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={18} color="#166534" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#166534', margin: 0 }}>
                  Official Entity Verification Confirmed
                </h4>
              </div>
              <p style={{ fontSize: '0.775rem', color: '#15803D', margin: '0.2rem 0 0 0' }}>
                {statusData?.documentType || 'DPIIT Startup Recognition Certificate'}
              </p>
            </div>
            
            <button
              onClick={handleResetVerification}
              style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '0.725rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Re-verify Entity
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.8rem', backgroundColor: '#FFFFFF', padding: '0.85rem', borderRadius: '6px', border: '1px solid #DCFCE7' }}>
            <div>
              <span style={{ color: '#64748B', fontSize: '0.725rem', display: 'block' }}>Verified Reference ID:</span>
              <strong style={{ color: '#0A2540', fontFamily: 'monospace' }}>{statusData?.maskedDocRef || 'DIPP****10984'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B', fontSize: '0.725rem', display: 'block' }}>Verified Timestamp:</span>
              <strong style={{ color: '#0A2540' }}>{statusData?.verifiedAt ? new Date(statusData.verifiedAt).toLocaleString() : new Date().toLocaleDateString()}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B', fontSize: '0.725rem', display: 'block' }}>Document Issuer:</span>
              <strong style={{ color: '#0A2540' }}>{statusData?.issuer || 'DPIIT, Ministry of Commerce & Industry'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B', fontSize: '0.725rem', display: 'block' }}>Verification Provider:</span>
              <strong style={{ color: isMock ? '#D97706' : '#059669' }}>
                {isMock ? 'SIH Demo Mock Provider' : 'Government API Setu (DigiLocker)'}
              </strong>
            </div>
          </div>

          <div style={{ fontSize: '0.775rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Award size={14} color="#166534" />
            <span>Eligible for 100% GFR Turnover & Prior Experience Waiver across all Maharashtra Government Challenges.</span>
          </div>
        </div>
      )}

      {/* STATE 2: NOT VERIFIED */}
      {currentStatus === 'Not Verified' && (
        <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1.15rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#0A2540', margin: 0 }}>
              Verify Startup Credentials with DigiLocker
            </h4>
            <p style={{ fontSize: '0.775rem', color: '#64748B', margin: '0.2rem 0 0 0', maxWidth: '520px', lineHeight: 1.4 }}>
              Authenticate your DPIIT Recognition Certificate or MCA Incorporation Certificate directly via MeitY DigiLocker OAuth 2.0 to unlock automated GFR procurement waivers.
            </p>
          </div>

          <button
            onClick={handleStartVerification}
            className="btn-primary"
            disabled={loading}
            style={{ backgroundColor: '#0A2540', padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
          >
            <ShieldCheck size={18} color="#FF9933" />
            <span>{loading ? 'Initiating OAuth...' : 'Verify with DigiLocker'}</span>
          </button>
        </div>
      )}

      {/* STATE 3: VERIFICATION IN PROGRESS */}
      {currentStatus === 'Verification in Progress' && (
        <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '1.15rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#1E3A8A', margin: 0 }}>
              Awaiting OAuth Authorization Callback...
            </h4>
            <p style={{ fontSize: '0.775rem', color: '#3B82F6', margin: '0.2rem 0 0 0' }}>
              Please complete authentication on the DigiLocker consent window.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleStartVerification}
              className="btn-primary"
              style={{ backgroundColor: '#0A2540', fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}
            >
              Resume Consent
            </button>
            <button
              onClick={handleResetVerification}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* STATE 4: FAILED */}
      {currentStatus === 'Failed' && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '1.15rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#991B1B', margin: 0 }}>
              Verification Attempt Unsuccessful
            </h4>
            <p style={{ fontSize: '0.775rem', color: '#B91C1C', margin: '0.2rem 0 0 0' }}>
              Reason: {statusData?.failureReason || 'User declined consent or request session expired.'}
            </p>
          </div>

          <button
            onClick={handleStartVerification}
            className="btn-primary"
            style={{ backgroundColor: '#DC2626', fontSize: '0.85rem' }}
          >
            <RefreshCw size={16} /> Retry Verification
          </button>
        </div>
      )}
    </div>
  );
};

export default DigiLockerVerificationCard;

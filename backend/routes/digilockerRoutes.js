const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const axios = require('axios');
const Startup = require('../models/Startup');
const AuditLog = require('../models/AuditLog');

// In-memory single-use state store with TTL (10 minutes)
const oauthStateStore = new Map();

const cleanExpiredStates = () => {
  const now = Date.now();
  for (const [state, data] of oauthStateStore.entries()) {
    if (now > data.expiresAt) {
      oauthStateStore.delete(state);
    }
  }
};

/**
 * POST /api/digilocker/authorize
 * Initiates the OAuth 2.0 flow. Generates secure single-use state.
 */
router.post('/authorize', async (req, res) => {
  try {
    cleanExpiredStates();

    const { startupId } = req.body;
    
    // Find target startup or fallback to primary startup
    let startup = null;
    if (startupId) {
      startup = await Startup.findById(startupId);
    } else {
      startup = await Startup.findOne();
    }

    if (!startup) {
      return res.status(404).json({ error: 'Startup profile not found' });
    }

    // Update status to 'Verification in Progress'
    startup.digilockerVerification = startup.digilockerVerification || {};
    startup.digilockerVerification.status = 'Verification in Progress';
    await startup.save();

    // Generate secure state token
    const stateToken = crypto.randomBytes(24).toString('hex');
    oauthStateStore.set(stateToken, {
      startupId: startup._id.toString(),
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 mins TTL
    });

    const mode = process.env.DIGILOCKER_MODE || 'mock';

    if (mode === 'mock') {
      const mockAuthUrl = `/api/digilocker/mock-consent?state=${stateToken}&startupId=${startup._id}`;
      return res.json({
        success: true,
        mode: 'mock',
        provider: 'mock',
        authUrl: mockAuthUrl,
        message: 'Initialized DigiLocker SIH Mock Consent Flow'
      });
    }

    // Production API Setu / DigiLocker OAuth Flow
    const clientId = process.env.DIGILOCKER_CLIENT_ID;
    const redirectUri = process.env.DIGILOCKER_REDIRECT_URI || 'http://localhost:5000/api/digilocker/callback';
    const authEndpoint = process.env.DIGILOCKER_AUTHORIZATION_URL || 'https://api.digitallocker.gov.in/public/oauth2/1/authorize';

    if (!clientId) {
      return res.status(500).json({ 
        error: 'DigiLocker Client ID missing in server environment. Set DIGILOCKER_CLIENT_ID or use DIGILOCKER_MODE=mock.' 
      });
    }

    const authUrl = `${authEndpoint}?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${stateToken}&scope=openid`;

    res.json({
      success: true,
      mode: 'production',
      provider: 'digilocker',
      authUrl
    });
  } catch (err) {
    console.error('DigiLocker Authorize Error:', err);
    res.status(500).json({ error: 'Failed to initiate DigiLocker authorization' });
  }
});

/**
 * GET /api/digilocker/callback
 * Handles OAuth callback code & state validation
 */
router.get('/callback', async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;

    if (!state || !oauthStateStore.has(state)) {
      return res.status(400).send(`
        <html>
          <body style="font-family: sans-serif; text-align: center; padding: 3rem;">
            <h2 style="color: #DC2626;">Invalid or Expired OAuth State</h2>
            <p>Verification request timed out or invalid state provided. Please try again from the Startup Portal.</p>
            <a href="http://localhost:5173/startup?tab=profile&digilocker=error_invalid_state" style="background: #0A2540; color: #fff; padding: 0.5rem 1rem; text-decoration: none; border-radius: 4px;">Return to Portal</a>
          </body>
        </html>
      `);
    }

    const stateData = oauthStateStore.get(state);
    oauthStateStore.delete(state); // Single-use state enforcement

    const startup = await Startup.findById(stateData.startupId);
    if (!startup) {
      return res.status(404).send('Startup not found for this verification transaction');
    }

    // User denied consent or provider error
    if (error || error_description) {
      startup.digilockerVerification = {
        status: 'Failed',
        provider: process.env.DIGILOCKER_MODE === 'mock' ? 'mock' : 'digilocker',
        mode: process.env.DIGILOCKER_MODE === 'mock' ? 'demo' : 'production',
        failureReason: error_description || error || 'User denied DigiLocker consent'
      };
      await startup.save();

      return res.redirect('http://localhost:5173/startup?tab=profile&digilocker=denied');
    }

    const mode = process.env.DIGILOCKER_MODE || 'mock';

    if (mode === 'mock') {
      // Mock Verification for SIH Hackathon Demo
      const maskedRef = `DIPP****${Math.floor(1000 + Math.random() * 9000)}`;

      startup.digilockerVerification = {
        status: 'Verified',
        provider: 'mock',
        mode: 'demo',
        verifiedAt: new Date(),
        documentType: 'DPIIT Startup Recognition Certificate',
        issuer: 'DPIIT, Ministry of Commerce & Industry (SIH Demo Provider)',
        maskedDocRef: maskedRef,
        failureReason: ''
      };
      startup.verificationStatus = 'DPIIT Verified';
      await startup.save();

      await AuditLog.create({
        action: 'DIGILOCKER_VERIFICATION_SUCCESS',
        actorRole: 'Startup Admin',
        actorName: startup.name,
        details: `Verified startup DPIIT certificate via DigiLocker (SIH Demo Provider: ${maskedRef})`,
        entityId: startup._id.toString()
      });

      return res.redirect('http://localhost:5173/startup?tab=profile&digilocker=success');
    }

    // Production OAuth Token Exchange & Document Query
    const clientId = process.env.DIGILOCKER_CLIENT_ID;
    const clientSecret = process.env.DIGILOCKER_CLIENT_SECRET;
    const tokenUrl = process.env.DIGILOCKER_TOKEN_URL || 'https://api.digitallocker.gov.in/public/oauth2/1/token';
    const redirectUri = process.env.DIGILOCKER_REDIRECT_URI || 'http://localhost:5000/api/digilocker/callback';

    const tokenResponse = await axios.post(tokenUrl, new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const { access_token } = tokenResponse.data;

    // Fetch verified document details using server-side access_token
    const apiBaseUrl = process.env.DIGILOCKER_API_BASE_URL || 'https://api.digitallocker.gov.in/public/oauth2/1';
    const docResponse = await axios.get(`${apiBaseUrl}/file/issued`, {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const issuedDocs = docResponse.data?.items || [];
    const dpiitDoc = issuedDocs.find(d => d.doctype === 'DPCRT' || d.name?.includes('DPIIT') || d.name?.includes('Startup')) || issuedDocs[0];

    const maskedRef = dpiitDoc ? `DIPP****${(dpiitDoc.uri || '10984').slice(-4)}` : 'DIPP****10984';

    startup.digilockerVerification = {
      status: 'Verified',
      provider: 'digilocker',
      mode: 'production',
      verifiedAt: new Date(),
      documentType: dpiitDoc?.description || 'DPIIT Startup Recognition Certificate',
      issuer: dpiitDoc?.issuer || 'DPIIT, Ministry of Commerce & Industry',
      maskedDocRef: maskedRef,
      failureReason: ''
    };
    startup.verificationStatus = 'DPIIT Verified';
    await startup.save();

    await AuditLog.create({
      action: 'DIGILOCKER_VERIFICATION_SUCCESS',
      actorRole: 'Startup Admin',
      actorName: startup.name,
      details: `Verified startup entity via Official DigiLocker API Setu (${maskedRef})`,
      entityId: startup._id.toString()
    });

    res.redirect('http://localhost:5173/startup?tab=profile&digilocker=success');

  } catch (err) {
    console.error('DigiLocker Callback Error:', err?.response?.data || err.message);

    res.status(500).send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 3rem;">
          <h2 style="color: #DC2626;">DigiLocker Verification Failed</h2>
          <p>Unable to complete authentication code exchange. Server configuration or credentials check required.</p>
          <a href="http://localhost:5173/startup?tab=profile&digilocker=failed" style="background: #0A2540; color: #fff; padding: 0.5rem 1rem; text-decoration: none; border-radius: 4px;">Return to Startup Portal</a>
        </body>
      </html>
    `);
  }
});

/**
 * GET /api/digilocker/status
 * Returns current verification status for authenticated startup/user
 */
router.get('/status', async (req, res) => {
  try {
    const { startupId } = req.query;

    let startup = null;
    if (startupId) {
      startup = await Startup.findById(startupId);
    } else {
      startup = await Startup.findOne();
    }

    if (!startup) {
      return res.status(404).json({ error: 'Startup profile not found' });
    }

    const verification = startup.digilockerVerification || {
      status: 'Not Verified',
      provider: process.env.DIGILOCKER_MODE === 'mock' ? 'mock' : 'digilocker',
      mode: process.env.DIGILOCKER_MODE === 'mock' ? 'demo' : 'production'
    };

    res.json({
      startupId: startup._id,
      startupName: startup.name,
      dpiitNumber: startup.dpiitNumber,
      verificationStatus: startup.verificationStatus,
      digilockerVerification: verification
    });
  } catch (err) {
    console.error('Get DigiLocker Status Error:', err);
    res.status(500).json({ error: 'Failed to retrieve DigiLocker verification status' });
  }
});

/**
 * GET /api/digilocker/mock-consent
 * Serves SIH Interactive Mock DigiLocker Consent Page for Live Demonstrations
 */
router.get('/mock-consent', async (req, res) => {
  const { state, startupId } = req.query;
  
  const startup = await Startup.findById(startupId).catch(() => null) || { name: 'HealthAI Solutions Pvt Ltd', dpiitNumber: 'DIPP10984' };

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>DigiLocker — Government of India Consent Portal (SIH Demo)</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .card { background: #ffffff; border-radius: 12px; width: 100%; max-width: 480px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden; border-top: 5px solid #0066CC; }
        .header { background-color: #0A2540; color: #ffffff; padding: 1.25rem 1.5rem; text-align: center; }
        .header h2 { margin: 0; font-size: 1.3rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .badge-demo { background-color: #D97706; color: #fff; font-size: 0.7rem; padding: 0.2rem 0.5rem; borderRadius: 4px; font-weight: 700; text-transform: uppercase; }
        .body { padding: 1.5rem; }
        .doc-box { background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 1rem; margin-bottom: 1.25rem; }
        .doc-box h4 { margin: 0 0 0.5rem 0; color: #1E3A8A; font-size: 0.95rem; }
        .doc-box p { margin: 0; color: #3B82F6; font-size: 0.8rem; }
        .actions { display: flex; gap: 0.75rem; }
        .btn { flex: 1; padding: 0.75rem; border-radius: 6px; border: none; font-weight: 700; cursor: pointer; text-align: center; font-size: 0.9rem; text-decoration: none; }
        .btn-allow { background-color: #059669; color: #ffffff; }
        .btn-allow:hover { background-color: #047857; }
        .btn-deny { background-color: #E2E8F0; color: #475569; }
        .btn-deny:hover { background-color: #CBD5E1; }
        .footer { font-size: 0.75rem; color: #64748B; text-align: center; padding: 1rem; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h2>
            <span>🛡️ DigiLocker Consent</span>
            <span class="badge-demo">SIH Demo</span>
          </h2>
          <p style="margin: 0.25rem 0 0 0; font-size: 0.8rem; color: #94A3B8;">Ministry of Electronics & Information Technology (MeitY)</p>
        </div>
        <div class="body">
          <p style="font-size: 0.9rem; color: #334155; margin-bottom: 1rem;">
            <strong>GovInnovate Platform</strong> is requesting access to verify your official government entity documents:
          </p>
          <div class="doc-box">
            <h4>📄 Requested Issued Document:</h4>
            <p><strong>DPIIT Startup Recognition Certificate</strong></p>
            <p style="color: #475569; font-size: 0.775rem; margin-top: 0.25rem;">Entity Name: <strong>${startup.name}</strong></p>
            <p style="color: #475569; font-size: 0.775rem;">Certificate No: <strong>${startup.dpiitNumber || 'DIPP10984'}</strong></p>
            <p style="color: #475569; font-size: 0.775rem;">Issuer: Department for Promotion of Industry and Internal Trade (DPIIT)</p>
          </div>
          <div class="actions">
            <a href="/api/digilocker/callback?state=${state}&code=mock_auth_code_sih_2026" class="btn btn-allow">
              ✓ Allow & Share Verified Document
            </a>
            <a href="/api/digilocker/callback?state=${state}&error=access_denied&error_description=User%20declined%20consent" class="btn btn-deny">
              Deny
            </a>
          </div>
        </div>
        <div class="footer">
          Official API Setu OAuth 2.0 Integration Mock for SIH 26136 Demonstration
        </div>
      </div>
    </body>
    </html>
  `);
});

/**
 * POST /api/digilocker/reset
 * Resets verification status back to 'Not Verified' for testing
 */
router.post('/reset', async (req, res) => {
  try {
    const { startupId } = req.body;
    let startup = null;
    if (startupId) {
      startup = await Startup.findById(startupId);
    } else {
      startup = await Startup.findOne();
    }

    if (!startup) {
      return res.status(404).json({ error: 'Startup profile not found' });
    }

    startup.digilockerVerification = {
      status: 'Not Verified',
      provider: process.env.DIGILOCKER_MODE === 'mock' ? 'mock' : 'digilocker',
      mode: process.env.DIGILOCKER_MODE === 'mock' ? 'demo' : 'production'
    };
    await startup.save();

    res.json({ success: true, message: 'Reset DigiLocker verification state' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset verification' });
  }
});

module.exports = router;

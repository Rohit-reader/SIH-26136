# DigiLocker / API Setu OAuth 2.0 Integration — GovInnovate (SIH 26136)

This document describes the **DigiLocker / API Setu OAuth 2.0** integration implemented for **SIH 26136 (GovInnovate)**.

---

## 🏛️ Architecture Overview

The DigiLocker integration enables automated, instant verification of startup entities (DPIIT Recognition Certificates & MCA Incorporation Certificates) directly from MeitY's official **DigiLocker / API Setu Requester Platform**.

```
[React Startup Portal]
        │
        ▼ 1. POST /api/digilocker/authorize
[Express Backend] ──(Generates Secure State & Stores with 10m TTL)
        │
        ▼ 2. Redirects Browser to DigiLocker OAuth / SIH Mock Consent Portal
[DigiLocker / API Setu] ──(User Grants Consent)
        │
        ▼ 3. Redirects to GET /api/digilocker/callback?code=...&state=...
[Express Backend]
        ├─► Validates single-use OAuth State
        ├─► Server-Side Token Exchange (POST to Token URL)
        ├─► Server-Side Document Fetch (Issued Files API)
        └─► Updates Startup Document Record in MongoDB (Status: 'Verified')
        │
        ▼ 4. Redirects Browser back to Portal (/startup?tab=profile&digilocker=success)
[React Startup Portal] ──(Queries GET /api/digilocker/status for Verification State)
```

---

## ⚙️ Environment Configuration

Set the environment variables in `backend/.env`:

```env
# Mode Selection: 'mock' (SIH Hackathon Demonstration) or 'production' (Live API Setu Requester)
DIGILOCKER_MODE=mock

# Official DigiLocker / API Setu Production Credentials (Required in production mode)
DIGILOCKER_CLIENT_ID=your_api_setu_client_id
DIGILOCKER_CLIENT_SECRET=your_api_setu_client_secret
DIGILOCKER_REDIRECT_URI=http://localhost:5000/api/digilocker/callback
DIGILOCKER_AUTHORIZATION_URL=https://api.digitallocker.gov.in/public/oauth2/1/authorize
DIGILOCKER_TOKEN_URL=https://api.digitallocker.gov.in/public/oauth2/1/token
DIGILOCKER_API_BASE_URL=https://api.digitallocker.gov.in/public/oauth2/1
```

---

## 🎭 Mock Mode for SIH Demonstration (`DIGILOCKER_MODE=mock`)

For Smart India Hackathon live evaluation without requiring production API Setu credentials:

1. Setting `DIGILOCKER_MODE=mock` activates the isolated **SIH Demo Consent Portal** (`/api/digilocker/mock-consent`).
2. When a startup clicks **"Verify with DigiLocker"**, they are taken to an interactive government consent screen.
3. Upon clicking **"Allow & Share Verified Document"**, the backend processes a simulated verification transaction:
   * **Provider**: `mock`
   * **Mode**: `demo`
   * **Document**: `DPIIT Startup Recognition Certificate`
   * **Issuer**: `DPIIT, Ministry of Commerce & Industry (SIH Demo Provider)`
   * **Masked Reference**: `DIPP****10984`
4. **Transparency Rule**: Mock mode is clearly distinguished in the UI and database logs. It is **never represented as genuine government verification**.

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/digilocker/authorize` | Initiates OAuth flow. Generates single-use cryptographically secure `state` (10 min TTL). Returns `authUrl`. |
| `GET` | `/api/digilocker/callback` | Validates `state`, handles OAuth authorization code exchange, fetches document metadata server-side, updates MongoDB, and redirects browser to portal. |
| `GET` | `/api/digilocker/status` | Returns active DigiLocker verification status, provider, mode, verified timestamp, and masked document reference. |
| `GET` | `/api/digilocker/mock-consent` | Serves interactive HTML consent screen during SIH Hackathon demonstration. |
| `POST` | `/api/digilocker/reset` | Resets startup verification status to `'Not Verified'` for demo testing. |

---

## 🔒 Security Practices

1. **OAuth State Protection**: Uses `crypto.randomBytes(24)` to generate nonces stored with a 10-minute TTL. States are enforced as single-use to prevent CSRF attacks.
2. **Server-Side Token Handling**: OAuth `access_token` and `refresh_token` are kept strictly in server memory during code exchange. They are **never saved in MongoDB or sent to React**.
3. **No Tokens in URLs**: Callback URLs only pass status indicators (`?digilocker=success` or `?digilocker=denied`).
4. **React Status Validation**: Following OAuth callback redirection, React queries `GET /api/digilocker/status` to fetch verified state directly from MongoDB rather than trusting URL parameters.

---

## 🧪 Testing Instructions

Run the automated DigiLocker test suite:

```bash
node backend/test/digilocker.test.js
```

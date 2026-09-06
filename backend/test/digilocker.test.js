const axios = require('axios');
const assert = require('assert');

const BASE_URL = 'http://localhost:5000/api/digilocker';

async function runDigiLockerTests() {
  console.log('🚀 Running DigiLocker API Integration Tests...\n');

  try {
    // Test 1: Retrieve Initial Status
    console.log('Test 1: Fetching initial DigiLocker verification status...');
    const resStatus1 = await axios.get(`${BASE_URL}/status`);
    assert.strictEqual(resStatus1.status, 200, 'Status endpoint should return HTTP 200');
    assert.ok(resStatus1.data.digilockerVerification, 'Should contain digilockerVerification object');
    console.log('  ✓ Initial status fetched:', resStatus1.data.digilockerVerification.status);

    // Test 2: Initiate OAuth Authorization
    console.log('\nTest 2: Initiating /authorize endpoint...');
    const resAuth = await axios.post(`${BASE_URL}/authorize`, {
      startupId: resStatus1.data.startupId
    });
    assert.strictEqual(resAuth.status, 200, 'Authorize endpoint should return HTTP 200');
    assert.strictEqual(resAuth.data.success, true, 'Authorization request should succeed');
    assert.ok(resAuth.data.authUrl, 'Should return an authUrl');
    console.log('  ✓ Authorization initiated. Mode:', resAuth.data.mode, '| Auth URL:', resAuth.data.authUrl);

    // Test 3: Status updated to 'Verification in Progress'
    console.log('\nTest 3: Checking status after authorization initiation...');
    const resStatus2 = await axios.get(`${BASE_URL}/status`);
    assert.strictEqual(resStatus2.data.digilockerVerification.status, 'Verification in Progress', 'Status should update to "Verification in Progress"');
    console.log('  ✓ Status correctly transitioned to:', resStatus2.data.digilockerVerification.status);

    // Test 4: Execute Callback in Mock Mode
    console.log('\nTest 4: Simulating OAuth callback execution...');
    // Extract state token from authUrl
    const urlObj = new URL(resAuth.data.authUrl, 'http://localhost:5000');
    const stateToken = urlObj.searchParams.get('state');

    const resCallback = await axios.get(`${BASE_URL}/callback`, {
      params: { state: stateToken, code: 'mock_test_code_123' },
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400
    });
    console.log('  ✓ Callback redirected cleanly (Status:', resCallback.status, '| Location:', resCallback.headers.location, ')');

    // Test 5: Verify Status Transitioned to 'Verified'
    console.log('\nTest 5: Checking final status after callback...');
    const resStatus3 = await axios.get(`${BASE_URL}/status`);
    assert.strictEqual(resStatus3.data.digilockerVerification.status, 'Verified', 'Status should update to "Verified"');
    assert.strictEqual(resStatus3.data.digilockerVerification.provider, 'mock', 'Provider should be "mock"');
    assert.strictEqual(resStatus3.data.digilockerVerification.mode, 'demo', 'Mode should be "demo"');
    assert.ok(resStatus3.data.digilockerVerification.maskedDocRef, 'Should have masked document reference');
    console.log('  ✓ Verified Entity details:', {
      status: resStatus3.data.digilockerVerification.status,
      provider: resStatus3.data.digilockerVerification.provider,
      documentType: resStatus3.data.digilockerVerification.documentType,
      maskedRef: resStatus3.data.digilockerVerification.maskedDocRef
    });

    // Test 6: Reset Status
    console.log('\nTest 6: Testing reset endpoint...');
    const resReset = await axios.post(`${BASE_URL}/reset`);
    assert.strictEqual(resReset.data.success, true, 'Reset should succeed');
    const resStatus4 = await axios.get(`${BASE_URL}/status`);
    assert.strictEqual(resStatus4.data.digilockerVerification.status, 'Not Verified', 'Status should reset to "Not Verified"');
    console.log('  ✓ Reset test passed successfully.');

    console.log('\n🎉 ALL DIGILOCKER TESTS PASSED CLEANLY!\n');
  } catch (err) {
    console.error('\n❌ TEST FAILED:', err?.response?.data || err.message);
    process.exit(1);
  }
}

// Execute tests if server is running, or notify user
runDigiLockerTests();

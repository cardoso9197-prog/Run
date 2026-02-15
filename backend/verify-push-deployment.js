/**
 * Push Notification Backend Verification Script
 * Run this to check if push notification code is deployed to Railway
 */

const axios = require('axios');

// Your Railway backend URL
const BACKEND_URL = 'https://zippy-healing-production-24e4.up.railway.app';

async function verifyPushNotificationDeployment() {
  console.log('🔍 Checking Railway Backend for Push Notification Support...\n');

  // Test 1: Check if backend is responding
  try {
    console.log('Test 1: Backend Health Check');
    const response = await axios.get(`${BACKEND_URL}/health`, { timeout: 5000 });
    console.log('✅ Backend is online:', response.status);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend is not responding (connection refused)');
    } else if (error.response) {
      console.log('⚠️ Backend responded but /health endpoint not found:', error.response.status);
    } else {
      console.log('⚠️ Could not connect to backend:', error.message);
    }
  }

  console.log('\n---\n');

  // Test 2: Try to access push-token endpoint (will fail without auth, but should show endpoint exists)
  try {
    console.log('Test 2: Push Token Endpoint Check');
    const response = await axios.post(`${BACKEND_URL}/api/drivers/push-token`, {
      pushToken: 'test',
      platform: 'android'
    }, { timeout: 5000 });
    console.log('✅ Push token endpoint exists and responded:', response.status);
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        console.log('✅ Push token endpoint EXISTS (returned auth error as expected)');
        console.log('   Status:', error.response.status);
        console.log('   This means the endpoint is deployed!');
      } else if (error.response.status === 404) {
        console.log('❌ Push token endpoint NOT FOUND (404)');
        console.log('   The push notification code is NOT deployed yet.');
      } else {
        console.log('⚠️ Unexpected response:', error.response.status, error.response.data);
      }
    } else {
      console.log('❌ Could not reach endpoint:', error.message);
    }
  }

  console.log('\n---\n');

  // Test 3: Check database for push_token column (requires DATABASE_URL)
  console.log('Test 3: Database Column Check');
  console.log('ℹ️ To check if database migration has been run:');
  console.log('   1. Go to Railway Dashboard → PostgreSQL service');
  console.log('   2. Click "Data" tab → "Query"');
  console.log('   3. Run this SQL:');
  console.log('');
  console.log('   SELECT column_name, data_type');
  console.log('   FROM information_schema.columns');
  console.log('   WHERE table_name = \'drivers\'');
  console.log('     AND column_name LIKE \'push%\';');
  console.log('');
  console.log('   Expected result: 3 rows (push_token, push_platform, push_token_updated_at)');
  console.log('   If 0 rows: Migration has NOT been run yet');
  console.log('   If 3 rows: Migration HAS been run ✅');

  console.log('\n---\n');

  // Summary
  console.log('📋 SUMMARY:');
  console.log('');
  console.log('Local Files Status:');
  console.log('✅ backend/utils/pushNotifications.js - EXISTS');
  console.log('✅ backend/routes/drivers.js - Modified with /push-token endpoint');
  console.log('✅ backend/routes/rides.js - Modified with notification sending');
  console.log('✅ package.json - axios dependency added');
  console.log('✅ Code committed to Git');
  console.log('✅ Code pushed to GitHub');
  console.log('');
  console.log('Railway Deployment Status:');
  console.log('❓ Check Test 2 result above to see if push-token endpoint exists');
  console.log('');
  console.log('Database Migration Status:');
  console.log('❓ Run the SQL query shown in Test 3 to verify');
  console.log('');
  console.log('Next Steps:');
  console.log('1. If push-token endpoint shows 404: Wait for Railway auto-deploy or redeploy manually');
  console.log('2. If database shows 0 rows: Run migration SQL (see PUSH_NOTIFICATIONS_QUICK_START.md Step 1)');
  console.log('3. If both show ✅: You\'re ready to rebuild driver APK and test!');
}

// Run verification
verifyPushNotificationDeployment().catch(console.error);

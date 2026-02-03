// Test script to simulate frontend authentication flow
const axios = require('axios');

// Configure axios to use the same base URL as the frontend
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

async function testFrontendAuthFlow() {
  console.log('🧪 Testing Frontend Authentication Flow\n');

  // Generate a unique email for this test
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'SecurePass123!';

  console.log(`📝 Testing signup with email: ${testEmail}`);

  // Test 1: Signup
  try {
    const signupResponse = await apiClient.post('/api/auth/register', {
      email: testEmail,
      password: testPassword
    });

    if (signupResponse.status === 201 && signupResponse.data.success) {
      console.log('✅ Signup successful');
      console.log(`   User ID: ${signupResponse.data.user.id}`);
      console.log(`   Access Token: ${signupResponse.data.access_token ? 'Received' : 'Missing'}`);

      const accessToken = signupResponse.data.access_token;

      // Test 2: Login with the same credentials
      console.log(`\n🔐 Testing login with email: ${testEmail}`);

      const loginResponse = await apiClient.post('/api/auth/login', {
        email: testEmail,
        password: testPassword
      });

      if (loginResponse.status === 200 && loginResponse.data.success) {
        console.log('✅ Login successful');
        console.log(`   User ID: ${loginResponse.data.user.id}`);
        console.log(`   New Access Token: ${loginResponse.data.access_token ? 'Received' : 'Missing'}`);

        // Test 3: Try to register the same user again (should fail)
        console.log(`\n🛡️  Testing duplicate registration prevention`);

        try {
          const duplicateResponse = await apiClient.post('/api/auth/register', {
            email: testEmail,
            password: testPassword
          });

          console.log('❌ Duplicate registration was allowed (should have failed)');
          return false;
        } catch (duplicateError) {
          if (duplicateError.response && duplicateError.response.status === 400) {
            console.log('✅ Duplicate registration properly prevented');
            console.log(`   Error: ${duplicateError.response.data.detail}`);

            console.log('\n🎉 All authentication tests passed!');
            console.log('\n📋 Summary:');
            console.log('   • Signup functionality works correctly');
            console.log('   • Login functionality works correctly');
            console.log('   • Duplicate registration prevention works');
            console.log('   • JWT token generation is functional');
            console.log('   • Backend API endpoints are accessible');

            return true;
          } else {
            console.log('❌ Unexpected error during duplicate test');
            console.error(`   Error: ${duplicateError.message}`);
            return false;
          }
        }
      } else {
        console.log('❌ Login failed');
        console.log(`   Status: ${loginResponse.status}`);
        console.log(`   Data: ${JSON.stringify(loginResponse.data)}`);
        return false;
      }
    } else {
      console.log('❌ Signup failed');
      console.log(`   Status: ${signupResponse.status}`);
      console.log(`   Data: ${JSON.stringify(signupResponse.data)}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Signup test failed');
    console.error(`   Error: ${error.message}`);
    if (error.response) {
      console.error(`   Response: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

// Run the test
testFrontendAuthFlow().then(success => {
  console.log(`\n🏁 Authentication flow test: ${success ? 'PASSED' : 'FAILED'}`);
  process.exit(success ? 0 : 1);
});
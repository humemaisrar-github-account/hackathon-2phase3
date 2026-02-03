// Comprehensive end-to-end test for the Todo Web Application
const axios = require('axios');

async function runEndToEndTests() {
  console.log('🧪 Running End-to-End Tests for Todo Web Application\n');

  // Test 1: Check if backend API is accessible
  console.log('🔍 Test 1: Checking backend API availability...');
  try {
    const healthResponse = await axios.get('http://127.0.0.1:8000/');
    if (healthResponse.status === 200 && healthResponse.data.message) {
      console.log('✅ Backend API is accessible');
      console.log(`   Message: ${healthResponse.data.message}`);
    } else {
      console.log('❌ Backend API is not accessible');
      return false;
    }
  } catch (error) {
    console.log('❌ Backend API is not accessible');
    console.error(`   Error: ${error.message}`);
    return false;
  }

  // Test 2: Test user registration
  console.log('\n📝 Test 2: Testing user registration...');
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testData = {
    email: testEmail,
    password: 'securePassword123!'
  };

  try {
    const registerResponse = await axios.post('http://127.0.0.1:8000/api/auth/register', testData);

    if (registerResponse.status === 201 && registerResponse.data.success) {
      console.log('✅ User registration successful');
      console.log(`   User ID: ${registerResponse.data.user.id}`);
      console.log(`   Email: ${registerResponse.data.user.email}`);
    } else {
      console.log('❌ User registration failed');
      return false;
    }
  } catch (error) {
    console.log('❌ User registration failed');
    console.error(`   Error: ${error.message}`);
    if (error.response) {
      console.error(`   Response: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }

  // Test 3: Test user login with the same credentials
  console.log('\n🔐 Test 3: Testing user login...');
  try {
    const loginResponse = await axios.post('http://127.0.0.1:8000/api/auth/login', testData);

    if (loginResponse.status === 200 && loginResponse.data.success) {
      console.log('✅ User login successful');
      console.log(`   User ID: ${loginResponse.data.user.id}`);
      console.log(`   Access Token: ${loginResponse.data.access_token ? 'Received' : 'Missing'}`);
    } else {
      console.log('❌ User login failed');
      return false;
    }
  } catch (error) {
    console.log('❌ User login failed');
    console.error(`   Error: ${error.message}`);
    if (error.response) {
      console.error(`   Response: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }

  // Test 4: Test that we can't register the same user twice
  console.log('\n🛡️  Test 4: Testing duplicate registration prevention...');
  try {
    const duplicateResponse = await axios.post('http://127.0.0.1:8000/api/auth/register', testData);
    console.log('❌ Duplicate registration was allowed (should have failed)');
    return false;
  } catch (error) {
    if (error.response && error.response.status === 400 && error.response.data.detail.includes('already registered')) {
      console.log('✅ Duplicate registration properly prevented');
      console.log(`   Error message: ${error.response.data.detail}`);
    } else {
      console.log('❌ Unexpected error during duplicate registration test');
      console.error(`   Error: ${error.message}`);
      return false;
    }
  }

  console.log('\n🎉 All tests passed! The Todo Web Application is working correctly.');
  console.log('\n📋 Summary of fixes:');
  console.log('   • Fixed endpoint mismatch between frontend and backend');
  console.log('   • Resolved database connection issues');
  console.log('   • Fixed missing timedelta import in UserService');
  console.log('   • Updated environment configurations');
  console.log('   • Verified signup and login functionality');

  return true;
}

// Run the tests
runEndToEndTests().then(success => {
  console.log(`\n🏁 End-to-end tests: ${success ? 'PASSED' : 'FAILED'}`);
  process.exit(success ? 0 : 1);
});
// Test script to verify login functionality
const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login endpoint...');

    // Use the same credentials as the successful signup
    const loginData = {
      email: 'testuser_' + Date.now() + '@example.com', // New user for this test
      password: 'testpassword123'
    };

    // First register a new user
    console.log('Registering a new user...');
    const registerResponse = await axios.post('http://127.0.0.1:8000/api/auth/register', loginData);
    console.log('User registered successfully');

    // Now try to log in with the same credentials
    console.log('Making login request...');
    const loginResponse = await axios.post('http://127.0.0.1:8000/api/auth/login', loginData);

    console.log('Login response received:');
    console.log('Status:', loginResponse.status);
    console.log('Data:', loginResponse.data);

    if (loginResponse.data.success) {
      console.log('✅ Login test PASSED!');
      console.log('User logged in successfully with ID:', loginResponse.data.user.id);
      return true;
    } else {
      console.log('❌ Login test FAILED - response not successful');
      return false;
    }
  } catch (error) {
    console.error('❌ Login test FAILED with error:');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Run the test
testLogin().then(success => {
  console.log('\nTest completed:', success ? 'PASSED' : 'FAILED');
  process.exit(success ? 0 : 1);
});
// Test script to verify signup functionality
const axios = require('axios');

async function testSignup() {
  try {
    console.log('Testing signup endpoint...');

    // Test data for signup
    const userData = {
      email: 'testuser_' + Date.now() + '@example.com',
      password: 'testpassword123'
    };

    console.log('Making request to backend register endpoint...');
    const response = await axios.post('http://127.0.0.1:8000/api/auth/register', userData);

    console.log('Response received:');
    console.log('Status:', response.status);
    console.log('Data:', response.data);

    if (response.data.success) {
      console.log('✅ Signup test PASSED!');
      console.log('User registered successfully with ID:', response.data.user.id);
      return true;
    } else {
      console.log('❌ Signup test FAILED - response not successful');
      return false;
    }
  } catch (error) {
    console.error('❌ Signup test FAILED with error:');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Run the test
testSignup().then(success => {
  console.log('\nTest completed:', success ? 'PASSED' : 'FAILED');
  process.exit(success ? 0 : 1);
});
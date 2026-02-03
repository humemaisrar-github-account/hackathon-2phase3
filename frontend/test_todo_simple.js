// Simple test to verify todo functionality without user_id in request body
const axios = require('axios');

async function testSimpleTodoCreation() {
  console.log('📝 Testing Simple Todo Creation\n');

  // First, register and login a test user
  const testEmail = `simpletest_${Date.now()}@example.com`;
  const testPassword = 'SecurePass123!';

  console.log(`📝 Registering test user: ${testEmail}`);

  // Register user
  const registerResponse = await axios.post('http://127.0.0.1:8000/api/auth/register', {
    email: testEmail,
    password: testPassword
  });

  if (!registerResponse.data.success) {
    console.log('❌ User registration failed');
    return false;
  }

  console.log('✅ User registered successfully');
  const accessToken = registerResponse.data.access_token;
  const userId = registerResponse.data.user.id;

  // Create axios instance with auth header
  const authApiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
  });

  console.log('\n📋 Testing todo creation (without user_id in request)...');

  // Test: Create a todo WITHOUT user_id (since it should be auto-set)
  const todoData = {
    title: 'Test Todo Item',
    description: 'This is a test todo item created via API',
    is_completed: false
  };

  try {
    const createResponse = await authApiClient.post('/api/todos', todoData);

    console.log(`Response Status: ${createResponse.status}`);
    console.log(`Response Data: ${JSON.stringify(createResponse.data, null, 2)}`);

    if (createResponse.status === 200 && createResponse.data.todo && createResponse.data.todo.id) {
      console.log('✅ Todo created successfully');
      console.log(`   Todo ID: ${createResponse.data.todo.id}`);
      console.log(`   Title: ${createResponse.data.todo.title}`);
      console.log(`   User ID (should match authenticated user): ${createResponse.data.todo.user_id}`);

      // Verify that the todo was associated with the correct user
      if (createResponse.data.todo.user_id === userId) {
        console.log('✅ Todo correctly associated with authenticated user');

        // Clean up - delete the test todo
        const deleteResponse = await authApiClient.delete(`/api/todos/${createResponse.data.todo.id}`);
        if (deleteResponse.status === 200) {
          console.log('✅ Test todo cleaned up successfully');

          console.log('\n🎉 Simple todo creation test passed!');
          return true;
        } else {
          console.log('⚠️  Todo cleanup failed, but creation worked');
          return true; // Still consider it a success for creation test
        }
      } else {
        console.log('❌ Todo was not associated with the correct user');
        console.log(`   Expected user ID: ${userId}`);
        console.log(`   Actual user ID: ${createResponse.data.todo.user_id}`);
        return false;
      }
    } else {
      console.log('❌ Todo creation failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Todo creation failed with error:');
    console.error(`   Error: ${error.message}`);
    if (error.response) {
      console.error(`   Response: ${error.response.status} - ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return false;
  }
}

// Run the test
testSimpleTodoCreation().then(success => {
  console.log(`\n🏁 Simple todo test: ${success ? 'PASSED' : 'FAILED'}`);
  process.exit(success ? 0 : 1);
});
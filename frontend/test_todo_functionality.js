// Test script to verify todo functionality with authentication
const axios = require('axios');

async function testTodoFunctionality() {
  console.log('📝 Testing Todo Functionality with Authentication\n');

  // First, register and login a test user
  const testEmail = `todotest_${Date.now()}@example.com`;
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

  console.log('\n📋 Testing todo creation...');

  // Test 1: Create a todo
  const todoData = {
    title: 'Test Todo Item',
    description: 'This is a test todo item created via API',
    is_completed: false
  };

  try {
    const createResponse = await authApiClient.post('/api/todos', todoData);

    if (createResponse.status === 200 && createResponse.data.id) {
      console.log('✅ Todo created successfully');
      console.log(`   Todo ID: ${createResponse.data.id}`);
      console.log(`   Title: ${createResponse.data.title}`);

      const todoId = createResponse.data.id;

      // Test 2: Get the created todo
      console.log('\n🔍 Testing todo retrieval...');
      const getResponse = await authApiClient.get(`/api/todos/${todoId}`);

      if (getResponse.status === 200 && getResponse.data.id === todoId) {
        console.log('✅ Todo retrieved successfully');
        console.log(`   Retrieved title: ${getResponse.data.title}`);

        // Test 3: Get all todos for the user
        console.log('\n📚 Testing todo list retrieval...');
        const listResponse = await authApiClient.get('/api/todos');

        if (listResponse.status === 200 && Array.isArray(listResponse.data.todos)) {
          console.log(`✅ Todo list retrieved successfully (${listResponse.data.todos.length} items)`);

          // Test 4: Update the todo
          console.log('\nPencil Testing todo update...');
          const updateData = {
            title: 'Updated Test Todo Item',
            description: 'This is an updated test todo item',
            is_completed: true
          };

          const updateResponse = await authApiClient.put(`/api/todos/${todoId}`, updateData);

          if (updateResponse.status === 200 && updateResponse.data.id === todoId) {
            console.log('✅ Todo updated successfully');
            console.log(`   Updated title: ${updateResponse.data.title}`);
            console.log(`   Is completed: ${updateResponse.data.is_completed}`);

            // Test 5: Toggle todo completion status
            console.log('\n🔄 Testing todo completion toggle...');
            const toggleResponse = await authApiClient.patch(`/api/todos/${todoId}/toggle-complete`);

            if (toggleResponse.status === 200) {
              console.log('✅ Todo completion toggled successfully');

              // Test 6: Delete the todo
              console.log('\n🗑️  Testing todo deletion...');
              const deleteResponse = await authApiClient.delete(`/api/todos/${todoId}`);

              if (deleteResponse.status === 200) {
                console.log('✅ Todo deleted successfully');

                console.log('\n🎉 All todo functionality tests passed!');
                console.log('\n📋 Summary:');
                console.log('   • User authentication works correctly');
                console.log('   • Todo creation works correctly');
                console.log('   • Todo retrieval works correctly');
                console.log('   • Todo list retrieval works correctly');
                console.log('   • Todo update works correctly');
                console.log('   • Todo completion toggle works correctly');
                console.log('   • Todo deletion works correctly');

                return true;
              } else {
                console.log('❌ Todo deletion failed');
                return false;
              }
            } else {
              console.log('❌ Todo completion toggle failed');
              return false;
            }
          } else {
            console.log('❌ Todo update failed');
            return false;
          }
        } else {
          console.log('❌ Todo list retrieval failed');
          return false;
        }
      } else {
        console.log('❌ Todo retrieval failed');
        return false;
      }
    } else {
      console.log('❌ Todo creation failed');
      console.log(`   Status: ${createResponse.status}`);
      console.log(`   Response: ${JSON.stringify(createResponse.data)}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Todo operation failed');
    console.error(`   Error: ${error.message}`);
    if (error.response) {
      console.error(`   Response: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

// Run the test
testTodoFunctionality().then(success => {
  console.log(`\n🏁 Todo functionality test: ${success ? 'PASSED' : 'FAILED'}`);
  process.exit(success ? 0 : 1);
});
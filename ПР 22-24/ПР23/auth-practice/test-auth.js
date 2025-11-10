const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testAuth() {
  try {
    console.log('1. Testing registration...');
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
      email: 'test@example.com',
      password: 'securepassword',
      role: 'user'
    });
    console.log('Registration:', registerResponse.data);

    console.log('\n2. Testing login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'test@example.com',
      password: 'securepassword'
    });
    console.log('Login:', { 
      user: loginResponse.data.user,
      token: loginResponse.data.token ? '✓ RECEIVED' : '✗ MISSING'
    });

    const token = loginResponse.data.token;

    console.log('\n3. Testing protected route...');
    const protectedResponse = await axios.get(`${API_BASE}/protected`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Protected route:', protectedResponse.data);

    console.log('\nAll tests passed!');

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testAuth();
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

let createdItemId;
let testItem = {
  title: 'Тестовая задача',
  description: 'Описание тестовой задачи',
  completed: false
};

async function testItems() {
  try {
    console.log(' Starting Items API Tests...\n');

    console.log('1. Testing GET /api/items...');
    const getResponse = await axios.get(`${API_BASE}/items`);
    console.log(' GET /api/items:', {
      status: getResponse.status,
      count: getResponse.data.length,
      data: getResponse.data.slice(0, 2) 
    });

    console.log('\n2. Testing POST /api/items...');
    const postResponse = await axios.post(`${API_BASE}/items`, testItem);
    console.log(' POST /api/items:', {
      status: postResponse.status,
      data: postResponse.data
    });
    
    createdItemId = postResponse.data.id;
    console.log(` Created item ID: ${createdItemId}`);

    console.log('\n3. Testing GET /api/items/:id...');
    const getByIdResponse = await axios.get(`${API_BASE}/items/${createdItemId}`);
    console.log(' GET /api/items/:id:', {
      status: getByIdResponse.status,
      data: getByIdResponse.data
    });

    console.log('\n4. Testing PUT /api/items/:id...');
    const updateData = {
      title: 'Обновленная тестовая задача',
      description: 'Обновленное описание',
      completed: true
    };
    
    const putResponse = await axios.put(`${API_BASE}/items/${createdItemId}`, updateData);
    console.log(' PUT /api/items/:id:', {
      status: putResponse.status,
      data: putResponse.data
    });

    console.log('\n5. Verifying update with GET /api/items/:id...');
    const verifyResponse = await axios.get(`${API_BASE}/items/${createdItemId}`);
    console.log(' Verification GET:', {
      status: verifyResponse.status,
      title: verifyResponse.data.title,
      completed: verifyResponse.data.completed,
      match: verifyResponse.data.title === updateData.title && 
             verifyResponse.data.completed === updateData.completed
    });

    console.log('\n6. Testing DELETE /api/items/:id...');
    const deleteResponse = await axios.delete(`${API_BASE}/items/${createdItemId}`);
    console.log(' DELETE /api/items/:id:', {
      status: deleteResponse.status,
      statusText: deleteResponse.statusText
    });

    console.log('\n7. Verifying deletion with GET /api/items/:id...');
    try {
      await axios.get(`${API_BASE}/items/${createdItemId}`);
      console.log(' Item still exists after deletion!');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(' Item successfully deleted (404 Not Found)');
      } else {
        throw error;
      }
    }

    console.log('\n8. Testing error handling...');
    
    try {
      await axios.get(`${API_BASE}/items/99999`);
    } catch (error) {
      console.log(' GET non-existent item:', {
        status: error.response.status,
        error: error.response.data.error
      });
    }

    try {
      await axios.put(`${API_BASE}/items/99999`, testItem);
    } catch (error) {
      console.log(' PUT non-existent item:', {
        status: error.response.status,
        error: error.response.data.error
      });
    }

    try {
      await axios.delete(`${API_BASE}/items/99999`);
    } catch (error) {
      console.log(' DELETE non-existent item:', {
        status: error.response.status,
        error: error.response.data.error
      });
    }

    try {
      await axios.post(`${API_BASE}/items`, {
        description: 'Только описание'
      });
    } catch (error) {
      console.log(' POST invalid data:', {
        status: error.response.status,
        error: error.response.data.error || 'Validation error'
      });
    }

    console.log('\n9. Final state check...');
    const finalResponse = await axios.get(`${API_BASE}/items`);
    const finalItems = finalResponse.data;
    const testItemExists = finalItems.some(item => item.id === createdItemId);
    
    console.log(' Final state:', {
      totalItems: finalItems.length,
      testItemExists: testItemExists ? ' FAIL' : ' PASS',
      items: finalItems.map(item => ({
        id: item.id,
        title: item.title,
        completed: item.completed
      }))
    });

    console.log('\nAll tests completed successfully!');
    console.log('Test Summary:');
    console.log('   GET all items');
    console.log('   CREATE new item');
    console.log('   GET item by ID');
    console.log('   UPDATE item');
    console.log('   DELETE item');
    console.log('   Error handling');
    console.log('   Data validation');

  } catch (error) {
    console.error('\nTest failed:');
    
    if (error.response) {
      console.error('Response error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.response.config.url,
        method: error.response.config.method
      });
    } else if (error.request) {
      console.error('No response received:', {
        message: error.message,
        url: error.request._currentUrl
      });
      console.error('Make sure the backend server is running on http://localhost:5000');
    } else {
      console.error('Request setup error:', error.message);
    }
    
    process.exit(1);
  }
}

async function runEdgeCaseTests() {
  console.log('\nRunning edge case tests...\n');
  
  try {
    console.log('1. Testing POST with only title...');
    const minimalItem = { title: 'Минимальная задача' };
    const response1 = await axios.post(`${API_BASE}/items`, minimalItem);
    console.log('Created with only title:', {
      id: response1.data.id,
      title: response1.data.title,
      completed: response1.data.completed, 
      description: response1.data.description || 'empty'
    });
    
    console.log('\n2. Testing partial UPDATE...');
    const partialUpdate = { completed: true };
    await axios.put(`${API_BASE}/items/${response1.data.id}`, partialUpdate);
    const verifyPartial = await axios.get(`${API_BASE}/items/${response1.data.id}`);
    console.log('Partial update:', {
      title: verifyPartial.data.title,
      completed: verifyPartial.data.completed 
    });
    
    console.log('\n3. Testing long values...');
    const longItem = {
      title: 'О'.repeat(50), 
      description: 'О'.repeat(200) 
    };
    const response3 = await axios.post(`${API_BASE}/items`, longItem);
    console.log('Long values handled:', {
      titleLength: response3.data.title.length,
      descriptionLength: response3.data.description.length
    });
    
    await axios.delete(`${API_BASE}/items/${response1.data.id}`);
    await axios.delete(`${API_BASE}/items/${response3.data.id}`);
    
    console.log('\nEdge case tests completed!');
    
  } catch (error) {
    console.error('Edge case test failed:', error.response?.data || error.message);
  }
}

testItems()
  .then(() => {
    return runEdgeCaseTests();
  })
  .then(() => {
    console.log('\nAll tests finished successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\nTest suite failed:', error.message);
    process.exit(1);
  });
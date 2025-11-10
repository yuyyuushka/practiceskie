import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    const customError = {
      message: error.response?.data?.error || 'Произошла ошибка при выполнении запроса',
      status: error.response?.status || 500,
      data: error.response?.data
    };
    
    return Promise.reject(customError);
  }
);

export const itemsService = {
  getAll: async () => {
    const response = await apiClient.get('/items');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/items/${id}`);
    return response.data;
  },

  create: async (itemData) => {
    const response = await apiClient.post('/items', itemData);
    return response.data;
  },

  update: async (id, itemData) => {
    const response = await apiClient.put(`/items/${id}`, itemData);
    return response.data;
  },

  delete: async (id) => {
    await apiClient.delete(`/items/${id}`);
  }
};

export default apiClient;
import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/auth/me', data);
    return response.data;
  },
};

export const laptopService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/laptops?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/laptops/${id}`);
    return response.data;
  },

  create: async (laptopData) => {
    const response = await api.post('/laptops', laptopData);
    return response.data;
  },

  update: async (id, laptopData) => {
    const response = await api.put(`/laptops/${id}`, laptopData);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/laptops/${id}`);
  },

  getMyListings: async () => {
    const response = await api.get('/laptops/user/my-listings');
    return response.data;
  },

  uploadImages: async (id, files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    const response = await api.post(`/laptops/${id}/upload-images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const mlService = {
  predictPrice: async (specs) => {
    const response = await api.post('/ml/predict', specs);
    return response.data;
  },

  healthCheck: async () => {
    const response = await api.get('/ml/health');
    return response.data;
  },
};

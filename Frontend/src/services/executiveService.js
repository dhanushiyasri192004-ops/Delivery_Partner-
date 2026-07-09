import api from './api';

const executiveService = {
  getDashboard: async () => {
    const response = await api.get('/executive/dashboard');
    return response.data;
  },

  updateStatus: async (status) => {
    const response = await api.patch('/executive/status', { status });
    return response.data;
  },

  acceptTrip: async (tripId) => {
    const response = await api.patch(`/executive/trips/${tripId}/accept`);
    return response.data;
  },

  startTravel: async (tripId) => {
    const response = await api.patch(`/executive/trips/${tripId}/transit`);
    return response.data;
  },

  closeTrip: async (tripId, formData) => {
    const response = await api.post(`/executive/trips/${tripId}/complete`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getTripHistory: async () => {
    const response = await api.get('/executive/history');
    return response.data;
  }
};

export default executiveService;

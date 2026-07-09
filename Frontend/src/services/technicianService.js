import api from './api';

const technicianService = {
  getDashboard: async () => {
    const response = await api.get('/technician/dashboard');
    return response.data;
  },

  updateStatus: async (status) => {
    const response = await api.patch('/technician/status', { status });
    return response.data;
  },

  acceptService: async (bookingId) => {
    const response = await api.patch(`/technician/services/${bookingId}/accept`);
    return response.data;
  },

  startTransit: async (bookingId) => {
    const response = await api.patch(`/technician/services/${bookingId}/transit`);
    return response.data;
  },

  arrivedCustomer: async (bookingId) => {
    const response = await api.patch(`/technician/services/${bookingId}/arrived`);
    return response.data;
  },

  uploadBeforePhoto: async (bookingId, formData) => {
    const response = await api.post(`/technician/services/${bookingId}/before-photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  uploadAfterPhoto: async (bookingId, formData) => {
    const response = await api.post(`/technician/services/${bookingId}/after-photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  completeService: async (bookingId, formData) => {
    const response = await api.post(`/technician/services/${bookingId}/complete`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getServiceHistory: async () => {
    const response = await api.get('/technician/history');
    return response.data;
  }
};

export default technicianService;

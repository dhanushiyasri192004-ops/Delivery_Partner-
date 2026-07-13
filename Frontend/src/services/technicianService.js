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

  arrivedCustomer: async (bookingId, coordinates) => {
    const response = await api.patch(`/technician/services/${bookingId}/arrived`, coordinates);
    return response.data;
  },

  uploadBeforePhoto: async (bookingId, formData) => {
    const response = await api.post(`/technician/services/${bookingId}/before-photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  startService: async (bookingId) => {
    const response = await api.patch(`/technician/services/${bookingId}/start`);
    return response.data;
  },

  startInProgress: async (bookingId) => {
    const response = await api.patch(`/technician/services/${bookingId}/in-progress`);
    return response.data;
  },

  completeService: async (bookingId, coordinates) => {
    const response = await api.patch(`/technician/services/${bookingId}/complete`, coordinates);
    return response.data;
  },

  uploadAfterPhoto: async (bookingId, formData) => {
    const response = await api.post(`/technician/services/${bookingId}/after-photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  verifyOTP: async (bookingId, otp) => {
    const response = await api.post(`/technician/services/${bookingId}/verify-otp`, { otp });
    return response.data;
  },

  releasePayout: async (bookingId) => {
    const response = await api.patch(`/technician/services/${bookingId}/update-wallet`);
    return response.data;
  },

  closeJob: async (bookingId) => {
    const response = await api.patch(`/technician/services/${bookingId}/close`);
    return response.data;
  },

  getServiceHistory: async () => {
    const response = await api.get('/technician/history');
    return response.data;
  }
};

export default technicianService;

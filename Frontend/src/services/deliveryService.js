import api from './api';

const deliveryService = {
  getDashboard: async () => {
    const response = await api.get('/delivery/dashboard');
    return response.data;
  },

  updateStatus: async (status) => {
    const response = await api.patch('/delivery/status', { status });
    return response.data;
  },

  acceptOrder: async (orderId) => {
    const response = await api.patch(`/delivery/orders/${orderId}/accept`);
    return response.data;
  },

  reachedVendor: async (orderId) => {
    const response = await api.patch(`/delivery/orders/${orderId}/reached-vendor`);
    return response.data;
  },

  verifyPickup: async (orderId, formData) => {
    const response = await api.post(`/delivery/orders/${orderId}/verify-pickup`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  reachedCustomer: async (orderId) => {
    const response = await api.patch(`/delivery/orders/${orderId}/reached-customer`);
    return response.data;
  },

  verifyDelivery: async (orderId, formData) => {
    const response = await api.post(`/delivery/orders/${orderId}/verify-delivery`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getOrderHistory: async () => {
    const response = await api.get('/delivery/history');
    return response.data;
  }
};

export default deliveryService;

import api from './api';

const notificationService = {
  getNotifications: async () => {
    // In our simplified setup, notifications are loaded via dashboards, 
    // but we can query them dynamically
    const response = await api.get('/delivery/dashboard'); 
    return response.data.notifications || [];
  }
};

export default notificationService;

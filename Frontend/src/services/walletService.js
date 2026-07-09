import api from './api';

const walletService = {
  getWalletDetails: async () => {
    const response = await api.get('/wallet');
    return response.data;
  },

  requestWithdrawal: async (amount) => {
    const response = await api.post('/wallet/withdraw', { amount });
    return response.data;
  }
};

export default walletService;


import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import deliveryReducer from './slices/deliverySlice';
import technicianReducer from './slices/technicianSlice';
import executiveReducer from './slices/executiveSlice';
import walletReducer from './slices/walletSlice';
import notificationReducer from './slices/notificationSlice';
import stayReducer from './slices/staySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    delivery: deliveryReducer,
    technician: technicianReducer,
    executive: executiveReducer,
    wallet: walletReducer,
    notification: notificationReducer,
    stay: stayReducer,
  }
});

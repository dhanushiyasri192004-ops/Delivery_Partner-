import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import deliveryService from '../../services/deliveryService';

const initialState = {
  partnerStatus: 'offline',
  activeOrder: null,
  assignedOrder: null,
  metrics: {
    todayEarnings: 0,
    todayOrdersCount: 0,
    completedCount: 0,
    cancellationCount: 0
  },
  history: [],
  loading: false,
  error: null
};

export const fetchDeliveryDashboard = createAsyncThunk(
  'delivery/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const data = await deliveryService.getDashboard();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard');
    }
  }
);

export const updateOnlineStatus = createAsyncThunk(
  'delivery/updateStatus',
  async (status, { rejectWithValue }) => {
    try {
      const data = await deliveryService.updateStatus(status);
      return data.status;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

export const acceptOrder = createAsyncThunk(
  'delivery/acceptOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await deliveryService.acceptOrder(orderId);
      return data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept order');
    }
  }
);

export const reachedVendor = createAsyncThunk(
  'delivery/reachedVendor',
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await deliveryService.reachedVendor(orderId);
      return data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update vendor progress');
    }
  }
);

export const verifyPickup = createAsyncThunk(
  'delivery/verifyPickup',
  async ({ orderId, formData }, { rejectWithValue }) => {
    try {
      const data = await deliveryService.verifyPickup(orderId, formData);
      return data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify pickup');
    }
  }
);

export const reachedCustomer = createAsyncThunk(
  'delivery/reachedCustomer',
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await deliveryService.reachedCustomer(orderId);
      return data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update customer transit progress');
    }
  }
);

export const verifyDelivery = createAsyncThunk(
  'delivery/verifyDelivery',
  async ({ orderId, formData }, { rejectWithValue }) => {
    try {
      const data = await deliveryService.verifyDelivery(orderId, formData);
      return data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify delivery');
    }
  }
);

export const fetchOrderHistory = createAsyncThunk(
  'delivery/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const data = await deliveryService.getOrderHistory();
      return data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order history');
    }
  }
);

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    clearDeliveryError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchDeliveryDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.partnerStatus = action.payload.partnerStatus;
        state.activeOrder = action.payload.activeOrder;
        state.assignedOrder = action.payload.assignedOrder;
        state.metrics = action.payload.metrics;
      })
      .addCase(fetchDeliveryDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update status
      .addCase(updateOnlineStatus.fulfilled, (state, action) => {
        state.partnerStatus = action.payload;
        state.error = null;
      })
      // Accept order
      .addCase(acceptOrder.fulfilled, (state, action) => {
        state.assignedOrder = null;
        state.activeOrder = action.payload;
        state.partnerStatus = 'busy';
        state.error = null;
      })
      // Reached vendor
      .addCase(reachedVendor.fulfilled, (state, action) => {
        state.activeOrder = action.payload;
        state.error = null;
      })
      // Verify pickup
      .addCase(verifyPickup.fulfilled, (state, action) => {
        state.activeOrder = action.payload;
        state.error = null;
      })
      // Reached customer
      .addCase(reachedCustomer.fulfilled, (state, action) => {
        state.activeOrder = action.payload;
        state.error = null;
      })
      // Verify delivery
      .addCase(verifyDelivery.fulfilled, (state) => {
        state.activeOrder = null;
        state.partnerStatus = 'online';
        state.error = null;
      })
      // History
      .addCase(fetchOrderHistory.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.history = action.payload;
        state.error = null;
      });
  }
});

export const { clearDeliveryError } = deliverySlice.actions;
export default deliverySlice.reducer;

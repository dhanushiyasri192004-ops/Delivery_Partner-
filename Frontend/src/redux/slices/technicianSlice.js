import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import technicianService from '../../services/technicianService';

const initialState = {
  technicianStatus: 'offline',
  activeService: null,
  assignedService: null,
  metrics: {
    assignedCount: 0,
    activeCount: 0,
    completedCount: 0,
    cancelledCount: 0,
    todayEarnings: 0,
    weeklyEarnings: 0,
    walletBalance: 0,
    customerRating: 4.8
  },
  walletBalance: 0,
  history: [],
  loading: false,
  error: null
};

export const fetchTechnicianDashboard = createAsyncThunk(
  'technician/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const data = await technicianService.getDashboard();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load technician dashboard');
    }
  }
);

export const updateTechnicianOnlineStatus = createAsyncThunk(
  'technician/updateStatus',
  async (status, { rejectWithValue }) => {
    try {
      const data = await technicianService.updateStatus(status);
      return data.status;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update technician status');
    }
  }
);

export const acceptService = createAsyncThunk(
  'technician/acceptService',
  async (bookingId, { rejectWithValue }) => {
    try {
      const data = await technicianService.acceptService(bookingId);
      return data.booking;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept service');
    }
  }
);

export const startTransit = createAsyncThunk(
  'technician/startTransit',
  async (bookingId, { rejectWithValue }) => {
    try {
      const data = await technicianService.startTransit(bookingId);
      return data.booking;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start transit');
    }
  }
);

export const arrivedCustomer = createAsyncThunk(
  'technician/arrivedCustomer',
  async ({ bookingId, coordinates }, { rejectWithValue }) => {
    try {
      const data = await technicianService.arrivedCustomer(bookingId, coordinates);
      return data.booking;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update site arrival');
    }
  }
);

export const uploadBeforePhoto = createAsyncThunk(
  'technician/uploadBeforePhoto',
  async ({ bookingId, formData }, { rejectWithValue }) => {
    try {
      const data = await technicianService.uploadBeforePhoto(bookingId, formData);
      return data.booking;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload pre-service verification');
    }
  }
);

export const startService = createAsyncThunk(
  'technician/startService',
  async (bookingId, { rejectWithValue }) => {
    try {
      const data = await technicianService.startService(bookingId);
      return data.booking;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start service');
    }
  }
);

export const startInProgress = createAsyncThunk(
  'technician/startInProgress',
  async (bookingId, { rejectWithValue }) => {
    try {
      const data = await technicianService.startInProgress(bookingId);
      return data.booking;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to set service in progress');
    }
  }
);

export const completeService = createAsyncThunk(
  'technician/completeService',
  async ({ bookingId, coordinates }, { rejectWithValue }) => {
    try {
      const data = await technicianService.completeService(bookingId, coordinates);
      return data.booking;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to complete service');
    }
  }
);

export const uploadAfterPhoto = createAsyncThunk(
  'technician/uploadAfterPhoto',
  async ({ bookingId, formData }, { rejectWithValue }) => {
    try {
      const data = await technicianService.uploadAfterPhoto(bookingId, formData);
      return data.booking;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload post-service verification');
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'technician/verifyOTP',
  async ({ bookingId, otp }, { rejectWithValue }) => {
    try {
      const data = await technicianService.verifyOTP(bookingId, otp);
      return data.booking;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify OTP');
    }
  }
);

export const releasePayout = createAsyncThunk(
  'technician/releasePayout',
  async (bookingId, { rejectWithValue }) => {
    try {
      const data = await technicianService.releasePayout(bookingId);
      return data.booking;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update wallet balance');
    }
  }
);

export const closeJob = createAsyncThunk(
  'technician/closeJob',
  async (bookingId, { rejectWithValue }) => {
    try {
      const data = await technicianService.closeJob(bookingId);
      return data.booking;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to close job');
    }
  }
);

export const fetchServiceHistory = createAsyncThunk(
  'technician/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const data = await technicianService.getServiceHistory();
      return data.bookings;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load service histories');
    }
  }
);

const technicianSlice = createSlice({
  name: 'technician',
  initialState,
  reducers: {
    clearTechnicianError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTechnicianDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTechnicianDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.technicianStatus = action.payload.technicianStatus;
        state.activeService = action.payload.activeService;
        state.assignedService = action.payload.assignedService;
        state.metrics = action.payload.metrics || initialState.metrics;
        state.walletBalance = action.payload.walletBalance || 0;
        state.error = null;
      })
      .addCase(fetchTechnicianDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTechnicianOnlineStatus.fulfilled, (state, action) => {
        state.technicianStatus = action.payload;
      })
      .addCase(acceptService.fulfilled, (state, action) => {
        state.assignedService = null;
        state.activeService = action.payload;
        state.technicianStatus = 'busy';
        state.error = null;
      })
      .addCase(startTransit.fulfilled, (state, action) => {
        state.activeService = action.payload;
        state.error = null;
      })
      .addCase(arrivedCustomer.fulfilled, (state, action) => {
        state.activeService = action.payload;
        state.error = null;
      })
      .addCase(uploadBeforePhoto.fulfilled, (state, action) => {
        state.activeService = action.payload;
        state.error = null;
      })
      .addCase(startService.fulfilled, (state, action) => {
        state.activeService = action.payload;
        state.error = null;
      })
      .addCase(startInProgress.fulfilled, (state, action) => {
        state.activeService = action.payload;
        state.error = null;
      })
      .addCase(completeService.fulfilled, (state, action) => {
        state.activeService = action.payload;
        state.error = null;
      })
      .addCase(uploadAfterPhoto.fulfilled, (state, action) => {
        state.activeService = action.payload;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.activeService = action.payload;
        state.error = null;
      })
      .addCase(releasePayout.fulfilled, (state, action) => {
        state.activeService = action.payload;
        state.error = null;
        if (action.payload.earnings) {
          state.walletBalance += action.payload.earnings;
        }
      })
      .addCase(closeJob.fulfilled, (state) => {
        state.activeService = null;
        state.technicianStatus = 'online';
        state.error = null;
      })
      .addCase(fetchServiceHistory.fulfilled, (state, action) => {
        state.history = action.payload;
        state.error = null;
      });
  }
});

export const { clearTechnicianError } = technicianSlice.actions;
export default technicianSlice.reducer;

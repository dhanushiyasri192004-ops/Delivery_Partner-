import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import technicianService from '../../services/technicianService';

const initialState = {
  technicianStatus: 'offline',
  activeService: null,
  assignedService: null,
  metrics: {
    completedCount: 0,
    todayEarnings: 0
  },
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
  async (bookingId, { rejectWithValue }) => {
    try {
      const data = await technicianService.arrivedCustomer(bookingId);
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

export const completeService = createAsyncThunk(
  'technician/completeService',
  async ({ bookingId, formData }, { rejectWithValue }) => {
    try {
      const data = await technicianService.completeService(bookingId, formData);
      return data.booking;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify completion');
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
      })
      .addCase(fetchTechnicianDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.technicianStatus = action.payload.technicianStatus;
        state.activeService = action.payload.activeService;
        state.assignedService = action.payload.assignedService;
        state.metrics = action.payload.metrics;
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
      })
      .addCase(startTransit.fulfilled, (state, action) => {
        state.activeService = action.payload;
      })
      .addCase(arrivedCustomer.fulfilled, (state, action) => {
        state.activeService = action.payload;
      })
      .addCase(uploadBeforePhoto.fulfilled, (state, action) => {
        state.activeService = action.payload;
      })
      .addCase(uploadAfterPhoto.fulfilled, (state, action) => {
        state.activeService = action.payload;
      })
      .addCase(completeService.fulfilled, (state) => {
        state.activeService = null;
        state.technicianStatus = 'online';
      })
      .addCase(fetchServiceHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      });
  }
});

export const { clearTechnicianError } = technicianSlice.actions;
export default technicianSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import executiveService from '../../services/executiveService';

const initialState = {
  executiveStatus: 'offline',
  activeTrip: null,
  assignedTrip: null,
  metrics: {
    completedCount: 0,
    assignedCount: 0
  },
  history: [],
  loading: false,
  error: null
};

export const fetchExecutiveDashboard = createAsyncThunk(
  'executive/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const data = await executiveService.getDashboard();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load executive dashboard');
    }
  }
);

export const updateExecutiveOnlineStatus = createAsyncThunk(
  'executive/updateStatus',
  async (status, { rejectWithValue }) => {
    try {
      const data = await executiveService.updateStatus(status);
      return data.status;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update executive status');
    }
  }
);

export const acceptTrip = createAsyncThunk(
  'executive/acceptTrip',
  async (tripId, { rejectWithValue }) => {
    try {
      const data = await executiveService.acceptTrip(tripId);
      return data.trip;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept trip');
    }
  }
);

export const startTravel = createAsyncThunk(
  'executive/startTravel',
  async (tripId, { rejectWithValue }) => {
    try {
      const data = await executiveService.startTravel(tripId);
      return data.trip;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to active transit tracking');
    }
  }
);

export const closeTrip = createAsyncThunk(
  'executive/closeTrip',
  async ({ tripId, formData }, { rejectWithValue }) => {
    try {
      const data = await executiveService.closeTrip(tripId, formData);
      return data.trip;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to complete executive trip');
    }
  }
);

export const fetchTripHistory = createAsyncThunk(
  'executive/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const data = await executiveService.getTripHistory();
      return data.trips;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load trip history');
    }
  }
);

const executiveSlice = createSlice({
  name: 'executive',
  initialState,
  reducers: {
    clearExecutiveError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExecutiveDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExecutiveDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.executiveStatus = action.payload.executiveStatus;
        state.activeTrip = action.payload.activeTrip;
        state.assignedTrip = action.payload.assignedTrip;
        state.metrics = action.payload.metrics;
      })
      .addCase(fetchExecutiveDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateExecutiveOnlineStatus.fulfilled, (state, action) => {
        state.executiveStatus = action.payload;
      })
      .addCase(acceptTrip.fulfilled, (state, action) => {
        state.assignedTrip = null;
        state.activeTrip = action.payload;
        state.executiveStatus = 'busy';
      })
      .addCase(startTravel.fulfilled, (state, action) => {
        state.activeTrip = action.payload;
      })
      .addCase(closeTrip.fulfilled, (state) => {
        state.activeTrip = null;
        state.executiveStatus = 'online';
      })
      .addCase(fetchTripHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      });
  }
});

export const { clearExecutiveError } = executiveSlice.actions;
export default executiveSlice.reducer;

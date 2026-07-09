import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import walletService from '../../services/walletService';

const initialState = {
  balance: 0,
  transactions: [],
  withdrawals: [],
  loading: false,
  error: null
};

export const fetchWalletDetails = createAsyncThunk(
  'wallet/fetchDetails',
  async (_, { rejectWithValue }) => {
    try {
      const data = await walletService.getWalletDetails();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wallet details');
    }
  }
);

export const submitWithdrawalRequest = createAsyncThunk(
  'wallet/withdraw',
  async (amount, { rejectWithValue }) => {
    try {
      const data = await walletService.requestWithdrawal(amount);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Withdrawal request failed');
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    updateLocalBalance: (state, action) => {
      state.balance = action.payload;
    },
    clearWalletError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalletDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.balance = action.payload.balance;
        state.transactions = action.payload.transactions;
        state.withdrawals = action.payload.withdrawals;
      })
      .addCase(fetchWalletDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitWithdrawalRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitWithdrawalRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.balance = action.payload.balance;
        state.withdrawals.unshift(action.payload.withdrawal);
      })
      .addCase(submitWithdrawalRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { updateLocalBalance, clearWalletError } = walletSlice.actions;
export default walletSlice.reducer;

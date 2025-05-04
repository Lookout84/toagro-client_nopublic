import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { paymentsApi } from '@/api/paymentsApi';
import { Payment, CreatePaymentData } from '@/types/payment.types';

interface PaymentsState {
  items: Payment[];
  currentPayment: Payment | null;
  isLoading: boolean;
  error: string | null;
  paymentLink: string | null;
}

const initialState: PaymentsState = {
  items: [],
  currentPayment: null,
  isLoading: false,
  error: null,
  paymentLink: null,
};

// Асинхронні дії для платежів
export const fetchUserPayments = createAsyncThunk(
  'payments/fetchUserPayments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentsApi.getUserPayments();
      return response.data.payments;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Помилка отримання платежів');
    }
  }
);

export const fetchPaymentDetails = createAsyncThunk(
  'payments/fetchPaymentDetails',
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const response = await paymentsApi.getPaymentDetails(transactionId);
      return response.data.payment;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Помилка отримання деталей платежу');
    }
  }
);

export const createPayment = createAsyncThunk(
  'payments/createPayment',
  async (paymentData: CreatePaymentData, { rejectWithValue }) => {
    try {
      const response = await paymentsApi.createPayment(paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Помилка створення платежу');
    }
  }
);

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
    clearPaymentLink: (state) => {
      state.paymentLink = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user payments
      .addCase(fetchUserPayments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchUserPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch payment details
      .addCase(fetchPaymentDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPaymentDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPayment = action.payload;
      })
      .addCase(fetchPaymentDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create payment
      .addCase(createPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = [action.payload.payment, ...state.items];
        state.currentPayment = action.payload.payment;
        state.paymentLink = action.payload.paymentLink;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentPayment, clearPaymentLink, clearError } = paymentsSlice.actions;

export default paymentsSlice.reducer;
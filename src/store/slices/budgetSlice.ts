import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BudgetState, Budget, BudgetFormData } from '../../types';
import { budgetService } from '../../services/budgetService';

const initialState: BudgetState = {
  budgets: [],
  loading: false,
  error: null,
};

export const fetchBudgets = createAsyncThunk(
  'budgets/fetchAll',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await budgetService.getBudgetsByUser(userId);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Không thể tải ngân sách');
    }
  }
);

export const fetchBudgetsByMonth = createAsyncThunk(
  'budgets/fetchByMonth',
  async ({ userId, month }: { userId: string; month: string }, { rejectWithValue }) => {
    try {
      return await budgetService.getBudgetsByMonth(userId, month);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Không thể tải ngân sách');
    }
  }
);

export const createBudget = createAsyncThunk(
  'budgets/create',
  async ({ userId, data }: { userId: string; data: BudgetFormData }, { rejectWithValue }) => {
    try {
      return await budgetService.createBudget(userId, data);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Không thể tạo ngân sách');
    }
  }
);

export const updateBudget = createAsyncThunk(
  'budgets/update',
  async ({ id, data }: { id: string; data: Partial<BudgetFormData> }, { rejectWithValue }) => {
    try {
      return await budgetService.updateBudget(id, data);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Không thể cập nhật ngân sách');
    }
  }
);

export const deleteBudget = createAsyncThunk(
  'budgets/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await budgetService.deleteBudget(id);
      return id;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Không thể xóa ngân sách');
    }
  }
);

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    clearBudgets: (state) => {
      state.budgets = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action: PayloadAction<Budget[]>) => {
        state.loading = false;
        state.budgets = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch By Month
      .addCase(fetchBudgetsByMonth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgetsByMonth.fulfilled, (state, action: PayloadAction<Budget[]>) => {
        state.loading = false;
        state.budgets = action.payload;
      })
      .addCase(fetchBudgetsByMonth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createBudget.fulfilled, (state, action: PayloadAction<Budget>) => {
        const existingIndex = state.budgets.findIndex(
          (b) => b.categoryId === action.payload.categoryId && b.month === action.payload.month
        );
        if (existingIndex !== -1) {
          state.budgets[existingIndex] = action.payload;
        } else {
          state.budgets.push(action.payload);
        }
      })
      // Update
      .addCase(updateBudget.fulfilled, (state, action: PayloadAction<Budget>) => {
        const index = state.budgets.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteBudget.fulfilled, (state, action: PayloadAction<string>) => {
        state.budgets = state.budgets.filter((b) => b.id !== action.payload);
      });
  },
});

export const { clearBudgets } = budgetSlice.actions;
export default budgetSlice.reducer;


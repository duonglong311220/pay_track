import api from './api';
import { Budget, BudgetFormData } from '../types';

export const budgetService = {
  async getBudgetsByUser(userId: string): Promise<Budget[]> {
    const response = await api.get<Budget[]>('/budgets', {
      params: { userId },
    });
    return response.data;
  },

  async getBudgetsByMonth(userId: string, month: string): Promise<Budget[]> {
    const response = await api.get<Budget[]>('/budgets', {
      params: { userId, month },
    });
    return response.data;
  },

  async createBudget(userId: string, data: BudgetFormData): Promise<Budget> {
    // Check if budget already exists for this category and month
    const existing = await api.get<Budget[]>('/budgets', {
      params: { userId, categoryId: data.categoryId, month: data.month },
    });

    if (existing.data.length > 0) {
      // Update existing budget
      return this.updateBudget(existing.data[0].id, { amount: data.amount });
    }

    const newBudget: Omit<Budget, 'id'> = {
      ...data,
      userId,
      createdAt: new Date().toISOString(),
    };

    const response = await api.post<Budget>('/budgets', newBudget);
    return response.data;
  },

  async updateBudget(id: string, data: Partial<BudgetFormData>): Promise<Budget> {
    const response = await api.patch<Budget>(`/budgets/${id}`, data);
    return response.data;
  },

  async deleteBudget(id: string): Promise<void> {
    await api.delete(`/budgets/${id}`);
  },
};


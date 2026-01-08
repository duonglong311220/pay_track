import api from './api';
import { Transaction, TransactionFormData } from '../types';

export const transactionService = {
  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>('/transactions', {
      params: { userId, _sort: 'date', _order: 'desc' },
    });
    return response.data;
  },

  async getTransactionsByMonth(userId: string, month: string): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>('/transactions', {
      params: { userId },
    });

    // Filter by month (format: YYYY-MM)
    return response.data.filter((t) => t.date.startsWith(month));
  },

  async createTransaction(userId: string, data: TransactionFormData): Promise<Transaction> {
    const newTransaction: Omit<Transaction, 'id'> = {
      ...data,
      userId,
      createdAt: new Date().toISOString(),
    };

    const response = await api.post<Transaction>('/transactions', newTransaction);
    return response.data;
  },

  async updateTransaction(id: string, data: Partial<TransactionFormData>): Promise<Transaction> {
    const response = await api.patch<Transaction>(`/transactions/${id}`, data);
    return response.data;
  },

  async deleteTransaction(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },

  async getTransactionById(id: string): Promise<Transaction> {
    const response = await api.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },
};


import api from './api';
import { Category } from '../types';

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  async getCategoriesByType(type: 'income' | 'expense'): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories', {
      params: { type },
    });
    return response.data;
  },

  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },
};


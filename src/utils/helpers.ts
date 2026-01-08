import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const formatDate = (dateString: string, formatStr: string = 'dd/MM/yyyy'): string => {
  try {
    return format(parseISO(dateString), formatStr, { locale: vi });
  } catch {
    return dateString;
  }
};

export const formatMonth = (dateString: string): string => {
  try {
    return format(parseISO(dateString + '-01'), 'MMMM yyyy', { locale: vi });
  } catch {
    return dateString;
  }
};

export const getCurrentMonth = (): string => {
  return format(new Date(), 'yyyy-MM');
};

export const getMonthRange = (month: string): { start: Date; end: Date } => {
  const date = parseISO(month + '-01');
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
};

export const isDateInMonth = (dateString: string, month: string): boolean => {
  try {
    const date = parseISO(dateString);
    const { start, end } = getMonthRange(month);
    return isWithinInterval(date, { start, end });
  } catch {
    return false;
  }
};

export const getMonthsList = (count: number = 12): string[] => {
  const months: string[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(format(date, 'yyyy-MM'));
  }

  return months;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};


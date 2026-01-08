import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTransactions } from '../store/slices/transactionSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import { fetchBudgetsByMonth } from '../store/slices/budgetSlice';
import Layout from '../components/Layout/Layout';
import StatCard from '../components/Dashboard/StatCard';
import ExpenseChart from '../components/Dashboard/ExpenseChart';
import BudgetProgress from '../components/Dashboard/BudgetProgress';
import TransactionList from '../components/Transaction/TransactionList';
import { Card, Select } from '../components/UI';
import { getCurrentMonth, formatMonth, getMonthsList, isDateInMonth } from '../utils/helpers';
import { CategoryStats } from '../types';
import { FiPlus } from 'react-icons/fi';

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { transactions, loading: transactionsLoading } = useAppSelector((state) => state.transactions);
  const { categories } = useAppSelector((state) => state.categories);
  const { budgets } = useAppSelector((state) => state.budgets);

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  useEffect(() => {
    if (user) {
      dispatch(fetchTransactions(user.id));
      dispatch(fetchCategories());
      dispatch(fetchBudgetsByMonth({ userId: user.id, month: selectedMonth }));
    }
  }, [dispatch, user, selectedMonth]);

  // Filter transactions by selected month
  const monthlyTransactions = useMemo(() => {
    return transactions.filter((t) => isDateInMonth(t.date, selectedMonth));
  }, [transactions, selectedMonth]);

  // Calculate stats
  const stats = useMemo(() => {
    const income = monthlyTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthlyTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [monthlyTransactions]);

  // Calculate expense by category
  const expenseByCategory = useMemo((): CategoryStats[] => {
    const expenseTransactions = monthlyTransactions.filter((t) => t.type === 'expense');
    const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

    const categoryMap = new Map<string, number>();
    expenseTransactions.forEach((t) => {
      const current = categoryMap.get(t.categoryId) || 0;
      categoryMap.set(t.categoryId, current + t.amount);
    });

    return Array.from(categoryMap.entries())
      .map(([categoryId, amount]) => {
        const category = categories.find((c) => c.id === categoryId);
        return {
          categoryId,
          categoryName: category?.name || 'Khác',
          icon: category?.icon || '📦',
          color: category?.color || '#6b7280',
          amount,
          percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
          count: expenseTransactions.filter((t) => t.categoryId === categoryId).length,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [monthlyTransactions, categories]);

  // Recent transactions (last 5)
  const recentTransactions = useMemo(() => {
    return [...monthlyTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [monthlyTransactions]);

  const monthOptions = getMonthsList(12).map((month) => ({
    value: month,
    label: formatMonth(month),
  }));

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Xin chào, {user?.name}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Đây là tổng quan chi tiêu của bạn</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            options={monthOptions}
            value={selectedMonth}
            onChange={setSelectedMonth}
            className="min-w-[180px]"
          />
          <Link
            to="/add-transaction"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FiPlus size={20} />
            <span className="hidden sm:inline">Thêm giao dịch</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Thu nhập" amount={stats.income} type="income" />
        <StatCard title="Chi tiêu" amount={stats.expense} type="expense" />
        <StatCard title="Số dư" amount={stats.balance} type="balance" />
      </div>

      {/* Charts & Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ExpenseChart data={expenseByCategory} title="Chi tiêu theo danh mục" />
        <BudgetProgress
          budgets={budgets}
          categories={categories}
          transactions={monthlyTransactions}
        />
      </div>

      {/* Recent Transactions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Giao dịch gần đây</h3>
          <Link
            to="/transactions"
            className="text-primary-600 hover:underline text-sm font-medium"
          >
            Xem tất cả
          </Link>
        </div>
        <TransactionList
          transactions={recentTransactions}
          categories={categories}
          loading={transactionsLoading}
        />
      </Card>
    </Layout>
  );
};

export default DashboardPage;


import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBudgetsByMonth, createBudget, deleteBudget } from '../store/slices/budgetSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import { fetchTransactions } from '../store/slices/transactionSlice';
import Layout from '../components/Layout/Layout';
import { Card, Select, Button, Input, Modal } from '../components/UI';
import { getCurrentMonth, formatMonth, getMonthsList, formatCurrency, isDateInMonth } from '../utils/helpers';
import { BudgetFormData } from '../types';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const BudgetsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { budgets, loading } = useAppSelector((state) => state.budgets);
  const { categories } = useAppSelector((state) => state.categories);
  const { transactions } = useAppSelector((state) => state.transactions);

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState<BudgetFormData>({
    categoryId: '',
    amount: 0,
    month: selectedMonth,
  });

  useEffect(() => {
    if (user) {
      dispatch(fetchBudgetsByMonth({ userId: user.id, month: selectedMonth }));
      dispatch(fetchCategories());
      dispatch(fetchTransactions(user.id));
    }
  }, [dispatch, user, selectedMonth]);

  useEffect(() => {
    setNewBudget((prev) => ({ ...prev, month: selectedMonth }));
  }, [selectedMonth]);

  // Get expense categories only
  const expenseCategories = useMemo(() => {
    return categories.filter((c) => c.type === 'expense');
  }, [categories]);

  // Get categories that don't have a budget yet
  const availableCategories = useMemo(() => {
    const budgetedCategoryIds = budgets.map((b) => b.categoryId);
    return expenseCategories.filter((c) => !budgetedCategoryIds.includes(c.id));
  }, [expenseCategories, budgets]);

  // Calculate spent amount for each category
  const monthlyTransactions = useMemo(() => {
    return transactions.filter((t) => isDateInMonth(t.date, selectedMonth) && t.type === 'expense');
  }, [transactions, selectedMonth]);

  const getSpentAmount = (categoryId: string) => {
    return monthlyTransactions
      .filter((t) => t.categoryId === categoryId)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getCategoryById = (id: string) => categories.find((c) => c.id === id);

  const handleAddBudget = async () => {
    if (!user || !newBudget.categoryId || newBudget.amount <= 0) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      await dispatch(createBudget({ userId: user.id, data: newBudget })).unwrap();
      toast.success('Đã thêm ngân sách');
      setIsModalOpen(false);
      setNewBudget({ categoryId: '', amount: 0, month: selectedMonth });
    } catch {
      toast.error('Không thể thêm ngân sách');
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      await dispatch(deleteBudget(id)).unwrap();
      toast.success('Đã xóa ngân sách');
    } catch {
      toast.error('Không thể xóa ngân sách');
    }
  };

  const monthOptions = getMonthsList(12).map((month) => ({
    value: month,
    label: formatMonth(month),
  }));

  const categoryOptions = availableCategories.map((c) => ({
    value: c.id,
    label: `${c.icon} ${c.name}`,
  }));

  // Calculate total budget and spent
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + getSpentAmount(b.categoryId), 0);

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ngân sách</h1>
          <p className="text-gray-500 mt-1">Quản lý ngân sách chi tiêu hàng tháng</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            options={monthOptions}
            value={selectedMonth}
            onChange={setSelectedMonth}
            className="min-w-[180px]"
          />
          <Button onClick={() => setIsModalOpen(true)} disabled={availableCategories.length === 0}>
            <FiPlus className="mr-2" />
            Thêm ngân sách
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-sm text-gray-500">Tổng ngân sách</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(totalBudget)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Đã chi tiêu</p>
          <p className="text-2xl font-bold text-expense mt-1">{formatCurrency(totalSpent)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Còn lại</p>
          <p className={`text-2xl font-bold mt-1 ${totalBudget - totalSpent >= 0 ? 'text-income' : 'text-expense'}`}>
            {formatCurrency(totalBudget - totalSpent)}
          </p>
        </Card>
      </div>

      {/* Budget List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500 mb-4">Chưa có ngân sách nào cho tháng này</p>
          <Button onClick={() => setIsModalOpen(true)}>
            <FiPlus className="mr-2" />
            Thêm ngân sách đầu tiên
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {budgets.map((budget) => {
            const category = getCategoryById(budget.categoryId);
            const spent = getSpentAmount(budget.categoryId);
            const percentage = Math.min((spent / budget.amount) * 100, 100);
            const isOverBudget = spent > budget.amount;

            return (
              <Card key={budget.id}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: category?.color + '20' }}
                    >
                      {category?.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{category?.name}</h3>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(spent)} / {formatCurrency(budget.amount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`font-semibold ${isOverBudget ? 'text-expense' : 'text-income'}`}>
                        {isOverBudget ? 'Vượt ' : 'Còn '}
                        {formatCurrency(Math.abs(budget.amount - spent))}
                      </p>
                      <p className="text-sm text-gray-500">{percentage.toFixed(0)}%</p>
                    </div>
                    <button
                      onClick={() => handleDeleteBudget(budget.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm ngân sách mới"
      >
        <div className="space-y-4">
          <Select
            label="Danh mục"
            options={categoryOptions}
            value={newBudget.categoryId}
            onChange={(value) => setNewBudget((prev) => ({ ...prev, categoryId: value }))}
          />
          <Input
            label="Số tiền ngân sách (VND)"
            type="number"
            value={newBudget.amount || ''}
            onChange={(e) => setNewBudget((prev) => ({ ...prev, amount: Number(e.target.value) }))}
            placeholder="0"
            min="0"
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
              Hủy
            </Button>
            <Button onClick={handleAddBudget} className="flex-1">
              Thêm
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default BudgetsPage;


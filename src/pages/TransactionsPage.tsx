import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTransactions, deleteTransaction } from '../store/slices/transactionSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import Layout from '../components/Layout/Layout';
import TransactionList from '../components/Transaction/TransactionList';
import TransactionForm from '../components/Transaction/TransactionForm';
import { Card, Select, Modal, Button } from '../components/UI';
import { getCurrentMonth, formatMonth, getMonthsList, isDateInMonth } from '../utils/helpers';
import { Transaction, TransactionFormData } from '../types';
import { updateTransaction } from '../store/slices/transactionSlice';
import { toast } from 'react-toastify';
import { FiFilter, FiSearch } from 'react-icons/fi';

const TransactionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { transactions, loading } = useAppSelector((state) => state.transactions);
  const { categories } = useAppSelector((state) => state.categories);

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchTransactions(user.id));
      dispatch(fetchCategories());
    }
  }, [dispatch, user]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => isDateInMonth(t.date, selectedMonth))
      .filter((t) => typeFilter === 'all' || t.type === typeFilter)
      .filter((t) => {
        if (!searchQuery) return true;
        const category = categories.find((c) => c.id === t.categoryId);
        return (
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category?.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, selectedMonth, typeFilter, searchQuery, categories]);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteTransaction(id)).unwrap();
      toast.success('Đã xóa giao dịch');
      setDeleteConfirm(null);
    } catch {
      toast.error('Không thể xóa giao dịch');
    }
  };

  const handleUpdate = async (data: TransactionFormData) => {
    if (!editingTransaction) return;

    try {
      await dispatch(updateTransaction({ id: editingTransaction.id, data })).unwrap();
      toast.success('Đã cập nhật giao dịch');
      setEditingTransaction(null);
    } catch {
      toast.error('Không thể cập nhật giao dịch');
    }
  };

  const monthOptions = getMonthsList(12).map((month) => ({
    value: month,
    label: formatMonth(month),
  }));

  const typeOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'income', label: 'Thu nhập' },
    { value: 'expense', label: 'Chi tiêu' },
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Giao dịch</h1>
        <p className="text-gray-500 mt-1">Quản lý tất cả giao dịch của bạn</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm giao dịch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Month Filter */}
          <Select
            options={monthOptions}
            value={selectedMonth}
            onChange={setSelectedMonth}
            className="sm:w-48"
          />

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <Select
              options={typeOptions}
              value={typeFilter}
              onChange={(value) => setTypeFilter(value as 'all' | 'income' | 'expense')}
              className="sm:w-36"
            />
          </div>
        </div>
      </Card>

      {/* Transaction List */}
      <TransactionList
        transactions={filteredTransactions}
        categories={categories}
        onEdit={handleEdit}
        onDelete={(id) => setDeleteConfirm(id)}
        loading={loading}
      />

      {filteredTransactions.length === 0 && !loading && (
        <Card className="text-center py-12">
          <p className="text-gray-500">Không tìm thấy giao dịch nào</p>
        </Card>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        title="Chỉnh sửa giao dịch"
      >
        {editingTransaction && (
          <TransactionForm
            categories={categories}
            onSubmit={handleUpdate}
            initialData={editingTransaction}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Xác nhận xóa"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Bạn có chắc chắn muốn xóa giao dịch này? Hành động này không thể hoàn tác.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteConfirm(null)}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="flex-1"
            >
              Xóa
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default TransactionsPage;


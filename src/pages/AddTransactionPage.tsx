import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCategories } from '../store/slices/categorySlice';
import { createTransaction } from '../store/slices/transactionSlice';
import Layout from '../components/Layout/Layout';
import TransactionForm from '../components/Transaction/TransactionForm';
import { Card } from '../components/UI';
import { TransactionFormData } from '../types';
import { toast } from 'react-toastify';

const AddTransactionPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { categories, loading: categoriesLoading } = useAppSelector((state) => state.categories);
  const { loading: transactionLoading } = useAppSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (data: TransactionFormData) => {
    if (!user) return;

    try {
      await dispatch(createTransaction({ userId: user.id, data })).unwrap();
      toast.success('Đã thêm giao dịch thành công!');
      navigate('/transactions');
    } catch {
      toast.error('Không thể thêm giao dịch');
    }
  };

  if (categoriesLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Thêm giao dịch mới</h1>
          <p className="text-gray-500 mt-1">Ghi lại thu nhập hoặc chi tiêu của bạn</p>
        </div>

        <Card>
          <TransactionForm
            categories={categories}
            onSubmit={handleSubmit}
            loading={transactionLoading}
          />
        </Card>
      </div>
    </Layout>
  );
};

export default AddTransactionPage;


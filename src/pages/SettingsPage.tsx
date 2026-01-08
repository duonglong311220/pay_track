import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateProfile, logout } from '../store/slices/authSlice';
import Layout from '../components/Layout/Layout';
import { Card, Button, Input } from '../components/UI';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiLogOut, FiSave } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading } = useAppSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await dispatch(updateProfile({ id: user.id, data: { name, email } })).unwrap();
      toast.success('Cập nhật thông tin thành công!');
    } catch {
      toast.error('Không thể cập nhật thông tin');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (currentPassword !== user.password) {
      toast.error('Mật khẩu hiện tại không đúng');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      await dispatch(updateProfile({ id: user.id, data: { password: newPassword } })).unwrap();
      toast.success('Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      toast.error('Không thể đổi mật khẩu');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.success('Đã đăng xuất');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Cài đặt</h1>
          <p className="text-gray-500 mt-1">Quản lý thông tin tài khoản của bạn</p>
        </div>

        {/* Profile Settings */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiUser className="text-primary-600" />
            Thông tin cá nhân
          </h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Họ và tên"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập họ và tên"
            />
            <div className="relative">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email"
              />
            </div>
            <Button type="submit" loading={loading}>
              <FiSave className="mr-2" />
              Lưu thay đổi
            </Button>
          </form>
        </Card>

        {/* Change Password */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiLock className="text-primary-600" />
            Đổi mật khẩu
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="Mật khẩu hiện tại"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại"
            />
            <Input
              label="Mật khẩu mới"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
            />
            <Input
              label="Xác nhận mật khẩu mới"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
            />
            <Button type="submit" loading={loading}>
              <FiLock className="mr-2" />
              Đổi mật khẩu
            </Button>
          </form>
        </Card>

        {/* Account Info */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiMail className="text-primary-600" />
            Thông tin tài khoản
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Email</span>
              <span className="text-gray-800 font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Ngày tạo tài khoản</span>
              <span className="text-gray-800 font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '-'}
              </span>
            </div>
          </div>
        </Card>

        {/* Logout */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiLogOut className="text-red-600" />
            Đăng xuất
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Bạn sẽ được đưa về trang đăng nhập sau khi đăng xuất.
          </p>
          <Button variant="danger" onClick={handleLogout}>
            <FiLogOut className="mr-2" />
            Đăng xuất
          </Button>
        </Card>
      </div>
    </Layout>
  );
};

export default SettingsPage;


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { ApiError } from '@/services/apiClient';
import { authService } from '@/services/authService';
import { PATHS } from '@/utils/routePaths';

type FieldErrors = Record<string, string>;

function normalizeErrors(errors?: ApiError['errors']): FieldErrors {
  if (!errors) return {};
  const out: FieldErrors = {};
  for (const [k, v] of Object.entries(errors)) {
    out[k] = Array.isArray(v) ? v[0] : (v as string);
  }
  return out;
}

type Tab = 'profile' | 'password';

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>('profile');

  // Tài khoản Google-only: không có mật khẩu
  const isGoogleOnly = user?.auth_provider === 'google';

  // ── Profile form ──
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [address, setAddress] = useState(user?.address ?? '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileFieldErrors, setProfileFieldErrors] = useState<FieldErrors>({});

  // ── Password form ──
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwFieldErrors, setPwFieldErrors] = useState<FieldErrors>({});

  const handleLogout = async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    logout();
    navigate(PATHS.HOME);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(false);
    setProfileFieldErrors({});

    try {
      const updated = await authService.updateProfile({ name, phone: phone || undefined, address: address || undefined });
      updateUser(updated);
      setProfileSuccess(true);
      toast.success('Thông tin đã được cập nhật thành công!');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) setProfileFieldErrors(normalizeErrors(err.errors));
        else setProfileError(err.message);
      } else {
        setProfileError('Đã xảy ra lỗi.');
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwLoading(true);
    setPwError(null);
    setPwSuccess(false);
    setPwFieldErrors({});

    try {
      await authService.changePassword({
        old_password: oldPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      setPwSuccess(true);
      toast.success('Mật khẩu đã được đổi thành công!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) setPwFieldErrors(normalizeErrors(err.errors));
        else setPwError(err.message);
      } else {
        setPwError('Đã xảy ra lỗi.');
      }
    } finally {
      setPwLoading(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full border rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none ${
      hasError ? 'border-red-400 bg-red-50' : 'border-outline-variant'
    }`;

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          {/* Avatar Google */}
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div>
            <span className="font-sans uppercase tracking-widest text-primary text-sm block mb-1">Xin chào,</span>
            <h1 className="text-3xl font-serif text-on-surface">{user?.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-on-surface-variant">{user?.email}</p>
              {/* Badge provider */}
              {isGoogleOnly && (
                <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-2 py-0.5">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-xl transition-colors"
        >
          Đăng xuất
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-outline-variant/40">
        {(['profile', 'password'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t === 'profile' ? 'Thông tin cá nhân' : 'Đổi mật khẩu'}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="space-y-5">
          {profileError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{profileError}</div>
          )}
          {profileSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
              Cập nhật thành công!
            </div>
          )}

          {[
            { id: 'pf-name', label: 'Họ và tên', value: name, onChange: setName, required: true, type: 'text', key: 'name' },
            { id: 'pf-phone', label: 'Số điện thoại', value: phone, onChange: setPhone, required: false, type: 'tel', key: 'phone' },
            { id: 'pf-address', label: 'Địa chỉ', value: address, onChange: setAddress, required: false, type: 'text', key: 'address' },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="block text-sm font-medium mb-2">
                {f.label}
              </label>
              <input
                id={f.id}
                type={f.type}
                required={f.required}
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                className={inputClass(!!profileFieldErrors[f.key])}
              />
              {profileFieldErrors[f.key] && (
                <p className="text-red-500 text-xs mt-1">{profileFieldErrors[f.key]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={profileLoading}
            className="bg-primary text-white py-3 px-8 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {profileLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </form>
      )}

      {/* Password Tab */}
      {tab === 'password' && (
        <>
          {/* Tài khoản Google-only: ẩn form đổi mật khẩu */}
          {isGoogleOnly ? (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 text-sm text-blue-700">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <div>
                  <p className="font-semibold mb-1">Tài khoản đăng nhập bằng Google</p>
                  <p className="text-blue-600">
                    Tài khoản của bạn hiện đang sử dụng Google để đăng nhập. Bạn chưa thiết lập mật khẩu riêng cho hệ thống.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              {pwError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{pwError}</div>
              )}
              {pwSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
                  Đổi mật khẩu thành công!
                </div>
              )}

              {[
                { id: 'pw-old', label: 'Mật khẩu hiện tại', value: oldPassword, onChange: setOldPassword, key: 'old_password' },
                { id: 'pw-new', label: 'Mật khẩu mới', value: newPassword, onChange: setNewPassword, key: 'password' },
                { id: 'pw-confirm', label: 'Xác nhận mật khẩu mới', value: confirmPassword, onChange: setConfirmPassword, key: 'password_confirmation' },
              ].map((f) => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="block text-sm font-medium mb-2">{f.label}</label>
                  <input
                    id={f.id}
                    type="password"
                    required
                    value={f.value}
                    onChange={(e) => f.onChange(e.target.value)}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className={inputClass(!!pwFieldErrors[f.key])}
                  />
                  {pwFieldErrors[f.key] && (
                    <p className="text-red-500 text-xs mt-1">{pwFieldErrors[f.key]}</p>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={pwLoading}
                className="bg-primary text-white py-3 px-8 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
              >
                {pwLoading ? 'Đang đổi...' : 'Đổi mật khẩu'}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

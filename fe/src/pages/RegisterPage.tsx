import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuth } from '@/contexts/AuthContext';
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

type Field = { id: string; label: string; type: string; key: string; required: boolean; placeholder: string };

const FIELDS: Field[] = [
  { id: 'reg-name', label: 'Họ và tên', type: 'text', key: 'name', required: true, placeholder: 'Nguyễn Văn A' },
  { id: 'reg-email', label: 'Email', type: 'email', key: 'email', required: true, placeholder: 'you@example.com' },
  { id: 'reg-phone', label: 'Số điện thoại', type: 'tel', key: 'phone', required: false, placeholder: '0912 345 678' },
  { id: 'reg-password', label: 'Mật khẩu', type: 'password', key: 'password', required: true, placeholder: '••••••••' },
  { id: 'reg-confirm', label: 'Xác nhận mật khẩu', type: 'password', key: 'password_confirmation', required: true, placeholder: '••••••••' },
];

export default function RegisterPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState<Record<string, string>>({
    name: '', email: '', phone: '', password: '', password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  if (isAuthenticated) return <Navigate to={PATHS.HOME} replace />;

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((prev) => ({ ...prev, [key]: e.target.value }));

  // ── Email/password register ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { token, user } = await authService.register({
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });
      login(token, user);
      navigate(PATHS.HOME, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) setFieldErrors(normalizeErrors(err.errors));
        else setError(err.message);
      } else {
        setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Google register/login ──
  // Dùng chung endpoint /auth/google — backend tự xử lý tạo mới hoặc liên kết
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError('Không nhận được thông tin đăng nhập từ Google.');
      return;
    }

    setGoogleLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { user, token } = await authService.googleLogin(credentialResponse.credential);
      login(token, user);
      navigate(PATHS.HOME, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Đăng ký bằng Google thất bại. Vui lòng thử lại.');
      } else {
        setError('Đăng ký bằng Google thất bại. Vui lòng thử lại.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Đăng ký bằng Google thất bại. Vui lòng thử lại.');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <span className="font-sans uppercase tracking-widest text-primary text-sm block mb-2">Tài khoản</span>
          <h1 className="text-3xl font-serif text-on-surface">Đăng ký</h1>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-outline-variant/30 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
          )}

          {/* ── Google Register Button ── */}
          <div className="flex flex-col items-center gap-3">
            {googleLoading ? (
              <div className="w-full flex items-center justify-center py-2.5 text-sm text-on-surface-variant gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Đang xử lý...
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="signup_with"
                shape="rectangular"
                size="large"
                width="368"
              />
            )}
          </div>

          {/* ── Divider ── */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-outline-variant/40" />
            <span className="text-xs text-on-surface-variant uppercase tracking-wider">hoặc</span>
            <div className="h-px flex-1 bg-outline-variant/40" />
          </div>

          {/* ── Email/password form ── */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {FIELDS.map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-on-surface mb-2">
                  {field.label} {!field.required && <span className="text-on-surface-variant font-normal">(tùy chọn)</span>}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  required={field.required}
                  value={values[field.key]}
                  onChange={set(field.key)}
                  placeholder={field.placeholder}
                  autoComplete={field.type === 'password' ? 'new-password' : field.key}
                  className={`w-full border rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none ${
                    fieldErrors[field.key] ? 'border-red-400 bg-red-50' : 'border-outline-variant'
                  }`}
                />
                {fieldErrors[field.key] && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors[field.key]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
            </button>
          </form>

          <p className="text-center text-sm text-on-surface-variant">
            Đã có tài khoản?{' '}
            <Link to={PATHS.LOGIN} className="text-primary font-bold hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

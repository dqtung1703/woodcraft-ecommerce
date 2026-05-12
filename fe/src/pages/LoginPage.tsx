import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
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

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') ?? PATHS.HOME;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  if (isAuthenticated) return <Navigate to={redirect} replace />;

  // ── Email/password login ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const { token, user } = await authService.login({ email, password });
      login(token, user);
      navigate(redirect, { replace: true });
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

  // ── Google login ──
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
      navigate(redirect, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
      } else {
        setError('Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <span className="font-sans uppercase tracking-widest text-primary text-sm block mb-2">Tài khoản</span>
          <h1 className="text-3xl font-serif text-on-surface">Đăng nhập</h1>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-outline-variant/30 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* ── Google Login Button ── */}
          <div className="flex flex-col items-center gap-3">
            {googleLoading ? (
              <div className="w-full flex items-center justify-center py-2.5 text-sm text-on-surface-variant gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Đang đăng nhập...
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="signin_with"
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-on-surface mb-2">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full border rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none ${
                  fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-outline-variant'
                }`}
              />
              {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-on-surface mb-2">
                Mật khẩu
              </label>
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full border rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none ${
                  fieldErrors.password ? 'border-red-400 bg-red-50' : 'border-outline-variant'
                }`}
              />
              {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="text-center text-sm text-on-surface-variant">
            Chưa có tài khoản?{' '}
            <Link to={PATHS.REGISTER} className="text-primary font-bold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

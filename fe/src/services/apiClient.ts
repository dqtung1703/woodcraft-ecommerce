import axios from 'axios';
import type { AxiosError } from 'axios';
import type { ApiFailure, ApiSuccess } from '@/types/api';

// ── Custom error class ────────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  errors?: ApiFailure['errors'];
  errorCode?: string;

  constructor(status: number, payload?: ApiFailure) {
    super(payload?.message ?? 'Request failed');
    this.name = 'ApiError';
    this.status = status;
    this.errors = payload?.errors;
    this.errorCode = payload?.error_code;
  }
}

// ── Axios instance ────────────────────────────────────────────────────────────

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Request interceptor — attach Bearer token ─────────────────────────────────

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('woodcraft_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Khi gửi FormData (upload file), phải xóa Content-Type để browser
  // tự set "multipart/form-data; boundary=..." với đúng boundary.
  // Nếu giữ nguyên 'application/json', server sẽ không parse được file.
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

// ── Response interceptor — normalize errors ───────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiFailure>) => {
    const status = error.response?.status ?? 0;
    const payload = error.response?.data;

    if (status === 401) {
      localStorage.removeItem('woodcraft_token');
      localStorage.removeItem('woodcraft_user');
      // Dispatch custom event so AuthProvider can react
      window.dispatchEvent(new Event('woodcraft:unauthorized'));
    } else if (status === 403 && payload?.error_code === 'ACCOUNT_LOCKED') {
      localStorage.removeItem('woodcraft_token');
      localStorage.removeItem('woodcraft_user');
      // Dispatch custom event with locked message
      window.dispatchEvent(
        new CustomEvent('woodcraft:account-locked', {
          detail: { message: payload.message },
        })
      );
    }

    throw new ApiError(status, payload);
  },
);

// ── Helper: unwrap data from successful response ──────────────────────────────

export async function unwrap<T>(
  request: Promise<{ data: ApiSuccess<T> }>,
): Promise<T> {
  const response = await request;
  return response.data.data;
}

// ── Helper: fire-and-forget for void endpoints (logout, DELETE...) ────────────

export async function call(request: Promise<unknown>): Promise<void> {
  await request;
}

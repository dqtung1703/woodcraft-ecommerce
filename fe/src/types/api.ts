// ── Generic API response shapes ──────────────────────────────────────────────

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
  meta?: ApiMeta;
};

export type ApiFailure = {
  success: false;
  message: string;
  errors?: Record<string, string[] | string>;
  error_code?: string;
};

export type ApiMeta = {
  pagination?: {
    total: number;
    per_page?: number;
    current_page: number;
    last_page: number;
    from?: number | null;
    to?: number | null;
    has_more?: boolean;
  };
  summary?: unknown;
};

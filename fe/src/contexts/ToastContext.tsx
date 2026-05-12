import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { createContext, useCallback, useContext, useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info';

type Toast = {
  id: string;
  type: ToastType;
  message: string;
};

type ToastContextValue = {
  success: (message: string) => void;
  error:   (message: string) => void;
  info:    (message: string) => void;
};

// ── Context ───────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

// ── Config ────────────────────────────────────────────────────────────────────

const TOAST_CONFIG: Record<ToastType, { icon: React.ElementType; className: string }> = {
  success: { icon: CheckCircle2, className: 'bg-green-50 border-green-200 text-green-800' },
  error:   { icon: XCircle,      className: 'bg-red-50 border-red-200 text-red-800' },
  info:    { icon: Info,         className: 'bg-blue-50 border-blue-200 text-blue-800' },
};

const AUTO_DISMISS_MS = 3500;

// ── Provider ──────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((type: ToastType, message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
  }, [dismiss]);

  const value: ToastContextValue = {
    success: (msg) => add('success', msg),
    error:   (msg) => add('error', msg),
    info:    (msg) => add('info', msg),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast container */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-6 right-4 sm:right-6 z-[60] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((toast) => {
          const { icon: Icon, className } = TOAST_CONFIG[toast.type];
          return (
            <div
              key={toast.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium animate-slide-in-right ${className}`}
            >
              <Icon className="w-4 h-4 mt-0.5 shrink-0" />
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => dismiss(toast.id)}
                aria-label="Đóng thông báo"
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

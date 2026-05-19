import { Bell } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { notificationService } from '@/services/notificationService';
import type { AppNotification } from '@/types/notification';

type NotificationBellProps = {
  variant?: 'storefront' | 'admin';
};

const POLL_MS = 20000;

export default function NotificationBell({ variant = 'storefront' }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const loadCount = useCallback(async () => {
    try {
      const result = await notificationService.getUnreadCount();
      setCount(result.count);
    } catch {
      // The auth interceptor handles 401; notification polling should stay quiet.
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const result = await notificationService.getNotifications({ per_page: 8 });
      setNotifications(result.data);
      await loadCount();
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [loadCount]);

  useEffect(() => {
    void loadCount();
    const id = window.setInterval(loadCount, POLL_MS);
    return () => window.clearInterval(id);
  }, [loadCount]);

  useEffect(() => {
    if (open) void loadNotifications();
  }, [open, loadNotifications]);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const iconClass = variant === 'admin'
    ? 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-950'
    : 'border-transparent text-primary hover:bg-primary/10';

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`relative inline-flex h-9 w-9 items-center justify-center rounded-md border transition ${iconClass}`}
        aria-label="Thông báo"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold leading-5 text-white">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-950">Thông báo</p>
              <p className="text-xs text-slate-500">{count} chưa đọc</p>
            </div>
            {count > 0 && (
              <button
                type="button"
                onClick={async () => {
                  await notificationService.markAllAsRead();
                  await loadNotifications();
                }}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Đọc tất cả
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-sm text-slate-500">Đang tải thông báo...</div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onNavigate={async () => {
                    if (!notification.read_at) {
                      await notificationService.markAsRead(notification.id);
                    }
                    setOpen(false);
                    void loadCount();
                  }}
                />
              ))
            ) : (
              <div className="p-6 text-center text-sm text-slate-500">Chưa có thông báo</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  onNavigate,
}: {
  notification: AppNotification;
  onNavigate: () => void;
}) {
  const href = getNotificationHref(notification);

  const content = (
    <div className={`block px-4 py-3 text-left transition hover:bg-slate-50 ${notification.read_at ? '' : 'bg-amber-50/60'}`}>
      <div className="flex items-start gap-3">
        <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${notification.read_at ? 'bg-slate-200' : 'bg-red-500'}`} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-950">{notification.title}</p>
          <p className="mt-1 text-sm leading-5 text-slate-600">{notification.message}</p>
          <p className="mt-1 text-xs text-slate-400">{formatDate(notification.created_at)}</p>
        </div>
      </div>
    </div>
  );

  if (!href) {
    return (
      <button type="button" onClick={onNavigate} className="w-full">
        {content}
      </button>
    );
  }

  return (
    <Link to={href} onClick={onNavigate}>
      {content}
    </Link>
  );
}

function getNotificationHref(notification: AppNotification) {
  const orderId = notification.data?.order_id;
  if (!orderId) return null;

  if (notification.target_role === 'admin' || notification.type === 'order_pending') {
    return '/admin/orders';
  }

  return `/orders/${orderId}`;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

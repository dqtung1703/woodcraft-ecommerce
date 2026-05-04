import { api, unwrap } from './apiClient';
import type { ApiSuccess } from '@/types/api';
import type { AppNotification, UnreadCountResponse } from '@/types/notification';

export const notificationService = {
  getNotifications: async (params?: { per_page?: number; page?: number }) => {
    const res = await api.get<ApiSuccess<AppNotification[]>>('/notifications', { params });
    return {
      data: res.data.data,
      meta: res.data.meta,
    };
  },

  getUnreadCount: () =>
    unwrap<UnreadCountResponse>(api.get('/notifications/unread-count')),

  markAsRead: (id: number) =>
    unwrap<AppNotification>(api.put(`/notifications/${id}/read`)),

  markAllAsRead: () =>
    unwrap<{ updated: number }>(api.put('/notifications/read-all')),
};

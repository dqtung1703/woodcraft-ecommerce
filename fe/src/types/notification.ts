export type AppNotification = {
  id: number;
  user_id: number | null;
  target_role: 'admin' | 'customer' | null;
  type: 'order_pending' | 'order_status_changed' | string;
  title: string;
  message: string;
  data: {
    order_id?: number;
    status?: string;
  } | null;
  read_at: string | null;
  created_at: string;
};

export type UnreadCountResponse = {
  count: number;
};

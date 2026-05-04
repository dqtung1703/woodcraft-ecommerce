export type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: 'customer' | 'admin';
  is_admin: boolean;
  // Google OAuth fields
  avatar: string | null;
  auth_provider: 'email' | 'google';
  google_linked_at: string | null;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type UpdateProfilePayload = {
  name: string;
  phone?: string;
  address?: string;
};

export type ChangePasswordPayload = {
  old_password: string;
  password: string;
  password_confirmation: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  address?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

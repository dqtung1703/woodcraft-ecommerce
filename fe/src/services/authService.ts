import { api, call, unwrap } from './apiClient';
import type {
  AuthResponse,
  ChangePasswordPayload,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from '@/types/user';

export const authService = {
  register: (payload: RegisterPayload) =>
    unwrap<AuthResponse>(api.post('/register', payload)),

  login: (payload: LoginPayload) =>
    unwrap<AuthResponse>(api.post('/login', payload)),

  // Google ID Token Flow — gửi credential từ @react-oauth/google về backend
  googleLogin: (credential: string) =>
    unwrap<AuthResponse>(api.post('/auth/google', { credential })),

  logout: () => call(api.post('/logout')),

  getProfile: () => unwrap<User>(api.get('/profile')),

  updateProfile: (payload: UpdateProfilePayload) =>
    unwrap<User>(api.put('/profile', payload)),

  changePassword: (payload: ChangePasswordPayload) =>
    call(api.put('/profile/password', payload)),
};

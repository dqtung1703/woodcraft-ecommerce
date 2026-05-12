import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useToast } from './ToastContext';
import type { User } from '@/types/user';

const TOKEN_KEY = 'woodcraft_token';
const USER_KEY = 'woodcraft_user';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  });

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const updateUser = (updated: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    setUser(updated);
  };

  // Auto-logout and show error when account is locked, or simple logout on 401
  useEffect(() => {
    const handleUnauthorized = () => logout();
    const handleAccountLocked = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>;
      const message = customEvent.detail?.message || 'Tài khoản của bạn đã bị khóa.';
      logout();
      toast.error(message);
    };

    window.addEventListener('woodcraft:unauthorized', handleUnauthorized);
    window.addEventListener('woodcraft:account-locked', handleAccountLocked);
    
    return () => {
      window.removeEventListener('woodcraft:unauthorized', handleUnauthorized);
      window.removeEventListener('woodcraft:account-locked', handleAccountLocked);
    };
  }, [toast]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

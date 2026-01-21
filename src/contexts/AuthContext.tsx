// ============================================
// AUTH CONTEXT
// ============================================
// JWT-based authentication (Supabase ishlatilmaydi)
// Admin login/logout funksiyalari
// ============================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, setToken, removeToken } from '@/lib/api';

type AppRole = 'super_admin' | 'admin' | null;

interface User {
  id: string;
  username: string;
  role: AppRole;
}

interface AuthContextType {
  user: User | null;
  role: AppRole;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole>(null);
  const [loading, setLoading] = useState(true);

  // Sahifa yuklanganda tokenni tekshirish
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.getMe();

        if (response.success && response.data?.user) {
          setUser(response.data.user);
          setRole(response.data.user.role as AppRole);
        } else {
          // Token yaroqsiz
          removeToken();
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        removeToken();
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Admin login
   */
  const signIn = async (username: string, password: string): Promise<{ error: Error | null }> => {
    try {
      const response = await authApi.login(username, password);

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Token saqlash
        setToken(token);

        // User ma'lumotlarini saqlash
        setUser({
          id: user.id,
          username: user.username,
          role: user.role,
        });
        setRole(user.role as AppRole);

        return { error: null };
      } else {
        return { error: new Error(response.message || 'Login xatosi') };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { error: new Error(error.message || 'Login xatosi') };
    }
  };

  /**
   * Admin logout
   */
  const signOut = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeToken();
      setUser(null);
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

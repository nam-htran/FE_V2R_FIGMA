"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from '../../i18n/navigation';
import { authService } from '@/services/api/auth';

interface User {
  id?: string | number;
  email?: string;
  fullName?: string;
  role?: string;
}

// Định nghĩa các giá trị mà Context sẽ cung cấp
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  currentProfile?: any | null;
  login: (email?: string, password?: string) => Promise<void>;
  logout: () => void;
}

// Tạo Context với giá trị mặc định
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tạo Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentProfile, setCurrentProfile] = useState<any | null>(null);
  const router = useRouter();

  // Restore session from stored token on mount
  useEffect(() => {
    try {
      const token = authService.getAuthToken();
      if (token) {
        const role = authService.getUserRole();
        const email = authService.getUserEmail();
        const fullName = authService.getUserFullName();
        const id = authService.getUserId();

        const restoredUser: User = {
          id: id || undefined,
          email: email || undefined,
          fullName: fullName || undefined,
          role: role || undefined,
        };

        setUser(restoredUser);
        setIsAuthenticated(true);
      }
    } catch (err) {
      // ignore
    }
  }, []);

  // Note: we intentionally do NOT auto-redirect admins on app load here.
  // Redirect for admin users happens only immediately after a successful login.

  const login = async (email?: string, password?: string) => {
    // If credentials provided, call API
    if (email && password) {
      try {
        const res = await authService.login({ email, password });
        // Prefer token fields in response
        const token = res.token || res.jwt || res.accessToken || (res.user && (res.user as any).token);

        if (token) {
          authService.setAuthToken(token);
        }

        const loggedUser: User = {
          id: res.user?.id,
          email: res.user?.email || email,
          fullName: res.user?.fullName,
          role: res.role || res.user?.role,
        };

        // If role is not returned in response, try to read it from the stored token
        if (!loggedUser.role) {
          const tokenRole = authService.getUserRole();
          if (tokenRole) loggedUser.role = tokenRole;
        }

        setUser(loggedUser);
        setIsAuthenticated(true);

        // After successful login, send user to the main page.
        // Keep this simple: always navigate to `/` regardless of role.
        router.push('/');
      } catch (err) {
        // Re-throw error to be handled by caller
        setIsAuthenticated(false);
        setUser(null);
        throw err;
      }
    } else {
      // Legacy behavior: just mark as authenticated and go to main page
      setIsAuthenticated(true);
      router.push('/');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    authService.removeAuthToken();
    router.push('/'); // Chuyển hướng về trang chủ sau khi đăng xuất
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, currentProfile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Tạo một custom hook để dễ dàng sử dụng Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
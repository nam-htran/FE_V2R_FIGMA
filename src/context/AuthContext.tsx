"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from '../../i18n/navigation';

// Định nghĩa các giá trị mà Context sẽ cung cấp
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

// Tạo Context với giá trị mặc định
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tạo Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const login = () => {
    // Trong một ứng dụng thực tế, bạn sẽ xử lý logic đăng nhập ở đây
    // Sau đó cập nhật trạng thái và chuyển hướng
    setIsAuthenticated(true);
    router.push('/workspace'); // Chuyển hướng đến trang workspace sau khi đăng nhập
  };

  const logout = () => {
    setIsAuthenticated(false);
    router.push('/'); // Chuyển hướng về trang chủ sau khi đăng xuất
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
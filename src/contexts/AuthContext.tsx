import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole } from '@/types/medical';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<UserRole, User> = {
  doctor: {
    id: 'usr-001',
    name: 'Dr. Sarah Chen',
    role: 'doctor',
    avatar: 'SC',
    department: 'Internal Medicine',
  },
  clinician: {
    id: 'usr-002',
    name: 'Dr. Michael Roberts',
    role: 'clinician',
    avatar: 'MR',
    department: 'Cardiology',
  },
  admin: {
    id: 'usr-003',
    name: 'Admin Thompson',
    role: 'admin',
    avatar: 'AT',
    department: 'IT Security',
  },
  researcher: {
    id: 'usr-004',
    name: 'Dr. Emily Watson',
    role: 'researcher',
    avatar: 'EW',
    department: 'Clinical Research',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((role: UserRole) => {
    setUser(DEMO_USERS[role]);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

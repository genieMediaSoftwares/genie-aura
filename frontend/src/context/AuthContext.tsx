import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { api } from '../api/client.js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, orgName: string) => Promise<void>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const me = await api.auth.getMe();
      setUser(me);
    } catch {
      // If getMe fails or no token, perform auto-login as agency admin for instant seamless demo
      try {
        const res = await api.auth.signIn({
          email: 'admin@geniemedia.in',
          password: 'admin123',
        });
        setUser(res.user);
      } catch (err) {
        console.warn('Auto-login fallback:', err);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.signIn({ email, password });
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string, orgName: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.signUp({ name, email, password, orgName });
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    api.auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

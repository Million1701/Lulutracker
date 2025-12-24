import { createContext, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { useAuth } from '../hooks/useAuth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  // Persist user ID to localStorage only when user changes
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem('user', JSON.stringify(user.id));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

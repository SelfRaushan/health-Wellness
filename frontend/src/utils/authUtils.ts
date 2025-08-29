import { createContext, useContext } from 'react';
import type { AuthContextType } from './authTypes'; // Assuming authTypes is in the same directory

// Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

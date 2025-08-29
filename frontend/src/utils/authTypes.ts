// Define the User interface based on usage in AuthContext.tsx
export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  role: string;
  createdAt: string;
}

// Define the AuthState interface
export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

// Define the AuthContextType interface
export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Define the RegisterData interface
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
}

// Define the initialState
export const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token') || null, // Assuming token is stored in localStorage
  loading: false,
  error: null,
  isInitialized: false,
};

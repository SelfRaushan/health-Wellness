import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react'; // Import useRef
import axios from 'axios';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  role: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
}

interface AxiosErrorResponse {
  data?: {
    message?: string;
  };
  message?: string;
}

interface AxiosError extends Error {
  response?: AxiosErrorResponse;
  // Removed request and config as they might be causing ESLint issues
}


// Action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'INITIALIZE_COMPLETE' };

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
  isInitialized: false,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
        isInitialized: true, // Set isInitialized to true on successful login
      };
    case 'LOGIN_FAILURE':
      localStorage.removeItem('token');
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        error: action.payload,
        isInitialized: true, // Set isInitialized to true on login failure
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        error: null,
        isInitialized: true, // Set isInitialized to true on logout
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'INITIALIZE_COMPLETE':
      return {
        ...state,
        isInitialized: true,
      };
    default:
      return state;
  }
};

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const initialized = useRef(false); // Use a ref to track if initialization has run

  // Initialize auth state on mount
  useEffect(() => {
    if (!initialized.current) { // Only run if not already initialized
      initialized.current = true; // Mark as initialized

      if (state.token) {
        const fetchUser = async () => {
          try {
            // Ensure Authorization header is set before making the request
            // Use the token from the closure, which is the token at the time of effect execution
            if (state.token) { // Simplified check for state.token
              axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
            }
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`);
            
            if (response.data.success) {
              dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                  user: response.data.data,
                  token: state.token, // Use the token from closure
                },
              });
            } else {
              // If token is valid but user data fetch fails, treat as logout
              dispatch({ type: 'LOGOUT' });
            }
          } catch (error) {
            console.error('Get current user failed:', error);
            dispatch({ type: 'LOGOUT' }); // Token is likely invalid or expired
          }
        };
        fetchUser();
      } else {
        // If no token, mark initialization as complete
        dispatch({ type: 'INITIALIZE_COMPLETE' });
      }
    }
  }, [dispatch, state.token]); // Dependencies: dispatch and state.token

  // Set axios default authorization header when token changes
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // Login function
  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data.success) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: response.data.user,
            token: response.data.token,
          },
        });
      }
    } catch (error) { // Error is implicitly unknown
      const axiosError = error as AxiosError; // Asserting type to access properties
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: axiosError.response?.data?.message || axiosError.message || 'Login failed',
      });
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, userData);

      if (response.data.success) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: response.data.user,
            token: response.data.token,
          },
        });
      }
    } catch (error) { // Error is implicitly unknown
      const axiosError = error as AxiosError; // Asserting type to access properties
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: axiosError.response?.data?.message || axiosError.message || 'Registration failed',
      });
    }
  };

  // Logout function
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ===== TYPES =====
export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  role: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// ===== ACTIONS =====
export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'INITIALIZE_COMPLETE' };

// ===== STATE =====
export const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
  isInitialized: false,
};

// ===== REDUCER =====
export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
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
        isInitialized: true,
      };
    case 'LOGIN_FAILURE':
      localStorage.removeItem('token');
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        error: action.payload,
        isInitialized: true,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        error: null,
        isInitialized: true,
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

// ===== CONSTANTS =====
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const AUTH_TOKEN_KEY = 'token';

// ===== DEMO DATA =====
export const DEMO_USERS = [
  { email: 'leena@example.com', password: 'hashedpassword1', name: 'Leena' },
  { email: 'rahul@example.com', password: 'hashedpassword2', name: 'Rahul' },
  { email: 'aditi@example.com', password: 'hashedpassword3', name: 'Aditi' },
  { email: 'aman@example.com', password: 'hashedpassword4', name: 'Aman' },
  { email: 'simran@example.com', password: 'hashedpassword5', name: 'Simran' },
];

// Added a comment to trigger re-build

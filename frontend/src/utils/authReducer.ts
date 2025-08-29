import type { AuthState, User } from './authTypes'; // Import AuthState and User as types

// Define action types
type AuthActionType = 'LOGIN_START' | 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'LOGOUT' | 'CLEAR_ERROR' | 'INITIALIZE_COMPLETE';

// Define specific payloads for actions
interface LoginSuccessPayload {
  user: User;
  token: string;
}

// Define a discriminated union for actions
interface AuthAction {
  type: AuthActionType;
  payload?: LoginSuccessPayload | string | undefined; // Union of possible payloads: LoginSuccessPayload or string (for error messages)
}

// Define the authReducer function
export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      // Ensure payload is of type LoginSuccessPayload
      if (action.payload && typeof action.payload === 'object' && 'token' in action.payload && 'user' in action.payload) {
        const successPayload = action.payload as LoginSuccessPayload;
        localStorage.setItem('token', successPayload.token);
        return {
          ...state,
          loading: false,
          user: successPayload.user,
          token: successPayload.token,
          error: null,
        };
      } else {
        // Handle error if payload is missing expected properties or is not the correct type
        return { ...state, loading: false, error: 'Login failed: Invalid payload structure' };
      }
    case 'LOGIN_FAILURE':
      // Payload for LOGIN_FAILURE is expected to be a string (error message)
      if (typeof action.payload === 'string') {
        return { ...state, loading: false, error: action.payload };
      } else {
        return { ...state, loading: false, error: 'Login failed: Invalid error message format' };
      }
    case 'LOGOUT':
      localStorage.removeItem('token');
      return { ...state, user: null, token: null, loading: false, error: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'INITIALIZE_COMPLETE':
      return { ...state, isInitialized: true };
    default:
      return state;
  }
};

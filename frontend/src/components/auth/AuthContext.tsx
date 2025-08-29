import React, { useReducer, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios'; // Import AxiosError
import type { AuthContextType, RegisterData } from '../../utils/authTypes'; // Use type-only import for types
import { initialState } from '../../utils/authTypes'; // Import initialState as a value
import { authReducer } from '../../utils/authReducer';
import { AuthContext } from '../../utils/authUtils'; // Import AuthContext

// Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Get current user - memoized to prevent recreation and infinite loops
  const getCurrentUser = useCallback(async () => {
    if (!state.token) {
      dispatch({ type: 'INITIALIZE_COMPLETE' });
      return;
    }

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`);
      
      if (response.data.success) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: response.data.data,
            token: state.token,
          },
        });
      }
    } catch (error: unknown) { // Use unknown for better type safety
      console.error('Get current user failed:', error);
      dispatch({ type: 'LOGOUT' });
    }
  }, [state.token]); // Only depend on token

  // Initialize auth state ONLY ONCE on mount or when token changes
  useEffect(() => {
    if (!state.isInitialized) {
      if (state.token) {
        getCurrentUser();
      } else {
        dispatch({ type: 'INITIALIZE_COMPLETE' });
      }
    }
  }, [state.token, state.isInitialized, getCurrentUser]);

  // Set axios default authorization header when token changes
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // Login function - memoized to prevent recreation
  const login = useCallback(async (email: string, password: string) => {
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
    } catch (error: unknown) { // Use unknown for better type safety
      if (error instanceof AxiosError) {
        // Handle AxiosError specifically
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: error.response?.data?.message || 'Login failed',
        });
      } else if (error instanceof Error) {
        // Handle generic Error
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: error.message || 'Login failed',
        });
      } else {
        // Handle other unexpected types
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: 'An unknown error occurred during login',
        });
      }
    }
  }, []);

  // Register function - memoized to prevent recreation
  const register = useCallback(async (userData: RegisterData) => {
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
    } catch (error: unknown) { // Use unknown for better type safety
      if (error instanceof AxiosError) {
        // Handle AxiosError specifically
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: error.response?.data?.message || 'Registration failed',
        });
      } else if (error instanceof Error) {
        // Handle generic Error
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: error.message || 'Registration failed',
        });
      } else {
        // Handle other unexpected types
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: 'An unknown error occurred during registration',
        });
      }
    }
  }, []);

  // Logout function - memoized to prevent recreation
  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  // Clear error function - memoized to prevent recreation
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

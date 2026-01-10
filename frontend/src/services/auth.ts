// frontend/src/services/auth.ts
import { storeToken, removeToken, setAuthStatus, getToken } from '@/lib/auth';

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user_id: string;
  email: string;
  token: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

// Base API URL - this should come from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * Helper function to make API requests for authentication
 */
const authRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Get current user profile using the stored token
 * @returns Promise resolving to user profile
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No token available');
    }

    const response = await fetch(`${API_BASE_URL}/user/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

/**
 * Signup a new user
 * @param signupData - User signup information
 * @returns Promise resolving to auth response
 */
export const signup = async (signupData: SignupData): Promise<{ user: User, token: string }> => {
  try {
    const response = await authRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(signupData),
    });

    // Store the received token
    storeToken(response.token);

    // Fetch the user profile using the new token
    const userProfile = await getCurrentUser();

    return {
      user: userProfile,
      token: response.token
    };
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

/**
 * Login an existing user
 * @param loginData - User login credentials
 * @returns Promise resolving to auth response
 */
export const login = async (loginData: LoginData): Promise<{ user: User, token: string }> => {
  try {
    const response = await authRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });

    // Store the received token
    storeToken(response.token);

    // Fetch the user profile using the new token
    const userProfile = await getCurrentUser();

    return {
      user: userProfile,
      token: response.token
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout the current user
 * @returns Promise resolving when logout is complete
 */
export const logout = async (): Promise<void> => {
  try {
    // Call the backend logout endpoint if it exists
    // For now, just remove the token from localStorage and set auth status to false
    removeToken();
    setAuthStatus(false);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
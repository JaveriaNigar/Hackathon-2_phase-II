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

// Base API URL - using Next.js rewrite proxy to avoid CORS
const API_BASE_URL = '/backend-api';

/**
 * Helper function to make API requests for authentication
 */
const authRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  console.log(`[Auth] Requesting: ${url}`, { method: options.method, headers });

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(id);

    console.log(`[Auth] Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Auth] Error body: ${errorText}`);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      } catch (e) {
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
    }

    return response.json();
  } catch (error: any) {
    clearTimeout(id);
    console.error(`[Auth] Fetch error:`, error);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your network connection or backend status.');
    }
    throw error;
  }
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

    // Use authRequest to benefit from timeout and logging
    // Endpoint: /user/ -> rewritten to ...hf.space/api/user/
    return await authRequest('/user/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
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
    // Truncate password to 72 chars to satisfy backend bcrypt limit
    const safeSignupData = {
      ...signupData,
      password: signupData.password
    };

    // Endpoint: /auth/signup -> rewritten to ...hf.space/api/auth/signup
    const response = await authRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(safeSignupData),
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
    // Truncate password to 72 chars to satisfy backend bcrypt limit
    const safeLoginData = {
      ...loginData,
      password: loginData.password
    };

    // Endpoint: /auth/login -> rewritten to ...hf.space/api/auth/login
    const response = await authRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(safeLoginData),
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
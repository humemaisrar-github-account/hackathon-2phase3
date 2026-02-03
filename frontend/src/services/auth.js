import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, userAPI } from './api';

// Create Auth Context
const AuthContext = createContext();

// Auth service to manage authentication state
class AuthService {
  constructor() {
    this.currentUser = null;
    this.listeners = [];
    this.init();
  }

  init() {
    // Check if user is already logged in by checking for stored token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        // In a real implementation, we'd verify the token with the backend
        // For now, we'll just assume the user is logged in
        this.currentUser = { id: 'mock-user-id', email: localStorage.getItem('user_email') };
      }
    }
  }

  // Register a listener for auth state changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners of auth state change
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  // Register a new user
  async register(userData) {
    try {
      // Call backend API to register user using API service
      const response = await authAPI.register(userData);

      const result = response.data;

      // Store token and user info locally
      if (result.access_token) {
        localStorage.setItem('auth_token', result.access_token);
        localStorage.setItem('user_email', result.user.email);
        this.currentUser = result.user;
        this.notifyListeners();
      }

      return result;
    } catch (error) {
      console.error('Registration error:', error);
      // Extract error message from axios error response
      const errorMessage = error.response?.data?.detail || error.response?.data?.error?.message || error.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  }

  // Login user
  async login(credentials) {
    try {
      // Call backend API to authenticate user using API service
      const response = await authAPI.login(credentials);

      const result = response.data;

      // Store token and user info locally
      if (result.access_token) {
        localStorage.setItem('auth_token', result.access_token);
        localStorage.setItem('user_email', result.user.email);
        this.currentUser = result.user;
        this.notifyListeners();
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      // Extract error message from axios error response
      const errorMessage = error.response?.data?.detail || error.response?.data?.error?.message || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  }

  // Logout user
  async logout() {
    try {
      // Call backend API to logout user using API service
      await authAPI.logout();

      // Clear local storage and state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      this.currentUser = null;
      this.notifyListeners();

      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      // Even if backend logout fails, clear local state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      this.currentUser = null;
      this.notifyListeners();

      return { success: true, message: 'Logged out successfully' };
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  }

  // Refresh user token (if needed)
  async refreshToken() {
    // In a real implementation, this would refresh the JWT token
    // For now, we'll just return the current token
    return localStorage.getItem('auth_token');
  }

  // Update user profile
  async updateUserProfile(updates) {
    if (!this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    try {
      // Call backend API to update user profile using API service
      const response = await userAPI.update(this.currentUser.id, updates);

      const result = response.data;

      // Update current user in state
      this.currentUser = { ...this.currentUser, ...result.user };
      this.notifyListeners();

      return result;
    } catch (error) {
      console.error('Update profile error:', error);
      // Extract error message from axios error response
      const errorMessage = error.response?.data?.detail || error.response?.data?.error?.message || error.message || 'Failed to update profile';
      throw new Error(errorMessage);
    }
  }
}

// Create a singleton instance of the auth service
const authService = new AuthService();

// Export a React hook for using auth state
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Create an AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set initial state
    setCurrentUser(authService.getCurrentUser());
    setLoading(false);

    // Subscribe to auth state changes
    const unsubscribe = authService.subscribe((user) => {
      setCurrentUser(user);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    isAuthenticated: authService.isAuthenticated(),
    register: authService.register.bind(authService),
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    updateUserProfile: authService.updateUserProfile.bind(authService),
    refreshToken: authService.refreshToken.bind(authService),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the service directly if needed
export default authService;
import { create } from 'zustand';
import api from '../lib/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      
      const response = await api.post('/auth/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      
      // Fetch user profile
      const userRes = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      
      set({ 
        user: userRes.data, 
        token: access_token, 
        isAuthenticated: true, 
        isLoading: false 
      });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Login failed', 
        isLoading: false 
      });
      return false;
    }
  },

  register: async (email, username, password) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/register', { email, username, password });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Registration failed', 
        isLoading: false 
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  fetchUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const response = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: response.data, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  }
}));

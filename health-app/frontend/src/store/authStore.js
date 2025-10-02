import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.login(credentials);
      const { access_token, user } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        token: access_token,
        isAuthenticated: true,
        loading: false,
      });

      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Login failed',
        loading: false,
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.register(data);
      const { access_token, user } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        token: access_token,
        isAuthenticated: true,
        loading: false,
      });

      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Registration failed',
        loading: false,
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
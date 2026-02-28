import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import { AuthState, LoginCredentials, User } from '@/types/auth';
import { authService } from '@/services';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true });
          const response = await authService.login(credentials);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          toast.success(`Welcome back, ${response.user.fullName}!`);
        } catch (error: any) {
          set({ isLoading: false });
          const message = error.response?.data?.message || 'Login failed';
          toast.error(message);
          throw error;
        }
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        toast.success('Logged out successfully');
        window.location.href = '/login';
      },

      refreshToken: async () => {
        try {
          const response = await authService.refreshToken();
          set({ token: response.token });
        } catch (error) {
          // Token refresh failed, logout user
          get().logout();
          throw error;
        }
      },

      checkAuth: async () => {
        if (!authService.isAuthenticated()) {
          set({ isAuthenticated: false, user: null, token: null });
          return;
        }

        try {
          set({ isLoading: true });
          const response = await authService.getProfile();
          set({
            user: response.data,
            token: authService.getToken() || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // Profile fetch failed, logout user
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          authService.logout();
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      initialize: () => {
        // Check if user is authenticated on app start
        get().checkAuth();
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
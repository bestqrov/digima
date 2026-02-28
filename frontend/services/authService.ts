import api from './api';
import Cookies from 'js-cookie';
import { LoginCredentials, LoginResponse, RefreshTokenResponse } from '@/types/auth';

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post('/api/v1/auth/login', credentials);
      const { user, token } = response.data;
      
      // Store token in httpOnly cookie (preferred) or regular cookie
      Cookies.set('auth-token', token, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  async logout(): Promise<void> {
    try {
      await api.post('/api/v1/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      // Always remove token
      Cookies.remove('auth-token');
    }
  }
  
  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const response = await api.post('/api/v1/auth/refresh');
      const { token } = response.data;
      
      // Update token in cookie
      Cookies.set('auth-token', token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      return response.data;
    } catch (error) {
      // If refresh fails, remove token and redirect to login
      Cookies.remove('auth-token');
      window.location.href = '/login';
      throw error;
    }
  }
  
  async getProfile() {
    try {
      const response = await api.get('/api/v1/auth/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  getToken(): string | undefined {
    return Cookies.get('auth-token');
  }
  
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }
}

const authService = new AuthService();
export default authService;
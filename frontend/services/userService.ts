import api from './api';
import {
  User,
  CreateUserData,
  UpdateUserData,
  UserFilters,
  ApiResponse,
  PaginatedResponse,
  PaginationParams
} from '@/types';

class UserService {
  // Get all users
  async getUsers(
    params?: PaginationParams & UserFilters
  ): Promise<PaginatedResponse<User>> {
    const response = await api.get('/api/v1/users', { params });
    return response.data;
  }
  
  // Get user by ID
  async getUserById(id: string): Promise<ApiResponse<User>> {
    const response = await api.get(`/api/v1/users/${id}`);
    return response.data;
  }
  
  // Create user
  async createUser(data: CreateUserData): Promise<ApiResponse<User>> {
    const response = await api.post('/api/v1/users', data);
    return response.data;
  }
  
  // Update user
  async updateUser(id: string, data: UpdateUserData): Promise<ApiResponse<User>> {
    const response = await api.put(`/api/v1/users/${id}`, data);
    return response.data;
  }
  
  // Delete user
  async deleteUser(id: string): Promise<ApiResponse> {
    const response = await api.delete(`/api/v1/users/${id}`);
    return response.data;
  }
  
  // Activate/Deactivate user
  async toggleUserStatus(id: string, isActive: boolean): Promise<ApiResponse<User>> {
    const response = await api.patch(`/api/v1/users/${id}/status`, { isActive });
    return response.data;
  }
  
  // Change user password
  async changePassword(
    id: string,
    data: { currentPassword: string; newPassword: string }
  ): Promise<ApiResponse> {
    const response = await api.post(`/api/v1/users/${id}/change-password`, data);
    return response.data;
  }
  
  // Reset user password (admin only)
  async resetPassword(id: string): Promise<ApiResponse<{ temporaryPassword: string }>> {
    const response = await api.post(`/api/v1/users/${id}/reset-password`);
    return response.data;
  }
  
  // Get user statistics
  async getUserStats(): Promise<ApiResponse<any>> {
    const response = await api.get('/api/v1/users/stats');
    return response.data;
  }
  
  // Get users by agency
  async getUsersByAgency(agencyId: string): Promise<ApiResponse<User[]>> {
    const response = await api.get(`/api/v1/users/agency/${agencyId}`);
    return response.data;
  }
  
  // Invite user by email
  async inviteUser(data: {
    email: string;
    role: 'agency_admin' | 'agency_user';
    agencyId?: string;
  }): Promise<ApiResponse> {
    const response = await api.post('/api/v1/users/invite', data);
    return response.data;
  }
}

const userService = new UserService();
export default userService;
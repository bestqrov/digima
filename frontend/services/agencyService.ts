import api from './api';
import {
  Agency,
  CreateAgencyData,
  UpdateAgencyData,
  ApiResponse,
  PaginatedResponse,
  PaginationParams
} from '@/types';

class AgencyService {
  // Get all agencies (admin only)
  async getAgencies(params?: PaginationParams): Promise<PaginatedResponse<Agency>> {
    const response = await api.get('/api/v1/agencies', { params });
    return response.data;
  }
  
  // Get agency by ID
  async getAgencyById(id: string): Promise<ApiResponse<Agency>> {
    const response = await api.get(`/api/v1/agencies/${id}`);
    return response.data;
  }
  
  // Get current agency
  async getCurrentAgency(): Promise<ApiResponse<Agency>> {
    const response = await api.get('/api/v1/agencies/me');
    return response.data;
  }
  
  // Create agency
  async createAgency(data: CreateAgencyData): Promise<ApiResponse<Agency>> {
    const response = await api.post('/api/v1/agencies', data);
    return response.data;
  }
  
  // Update agency
  async updateAgency(id: string, data: UpdateAgencyData): Promise<ApiResponse<Agency>> {
    const response = await api.put(`/api/v1/agencies/${id}`, data);
    return response.data;
  }
  
  // Update current agency
  async updateCurrentAgency(data: UpdateAgencyData): Promise<ApiResponse<Agency>> {
    const response = await api.put('/api/v1/agencies/me', data);
    return response.data;
  }
  
  // Delete agency
  async deleteAgency(id: string): Promise<ApiResponse> {
    const response = await api.delete(`/api/v1/agencies/${id}`);
    return response.data;
  }
  
  // Toggle agency status
  async toggleAgencyStatus(id: string, isActive: boolean): Promise<ApiResponse<Agency>> {
    const response = await api.patch(`/api/v1/agencies/${id}/status`, { isActive });
    return response.data;
  }
  
  // Get agency statistics
  async getAgencyStats(id?: string): Promise<ApiResponse<any>> {
    const endpoint = id ? `/api/v1/agencies/${id}/stats` : '/api/v1/agencies/me/stats';
    const response = await api.get(endpoint);
    return response.data;
  }
  
  // Upload agency logo
  async uploadLogo(id: string, file: File): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('logo', file);
    
    const response = await api.post(
      `/api/v1/agencies/${id}/logo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
}

const agencyService = new AgencyService();
export default agencyService;
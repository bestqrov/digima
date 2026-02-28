import api from './api';
import {
  Vehicle,
  CreateVehicleData,
  UpdateVehicleData,
  VehicleFilters,
  ApiResponse,
  PaginatedResponse,
  PaginationParams
} from '@/types';

class VehicleService {
  // Get all vehicles
  async getVehicles(
    params?: PaginationParams & VehicleFilters
  ): Promise<PaginatedResponse<Vehicle>> {
    const response = await api.get('/api/v1/vehicles', { params });
    return response.data;
  }
  
  // Get vehicle by ID
  async getVehicleById(id: string): Promise<ApiResponse<Vehicle>> {
    const response = await api.get(`/api/v1/vehicles/${id}`);
    return response.data;
  }
  
  // Create vehicle
  async createVehicle(data: CreateVehicleData): Promise<ApiResponse<Vehicle>> {
    const response = await api.post('/api/v1/vehicles', data);
    return response.data;
  }
  
  // Update vehicle
  async updateVehicle(id: string, data: UpdateVehicleData): Promise<ApiResponse<Vehicle>> {
    const response = await api.put(`/api/v1/vehicles/${id}`, data);
    return response.data;
  }
  
  // Delete vehicle
  async deleteVehicle(id: string): Promise<ApiResponse> {
    const response = await api.delete(`/api/v1/vehicles/${id}`);
    return response.data;
  }
  
  // Update vehicle status
  async updateVehicleStatus(
    id: string, 
    status: 'active' | 'maintenance' | 'inactive'
  ): Promise<ApiResponse<Vehicle>> {
    const response = await api.patch(`/api/v1/vehicles/${id}/status`, { status });
    return response.data;
  }
  
  // Upload vehicle images
  async uploadVehicleImages(id: string, files: File[]): Promise<ApiResponse> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    
    const response = await api.post(
      `/api/v1/vehicles/${id}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
  
  // Get vehicle statistics
  async getVehicleStats(): Promise<ApiResponse<any>> {
    const response = await api.get('/api/v1/vehicles/stats');
    return response.data;
  }
  
  // Get available vehicles for a date/time
  async getAvailableVehicles(datetime: string): Promise<ApiResponse<Vehicle[]>> {
    const response = await api.get('/api/v1/vehicles/available', {
      params: { datetime }
    });
    return response.data;
  }
}

const vehicleService = new VehicleService();
export default vehicleService;
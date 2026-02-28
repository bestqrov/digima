import api from './api';
import {
  Trip,
  CreateTripData,
  UpdateTripData,
  TripFilters,
  ApiResponse,
  PaginatedResponse,
  PaginationParams
} from '@/types';

class TripService {
  // Get all trips
  async getTrips(
    params?: PaginationParams & TripFilters
  ): Promise<PaginatedResponse<Trip>> {
    const response = await api.get('/api/v1/trips', { params });
    return response.data;
  }
  
  // Get trip by ID
  async getTripById(id: string): Promise<ApiResponse<Trip>> {
    const response = await api.get(`/api/v1/trips/${id}`);
    return response.data;
  }
  
  // Create trip
  async createTrip(data: CreateTripData): Promise<ApiResponse<Trip>> {
    const response = await api.post('/api/v1/trips', data);
    return response.data;
  }
  
  // Update trip
  async updateTrip(id: string, data: UpdateTripData): Promise<ApiResponse<Trip>> {
    const response = await api.put(`/api/v1/trips/${id}`, data);
    return response.data;
  }
  
  // Update trip status
  async updateTripStatus(
    id: string, 
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  ): Promise<ApiResponse<Trip>> {
    const response = await api.patch(`/api/v1/trips/${id}/status`, { status });
    return response.data;
  }
  
  // Update payment status
  async updatePaymentStatus(
    id: string,
    paymentStatus: 'pending' | 'paid' | 'refunded'
  ): Promise<ApiResponse<Trip>> {
    const response = await api.patch(`/api/v1/trips/${id}/payment-status`, {
      paymentStatus
    });
    return response.data;
  }
  
  // Delete trip
  async deleteTrip(id: string): Promise<ApiResponse> {
    const response = await api.delete(`/api/v1/trips/${id}`);
    return response.data;
  }
  
  // Add rating to trip
  async addTripRating(
    id: string,
    rating: { score: number; comment?: string }
  ): Promise<ApiResponse<Trip>> {
    const response = await api.post(`/api/v1/trips/${id}/rating`, rating);
    return response.data;
  }
  
  // Get trip statistics
  async getTripStats(period?: 'today' | 'week' | 'month' | 'year'): Promise<ApiResponse<any>> {
    const response = await api.get('/api/v1/trips/stats', {
      params: { period }
    });
    return response.data;
  }
  
  // Get revenue statistics
  async getRevenueStats(period?: 'today' | 'week' | 'month' | 'year'): Promise<ApiResponse<any>> {
    const response = await api.get('/api/v1/trips/revenue', {
      params: { period }
    });
    return response.data;
  }
  
  // Export trips to CSV
  async exportTrips(filters?: TripFilters): Promise<Blob> {
    const response = await api.get('/api/v1/trips/export', {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  }
}

const tripService = new TripService();
export default tripService;
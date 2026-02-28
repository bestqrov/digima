import api from './api';
import {
  Subscription,
  SubscriptionPlan,
  SubscriptionRequest,
  PaymentProofUpload,
  ApiResponse,
  PaginatedResponse
} from '@/types';

class SubscriptionService {
  // Get current subscription
  async getCurrentSubscription(): Promise<ApiResponse<Subscription>> {
    const response = await api.get('/api/v1/subscriptions/me');
    return response.data;
  }
  
  // Get all available plans
  async getPlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
    const response = await api.get('/api/v1/subscriptions/plans');
    return response.data;
  }
  
  // Request a new subscription
  async requestSubscription(data: SubscriptionRequest): Promise<ApiResponse<Subscription>> {
    const response = await api.post('/api/v1/subscriptions/request', data);
    return response.data;
  }
  
  // Upload payment proof
  async uploadPaymentProof(subscriptionId: string, file: File): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('paymentProof', file);
    
    const response = await api.post(
      `/api/v1/subscriptions/${subscriptionId}/upload-proof`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
  
  // Get subscription usage stats
  async getUsageStats(): Promise<ApiResponse<any>> {
    const response = await api.get('/api/v1/subscriptions/usage');
    return response.data;
  }
  
  // Cancel subscription
  async cancelSubscription(subscriptionId: string): Promise<ApiResponse> {
    const response = await api.post(`/api/v1/subscriptions/${subscriptionId}/cancel`);
    return response.data;
  }
  
  // Renew subscription
  async renewSubscription(subscriptionId: string, planId: string): Promise<ApiResponse<Subscription>> {
    const response = await api.post(`/api/v1/subscriptions/${subscriptionId}/renew`, {
      planId
    });
    return response.data;
  }
  
  // Admin: Get all subscriptions
  async getAllSubscriptions(params?: any): Promise<PaginatedResponse<Subscription>> {
    const response = await api.get('/api/v1/subscriptions', { params });
    return response.data;
  }
  
  // Admin: Approve subscription
  async approveSubscription(subscriptionId: string): Promise<ApiResponse> {
    const response = await api.post(`/api/v1/subscriptions/${subscriptionId}/approve`);
    return response.data;
  }
  
  // Admin: Reject subscription
  async rejectSubscription(subscriptionId: string, reason: string): Promise<ApiResponse> {
    const response = await api.post(`/api/v1/subscriptions/${subscriptionId}/reject`, {
      reason
    });
    return response.data;
  }
}

const subscriptionService = new SubscriptionService();
export default subscriptionService;
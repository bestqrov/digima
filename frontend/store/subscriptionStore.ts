import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { Subscription, SubscriptionPlan } from '@/types';
import { subscriptionService } from '@/services';

interface SubscriptionStore {
  // State
  subscription: Subscription | null;
  plans: SubscriptionPlan[];
  usage: any;
  isLoading: boolean;
  
  // Actions
  fetchCurrentSubscription: () => Promise<void>;
  fetchPlans: () => Promise<void>;
  fetchUsage: () => Promise<void>;
  requestSubscription: (planId: string) => Promise<void>;
  uploadPaymentProof: (subscriptionId: string, file: File) => Promise<void>;
  cancelSubscription: (subscriptionId: string) => Promise<void>;
  renewSubscription: (subscriptionId: string, planId: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useSubscriptionStore = create<SubscriptionStore>()((set, get) => ({
  // State
  subscription: null,
  plans: [],
  usage: null,
  isLoading: false,

  // Actions
  fetchCurrentSubscription: async () => {
    try {
      set({ isLoading: true });
      const response = await subscriptionService.getCurrentSubscription();
      set({ subscription: response.data, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch subscription');
      }
    }
  },

  fetchPlans: async () => {
    try {
      const response = await subscriptionService.getPlans();
      set({ plans: response.data });
    } catch (error) {
      toast.error('Failed to fetch subscription plans');
    }
  },

  fetchUsage: async () => {
    try {
      const response = await subscriptionService.getUsageStats();
      set({ usage: response.data });
    } catch (error) {
      toast.error('Failed to fetch usage statistics');
    }
  },

  requestSubscription: async (planId: string) => {
    try {
      set({ isLoading: true });
      const response = await subscriptionService.requestSubscription({
        planId,
        agencyId: '', // This will be set by the backend based on the authenticated user
      });
      set({ subscription: response.data, isLoading: false });
      toast.success('Subscription requested successfully! Please proceed with payment.');
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Failed to request subscription';
      toast.error(message);
      throw error;
    }
  },

  uploadPaymentProof: async (subscriptionId: string, file: File) => {
    try {
      set({ isLoading: true });
      await subscriptionService.uploadPaymentProof(subscriptionId, file);
      
      // Refetch subscription to get updated status
      await get().fetchCurrentSubscription();
      
      toast.success('Payment proof uploaded successfully! Your subscription is now pending approval.');
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Failed to upload payment proof';
      toast.error(message);
      throw error;
    }
  },

  cancelSubscription: async (subscriptionId: string) => {
    try {
      set({ isLoading: true });
      await subscriptionService.cancelSubscription(subscriptionId);
      await get().fetchCurrentSubscription();
      toast.success('Subscription cancelled successfully');
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Failed to cancel subscription';
      toast.error(message);
      throw error;
    }
  },

  renewSubscription: async (subscriptionId: string, planId: string) => {
    try {
      set({ isLoading: true });
      const response = await subscriptionService.renewSubscription(subscriptionId, planId);
      set({ subscription: response.data, isLoading: false });
      toast.success('Subscription renewed successfully! Please proceed with payment.');
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Failed to renew subscription';
      toast.error(message);
      throw error;
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
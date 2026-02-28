import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { Trip, CreateTripData, UpdateTripData, TripFilters } from '@/types';
import { tripService } from '@/services';

interface TripStore {
  // State
  trips: Trip[];
  selectedTrip: Trip | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: TripFilters;
  isLoading: boolean;
  stats: any;
  
  // Actions
  fetchTrips: () => Promise<void>;
  fetchTripById: (id: string) => Promise<void>;
  createTrip: (data: CreateTripData) => Promise<void>;
  updateTrip: (id: string, data: UpdateTripData) => Promise<void>;
  updateTripStatus: (id: string, status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled') => Promise<void>;
  updatePaymentStatus: (id: string, paymentStatus: 'pending' | 'paid' | 'refunded') => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  addTripRating: (id: string, rating: { score: number; comment?: string }) => Promise<void>;
  fetchTripStats: (period?: 'today' | 'week' | 'month' | 'year') => Promise<void>;
  exportTrips: () => Promise<void>;
  setFilters: (filters: TripFilters) => void;
  setPagination: (page: number, limit?: number) => void;
  setLoading: (loading: boolean) => void;
  clearSelectedTrip: () => void;
}

export const useTripStore = create<TripStore>()((set, get) => ({
  // State
  trips: [],
  selectedTrip: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {},
  isLoading: false,
  stats: null,

  // Actions
  fetchTrips: async () => {
    try {
      set({ isLoading: true });
      const { pagination, filters } = get();
      const response = await tripService.getTrips({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      
      set({
        trips: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });
      toast.error('Failed to fetch trips');
    }
  },

  fetchTripById: async (id: string) => {
    try {
      set({ isLoading: true });
      const response = await tripService.getTripById(id);
      set({ selectedTrip: response.data, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      toast.error('Failed to fetch trip details');
    }
  },

  createTrip: async (data: CreateTripData) => {
    try {
      set({ isLoading: true });
      await tripService.createTrip(data);
      await get().fetchTrips();
      toast.success('Trip created successfully');
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Failed to create trip';
      toast.error(message);
      throw error;
    }
  },

  updateTrip: async (id: string, data: UpdateTripData) => {
    try {
      set({ isLoading: true });
      const response = await tripService.updateTrip(id, data);
      
      // Update the trip in the list
      set((state) => ({
        trips: state.trips.map((t) => (t._id === id ? response.data : t)),
        selectedTrip: state.selectedTrip?._id === id ? response.data : state.selectedTrip,
        isLoading: false,
      }));
      
      toast.success('Trip updated successfully');
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Failed to update trip';
      toast.error(message);
      throw error;
    }
  },

  updateTripStatus: async (id: string, status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      const response = await tripService.updateTripStatus(id, status);
      
      // Update the trip in the list
      set((state) => ({
        trips: state.trips.map((t) => (t._id === id ? response.data : t)),
        selectedTrip: state.selectedTrip?._id === id ? response.data : state.selectedTrip,
      }));
      
      toast.success(`Trip status updated to ${status}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update trip status';
      toast.error(message);
      throw error;
    }
  },

  updatePaymentStatus: async (id: string, paymentStatus: 'pending' | 'paid' | 'refunded') => {
    try {
      const response = await tripService.updatePaymentStatus(id, paymentStatus);
      
      // Update the trip in the list
      set((state) => ({
        trips: state.trips.map((t) => (t._id === id ? response.data : t)),
        selectedTrip: state.selectedTrip?._id === id ? response.data : state.selectedTrip,
      }));
      
      toast.success(`Payment status updated to ${paymentStatus}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update payment status';
      toast.error(message);
      throw error;
    }
  },

  deleteTrip: async (id: string) => {
    try {
      set({ isLoading: true });
      await tripService.deleteTrip(id);
      
      // Remove the trip from the list
      set((state) => ({
        trips: state.trips.filter((t) => t._id !== id),
        selectedTrip: state.selectedTrip?._id === id ? null : state.selectedTrip,
        isLoading: false,
      }));
      
      toast.success('Trip deleted successfully');
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Failed to delete trip';
      toast.error(message);
      throw error;
    }
  },

  addTripRating: async (id: string, rating: { score: number; comment?: string }) => {
    try {
      const response = await tripService.addTripRating(id, rating);
      
      // Update the trip in the list
      set((state) => ({
        trips: state.trips.map((t) => (t._id === id ? response.data : t)),
        selectedTrip: state.selectedTrip?._id === id ? response.data : state.selectedTrip,
      }));
      
      toast.success('Rating added successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add rating';
      toast.error(message);
      throw error;
    }
  },

  fetchTripStats: async (period?: 'today' | 'week' | 'month' | 'year') => {
    try {
      const response = await tripService.getTripStats(period);
      set({ stats: response.data });
    } catch (error) {
      toast.error('Failed to fetch trip statistics');
    }
  },

  exportTrips: async () => {
    try {
      const { filters } = get();
      const blob = await tripService.exportTrips(filters);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trips-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Trips exported successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to export trips';
      toast.error(message);
    }
  },

  setFilters: (filters: TripFilters) => {
    set({ filters, pagination: { ...get().pagination, page: 1 } });
    get().fetchTrips();
  },

  setPagination: (page: number, limit?: number) => {
    const currentPagination = get().pagination;
    set({
      pagination: {
        ...currentPagination,
        page,
        limit: limit || currentPagination.limit,
      },
    });
    get().fetchTrips();
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  clearSelectedTrip: () => {
    set({ selectedTrip: null });
  },
}));
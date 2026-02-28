import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { Vehicle, CreateVehicleData, UpdateVehicleData, VehicleFilters } from '@/types';
import { vehicleService } from '@/services';

interface VehicleStore {
  // State
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: VehicleFilters;
  isLoading: boolean;
  stats: any;
  
  // Actions
  fetchVehicles: () => Promise<void>;
  fetchVehicleById: (id: string) => Promise<void>;
  createVehicle: (data: CreateVehicleData) => Promise<void>;
  updateVehicle: (id: string, data: UpdateVehicleData) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  updateVehicleStatus: (id: string, status: 'active' | 'maintenance' | 'inactive') => Promise<void>;
  uploadVehicleImages: (id: string, files: File[]) => Promise<void>;
  fetchVehicleStats: () => Promise<void>;
  setFilters: (filters: VehicleFilters) => void;
  setPagination: (page: number, limit?: number) => void;
  setLoading: (loading: boolean) => void;
  clearSelectedVehicle: () => void;
}

export const useVehicleStore = create<VehicleStore>()((set, get) => ({
  // State
  vehicles: [],
  selectedVehicle: null,
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
  fetchVehicles: async () => {
    try {
      set({ isLoading: true });
      const { pagination, filters } = get();
      const response = await vehicleService.getVehicles({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      
      set({
        vehicles: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });
      toast.error('Failed to fetch vehicles');
    }
  },

  fetchVehicleById: async (id: string) => {
    try {
      set({ isLoading: true });
      const response = await vehicleService.getVehicleById(id);
      set({ selectedVehicle: response.data, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      toast.error('Failed to fetch vehicle details');
    }
  },

  createVehicle: async (data: CreateVehicleData) => {
    try {
      set({ isLoading: true });
      await vehicleService.createVehicle(data);
      await get().fetchVehicles();
      toast.success('Vehicle created successfully');
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Failed to create vehicle';
      toast.error(message);
      throw error;
    }
  },

  updateVehicle: async (id: string, data: UpdateVehicleData) => {
    try {
      set({ isLoading: true });
      const response = await vehicleService.updateVehicle(id, data);
      
      // Update the vehicle in the list
      set((state) => ({
        vehicles: state.vehicles.map((v) => (v._id === id ? response.data : v)),
        selectedVehicle: state.selectedVehicle?._id === id ? response.data : state.selectedVehicle,
        isLoading: false,
      }));
      
      toast.success('Vehicle updated successfully');
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Failed to update vehicle';
      toast.error(message);
      throw error;
    }
  },

  deleteVehicle: async (id: string) => {
    try {
      set({ isLoading: true });
      await vehicleService.deleteVehicle(id);
      
      // Remove the vehicle from the list
      set((state) => ({
        vehicles: state.vehicles.filter((v) => v._id !== id),
        selectedVehicle: state.selectedVehicle?._id === id ? null : state.selectedVehicle,
        isLoading: false,
      }));
      
      toast.success('Vehicle deleted successfully');
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Failed to delete vehicle';
      toast.error(message);
      throw error;
    }
  },

  updateVehicleStatus: async (id: string, status: 'active' | 'maintenance' | 'inactive') => {
    try {
      const response = await vehicleService.updateVehicleStatus(id, status);
      
      // Update the vehicle in the list
      set((state) => ({
        vehicles: state.vehicles.map((v) => (v._id === id ? response.data : v)),
        selectedVehicle: state.selectedVehicle?._id === id ? response.data : state.selectedVehicle,
      }));
      
      toast.success(`Vehicle status updated to ${status}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update vehicle status';
      toast.error(message);
      throw error;
    }
  },

  uploadVehicleImages: async (id: string, files: File[]) => {
    try {
      set({ isLoading: true });
      await vehicleService.uploadVehicleImages(id, files);
      await get().fetchVehicleById(id); // Refetch to get updated images
      toast.success('Vehicle images uploaded successfully');
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Failed to upload vehicle images';
      toast.error(message);
      throw error;
    }
  },

  fetchVehicleStats: async () => {
    try {
      const response = await vehicleService.getVehicleStats();
      set({ stats: response.data });
    } catch (error) {
      toast.error('Failed to fetch vehicle statistics');
    }
  },

  setFilters: (filters: VehicleFilters) => {
    set({ filters, pagination: { ...get().pagination, page: 1 } });
    get().fetchVehicles();
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
    get().fetchVehicles();
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  clearSelectedVehicle: () => {
    set({ selectedVehicle: null });
  },
}));
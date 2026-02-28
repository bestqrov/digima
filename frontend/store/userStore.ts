import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { User, CreateUserData, UpdateUserData, UserFilters } from '@/types';
import { userService } from '@/services';

interface UserStore {
  // State
  users: User[];
  selectedUser: User | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: UserFilters;
  isLoading: boolean;
  stats: any;
  
  // Actions
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  createUser: (data: CreateUserData) => Promise<void>;
  updateUser: (id: string, data: UpdateUserData) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  toggleUserStatus: (id: string, isActive: boolean) => Promise<void>;
  changePassword: (id: string, data: { currentPassword: string; newPassword: string }) => Promise<void>;
  resetPassword: (id: string) => Promise<string>;
  inviteUser: (data: { email: string; role: 'agency_admin' | 'agency_user'; agencyId?: string }) => Promise<void>;
  fetchUserStats: () => Promise<void>;
  setFilters: (filters: UserFilters) => void;
  setPagination: (page: number, limit?: number) => void;
  setLoading: (loading: boolean) => void;
  clearSelectedUser: () => void;
}

export const useUserStore = create<UserStore>()((set, get) => ({
  // State
  users: [],
  selectedUser: null,
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
  fetchUsers: async () => {
    try {
      set({ isLoading: true });
      const { pagination, filters } = get();
      const response = await userService.getUsers({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      
      set({
        users: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });
      toast.error('Failed to fetch users');
    }
  },

  fetchUserById: async (id: string) => {
    try {
      set({ isLoading: true });
      const response = await userService.getUserById(id);
      set({ selectedUser: response.data, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      toast.error('Failed to fetch user details');
    }
  },

  createUser: async (data: CreateUserData) => {
    try {
      set({ isLoading: true });
      await userService.createUser(data);
      await get().fetchUsers();
      toast.success('User created successfully');
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Failed to create user';
      toast.error(message);
      throw error;
    }
  },

  updateUser: async (id: string, data: UpdateUserData) => {
    try {
      set({ isLoading: true });
      const response = await userService.updateUser(id, data);
      
      // Update the user in the list
      set((state) => ({
        users: state.users.map((u) => (u._id === id ? response.data : u)),
        selectedUser: state.selectedUser?._id === id ? response.data : state.selectedUser,
        isLoading: false,
      }));
      
      toast.success('User updated successfully');
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Failed to update user';
      toast.error(message);
      throw error;
    }
  },

  deleteUser: async (id: string) => {
    try {
      set({ isLoading: true });
      await userService.deleteUser(id);
      
      // Remove the user from the list
      set((state) => ({
        users: state.users.filter((u) => u._id !== id),
        selectedUser: state.selectedUser?._id === id ? null : state.selectedUser,
        isLoading: false,
      }));
      
      toast.success('User deleted successfully');
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Failed to delete user';
      toast.error(message);
      throw error;
    }
  },

  toggleUserStatus: async (id: string, isActive: boolean) => {
    try {
      const response = await userService.toggleUserStatus(id, isActive);
      
      // Update the user in the list
      set((state) => ({
        users: state.users.map((u) => (u._id === id ? response.data : u)),
        selectedUser: state.selectedUser?._id === id ? response.data : state.selectedUser,
      }));
      
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update user status';
      toast.error(message);
      throw error;
    }
  },

  changePassword: async (id: string, data: { currentPassword: string; newPassword: string }) => {
    try {
      await userService.changePassword(id, data);
      toast.success('Password changed successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
      throw error;
    }
  },

  resetPassword: async (id: string): Promise<string> => {
    try {
      const response = await userService.resetPassword(id);
      toast.success('Password reset successfully');
      return response.data.temporaryPassword;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
      throw error;
    }
  },

  inviteUser: async (data: { email: string; role: 'agency_admin' | 'agency_user'; agencyId?: string }) => {
    try {
      set({ isLoading: true });
      await userService.inviteUser(data);
      set({ isLoading: false });
      toast.success('User invitation sent successfully');
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Failed to send user invitation';
      toast.error(message);
      throw error;
    }
  },

  fetchUserStats: async () => {
    try {
      const response = await userService.getUserStats();
      set({ stats: response.data });
    } catch (error) {
      toast.error('Failed to fetch user statistics');
    }
  },

  setFilters: (filters: UserFilters) => {
    set({ filters, pagination: { ...get().pagination, page: 1 } });
    get().fetchUsers();
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
    get().fetchUsers();
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  clearSelectedUser: () => {
    set({ selectedUser: null });
  },
}));
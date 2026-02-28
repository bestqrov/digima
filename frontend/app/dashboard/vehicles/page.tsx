'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TruckIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import Topbar from '@/components/Topbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import { useVehicleStore, useAuthStore } from '@/store';
import { Vehicle, VehicleFilters } from '@/types';
import { formatDate, getStatusColor, cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

const VEHICLE_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'bus', label: 'Bus' },
  { value: 'van', label: 'Van' },
  { value: 'car', label: 'Car' },
  { value: 'boat', label: 'Boat' },
];

const VEHICLE_STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'inactive', label: 'Inactive' },
];

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onView: (vehicle: Vehicle) => void;
  onStatusChange: (vehicle: Vehicle, status: string) => void;
}

const VehicleCard = ({ vehicle, onEdit, onDelete, onView, onStatusChange }: VehicleCardProps) => {
  const handleStatusChange = async (status: 'active' | 'maintenance' | 'inactive') => {
    try {
      onStatusChange(vehicle, status);
    } catch (error) {
      // Error handled by parent
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <TruckIcon className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{vehicle.plateNumber}</h3>
            <p className="text-sm text-gray-500">
              {vehicle.brand} {vehicle.model} ({vehicle.year})
            </p>
          </div>
        </div>
        
        <Menu as="div" className="relative">
          <Menu.Button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => onView(vehicle)}
                  className={cn(
                    active ? 'bg-gray-50' : '',
                    'flex w-full items-center px-4 py-2 text-sm text-gray-700'
                  )}
                >
                  <EyeIcon className="mr-3 h-4 w-4" />
                  View Details
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => onEdit(vehicle)}
                  className={cn(
                    active ? 'bg-gray-50' : '',
                    'flex w-full items-center px-4 py-2 text-sm text-gray-700'
                  )}
                >
                  <PencilIcon className="mr-3 h-4 w-4" />
                  Edit Vehicle
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => handleStatusChange(
                    vehicle.status === 'active' ? 'maintenance' : 'active'
                  )}
                  className={cn(
                    active ? 'bg-gray-50' : '',
                    'flex w-full items-center px-4 py-2 text-sm text-gray-700'
                  )}
                >
                  {vehicle.status === 'active' ? 'Set Maintenance' : 'Set Active'}
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => onDelete(vehicle)}
                  className={cn(
                    active ? 'bg-gray-50' : '',
                    'flex w-full items-center px-4 py-2 text-sm text-red-600'
                  )}
                >
                  <TrashIcon className="mr-3 h-4 w-4" />
                  Delete Vehicle
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Type:</span>
          <span className="text-sm font-medium text-gray-900 capitalize">{vehicle.type}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Capacity:</span>
          <span className="text-sm font-medium text-gray-900">
            {vehicle.capacity.passengers} passengers
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Status:</span>
          <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            getStatusColor(vehicle.status)
          )}>
            {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
          </span>
        </div>
        
        {vehicle.driver && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Driver:</span>
            <span className="text-sm font-medium text-gray-900">{vehicle.driver.name}</span>
          </div>
        )}
        
        <div className="pt-3 border-t border-gray-200">
          <span className="text-xs text-gray-500">
            Added {formatDate(vehicle.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function VehiclesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const 
    vehicles,
    pagination,
    filters,
    isLoading,
    fetchVehicles,
    setFilters,
    setPagination,
    updateVehicleStatus,
    deleteVehicle,
  } = useVehicleStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ ...filters, search: query });
  };

  const handleFilterChange = (key: keyof VehicleFilters, value: string) => {
    setFilters({ ...filters, [key]: value || undefined });
  };

  const handleStatusChange = async (vehicle: Vehicle, status: string) => {
    try {
      await updateVehicleStatus(vehicle._id, status as any);
    } catch (error) {
      // Error handled by store
    }
  };

  const handleDelete = async (vehicle: Vehicle) => {
    if (window.confirm(
      `Are you sure you want to delete vehicle ${vehicle.plateNumber}? This action cannot be undone.`
    )) {
      try {
        await deleteVehicle(vehicle._id);
      } catch (error) {
        // Error handled by store
      }
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    router.push(`/dashboard/vehicles/${vehicle._id}/edit`);
  };

  const handleView = (vehicle: Vehicle) => {
    router.push(`/dashboard/vehicles/${vehicle._id}`);
  };

  const handlePageChange = (page: number) => {
    setPagination(page);
  };

  if (isLoading && vehicles.length === 0) {
    return (
      <div className="min-h-screen">
        <Topbar title="Vehicles" subtitle="Manage your fleet of vehicles" />
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Topbar title="Vehicles" subtitle="Manage your fleet of vehicles and drivers" />
      
      <div className="p-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64"
              />
            </div>
            
            {/* Filters */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="btn-secondary flex items-center"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
          
          <button
            onClick={() => router.push('/dashboard/vehicles/new')}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Vehicle
          </button>
        </div>

        {/* Filters Panel */}
        {isFilterOpen && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="form-input"
                >
                  {VEHICLE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="form-input"
                >
                  {VEHICLE_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({})}
                  className="btn-secondary"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vehicles Grid */}
        {vehicles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle._id}
                  vehicle={vehicle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">
                        {(pagination.page - 1) * pagination.limit + 1}
                      </span>{' '}
                      to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span>{' '}
                      of <span className="font-medium">{pagination.total}</span> vehicles
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={cn(
                          'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md',
                          page === pagination.page
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        )}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No vehicles found"
            description="Get started by adding your first vehicle to the fleet."
            actionLabel="Add Vehicle"
            onAction={() => router.push('/dashboard/vehicles/new')}
            icon={TruckIcon}
          />
        )}
      </div>
    </div>
  );
}
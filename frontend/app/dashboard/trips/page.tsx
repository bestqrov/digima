'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  MapIcon,
  PencilIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import Topbar from '@/components/Topbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { useTripStore, useAuthStore } from '@/store';
import { Trip, TripFilters } from '@/types';
import { formatDate, formatCurrency, getStatusColor, cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

const TRIP_STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PAYMENT_STATUSES = [
  { value: '', label: 'All Payment Status' },
  { value: 'pending', label: 'Payment Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'refunded', label: 'Refunded' },
];

interface TripCardProps {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onView: (trip: Trip) => void;
  onStatusChange: (trip: Trip, status: string) => void;
  onPaymentStatusChange: (trip: Trip, paymentStatus: string) => void;
}

const TripCard = ({ trip, onEdit, onView, onStatusChange, onPaymentStatusChange }: TripCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
      case 'in_progress':
        return <CheckCircleIcon className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <MapIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon(trip.status)}
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {trip.customerInfo.name}
            </h3>
            <p className="text-sm text-gray-500">
              {trip.customerInfo.numberOfPassengers} passengers
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
                  onClick={() => onView(trip)}
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
                  onClick={() => onEdit(trip)}
                  className={cn(
                    active ? 'bg-gray-50' : '',
                    'flex w-full items-center px-4 py-2 text-sm text-gray-700'
                  )}
                >
                  <PencilIcon className="mr-3 h-4 w-4" />
                  Edit Trip
                </button>
              )}
            </Menu.Item>
            {trip.status === 'pending' && (
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => onStatusChange(trip, 'confirmed')}
                    className={cn(
                      active ? 'bg-gray-50' : '',
                      'flex w-full items-center px-4 py-2 text-sm text-green-600'
                    )}
                  >
                    <CheckCircleIcon className="mr-3 h-4 w-4" />
                    Confirm Trip
                  </button>
                )}
              </Menu.Item>
            )}
            {trip.status === 'confirmed' && (
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => onStatusChange(trip, 'in_progress')}
                    className={cn(
                      active ? 'bg-gray-50' : '',
                      'flex w-full items-center px-4 py-2 text-sm text-blue-600'
                    )}
                  >
                    Start Trip
                  </button>
                )}
              </Menu.Item>
            )}
            {trip.status === 'in_progress' && (
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => onStatusChange(trip, 'completed')}
                    className={cn(
                      active ? 'bg-gray-50' : '',
                      'flex w-full items-center px-4 py-2 text-sm text-green-600'
                    )}
                  >
                    Complete Trip
                  </button>
                )}
              </Menu.Item>
            )}
            {trip.paymentStatus === 'pending' && (
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => onPaymentStatusChange(trip, 'paid')}
                    className={cn(
                      active ? 'bg-gray-50' : '',
                      'flex w-full items-center px-4 py-2 text-sm text-green-600'
                    )}
                  >
                    <CurrencyDollarIcon className="mr-3 h-4 w-4" />
                    Mark Paid
                  </button>
                )}
              </Menu.Item>
            )}
            {(['pending', 'confirmed'].includes(trip.status)) && (
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => onStatusChange(trip, 'cancelled')}
                    className={cn(
                      active ? 'bg-gray-50' : '',
                      'flex w-full items-center px-4 py-2 text-sm text-red-600'
                    )}
                  >
                    <XCircleIcon className="mr-3 h-4 w-4" />
                    Cancel Trip
                  </button>
                )}
              </Menu.Item>
            )}
          </Menu.Items>
        </Menu>
      </div>
      
      <div className="space-y-3">
        {/* Route */}
        <div className="text-sm">
          <p className="font-medium text-gray-900">Route:</p>
          <p className="text-gray-600">
            {trip.itinerary.pickupLocation.address}
          </p>
          <p className="text-gray-400 text-xs">↓</p>
          <p className="text-gray-600">
            {trip.itinerary.dropoffLocation.address}
          </p>
        </div>
        
        {/* Time & Vehicle */}
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="text-gray-500">Pickup:</span>
            <span className="ml-2 font-medium text-gray-900">
              {new Date(trip.itinerary.pickupTime).toLocaleString()}
            </span>
          </div>
        </div>
        
        {trip.vehicleId && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Vehicle:</span>
            <span className="font-medium text-gray-900">
              {typeof trip.vehicleId === 'object' ? trip.vehicleId.plateNumber : 'Unknown'}
            </span>
          </div>
        )}
        
        {/* Status & Payment */}
        <div className="flex items-center justify-between">
          <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            getStatusColor(trip.status)
          )}>
            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1).replace('_', ' ')}
          </span>
          
          <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            getStatusColor(trip.paymentStatus)
          )}>
            {trip.paymentStatus.charAt(0).toUpperCase() + trip.paymentStatus.slice(1)}
          </span>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(trip.pricing.totalAmount)}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(trip.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function TripsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const {
    trips,
    pagination,
    filters,
    isLoading,
    fetchTrips,
    setFilters,
    setPagination,
    updateTripStatus,
    updatePaymentStatus,
  } = useTripStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ ...filters, search: query });
  };

  const handleFilterChange = (key: keyof TripFilters, value: string) => {
    setFilters({ ...filters, [key]: value || undefined });
  };

  const handleStatusChange = async (trip: Trip, status: string) => {
    try {
      await updateTripStatus(trip._id, status as any);
    } catch (error) {
      // Error handled by store
    }
  };

  const handlePaymentStatusChange = async (trip: Trip, paymentStatus: string) => {
    try {
      await updatePaymentStatus(trip._id, paymentStatus as any);
    } catch (error) {
      // Error handled by store
    }
  };

  const handleEdit = (trip: Trip) => {
    router.push(`/dashboard/trips/${trip._id}/edit`);
  };

  const handleView = (trip: Trip) => {
    router.push(`/dashboard/trips/${trip._id}`);
  };

  const handlePageChange = (page: number) => {
    setPagination(page);
  };

  if (isLoading && trips.length === 0) {
    return (
      <div className="min-h-screen">
        <Topbar title="Trips" subtitle="Manage your transportation bookings" />
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
      <Topbar title="Trips" subtitle="Manage your transportation bookings and schedules" />
      
      <div className="p-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search trips..."
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
            onClick={() => router.push('/dashboard/trips/new')}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Trip
          </button>
        </div>

        {/* Filters Panel */}
        {isFilterOpen && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="form-input"
                >
                  {TRIP_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select
                  value={filters.paymentStatus || ''}
                  onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                  className="form-input"
                >
                  {PAYMENT_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <input
                  type="date"
                  value={filters.dateRange?.start || ''}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value ? 
                    JSON.stringify({ start: e.target.value, end: filters.dateRange?.end || '' }) : ''
                  )}
                  className="form-input"
                  placeholder="Start date"
                />
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

        {/* Trips Grid */}
        {trips.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {trips.map((trip) => (
                <TripCard
                  key={trip._id}
                  trip={trip}
                  onEdit={handleEdit}
                  onView={handleView}
                  onStatusChange={handleStatusChange}
                  onPaymentStatusChange={handlePaymentStatusChange}
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
                      of <span className="font-medium">{pagination.total}</span> trips
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
            title="No trips found"
            description="Start by creating your first trip booking."
            actionLabel="New Trip"
            onAction={() => router.push('/dashboard/trips/new')}
            icon={MapIcon}
          />
        )}
      </div>
    </div>
  );
}
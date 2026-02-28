'use client';

import { useEffect, useState } from 'react';
import { 
  TruckIcon, 
  MapIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Topbar from '@/components/Topbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuthStore, useSubscriptionStore } from '@/store';
import { vehicleService, tripService, userService } from '@/services';
import { formatCurrency, formatDate } from '@/lib/utils';

interface DashboardStats {
  totalVehicles: number;
  activeTrips: number;
  totalUsers: number;
  monthlyRevenue: number;
  recentTrips: any[];
  vehicleUtilization: number;
}

const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
  <div className="bg-white rounded-lg shadow-soft p-6 border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change}% from last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const { subscription } = useSubscriptionStore();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch stats in parallel
        const [vehicleStats, tripStats, userStats] = await Promise.all([
          vehicleService.getVehicleStats().catch(() => ({ data: {} })),
          tripService.getTripStats('month').catch(() => ({ data: {} })),
          userService.getUserStats().catch(() => ({ data: {} })),
        ]);

        // Fetch recent trips
        const recentTripsResponse = await tripService.getTrips({ 
          limit: 5, 
          sort: 'createdAt', 
          order: 'desc' 
        }).catch(() => ({ data: [] }));

        setStats({
          totalVehicles: vehicleStats.data?.total || 0,
          activeTrips: tripStats.data?.activeTrips || 0,
          totalUsers: userStats.data?.total || 0,
          monthlyRevenue: tripStats.data?.monthlyRevenue || 0,
          recentTrips: recentTripsResponse.data || [],
          vehicleUtilization: vehicleStats.data?.utilization || 0,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Topbar title="Dashboard" subtitle="Welcome back to your transport management center" />
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
      <Topbar 
        title="Dashboard" 
        subtitle={`Welcome back, ${user?.fullName || 'User'}! Here's what's happening with your transport service.`} 
      />
      
      <div className="p-6">
        {/* Subscription Status Alert */}
        {subscription && subscription.status !== 'active' && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ClockIcon className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Subscription Status: {subscription.status.replace('_', ' ').toUpperCase()}
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  {subscription.status === 'pending_payment' && 
                    'Please complete your payment to activate your subscription.'
                  }
                  {subscription.status === 'pending_approval' && 
                    'Your payment is being reviewed. You\'ll be notified once approved.'
                  }
                  {subscription.status === 'expired' && 
                    'Your subscription has expired. Please renew to continue using the service.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Vehicles"
            value={stats?.totalVehicles || 0}
            icon={TruckIcon}
            color="bg-blue-500"
            change={12}
          />
          <StatCard
            title="Active Trips"
            value={stats?.activeTrips || 0}
            icon={MapIcon}
            color="bg-green-500"
            change={8}
          />
          <StatCard
            title="Team Members"
            value={stats?.totalUsers || 0}
            icon={UsersIcon}
            color="bg-purple-500"
            change={-2}
          />
          <StatCard
            title="Monthly Revenue"
            value={formatCurrency(stats?.monthlyRevenue || 0)}
            icon={CurrencyDollarIcon}
            color="bg-emerald-500"
            change={15}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Trips */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-soft border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Trips</h3>
            </div>
            <div className="p-6">
              {stats?.recentTrips && stats.recentTrips.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentTrips.map((trip: any) => (
                    <div key={trip._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {trip.customerInfo?.name || 'Unknown Customer'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {trip.itinerary?.pickupLocation?.address} → {trip.itinerary?.dropoffLocation?.address}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(trip.pricing?.totalAmount || 0)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(trip.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No trips yet</p>
                  <p className="text-sm text-gray-400">Start by adding your first trip</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-soft border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <TruckIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium">Add New Vehicle</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <MapIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium">Create Trip</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium">Invite User</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <ChartBarIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium">View Reports</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import {
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  MapIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/LoadingSpinner';

interface SystemStatus {
  name: string;
  description: string;
  version: string;
  status: string;
  timestamp: string;
  endpoints: Record<string, string>;
  links: Record<string, string>;
}

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    name: "ArwaPark SaaS API",
    description: "Multi-tenant SaaS for tourist transport agencies",
    version: "1.0.0",
    status: "online",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      api_documentation: "/api/docs",
      api_base: "/api/v1",
      authentication: "/api/v1/auth",
      agencies: "/api/v1/agencies",
      users: "/api/v1/users",
      vehicles: "/api/v1/vehicles",
      trips: "/api/v1/trips"
    },
    links: {
      documentation: "https://arwapark.digima.cloud/api/docs",
      health_check: "https://arwapark.digima.cloud/health"
    }
  });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600">Loading ArwaPark...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg">
                <TruckIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            
            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ArwaPark
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Multi-tenant SaaS for tourist transport agencies
            </p>
            
            {/* System Status */}
            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full mb-8">
              <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                System {systemStatus.status} • v{systemStatus.version}
              </span>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={() => router.push('/login')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105"
              >
                Sign In to Dashboard
              </button>
              <a
                href={systemStatus.links.documentation}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg shadow-lg hover:bg-gray-50 transition-all border border-gray-200"
              >
                View API Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UserGroupIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi-Tenant</h3>
            <p className="text-gray-600">Manage multiple transport agencies with isolated data and custom settings.</p>
          </div>
          
          {/* Feature 2 */}
          <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MapIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Trip Management</h3>
            <p className="text-gray-600">Plan, schedule, and track tourist trips with real-time updates.</p>
          </div>
          
          {/* Feature 3 */}
          <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ChartBarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600">Comprehensive reports and insights for better business decisions.</p>
          </div>
        </div>
      </div>
      
      {/* System Info */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">System Status</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">API Endpoints:</h4>
              <div className="space-y-2 text-sm">
                {Object.entries(systemStatus.endpoints).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-1">
                    <span className="text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                    <code className="text-blue-600 bg-blue-50 px-2 py-1 rounded">{value}</code>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Quick Links:</h4>
              <div className="space-y-3">
                <a
                  href={systemStatus.links.health_check}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Health Check
                </a>
                <a
                  href={systemStatus.links.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ChartBarIcon className="w-4 h-4 mr-2" />
                  API Documentation
                </a>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <ClockIcon className="w-4 h-4 mr-2" />
                Last updated: {new Date(systemStatus.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">© 2026 ArwaPark SaaS. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2">Powering tourist transport management worldwide</p>
        </div>
      </footer>
    </div>
  );
}
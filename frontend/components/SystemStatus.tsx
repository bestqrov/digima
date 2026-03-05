'use client';

import { useState, useEffect } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface SystemStatusProps {
  className?: string;
  showDetails?: boolean;
}

interface ApiStatus {
  status: 'online' | 'offline' | 'maintenance';
  version: string;
  timestamp: string;
  responseTime?: number;
}

export default function SystemStatus({ className = '', showDetails = false }: SystemStatusProps) {
  const [status, setStatus] = useState<ApiStatus>({
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    responseTime: 0
  });
  const [loading, setLoading] = useState(false);

  const checkSystemStatus = async () => {
    setLoading(true);
    const startTime = performance.now();
    
    try {
      // In a real app, you'd fetch from your health endpoint
      // For now, we'll simulate the API response you provided
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
      
      const responseTime = performance.now() - startTime;
      
      setStatus({
        status: 'online',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        responseTime: Math.round(responseTime)
      });
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        status: 'offline',
        timestamp: new Date().toISOString()
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSystemStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkSystemStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (status.status) {
      case 'online':
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
      case 'maintenance':
        return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />;
      case 'offline':
      default:
        return <XCircleIcon className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'online':
        return 'bg-green-50 border-green-200';
      case 'maintenance':
        return 'bg-yellow-50 border-yellow-200';
      case 'offline':
      default:
        return 'bg-red-50 border-red-200';
    }
  };

  const getStatusText = () => {
    switch (status.status) {
      case 'online':
        return 'System Online';
      case 'maintenance':
        return 'Maintenance Mode';
      case 'offline':
      default:
        return 'System Offline';
    }
  };

  const getTextColor = () => {
    switch (status.status) {
      case 'online':
        return 'text-green-800';
      case 'maintenance':
        return 'text-yellow-800';
      case 'offline':
      default:
        return 'text-red-800';
    }
  };

  if (!showDetails) {
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getStatusColor()} ${className}`}>
        {getStatusIcon()}
        <span className={`ml-2 text-sm font-medium ${getTextColor()}`}>
          {getStatusText()}
          {status.status === 'online' && ` • v${status.version}`}
        </span>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border ${getStatusColor()} p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {getStatusIcon()}
          <span className={`ml-2 font-medium ${getTextColor()}`}>
            {getStatusText()}
          </span>
        </div>
        <button
          onClick={checkSystemStatus}
          disabled={loading}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Refresh'}
        </button>
      </div>
      
      {showDetails && (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Version:</span>
            <span className="font-mono text-gray-800">v{status.version}</span>
          </div>
          
          {status.responseTime && (
            <div className="flex justify-between">
              <span className="text-gray-600">Response Time:</span>
              <span className="font-mono text-gray-800">{status.responseTime}ms</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-600">Last Check:</span>
            <span className="font-mono text-gray-800">
              {new Date(status.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
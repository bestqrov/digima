'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { useAuthStore, useSubscriptionStore } from '@/store';
import { toast } from 'react-hot-toast';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, initialize } = useAuthStore();
  const { subscription, fetchCurrentSubscription } = useSubscriptionStore();

  useEffect(() => {
    initialize();
    fetchCurrentSubscription();
  }, [initialize, fetchCurrentSubscription]);

  // Check subscription status and redirect if needed
  useEffect(() => {
    if (subscription) {
      const { status } = subscription;
      
      // Allow access to subscription page for all statuses
      if (window.location.pathname.includes('/dashboard/subscription')) {
        return;
      }
      
      // Block access to other dashboard pages if subscription is not active
      if (status !== 'active') {
        toast.error('Your subscription is not active. Please update your subscription.');
        router.push('/dashboard/subscription');
      }
    }
  }, [subscription, router]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="lg:pl-64">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { 
  CheckIcon, 
  CreditCardIcon, 
  DocumentIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import Topbar from '@/components/Topbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useSubscriptionStore } from '@/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'react-hot-toast';

const PlanCard = ({ plan, isCurrentPlan, onSelect, isLoading }: any) => (
  <div className={`rounded-lg border-2 p-6 ${
    isCurrentPlan 
      ? 'border-primary-500 bg-primary-50' 
      : 'border-gray-200 bg-white hover:border-gray-300'
  } transition-colors`}>
    <div className="text-center">
      <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
      <p className="mt-2 text-3xl font-bold text-gray-900">
        {formatCurrency(plan.monthlyPrice)}
        <span className="text-base font-normal text-gray-500">/month</span>
      </p>
    </div>
    
    <ul className="mt-6 space-y-3">
      <li className="flex items-center">
        <CheckIcon className="h-4 w-4 text-green-500 mr-3" />
        <span className="text-sm">{plan.features.maxUsers} users</span>
      </li>
      <li className="flex items-center">
        <CheckIcon className="h-4 w-4 text-green-500 mr-3" />
        <span className="text-sm">{plan.features.maxVehicles} vehicles</span>
      </li>
      <li className="flex items-center">
        <CheckIcon className="h-4 w-4 text-green-500 mr-3" />
        <span className="text-sm">{plan.features.maxTripsPerMonth} trips/month</span>
      </li>
      {plan.features.hasReporting && (
        <li className="flex items-center">
          <CheckIcon className="h-4 w-4 text-green-500 mr-3" />
          <span className="text-sm">Advanced reporting</span>
        </li>
      )}
      {plan.features.hasApi && (
        <li className="flex items-center">
          <CheckIcon className="h-4 w-4 text-green-500 mr-3" />
          <span className="text-sm">API access</span>
        </li>
      )}
      <li className="flex items-center">
        <CheckIcon className="h-4 w-4 text-green-500 mr-3" />
        <span className="text-sm capitalize">{plan.features.priority} priority support</span>
      </li>
    </ul>
    
    <button
      onClick={() => onSelect(plan._id)}
      disabled={isCurrentPlan || isLoading}
      className={`mt-6 w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
        isCurrentPlan
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50'
      }`}
    >
      {isLoading ? <LoadingSpinner size="sm" /> : null}
      {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
    </button>
  </div>
);

const PaymentProofUpload = ({ subscription, onUpload }: any) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        toast.error('Please upload an image or PDF file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      setIsUploading(true);
      await onUpload(subscription._id, selectedFile);
      setSelectedFile(null);
      // Reset the file input
      const fileInput = document.getElementById('payment-proof') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      // Error handled by store
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Payment Proof</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="payment-proof" className="block text-sm font-medium text-gray-700 mb-2">
            Select payment proof (Image or PDF, max 5MB)
          </label>
          <input
            type="file"
            id="payment-proof"
            accept="image/*,.pdf"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
        </div>
        
        {selectedFile && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div className="flex items-center">
              <DocumentIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-700">{selectedFile.name}</span>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        )}
        
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="btn-primary disabled:opacity-50"
        >
          {isUploading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
          {isUploading ? 'Uploading...' : 'Upload Payment Proof'}
        </button>
      </div>
    </div>
  );
};

export default function SubscriptionPage() {
  const {
    subscription,
    plans,
    usage,
    isLoading,
    fetchCurrentSubscription,
    fetchPlans,
    fetchUsage,
    requestSubscription,
    uploadPaymentProof,
    renewSubscription,
  } = useSubscriptionStore();

  useEffect(() => {
    fetchCurrentSubscription();
    fetchPlans();
    fetchUsage();
  }, [fetchCurrentSubscription, fetchPlans, fetchUsage]);

  const handlePlanSelect = async (planId: string) => {
    try {
      if (subscription && subscription.status === 'expired') {
        await renewSubscription(subscription._id, planId);
      } else {
        await requestSubscription(planId);
      }
    } catch (error) {
      // Error handled by store
    }
  };

  const handlePaymentProofUpload = async (subscriptionId: string, file: File) => {
    await uploadPaymentProof(subscriptionId, file);
  };

  const renderSubscriptionStatus = () => {
    if (!subscription) {
      return (
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
          <p className="text-gray-600">Choose a plan below to get started with ArwaPark.</p>
        </div>
      );
    }

    const { status } = subscription;

    switch (status) {
      case 'active':
        return (
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Subscription Active</h3>
            <p className="text-gray-600">
              Your subscription is active until {formatDate(subscription.endDate || '')}
            </p>
          </div>
        );
      
      case 'pending_payment':
        return (
          <div className="text-center">
            <CreditCardIcon className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Required</h3>
            <p className="text-gray-600 mb-6">
              Please complete your payment to activate your subscription.
            </p>
            {subscription.bankTransferInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <h4 className="font-medium text-blue-900 mb-2">Bank Transfer Details:</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Bank:</strong> {subscription.bankTransferInfo.bankName}</p>
                  <p><strong>Account Number:</strong> {subscription.bankTransferInfo.accountNumber}</p>
                  <p><strong>Account Name:</strong> {subscription.bankTransferInfo.accountName}</p>
                  <p><strong>Amount:</strong> {formatCurrency(subscription.bankTransferInfo.amount)}</p>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'pending_approval':
        return (
          <div className="text-center">
            <ClockIcon className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Under Review</h3>
            <p className="text-gray-600">
              Your payment proof has been submitted and is being reviewed. You'll be notified once approved.
            </p>
            {subscription.paymentProof && (
              <p className="text-sm text-gray-500 mt-2">
                Uploaded: {formatDate(subscription.paymentProof.uploadDate)}
              </p>
            )}
          </div>
        );
      
      case 'expired':
        return (
          <div className="text-center">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Subscription Expired</h3>
            <p className="text-gray-600">
              Your subscription expired on {formatDate(subscription.endDate || '')}. Renew to continue.
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (isLoading && !subscription && plans.length === 0) {
    return (
      <div className="min-h-screen">
        <Topbar title="Subscription" subtitle="Manage your ArwaPark subscription" />
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
      <Topbar title="Subscription" subtitle="Manage your ArwaPark subscription and billing" />
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* Current Subscription Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          {renderSubscriptionStatus()}
        </div>

        {/* Usage Statistics */}
        {usage && subscription?.status === 'active' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Usage</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {usage.currentUsers} / {subscription.planId.features.maxUsers}
                </p>
                <p className="text-sm text-gray-600">Users</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {usage.currentVehicles} / {subscription.planId.features.maxVehicles}
                </p>
                <p className="text-sm text-gray-600">Vehicles</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {usage.currentMonthTrips} / {subscription.planId.features.maxTripsPerMonth}
                </p>
                <p className="text-sm text-gray-600">Trips This Month</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Upload Section */}
        {subscription?.status === 'pending_payment' && (
          <div className="mb-8">
            <PaymentProofUpload 
              subscription={subscription} 
              onUpload={handlePaymentProofUpload} 
            />
          </div>
        )}

        {/* Available Plans */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
            <p className="text-gray-600">Select the plan that best fits your transport business needs</p>
          </div>

          {plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <PlanCard
                  key={plan._id}
                  plan={plan}
                  isCurrentPlan={subscription?.planId?._id === plan._id}
                  onSelect={handlePlanSelect}
                  isLoading={isLoading}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No plans available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
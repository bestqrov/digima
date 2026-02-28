export interface SubscriptionPlan {
  _id: string;
  name: string;
  monthlyPrice: number;
  features: {
    maxUsers: number;
    maxVehicles: number;
    maxTripsPerMonth: number;
    hasReporting: boolean;
    hasApi: boolean;
    priority: 'low' | 'medium' | 'high';
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  _id: string;
  agencyId: string;
  planId: SubscriptionPlan;
  status: 'pending_payment' | 'pending_approval' | 'active' | 'expired';
  startDate?: string;
  endDate?: string;
  paymentProof?: {
    filename: string;
    uploadDate: string;
    verified: boolean;
  };
  bankTransferInfo?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    amount: number;
  };
  usage: {
    currentUsers: number;
    currentVehicles: number;
    currentMonthTrips: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionRequest {
  planId: string;
  agencyId: string;
}

export interface PaymentProofUpload {
  subscriptionId: string;
  paymentProof: File;
}
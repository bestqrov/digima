export interface Agency {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
  };
  businessLicense?: string;
  isActive: boolean;
  subscriptionStatus: 'pending_payment' | 'pending_approval' | 'active' | 'expired';
  settings: {
    currency: string;
    timezone: string;
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgencyData {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
  };
  businessLicense?: string;
}

export interface UpdateAgencyData extends Partial<CreateAgencyData> {
  settings?: {
    currency?: string;
    timezone?: string;
    language?: string;
    notifications?: {
      email?: boolean;
      sms?: boolean;
    };
  };
}
export interface Trip {
  _id: string;
  agencyId: string;
  vehicleId: Vehicle;
  driverId?: User;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    numberOfPassengers: number;
  };
  itinerary: {
    pickupLocation: {
      address: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
    dropoffLocation: {
      address: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
    pickupTime: string;
    estimatedDuration: number;
    distance?: number;
  };
  pricing: {
    basePrice: number;
    additionalCharges?: {
      name: string;
      amount: number;
    }[];
    totalAmount: number;
    currency: string;
  };
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  specialRequests?: string;
  notes?: string;
  rating?: {
    score: number;
    comment?: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripData {
  vehicleId: string;
  driverId?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    numberOfPassengers: number;
  };
  itinerary: {
    pickupLocation: {
      address: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
    dropoffLocation: {
      address: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
    pickupTime: string;
    estimatedDuration: number;
  };
  pricing: {
    basePrice: number;
    additionalCharges?: {
      name: string;
      amount: number;
    }[];
  };
  specialRequests?: string;
}

export interface UpdateTripData extends Partial<CreateTripData> {
  status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  notes?: string;
}

export interface TripFilters {
  status?: string;
  paymentStatus?: string;
  vehicleId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}
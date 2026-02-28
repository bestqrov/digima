export interface Vehicle {
  _id: string;
  agencyId: string;
  plateNumber: string;
  type: 'bus' | 'van' | 'car' | 'boat';
  brand: string;
  model: string;
  year: number;
  capacity: {
    passengers: number;
    luggage?: number;
  };
  features: string[];
  status: 'active' | 'maintenance' | 'inactive';
  driver?: {
    name: string;
    phone: string;
    licenseNumber: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
  maintenance: {
    lastService: string;
    nextService: string;
    mileage: number;
  };
  images?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleData {
  plateNumber: string;
  type: 'bus' | 'van' | 'car' | 'boat';
  brand: string;
  model: string;
  year: number;
  capacity: {
    passengers: number;
    luggage?: number;
  };
  features?: string[];
  driver?: {
    name: string;
    phone: string;
    licenseNumber: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
  maintenance?: {
    lastService: string;
    nextService: string;
    mileage: number;
  };
}

export interface UpdateVehicleData extends Partial<CreateVehicleData> {
  status?: 'active' | 'maintenance' | 'inactive';
}

export interface VehicleFilters {
  type?: string;
  status?: string;
  search?: string;
}
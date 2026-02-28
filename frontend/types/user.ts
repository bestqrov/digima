export interface CreateUserData {
  fullName: string;
  email: string;
  password: string;
  role: 'agency_admin' | 'agency_user';
  agencyId?: string;
}

export interface UpdateUserData {
  fullName?: string;
  email?: string;
  role?: 'agency_admin' | 'agency_user';
  isActive?: boolean;
}

export interface UserFilters {
  role?: string;
  agencyId?: string;
  isActive?: boolean;
  search?: string;
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UsersIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  KeyIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import Topbar from '@/components/Topbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { useUserStore, useAuthStore } from '@/store';
import { User, UserFilters } from '@/types';
import { formatDate, getStatusColor, cn, getInitials } from '@/lib/utils';
import { toast } from 'react-hot-toast';

const USER_ROLES = [
  { value: '', label: 'All Roles' },
  { value: 'agency_admin', label: 'Agency Admin' },
  { value: 'agency_user', label: 'Agency User' },
];

const USER_STATUS = [
  { value: '', label: 'All Status' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

interface UserCardProps {
  user: User;
  currentUser: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onView: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onResetPassword: (user: User) => void;
  onInvite?: () => void;
}

const UserCard = ({ 
  user, 
  currentUser, 
  onEdit, 
  onDelete, 
  onView, 
  onToggleStatus, 
  onResetPassword 
}: UserCardProps) => {
  const isCurrentUser = user._id === currentUser._id;
  const canManage = currentUser.role === 'super_admin' || 
    (currentUser.role === 'agency_admin' && user.role !== 'super_admin');

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <ShieldCheckIcon className="w-5 h-5 text-purple-500" />;
      case 'agency_admin':
        return <ShieldExclamationIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <UsersIcon className="w-5 h-5 text-green-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'text-purple-600 bg-purple-100';
      case 'agency_admin':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-green-600 bg-green-100';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {getInitials(user.fullName)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{user.fullName}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        
        {canManage && (
          <Menu as="div" className="relative">
            <Menu.Button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => onView(user)}
                    className={cn(
                      active ? 'bg-gray-50' : '',
                      'flex w-full items-center px-4 py-2 text-sm text-gray-700'
                    )}
                  >
                    <EyeIcon className="mr-3 h-4 w-4" />
                    View Details
                  </button>
                )}
              </Menu.Item>
              {!isCurrentUser && (
                <>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onEdit(user)}
                        className={cn(
                          active ? 'bg-gray-50' : '',
                          'flex w-full items-center px-4 py-2 text-sm text-gray-700'
                        )}
                      >
                        <PencilIcon className="mr-3 h-4 w-4" />
                        Edit User
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onToggleStatus(user)}
                        className={cn(
                          active ? 'bg-gray-50' : '',
                          'flex w-full items-center px-4 py-2 text-sm',
                          user.isActive ? 'text-red-600' : 'text-green-600'
                        )}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'} User
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onResetPassword(user)}
                        className={cn(
                          active ? 'bg-gray-50' : '',
                          'flex w-full items-center px-4 py-2 text-sm text-gray-700'
                        )}
                      >
                        <KeyIcon className="mr-3 h-4 w-4" />
                        Reset Password
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onDelete(user)}
                        className={cn(
                          active ? 'bg-gray-50' : '',
                          'flex w-full items-center px-4 py-2 text-sm text-red-600'
                        )}
                      >
                        <TrashIcon className="mr-3 h-4 w-4" />
                        Delete User
                      </button>
                    )}
                  </Menu.Item>
                </>
              )}
            </Menu.Items>
          </Menu>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getRoleIcon(user.role)}
            <span className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              getRoleColor(user.role)
            )}>
              {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
          
          <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            user.isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
          )}>
            {user.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        {user.agencyId && (
          <div className="text-sm text-gray-500">
            Agency: {typeof user.agencyId === 'object' ? user.agencyId.name : 'Unknown'}
          </div>
        )}
        
        <div className="pt-3 border-t border-gray-200">
          <span className="text-xs text-gray-500">
            Joined {formatDate(user.createdAt)}
          </span>
          {isCurrentUser && (
            <span className="ml-2 text-xs font-medium text-primary-600">(You)</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function UsersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const {
    users,
    pagination,
    filters,
    isLoading,
    fetchUsers,
    setFilters,
    setPagination,
    toggleUserStatus,
    deleteUser,
    resetPassword,
    inviteUser,
  } = useUserStore();
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ ...filters, search: query });
  };

  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    const processedValue = key === 'isActive' ? 
      (value === 'true' ? true : value === 'false' ? false : undefined) : 
      (value || undefined);
    setFilters({ ...filters, [key]: processedValue });
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await toggleUserStatus(user._id, !user.isActive);
    } catch (error) {
      // Error handled by store
    }
  };

  const handleDelete = async (user: User) => {
    if (window.confirm(
      `Are you sure you want to delete ${user.fullName}? This action cannot be undone.`
    )) {
      try {
        await deleteUser(user._id);
      } catch (error) {
        // Error handled by store
      }
    }
  };

  const handleResetPassword = async (user: User) => {
    if (window.confirm(
      `Are you sure you want to reset the password for ${user.fullName}? A temporary password will be generated.`
    )) {
      try {
        const tempPassword = await resetPassword(user._id);
        toast.success(`Password reset! Temporary password: ${tempPassword}`, {
          duration: 10000,
        });
      } catch (error) {
        // Error handled by store
      }
    }
  };

  const handleEdit = (user: User) => {
    router.push(`/dashboard/users/${user._id}/edit`);
  };

  const handleView = (user: User) => {
    router.push(`/dashboard/users/${user._id}`);
  };

  const handlePageChange = (page: number) => {
    setPagination(page);
  };

  const canManageUsers = currentUser?.role === 'super_admin' || currentUser?.role === 'agency_admin';

  if (isLoading && users.length === 0) {
    return (
      <div className="min-h-screen">
        <Topbar title="Users" subtitle="Manage your team members" />
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
      <Topbar title="Users" subtitle="Manage your team members and their permissions" />
      
      <div className="p-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64"
              />
            </div>
            
            {/* Filters */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="btn-secondary flex items-center"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
          
          {canManageUsers && (
            <div className="flex space-x-3">
              <button
                onClick={() => setShowInviteModal(true)}
                className="btn-secondary flex items-center"
              >
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                Invite User
              </button>
              
              <button
                onClick={() => router.push('/dashboard/users/new')}
                className="btn-primary flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add User
              </button>
            </div>
          )}
        </div>

        {/* Filters Panel */}
        {isFilterOpen && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={filters.role || ''}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="form-input"
                >
                  {USER_ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.isActive === true ? 'true' : filters.isActive === false ? 'false' : ''}
                  onChange={(e) => handleFilterChange('isActive', e.target.value)}
                  className="form-input"
                >
                  {USER_STATUS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({})}
                  className="btn-secondary"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Grid */}
        {users.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {users.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  currentUser={currentUser!}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                  onToggleStatus={handleToggleStatus}
                  onResetPassword={handleResetPassword}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">
                        {(pagination.page - 1) * pagination.limit + 1}
                      </span>{' '}
                      to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span>{' '}
                      of <span className="font-medium">{pagination.total}</span> users
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={cn(
                          'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md',
                          page === pagination.page
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        )}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No users found"
            description="Get started by adding your first team member."
            actionLabel={canManageUsers ? "Add User" : undefined}
            onAction={canManageUsers ? () => router.push('/dashboard/users/new') : undefined}
            icon={UsersIcon}
          />
        )}

        {/* Invite User Modal */}
        {showInviteModal && (
          <InviteUserModal
            onClose={() => setShowInviteModal(false)}
            onInvite={async (email: string, role: 'agency_admin' | 'agency_user') => {
              try {
                await inviteUser({ email, role });
                setShowInviteModal(false);
              } catch (error) {
                // Error handled by store
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

// Simple Invite User Modal Component
const InviteUserModal = ({ onClose, onInvite }: {
  onClose: () => void;
  onInvite: (email: string, role: 'agency_admin' | 'agency_user') => Promise<void>;
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'agency_admin' | 'agency_user'>('agency_user');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      setIsSubmitting(true);
      await onInvite(email, role);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Invite User</h3>
          
          <div className="space-y-4">
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="user@example.com"
                required
              />
            </div>
            
            <div>
              <label className="form-label">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="form-input"
              >
                <option value="agency_user">Agency User</option>
                <option value="agency_admin">Agency Admin</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              {isSubmitting ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
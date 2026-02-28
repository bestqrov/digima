'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Topbar from '@/components/Topbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useUserStore, useAuthStore } from '@/store';
import { CreateUserData } from '@/types';
import { toast } from 'react-hot-toast';

const userSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['agency_admin', 'agency_user'], {
    errorMap: () => ({ message: 'Please select a valid role' })
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UserFormData = z.infer<typeof userSchema>;

export default function NewUserPage() {
  const router = useRouter();
  const { createUser, isLoading } = useUserStore();
  const { user: currentUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'agency_user',
    },
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      const userData: CreateUserData = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role,
        agencyId: currentUser?.agencyId, // Will be set by backend based on current user
      };

      await createUser(userData);
      toast.success('User created successfully!');
      router.push('/dashboard/users');
    } catch (error) {
      // Error handled by store
    }
  };

  // Check permissions
  const canCreateUsers = currentUser?.role === 'super_admin' || currentUser?.role === 'agency_admin';
  
  if (!canCreateUsers) {
    return (
      <div className="min-h-screen">
        <Topbar title="Access Denied" subtitle="You don't have permission to create users" />
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">You don't have permission to create new users.</p>
            <button
              onClick={() => router.back()}
              className="btn-primary"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Topbar title="Add New User" subtitle="Create a new team member account" />
      
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.back()}
              className="btn-secondary flex items-center mr-4"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      {...register('fullName')}
                      className="form-input"
                      placeholder="John Doe"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      {...register('email')}
                      className="form-input"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Security */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        className="form-input pr-10"
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Confirm Password *</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirmPassword')}
                        className="form-input pr-10"
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Role & Permissions */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Role & Permissions</h3>
                
                <div>
                  <label className="form-label">User Role *</label>
                  <select {...register('role')} className="form-input">
                    <option value="agency_user">Agency User</option>
                    <option value="agency_admin">Agency Admin</option>
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                  )}
                  
                  <div className="mt-2 text-sm text-gray-600">
                    <div className="space-y-2">
                      <div>
                        <strong>Agency User:</strong> Can view and manage vehicles, trips, and basic operations.
                      </div>
                      <div>
                        <strong>Agency Admin:</strong> Full access to manage users, settings, and all agency operations.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                  {isLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>

          {/* Help Text */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Security Note:</h4>
            <p className="text-sm text-blue-700">
              The user will receive an email with their login credentials. 
              They'll be prompted to change their password on first login for security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
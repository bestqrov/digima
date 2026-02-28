'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Topbar from '@/components/Topbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useVehicleStore } from '@/store';
import { CreateVehicleData } from '@/types';
import { toast } from 'react-hot-toast';

const vehicleSchema = z.object({
  plateNumber: z.string().min(1, 'Plate number is required'),
  type: z.enum(['bus', 'van', 'car', 'boat'], {
    errorMap: () => ({ message: 'Please select a vehicle type' })
  }),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900, 'Invalid year').max(new Date().getFullYear() + 1, 'Invalid year'),
  capacity: z.object({
    passengers: z.number().min(1, 'Passenger capacity must be at least 1'),
    luggage: z.number().optional(),
  }),
  features: z.array(z.string()).optional(),
  driver: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    licenseNumber: z.string().optional(),
  }).optional(),
  insurance: z.object({
    provider: z.string().min(1, 'Insurance provider is required'),
    policyNumber: z.string().min(1, 'Policy number is required'),
    expiryDate: z.string().min(1, 'Expiry date is required'),
  }),
  maintenance: z.object({
    lastService: z.string().optional(),
    nextService: z.string().min(1, 'Next service date is required'),
    mileage: z.number().min(0, 'Mileage cannot be negative'),
  }).optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

export default function NewVehiclePage() {
  const router = useRouter();
  const { createVehicle, isLoading } = useVehicleStore();
  const [hasDriver, setHasDriver] = useState(false);
  const [hasMaintenance, setHasMaintenance] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      type: 'van',
      capacity: {
        passengers: 1,
      },
      features: [],
      insurance: {
        provider: '',
        policyNumber: '',
        expiryDate: '',
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'features',
  });

  const onSubmit = async (data: VehicleFormData) => {
    try {
      const vehicleData: CreateVehicleData = {
        ...data,
        features: data.features?.filter(Boolean) || [],
        driver: hasDriver && data.driver?.name ? data.driver : undefined,
        maintenance: hasMaintenance ? data.maintenance : undefined,
      };

      await createVehicle(vehicleData);
      toast.success('Vehicle created successfully!');
      router.push('/dashboard/vehicles');
    } catch (error) {
      // Error handled by store
    }
  };

  return (
    <div className="min-h-screen">
      <Topbar title="Add New Vehicle" subtitle="Add a new vehicle to your fleet" />
      
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.back()}
              className="btn-secondary flex items-center mr-4"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Add New Vehicle</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Plate Number *</label>
                  <input
                    type="text"
                    {...register('plateNumber')}
                    className="form-input"
                    placeholder="e.g., ABC-123"
                  />
                  {errors.plateNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.plateNumber.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Vehicle Type *</label>
                  <select {...register('type')} className="form-input">
                    <option value="van">Van</option>
                    <option value="bus">Bus</option>
                    <option value="car">Car</option>
                    <option value="boat">Boat</option>
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Brand *</label>
                  <input
                    type="text"
                    {...register('brand')}
                    className="form-input"
                    placeholder="e.g., Toyota"
                  />
                  {errors.brand && (
                    <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Model *</label>
                  <input
                    type="text"
                    {...register('model')}
                    className="form-input"
                    placeholder="e.g., Hiace"
                  />
                  {errors.model && (
                    <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Year *</label>
                  <input
                    type="number"
                    {...register('year', { valueAsNumber: true })}
                    className="form-input"
                    placeholder="2023"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                  />
                  {errors.year && (
                    <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Capacity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Capacity</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Passenger Capacity *</label>
                  <input
                    type="number"
                    {...register('capacity.passengers', { valueAsNumber: true })}
                    className="form-input"
                    placeholder="8"
                    min="1"
                  />
                  {errors.capacity?.passengers && (
                    <p className="mt-1 text-sm text-red-600">{errors.capacity.passengers.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Luggage Capacity (optional)</label>
                  <input
                    type="number"
                    {...register('capacity.luggage', { valueAsNumber: true })}
                    className="form-input"
                    placeholder="10 bags"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Features</h3>
                <button
                  type="button"
                  onClick={() => append('')}
                  className="btn-secondary flex items-center text-sm"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Feature
                </button>
              </div>
              
              {fields.length > 0 ? (
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-3">
                      <input
                        type="text"
                        {...register(`features.${index}`)}
                        className="form-input flex-1"
                        placeholder="e.g., Air Conditioning, WiFi, GPS"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No features added yet. Click "Add Feature" to get started.</p>
              )}
            </div>

            {/* Driver Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Driver Information</h3>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hasDriver}
                    onChange={(e) => setHasDriver(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Assign driver</span>
                </label>
              </div>
              
              {hasDriver && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="form-label">Driver Name</label>
                    <input
                      type="text"
                      {...register('driver.name')}
                      className="form-input"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      {...register('driver.phone')}
                      className="form-input"
                      placeholder="+1234567890"
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">License Number</label>
                    <input
                      type="text"
                      {...register('driver.licenseNumber')}
                      className="form-input"
                      placeholder="DL123456"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Insurance Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Insurance Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="form-label">Insurance Provider *</label>
                  <input
                    type="text"
                    {...register('insurance.provider')}
                    className="form-input"
                    placeholder="ABC Insurance"
                  />
                  {errors.insurance?.provider && (
                    <p className="mt-1 text-sm text-red-600">{errors.insurance.provider.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Policy Number *</label>
                  <input
                    type="text"
                    {...register('insurance.policyNumber')}
                    className="form-input"
                    placeholder="POL123456"
                  />
                  {errors.insurance?.policyNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.insurance.policyNumber.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Expiry Date *</label>
                  <input
                    type="date"
                    {...register('insurance.expiryDate')}
                    className="form-input"
                  />
                  {errors.insurance?.expiryDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.insurance.expiryDate.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Maintenance Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Maintenance Information</h3>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hasMaintenance}
                    onChange={(e) => setHasMaintenance(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Add maintenance data</span>
                </label>
              </div>
              
              {hasMaintenance && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="form-label">Last Service Date</label>
                    <input
                      type="date"
                      {...register('maintenance.lastService')}
                      className="form-input"
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Next Service Date *</label>
                    <input
                      type="date"
                      {...register('maintenance.nextService')}
                      className="form-input"
                    />
                    {errors.maintenance?.nextService && (
                      <p className="mt-1 text-sm text-red-600">{errors.maintenance.nextService.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="form-label">Current Mileage</label>
                    <input
                      type="number"
                      {...register('maintenance.mileage', { valueAsNumber: true })}
                      className="form-input"
                      placeholder="50000"
                      min="0"
                    />
                    {errors.maintenance?.mileage && (
                      <p className="mt-1 text-sm text-red-600">{errors.maintenance.mileage.message}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-6">
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
                {isLoading ? 'Creating...' : 'Create Vehicle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
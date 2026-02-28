'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeftIcon, PlusIcon, TrashIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Topbar from '@/components/Topbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTripStore, useVehicleStore, useUserStore } from '@/store';
import { CreateTripData, Vehicle, User } from '@/types';
import { vehicleService, userService } from '@/services';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'react-hot-toast';

const tripSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle is required'),
  driverId: z.string().optional(),
  customerInfo: z.object({
    name: z.string().min(1, 'Customer name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    numberOfPassengers: z.number().min(1, 'Number of passengers must be at least 1'),
  }),
  itinerary: z.object({
    pickupLocation: z.object({
      address: z.string().min(1, 'Pickup location is required'),
      coordinates: z.object({
        lat: z.number().optional(),
        lng: z.number().optional(),
      }).optional(),
    }),
    dropoffLocation: z.object({
      address: z.string().min(1, 'Dropoff location is required'),
      coordinates: z.object({
        lat: z.number().optional(),
        lng: z.number().optional(),
      }).optional(),
    }),
    pickupTime: z.string().min(1, 'Pickup time is required'),
    estimatedDuration: z.number().min(1, 'Estimated duration is required'),
  }),
  pricing: z.object({
    basePrice: z.number().min(0, 'Base price cannot be negative'),
    additionalCharges: z.array(z.object({
      name: z.string().min(1, 'Charge name is required'),
      amount: z.number().min(0, 'Amount cannot be negative'),
    })).optional(),
  }),
  specialRequests: z.string().optional(),
});

type TripFormData = z.infer<typeof tripSchema>;

export default function NewTripPage() {
  const router = useRouter();
  const { createTrip, isLoading } = useTripStore();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      customerInfo: {
        numberOfPassengers: 1,
      },
      pricing: {
        basePrice: 0,
        additionalCharges: [],
      },
      itinerary: {
        estimatedDuration: 60, // 1 hour default
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'pricing.additionalCharges',
  });

  const basePrice = watch('pricing.basePrice');
  const additionalCharges = watch('pricing.additionalCharges');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [vehiclesResponse, driversResponse] = await Promise.all([
          vehicleService.getVehicles({ limit: 100 }),
          userService.getUsers({ limit: 100, role: 'agency_user' }),
        ]);
        
        setVehicles(vehiclesResponse.data);
        setDrivers(driversResponse.data);
      } catch (error) {
        toast.error('Failed to load vehicles and drivers');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Calculate total price
    const additionalTotal = additionalCharges?.reduce((sum, charge) => sum + (charge.amount || 0), 0) || 0;
    setTotalPrice((basePrice || 0) + additionalTotal);
  }, [basePrice, additionalCharges]);

  const onSubmit = async (data: TripFormData) => {
    try {
      const tripData: CreateTripData = {
        ...data,
        driverId: data.driverId || undefined,
        pricing: {
          ...data.pricing,
          additionalCharges: data.pricing.additionalCharges?.filter(
            charge => charge.name && charge.amount > 0
          ) || [],
        },
      };

      await createTrip(tripData);
      toast.success('Trip created successfully!');
      router.push('/dashboard/trips');
    } catch (error) {
      // Error handled by store
    }
  };

  const generatePickupDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1); // Default to 1 hour from now
    return now.toISOString().slice(0, 16); // Format for datetime-local input
  };

  if (loadingData) {
    return (
      <div className="min-h-screen">
        <Topbar title="Create New Trip" subtitle="Book a new transportation service" />
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
      <Topbar title="Create New Trip" subtitle="Book a new transportation service" />
      
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
            <h1 className="text-2xl font-bold text-gray-900">Create New Trip</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Customer Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Customer Name *</label>
                  <input
                    type="text"
                    {...register('customerInfo.name')}
                    className="form-input"
                    placeholder="John Doe"
                  />
                  {errors.customerInfo?.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.customerInfo.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    {...register('customerInfo.email')}
                    className="form-input"
                    placeholder="john@example.com"
                  />
                  {errors.customerInfo?.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.customerInfo.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    {...register('customerInfo.phone')}
                    className="form-input"
                    placeholder="+1234567890"
                  />
                  {errors.customerInfo?.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.customerInfo.phone.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Number of Passengers *</label>
                  <input
                    type="number"
                    {...register('customerInfo.numberOfPassengers', { valueAsNumber: true })}
                    className="form-input"
                    placeholder="2"
                    min="1"
                  />
                  {errors.customerInfo?.numberOfPassengers && (
                    <p className="mt-1 text-sm text-red-600">{errors.customerInfo.numberOfPassengers.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Trip Details</h3>
              
              <div className="space-y-6">
                {/* Locations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Pickup Location *</label>
                    <input
                      type="text"
                      {...register('itinerary.pickupLocation.address')}
                      className="form-input"
                      placeholder="123 Main Street, City"
                    />
                    {errors.itinerary?.pickupLocation?.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.itinerary.pickupLocation.address.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="form-label">Dropoff Location *</label>
                    <input
                      type="text"
                      {...register('itinerary.dropoffLocation.address')}
                      className="form-input"
                      placeholder="456 Destination Ave, City"
                    />
                    {errors.itinerary?.dropoffLocation?.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.itinerary.dropoffLocation.address.message}</p>
                    )}
                  </div>
                </div>
                
                {/* Time & Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Pickup Date & Time *</label>
                    <input
                      type="datetime-local"
                      {...register('itinerary.pickupTime')}
                      className="form-input"
                      defaultValue={generatePickupDateTime()}
                    />
                    {errors.itinerary?.pickupTime && (
                      <p className="mt-1 text-sm text-red-600">{errors.itinerary.pickupTime.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="form-label">Estimated Duration (minutes) *</label>
                    <input
                      type="number"
                      {...register('itinerary.estimatedDuration', { valueAsNumber: true })}
                      className="form-input"
                      placeholder="60"
                      min="1"
                    />
                    {errors.itinerary?.estimatedDuration && (
                      <p className="mt-1 text-sm text-red-600">{errors.itinerary.estimatedDuration.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle & Driver */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle & Driver Assignment</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Vehicle *</label>
                  <select {...register('vehicleId')} className="form-input">
                    <option value="">Select a vehicle</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle._id} value={vehicle._id}>
                        {vehicle.plateNumber} - {vehicle.brand} {vehicle.model} ({vehicle.capacity.passengers} seats)
                      </option>
                    ))}
                  </select>
                  {errors.vehicleId && (
                    <p className="mt-1 text-sm text-red-600">{errors.vehicleId.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Driver (optional)</label>
                  <select {...register('driverId')} className="form-input">
                    <option value="">No driver assigned</option>
                    {drivers.map((driver) => (
                      <option key={driver._id} value={driver._id}>
                        {driver.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Pricing</h3>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPrice)}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="form-label">Base Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('pricing.basePrice', { valueAsNumber: true })}
                    className="form-input"
                    placeholder="100.00"
                    min="0"
                  />
                  {errors.pricing?.basePrice && (
                    <p className="mt-1 text-sm text-red-600">{errors.pricing.basePrice.message}</p>
                  )}
                </div>
                
                {/* Additional Charges */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="form-label">Additional Charges</label>
                    <button
                      type="button"
                      onClick={() => append({ name: '', amount: 0 })}
                      className="btn-secondary flex items-center text-sm"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Charge
                    </button>
                  </div>
                  
                  {fields.length > 0 ? (
                    <div className="space-y-3">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center space-x-3">
                          <input
                            type="text"
                            {...register(`pricing.additionalCharges.${index}.name`)}
                            className="form-input flex-1"
                            placeholder="e.g., Airport fee, Extra luggage"
                          />
                          <input
                            type="number"
                            step="0.01"
                            {...register(`pricing.additionalCharges.${index}.amount`, { valueAsNumber: true })}
                            className="form-input w-32"
                            placeholder="0.00"
                            min="0"
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
                    <p className="text-gray-500 text-sm">No additional charges. Click "Add Charge" to include extras.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Special Requests</h3>
              
              <div>
                <label className="form-label">Notes (optional)</label>
                <textarea
                  {...register('specialRequests')}
                  rows={3}
                  className="form-input"
                  placeholder="Any special requirements or notes for this trip..."
                />
              </div>
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
                {isLoading ? 'Creating...' : 'Create Trip'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
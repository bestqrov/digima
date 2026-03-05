
'use client'

import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { useState } from 'react'
import Topbar from '@/components/Topbar'
import { toast } from 'react-hot-toast'
import { useVehicleStore } from '@/store'

type VehicleFormData = {
  plateNumber: string
  brand: string
  model: string
  year: number
  type: 'bus' | 'van' | 'car' | 'boat'
  capacity: {
    passengers: number
    luggage?: number
  }
  features: { value: string }[]
  insurance: {
    provider: string
    policyNumber: string
    expiryDate: string
  }
}

export default function NewVehiclePage() {
  const router = useRouter()
  const { createVehicle } = useVehicleStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormData>({
    defaultValues: {
      type: 'bus',
      features: [{ value: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'features',
  })

  const onSubmit = async (data: VehicleFormData) => {
    try {
      setIsSubmitting(true)

      const payload = {
        plateNumber: data.plateNumber,
        brand: data.brand,
        model: data.model,
        year: data.year,
        type: data.type,
        capacity: {
          passengers: data.capacity.passengers,
          luggage: data.capacity.luggage,
        },
        features: data.features.map((f) => f.value).filter(Boolean),
        insurance: {
          provider: data.insurance.provider,
          policyNumber: data.insurance.policyNumber,
          expiryDate: data.insurance.expiryDate,
        },
      }

      await createVehicle(payload)
      toast.success('Vehicle created successfully')
      reset()
      router.push('/dashboard/vehicles')
    } catch {
      toast.error('Failed to create vehicle')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Topbar
        title="Add Vehicle"
        subtitle="Create a new vehicle for your fleet"
      />

      <div className="p-6 max-w-3xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-6 rounded-lg border"
        >
          {/* Plate Number */}
          <div>
            <label className="form-label">Plate Number</label>
            <input
              {...register('plateNumber', { required: true })}
              className="form-input"
            />
            {errors.plateNumber && (
              <p className="text-red-500 text-sm">Plate number required</p>
            )}
          </div>

          {/* Brand */}
          <div>
            <label className="form-label">Brand</label>
            <input
              {...register('brand', { required: true })}
              className="form-input"
            />
          </div>

          {/* Model */}
          <div>
            <label className="form-label">Model</label>
            <input
              {...register('model', { required: true })}
              className="form-input"
            />
          </div>

          {/* Year */}
          <div>
            <label className="form-label">Year</label>
            <input
              type="number"
              {...register('year', {
                required: 'Year is required',
                valueAsNumber: true,
                min: { value: 1990, message: 'Year must be 1990 or later' },
                max: { value: new Date().getFullYear() + 1, message: 'Invalid year' },
              })}
              className="form-input"
              placeholder="e.g. 2022"
            />
            {errors.year && (
              <p className="text-red-500 text-sm">{errors.year.message}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="form-label">Vehicle Type</label>
            <select {...register('type', { required: true })} className="form-input">
              <option value="bus">Bus</option>
              <option value="van">Van</option>
              <option value="car">Car</option>
              <option value="boat">Boat</option>
            </select>
          </div>

          {/* Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Passenger Capacity</label>
              <input
                type="number"
                {...register('capacity.passengers', {
                  required: 'Passenger capacity is required',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Must be at least 1' },
                })}
                className="form-input"
                placeholder="e.g. 20"
              />
              {errors.capacity?.passengers && (
                <p className="text-red-500 text-sm">{errors.capacity.passengers.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Luggage Capacity (optional)</label>
              <input
                type="number"
                {...register('capacity.luggage', { valueAsNumber: true })}
                className="form-input"
                placeholder="e.g. 10"
              />
            </div>
          </div>

          {/* Insurance */}
          <fieldset className="border rounded-lg p-4 space-y-4">
            <legend className="form-label px-1">Insurance</legend>
            <div>
              <label className="form-label">Provider</label>
              <input
                {...register('insurance.provider', { required: 'Insurance provider is required' })}
                className="form-input"
                placeholder="e.g. AXA"
              />
              {errors.insurance?.provider && (
                <p className="text-red-500 text-sm">{errors.insurance.provider.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Policy Number</label>
              <input
                {...register('insurance.policyNumber', { required: 'Policy number is required' })}
                className="form-input"
                placeholder="e.g. POL-123456"
              />
              {errors.insurance?.policyNumber && (
                <p className="text-red-500 text-sm">{errors.insurance.policyNumber.message}</p>
              )}
            </div>
            <div>
              <label className="form-label">Expiry Date</label>
              <input
                type="date"
                {...register('insurance.expiryDate', { required: 'Expiry date is required' })}
                className="form-input"
              />
              {errors.insurance?.expiryDate && (
                <p className="text-red-500 text-sm">{errors.insurance.expiryDate.message}</p>
              )}
            </div>
          </fieldset>

          {/* Features */}
          <div>
            <label className="form-label">Features</label>

            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <input
                  {...register(`features.${index}.value` as const)}
                  className="form-input flex-1"
                />

                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="btn-danger"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ value: '' })}
              className="btn-secondary mt-2"
            >
              Add Feature
            </button>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? 'Creating...' : 'Create Vehicle'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/dashboard/vehicles')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


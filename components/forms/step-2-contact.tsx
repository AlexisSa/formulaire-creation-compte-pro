'use client'

import { UseFormReturn } from 'react-hook-form'
import { AccountFormData } from '@/lib/validation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin, Home } from 'lucide-react'

interface Step2ContactProps {
  form: UseFormReturn<AccountFormData>
}

/**
 * Étape 2 : Informations de contact et adresse
 */
export function Step2Contact({ form }: Step2ContactProps) {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="space-y-8">
      {/* Contact */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 mb-6">
          <Mail className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Contact
          </h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email professionnel <span className="text-red-600">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="contact@entreprise.fr"
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-600" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Téléphone <span className="text-red-600">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="01 23 45 67 89"
            {...register('phone')}
            className={errors.phone ? 'border-red-500' : ''}
            aria-invalid={errors.phone ? 'true' : 'false'}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className="text-sm text-red-600" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Adresse */}
      <div className="space-y-5 pt-8">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Adresse de facturation
          </h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium text-gray-700">
            Adresse <span className="text-red-600">*</span>
          </Label>
          <Input
            id="address"
            type="text"
            placeholder="123 Rue de la République"
            {...register('address')}
            className={errors.address ? 'border-red-500' : ''}
            aria-invalid={errors.address ? 'true' : 'false'}
            aria-describedby={errors.address ? 'address-error' : undefined}
          />
          {errors.address && (
            <p id="address-error" className="text-sm text-red-600" role="alert">
              {errors.address.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
              Code postal <span className="text-red-600">*</span>
            </Label>
            <Input
              id="postalCode"
              type="text"
              placeholder="75001"
              maxLength={5}
              {...register('postalCode')}
              className={errors.postalCode ? 'border-red-500' : ''}
              aria-invalid={errors.postalCode ? 'true' : 'false'}
              aria-describedby={errors.postalCode ? 'postalCode-error' : undefined}
            />
            {errors.postalCode && (
              <p id="postalCode-error" className="text-sm text-red-600" role="alert">
                {errors.postalCode.message}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="city" className="text-sm font-medium text-gray-700">
              Ville <span className="text-red-600">*</span>
            </Label>
            <Input
              id="city"
              type="text"
              placeholder="Paris"
              {...register('city')}
              className={errors.city ? 'border-red-500' : ''}
              aria-invalid={errors.city ? 'true' : 'false'}
              aria-describedby={errors.city ? 'city-error' : undefined}
            />
            {errors.city && (
              <p id="city-error" className="text-sm text-red-600" role="alert">
                {errors.city.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

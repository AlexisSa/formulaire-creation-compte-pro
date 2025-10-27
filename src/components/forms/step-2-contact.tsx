'use client'

import { UseFormReturn } from 'react-hook-form'
import { AccountFormData } from '@/lib/validation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Step2ContactProps {
  form: UseFormReturn<AccountFormData>
}

/**
 * Étape 2 : Informations de contact et adresses
 */
export function Step2Contact({ form }: Step2ContactProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form

  // Copier l'adresse de facturation vers livraison
  const copyFacturationToLivraison = () => {
    const address = watch('address')
    const postalCode = watch('postalCode')
    const city = watch('city')

    setValue('deliveryAddress', address)
    setValue('deliveryPostalCode', postalCode)
    setValue('deliveryCity', city)
  }

  // Copier le responsable achat vers service compta
  const copyAchatToCompta = () => {
    const email = watch('responsableAchatEmail')
    const phone = watch('responsableAchatPhone')

    setValue('serviceComptaEmail', email)
    setValue('serviceComptaPhone', phone)
  }

  return (
    <div className="space-y-8">
      {/* Contacts côte à côte */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Responsable Achat */}
        <div className="space-y-5 bg-blue-50/30 border border-blue-100 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Mail className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Responsable Achat
            </h3>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="responsableAchatEmail"
              className="text-sm font-medium text-gray-700"
            >
              Email <span className="text-red-600">*</span>
            </Label>
            <Input
              id="responsableAchatEmail"
              type="email"
              placeholder="achat@entreprise.fr"
              {...register('responsableAchatEmail')}
              className={errors.responsableAchatEmail ? 'border-red-500' : ''}
              aria-invalid={errors.responsableAchatEmail ? 'true' : 'false'}
              aria-describedby={
                errors.responsableAchatEmail ? 'responsableAchatEmail-error' : undefined
              }
            />
            {errors.responsableAchatEmail && (
              <p
                id="responsableAchatEmail-error"
                className="text-sm text-red-600"
                role="alert"
              >
                {errors.responsableAchatEmail.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="responsableAchatPhone"
              className="text-sm font-medium text-gray-700"
            >
              Téléphone <span className="text-red-600">*</span>
            </Label>
            <Input
              id="responsableAchatPhone"
              type="tel"
              placeholder="01 23 45 67 89"
              {...register('responsableAchatPhone')}
              className={errors.responsableAchatPhone ? 'border-red-500' : ''}
              aria-invalid={errors.responsableAchatPhone ? 'true' : 'false'}
              aria-describedby={
                errors.responsableAchatPhone ? 'responsableAchatPhone-error' : undefined
              }
            />
            {errors.responsableAchatPhone && (
              <p
                id="responsableAchatPhone-error"
                className="text-sm text-red-600"
                role="alert"
              >
                {errors.responsableAchatPhone.message}
              </p>
            )}
          </div>
        </div>

        {/* Service Comptabilité */}
        <div className="space-y-5 bg-blue-50/30 border border-blue-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Service Comptabilité
              </h3>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={copyAchatToCompta}
              className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-100"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copier les infos achat
            </Button>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="serviceComptaEmail"
              className="text-sm font-medium text-gray-700"
            >
              Email <span className="text-red-600">*</span>
            </Label>
            <Input
              id="serviceComptaEmail"
              type="email"
              placeholder="compta@entreprise.fr"
              {...register('serviceComptaEmail')}
              className={errors.serviceComptaEmail ? 'border-red-500' : ''}
              aria-invalid={errors.serviceComptaEmail ? 'true' : 'false'}
              aria-describedby={
                errors.serviceComptaEmail ? 'serviceComptaEmail-error' : undefined
              }
            />
            {errors.serviceComptaEmail && (
              <p
                id="serviceComptaEmail-error"
                className="text-sm text-red-600"
                role="alert"
              >
                {errors.serviceComptaEmail.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="serviceComptaPhone"
              className="text-sm font-medium text-gray-700"
            >
              Téléphone <span className="text-red-600">*</span>
            </Label>
            <Input
              id="serviceComptaPhone"
              type="tel"
              placeholder="01 23 45 67 90"
              {...register('serviceComptaPhone')}
              className={errors.serviceComptaPhone ? 'border-red-500' : ''}
              aria-invalid={errors.serviceComptaPhone ? 'true' : 'false'}
              aria-describedby={
                errors.serviceComptaPhone ? 'serviceComptaPhone-error' : undefined
              }
            />
            {errors.serviceComptaPhone && (
              <p
                id="serviceComptaPhone-error"
                className="text-sm text-red-600"
                role="alert"
              >
                {errors.serviceComptaPhone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Adresses côte à côte */}
      <div className="grid md:grid-cols-2 gap-6 pt-8">
        {/* Adresse de facturation */}
        <div className="space-y-5 bg-gray-50/50 border border-gray-200 rounded-xl p-6">
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

        {/* Adresse de livraison */}
        <div className="space-y-5 bg-gray-50/50 border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Adresse de livraison
              </h3>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={copyFacturationToLivraison}
              className="text-xs text-gray-600 hover:text-gray-700 hover:bg-gray-100"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copier la facturation
            </Button>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="deliveryAddress"
              className="text-sm font-medium text-gray-700"
            >
              Adresse <span className="text-red-600">*</span>
            </Label>
            <Input
              id="deliveryAddress"
              type="text"
              placeholder="123 Rue de la République"
              {...register('deliveryAddress')}
              className={errors.deliveryAddress ? 'border-red-500' : ''}
              aria-invalid={errors.deliveryAddress ? 'true' : 'false'}
              aria-describedby={
                errors.deliveryAddress ? 'deliveryAddress-error' : undefined
              }
            />
            {errors.deliveryAddress && (
              <p id="deliveryAddress-error" className="text-sm text-red-600" role="alert">
                {errors.deliveryAddress.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-1">
              <Label
                htmlFor="deliveryPostalCode"
                className="text-sm font-medium text-gray-700"
              >
                Code postal <span className="text-red-600">*</span>
              </Label>
              <Input
                id="deliveryPostalCode"
                type="text"
                placeholder="75001"
                maxLength={5}
                {...register('deliveryPostalCode')}
                className={errors.deliveryPostalCode ? 'border-red-500' : ''}
                aria-invalid={errors.deliveryPostalCode ? 'true' : 'false'}
                aria-describedby={
                  errors.deliveryPostalCode ? 'deliveryPostalCode-error' : undefined
                }
              />
              {errors.deliveryPostalCode && (
                <p
                  id="deliveryPostalCode-error"
                  className="text-sm text-red-600"
                  role="alert"
                >
                  {errors.deliveryPostalCode.message}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="deliveryCity" className="text-sm font-medium text-gray-700">
                Ville <span className="text-red-600">*</span>
              </Label>
              <Input
                id="deliveryCity"
                type="text"
                placeholder="Paris"
                {...register('deliveryCity')}
                className={errors.deliveryCity ? 'border-red-500' : ''}
                aria-invalid={errors.deliveryCity ? 'true' : 'false'}
                aria-describedby={errors.deliveryCity ? 'deliveryCity-error' : undefined}
              />
              {errors.deliveryCity && (
                <p id="deliveryCity-error" className="text-sm text-red-600" role="alert">
                  {errors.deliveryCity.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

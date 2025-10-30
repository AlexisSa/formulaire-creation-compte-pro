'use client'

import { UseFormReturn } from 'react-hook-form'
import { AccountFormData } from '@/lib/validation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin, Copy, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

function FieldError({ name, form, stepSubmitted }: { name: keyof AccountFormData, form: UseFormReturn<AccountFormData>, stepSubmitted?: boolean }) {
  const error = form.formState.errors[name];
  const touched = !!form.formState.touchedFields[name];
  // utilise le stepSubmitted passé en prop
  if (!error || (!touched && !stepSubmitted)) return null;
  return (
    <p className="text-sm text-red-600" role="alert">
      {error.message}
    </p>
  );
}

interface Step2ContactProps {
  form: UseFormReturn<AccountFormData>
  stepSubmitted?: boolean
}

/**
 * Étape 2 : Informations de contact et adresses
 */
export function Step2Contact({ form, stepSubmitted }: Step2ContactProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors, touchedFields, isSubmitted },
  } = form

  const isMissingAddressInfo = !watch('address') || !watch('postalCode') || !watch('city')
  const isFromInsee = !!watch('siret') || !!watch('nafApe')

  // Copier l'adresse de facturation vers livraison
  const copyFacturationToLivraison = async () => {
    const address = watch('address')
    const postalCode = watch('postalCode')
    const city = watch('city')

    setValue('deliveryAddress', address, { shouldValidate: true, shouldTouch: true })
    setValue('deliveryPostalCode', postalCode, { shouldValidate: true, shouldTouch: true })
    setValue('deliveryCity', city, { shouldValidate: true, shouldTouch: true })

    await form.trigger(['deliveryAddress', 'deliveryPostalCode', 'deliveryCity'])
  }

  // Copier le responsable achat vers service compta
  const copyAchatToCompta = async () => {
    const email = watch('responsableAchatEmail')
    const phone = watch('responsableAchatPhone')

    setValue('serviceComptaEmail', email, { shouldValidate: true, shouldTouch: true })
    setValue('serviceComptaPhone', phone, { shouldValidate: true, shouldTouch: true })

    await form.trigger(['serviceComptaEmail', 'serviceComptaPhone'])
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Contacts côte à côte */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Responsable Achat */}
        <div className="space-y-5 bg-blue-50/30 border border-blue-100 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wide">
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
              {...register('responsableAchatEmail')}
              className={(errors.responsableAchatEmail && (touchedFields.responsableAchatEmail || isSubmitted)) ? 'border-red-500' : ''}
              aria-invalid={errors.responsableAchatEmail ? 'true' : 'false'}
              aria-describedby={errors.responsableAchatEmail ? 'responsableAchatEmail-error' : undefined}
            />
            <FieldError name="responsableAchatEmail" form={form} stepSubmitted={stepSubmitted} />
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
              {...register('responsableAchatPhone')}
              className={(errors.responsableAchatPhone && (touchedFields.responsableAchatPhone || isSubmitted)) ? 'border-red-500' : ''}
              aria-invalid={errors.responsableAchatPhone ? 'true' : 'false'}
              aria-describedby={errors.responsableAchatPhone ? 'responsableAchatPhone-error' : undefined}
            />
            <FieldError name="responsableAchatPhone" form={form} stepSubmitted={stepSubmitted} />
          </div>
        </div>

        {/* Service Comptabilité */}
        <div className="space-y-5 bg-blue-50/30 border border-blue-100 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Service Comptabilité
              </h3>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={copyAchatToCompta}
              className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-100 whitespace-nowrap"
            >
              <Copy className="h-3 w-3 sm:mr-1" />
              <span className="hidden sm:inline">Copier les infos achat</span>
              <span className="sm:hidden">Copier</span>
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
              {...register('serviceComptaEmail')}
              className={(errors.serviceComptaEmail && (touchedFields.serviceComptaEmail || isSubmitted)) ? 'border-red-500' : ''}
              aria-invalid={errors.serviceComptaEmail ? 'true' : 'false'}
              aria-describedby={errors.serviceComptaEmail ? 'serviceComptaEmail-error' : undefined}
            />
            <FieldError name="serviceComptaEmail" form={form} stepSubmitted={stepSubmitted} />
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
              {...register('serviceComptaPhone')}
              className={(errors.serviceComptaPhone && (touchedFields.serviceComptaPhone || isSubmitted)) ? 'border-red-500' : ''}
              aria-invalid={errors.serviceComptaPhone ? 'true' : 'false'}
              aria-describedby={errors.serviceComptaPhone ? 'serviceComptaPhone-error' : undefined}
            />
            <FieldError name="serviceComptaPhone" form={form} stepSubmitted={stepSubmitted} />
          </div>
        </div>
      </div>

      {/* Adresses côte à côte */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-8">
        {/* Adresse de facturation */}
        <div className="space-y-5 bg-gray-50/50 border border-gray-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Adresse de facturation
            </h3>
          </div>

          {isFromInsee && isMissingAddressInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3 text-blue-700 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-500 flex-shrink-0" aria-hidden="true" />
              Certaines informations d&apos;adresse n&apos;ont pas pu être récupérées automatiquement. Merci de compléter ces champs pour poursuivre votre inscription.
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Adresse <span className="text-red-600">*</span>
            </Label>
            <Input
              id="address"
              type="text"
              {...register('address')}
              className={(errors.address && (touchedFields.address || isSubmitted)) ? 'border-red-500' : ''}
              aria-invalid={errors.address ? 'true' : 'false'}
              aria-describedby={errors.address ? 'address-error' : undefined}
            />
            <FieldError name="address" form={form} stepSubmitted={stepSubmitted} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                Code postal <span className="text-red-600">*</span>
              </Label>
              <Input
                id="postalCode"
                type="text"
                {...register('postalCode')}
                className={(errors.postalCode && (touchedFields.postalCode || isSubmitted)) ? 'border-red-500' : ''}
                aria-invalid={errors.postalCode ? 'true' : 'false'}
                aria-describedby={errors.postalCode ? 'postalCode-error' : undefined}
              />
              <FieldError name="postalCode" form={form} stepSubmitted={stepSubmitted} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                Ville <span className="text-red-600">*</span>
              </Label>
              <Input
                id="city"
                type="text"
                {...register('city')}
                className={(errors.city && (touchedFields.city || isSubmitted)) ? 'border-red-500' : ''}
                aria-invalid={errors.city ? 'true' : 'false'}
                aria-describedby={errors.city ? 'city-error' : undefined}
              />
              <FieldError name="city" form={form} stepSubmitted={stepSubmitted} />
            </div>
          </div>
        </div>

        {/* Adresse de livraison */}
        <div className="space-y-5 bg-gray-50/50 border border-gray-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Adresse de livraison
              </h3>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={copyFacturationToLivraison}
              className="text-xs text-gray-600 hover:text-gray-700 hover:bg-gray-100 whitespace-nowrap"
            >
              <Copy className="h-3 w-3 sm:mr-1" />
              <span className="hidden sm:inline">Copier la facturation</span>
              <span className="sm:hidden">Copier</span>
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
              {...register('deliveryAddress')}
              className={(errors.deliveryAddress && (touchedFields.deliveryAddress || isSubmitted)) ? 'border-red-500' : ''}
              aria-invalid={errors.deliveryAddress ? 'true' : 'false'}
              aria-describedby={errors.deliveryAddress ? 'deliveryAddress-error' : undefined}
            />
            <FieldError name="deliveryAddress" form={form} stepSubmitted={stepSubmitted} />
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
                {...register('deliveryPostalCode')}
                className={(errors.deliveryPostalCode && (touchedFields.deliveryPostalCode || isSubmitted)) ? 'border-red-500' : ''}
                aria-invalid={errors.deliveryPostalCode ? 'true' : 'false'}
                aria-describedby={errors.deliveryPostalCode ? 'deliveryPostalCode-error' : undefined}
              />
              <FieldError name="deliveryPostalCode" form={form} stepSubmitted={stepSubmitted} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="deliveryCity" className="text-sm font-medium text-gray-700">
                Ville <span className="text-red-600">*</span>
              </Label>
              <Input
                id="deliveryCity"
                type="text"
                {...register('deliveryCity')}
                className={(errors.deliveryCity && (touchedFields.deliveryCity || isSubmitted)) ? 'border-red-500' : ''}
                aria-invalid={errors.deliveryCity ? 'true' : 'false'}
                aria-describedby={errors.deliveryCity ? 'deliveryCity-error' : undefined}
              />
              <FieldError name="deliveryCity" form={form} stepSubmitted={stepSubmitted} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

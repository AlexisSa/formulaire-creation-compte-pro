'use client'

import { motion } from 'framer-motion'
import { UseFormReturn } from 'react-hook-form'
import { AccountFormData } from '@/lib/validation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, Hash, FileText, Globe } from 'lucide-react'

interface Step1CompanyProps {
  form: UseFormReturn<AccountFormData>
}

/**
 * Étape 1 : Recherche entreprise + Informations légales
 */
export function Step1Company({ form }: Step1CompanyProps) {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Titre section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Informations de l&apos;entreprise
          </h3>
        </div>
      </motion.div>

      {/* Formulaire entreprise */}
      <div className="space-y-5">
        {/* Raison sociale */}
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
            Raison sociale <span className="text-red-600">*</span>
          </Label>
          <Input
            id="companyName"
            type="text"
            placeholder="SARL EXEMPLE"
            {...register('companyName')}
            className={errors.companyName ? 'border-red-500' : ''}
            aria-invalid={errors.companyName ? 'true' : 'false'}
            aria-describedby={errors.companyName ? 'companyName-error' : undefined}
          />
          {errors.companyName && (
            <p id="companyName-error" className="text-sm text-red-600" role="alert">
              {errors.companyName.message}
            </p>
          )}
        </div>

        {/* SIREN et SIRET */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="space-y-2">
            <Label htmlFor="siren" className="text-sm font-medium text-gray-700">
              SIREN
            </Label>
            <Input
              id="siren"
              type="text"
              placeholder="123456789"
              maxLength={9}
              {...register('siren')}
              className={errors.siren ? 'border-red-500' : ''}
              aria-invalid={errors.siren ? 'true' : 'false'}
              aria-describedby={errors.siren ? 'siren-error' : undefined}
            />
            {errors.siren && (
              <p id="siren-error" className="text-sm text-red-600" role="alert">
                {errors.siren.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="siret" className="text-sm font-medium text-gray-700">
              SIRET <span className="text-red-600">*</span>
            </Label>
            <Input
              id="siret"
              type="text"
              placeholder="12345678900001"
              maxLength={14}
              {...register('siret')}
              className={errors.siret ? 'border-red-500' : ''}
              aria-invalid={errors.siret ? 'true' : 'false'}
              aria-describedby={errors.siret ? 'siret-error' : undefined}
            />
            {errors.siret && (
              <p id="siret-error" className="text-sm text-red-600" role="alert">
                {errors.siret.message}
              </p>
            )}
          </div>
        </div>

        {/* NAF/APE et TVA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="space-y-2">
            <Label htmlFor="nafApe" className="text-sm font-medium text-gray-700">
              Code NAF / APE
            </Label>
            <Input
              id="nafApe"
              type="text"
              placeholder="6201Z"
              {...register('nafApe')}
              className={errors.nafApe ? 'border-red-500' : ''}
              aria-invalid={errors.nafApe ? 'true' : 'false'}
              aria-describedby={errors.nafApe ? 'nafApe-error' : undefined}
            />
            {errors.nafApe && (
              <p id="nafApe-error" className="text-sm text-red-600" role="alert">
                {errors.nafApe.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tvaIntracom" className="text-sm font-medium text-gray-700">
              N° TVA Intracommunautaire
            </Label>
            <Input
              id="tvaIntracom"
              type="text"
              placeholder="FR12345678901"
              maxLength={13}
              {...register('tvaIntracom')}
              className={errors.tvaIntracom ? 'border-red-500' : ''}
              aria-invalid={errors.tvaIntracom ? 'true' : 'false'}
              aria-describedby={errors.tvaIntracom ? 'tvaIntracom-error' : undefined}
            />
            {errors.tvaIntracom && (
              <p id="tvaIntracom-error" className="text-sm text-red-600" role="alert">
                {errors.tvaIntracom.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

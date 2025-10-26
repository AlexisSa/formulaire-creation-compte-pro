'use client'

import React, { useState, useEffect } from 'react'
import { useSecureCompanyForm } from '@/hooks/useSecureForms'
import { CSRFProtection } from '@/contexts/CSRFContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle, Shield, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SecureCompanyFormProps {
  initialData?: any
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
  className?: string
}

/**
 * Composant de formulaire d'entreprise sécurisé
 */
export function SecureCompanyForm({
  initialData,
  onSuccess,
  onError,
  className,
}: SecureCompanyFormProps) {
  const [formData, setFormData] = useState({
    siren: initialData?.siren || '',
    siret: initialData?.siret || '',
    nafApe: initialData?.nafApe || '',
    tvaIntracom: initialData?.tvaIntracom || '',
    companyName: initialData?.companyName || '',
    address: initialData?.address || '',
    postalCode: initialData?.postalCode || '',
    city: initialData?.city || '',
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isDirty, setIsDirty] = useState(false)

  const { submitForm, isLoading, error, isReady, validateData, autoSaveData } =
    useSecureCompanyForm({
      onSuccess: (data) => {
        setIsDirty(false)
        onSuccess?.(data)
      },
      onError: (error) => {
        onError?.(error)
      },
      autoSave: true,
      autoSaveDelay: 3000,
    })

  /**
   * Gestion des changements de formulaire
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setIsDirty(true)

    // Validation en temps réel
    const validation = validateData({ ...formData, [field]: value })
    if (!validation.isValid) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: validation.errors[0] || 'Erreur de validation',
      }))
    } else {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Auto-sauvegarde
    autoSaveData({ ...formData, [field]: value })
  }

  /**
   * Soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation complète
    const validation = validateData(formData)
    if (!validation.isValid) {
      const errors: Record<string, string> = {}
      validation.errors.forEach((error, index) => {
        errors[`field_${index}`] = error
      })
      setValidationErrors(errors)
      return
    }

    try {
      await submitForm(formData)
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
    }
  }

  /**
   * Indicateur de sécurité
   */
  const SecurityIndicator = () => (
    <div className="flex items-center space-x-2 text-sm text-green-600">
      <Shield className="h-4 w-4" />
      <span>Connexion sécurisée</span>
    </div>
  )

  /**
   * Indicateur de validation
   */
  const ValidationIndicator = ({ field }: { field: string }) => {
    const hasError = validationErrors[field]
    const hasValue = formData[field as keyof typeof formData]

    if (hasError) {
      return <AlertCircle className="h-4 w-4 text-red-500" />
    }
    if (hasValue) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    return null
  }

  if (!isReady) {
    return (
      <Card className={cn('p-6', className)}>
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Initialisation de la sécurité...</span>
        </div>
      </Card>
    )
  }

  return (
    <CSRFProtection>
      <Card className={cn('p-6', className)}>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Informations de l&apos;entreprise
            </h2>
            <SecurityIndicator />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}

          {isDirty && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span className="text-blue-700 text-sm">
                  Données sauvegardées automatiquement
                </span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations légales */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Informations légales</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siren" className="text-sm font-medium">
                  SIREN <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="siren"
                    type="text"
                    value={formData.siren}
                    onChange={(e) => handleInputChange('siren', e.target.value)}
                    placeholder="123456789"
                    maxLength={9}
                    className={cn(
                      'pr-10',
                      validationErrors.siren && 'border-red-500 focus:ring-red-500'
                    )}
                    required
                  />
                  <div className="absolute right-3 top-3">
                    <ValidationIndicator field="siren" />
                  </div>
                </div>
                {validationErrors.siren && (
                  <p className="text-sm text-red-600">{validationErrors.siren}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="siret" className="text-sm font-medium">
                  SIRET <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="siret"
                    type="text"
                    value={formData.siret}
                    onChange={(e) => handleInputChange('siret', e.target.value)}
                    placeholder="12345678901234"
                    maxLength={14}
                    className={cn(
                      'pr-10',
                      validationErrors.siret && 'border-red-500 focus:ring-red-500'
                    )}
                    required
                  />
                  <div className="absolute right-3 top-3">
                    <ValidationIndicator field="siret" />
                  </div>
                </div>
                {validationErrors.siret && (
                  <p className="text-sm text-red-600">{validationErrors.siret}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nafApe" className="text-sm font-medium">
                  Code NAF/APE <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="nafApe"
                    type="text"
                    value={formData.nafApe}
                    onChange={(e) => handleInputChange('nafApe', e.target.value)}
                    placeholder="62.01Z"
                    maxLength={5}
                    className={cn(
                      'pr-10',
                      validationErrors.nafApe && 'border-red-500 focus:ring-red-500'
                    )}
                    required
                  />
                  <div className="absolute right-3 top-3">
                    <ValidationIndicator field="nafApe" />
                  </div>
                </div>
                {validationErrors.nafApe && (
                  <p className="text-sm text-red-600">{validationErrors.nafApe}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tvaIntracom" className="text-sm font-medium">
                  TVA Intracommunautaire
                </Label>
                <div className="relative">
                  <Input
                    id="tvaIntracom"
                    type="text"
                    value={formData.tvaIntracom}
                    onChange={(e) => handleInputChange('tvaIntracom', e.target.value)}
                    placeholder="FR12345678901"
                    className={cn(
                      'pr-10',
                      validationErrors.tvaIntracom && 'border-red-500 focus:ring-red-500'
                    )}
                  />
                  <div className="absolute right-3 top-3">
                    <ValidationIndicator field="tvaIntracom" />
                  </div>
                </div>
                {validationErrors.tvaIntracom && (
                  <p className="text-sm text-red-600">{validationErrors.tvaIntracom}</p>
                )}
              </div>
            </div>
          </div>

          {/* Informations générales */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Informations générales</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-medium">
                  Nom de l&apos;entreprise <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Nom de votre entreprise"
                    className={cn(
                      'pr-10',
                      validationErrors.companyName && 'border-red-500 focus:ring-red-500'
                    )}
                    required
                  />
                  <div className="absolute right-3 top-3">
                    <ValidationIndicator field="companyName" />
                  </div>
                </div>
                {validationErrors.companyName && (
                  <p className="text-sm text-red-600">{validationErrors.companyName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Adresse <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Rue de la Paix"
                    className={cn(
                      'pr-10',
                      validationErrors.address && 'border-red-500 focus:ring-red-500'
                    )}
                    required
                  />
                  <div className="absolute right-3 top-3">
                    <ValidationIndicator field="address" />
                  </div>
                </div>
                {validationErrors.address && (
                  <p className="text-sm text-red-600">{validationErrors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-sm font-medium">
                    Code postal <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="postalCode"
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      placeholder="75001"
                      maxLength={5}
                      className={cn(
                        'pr-10',
                        validationErrors.postalCode && 'border-red-500 focus:ring-red-500'
                      )}
                      required
                    />
                    <div className="absolute right-3 top-3">
                      <ValidationIndicator field="postalCode" />
                    </div>
                  </div>
                  {validationErrors.postalCode && (
                    <p className="text-sm text-red-600">{validationErrors.postalCode}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium">
                    Ville <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="city"
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Paris"
                      className={cn(
                        'pr-10',
                        validationErrors.city && 'border-red-500 focus:ring-red-500'
                      )}
                      required
                    />
                    <div className="absolute right-3 top-3">
                      <ValidationIndicator field="city" />
                    </div>
                  </div>
                  {validationErrors.city && (
                    <p className="text-sm text-red-600">{validationErrors.city}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <Shield className="inline h-4 w-4 mr-1" />
              Données chiffrées et sécurisées
            </div>

            <Button
              type="submit"
              disabled={isLoading || !isReady}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                'Sauvegarder'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </CSRFProtection>
  )
}

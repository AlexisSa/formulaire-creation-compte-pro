'use client'

import { useEffect, useRef } from 'react'
import { useAccessibility } from '@/hooks/useAccessibility'

interface AccessibleFormProps {
  children: React.ReactNode
  title: string
  description?: string
  currentStep?: number
  totalSteps?: number
}

/**
 * Composant wrapper pour améliorer l'accessibilité des formulaires
 * Fournit la structure ARIA appropriée et la gestion du focus
 */
export function AccessibleForm({
  children,
  title,
  description,
  currentStep,
  totalSteps,
}: AccessibleFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const { announceToScreenReader } = useAccessibility()

  // Annonce les changements d'étape
  useEffect(() => {
    if (currentStep && totalSteps) {
      announceToScreenReader(`Étape ${currentStep} sur ${totalSteps}: ${title}`)
    }
  }, [currentStep, totalSteps, title, announceToScreenReader])

  return (
    <form
      ref={formRef}
      role="form"
      aria-labelledby="form-title"
      aria-describedby={description ? 'form-description' : undefined}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 id="form-title" className="text-2xl font-bold text-gray-900">
          {title}
        </h2>
        {description && (
          <p id="form-description" className="text-gray-600">
            {description}
          </p>
        )}
        {currentStep && totalSteps && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span aria-live="polite" aria-atomic="true">
              Étape {currentStep} sur {totalSteps}
            </span>
            <div className="flex space-x-1">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div role="group" aria-labelledby="form-title">
        {children}
      </div>
    </form>
  )
}

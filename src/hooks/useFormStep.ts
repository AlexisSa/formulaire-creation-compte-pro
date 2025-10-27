import { useState, useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import type { AccountFormData } from '@/lib/validation'

interface Step {
  id: number
  title: string
  description: string
}

interface UseFormStepOptions {
  steps: Step[]
  initialStep?: number
}

export interface UseFormStepReturn {
  // État
  currentStep: number
  isTransitioning: boolean
  totalSteps: number

  // Actions
  goToNext: () => Promise<boolean>
  goToPrevious: () => void
  goToStep: (step: number) => Promise<boolean>
  validateCurrentStep: () => Promise<boolean>

  // Utilitaires
  scrollToStepper: () => void
  canGoNext: boolean
  canGoPrevious: boolean
  isFirstStep: boolean
  isLastStep: boolean
  progress: number
}

/**
 * Hook personnalisé pour gérer la navigation entre les étapes d'un formulaire
 * Inclut la validation, les transitions et la navigation
 */
export function useFormStep(
  form: UseFormReturn<AccountFormData>,
  options: UseFormStepOptions
): UseFormStepReturn {
  const { steps, initialStep = 1 } = options
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const { trigger } = form
  const totalSteps = steps.length

  /**
   * Définition des champs à valider pour chaque étape
   */
  const getFieldsForStep = (step: number): (keyof AccountFormData)[] => {
    const fieldsByStep: (keyof AccountFormData)[][] = [
      // Étape 1: Informations entreprise
      [
        'companyName',
        'siren',
        'siret',
        'nafApe',
        'tvaIntracom',
        'address',
        'postalCode',
        'city',
      ],
      // Étape 2: Contact
      [
        'responsableAchatEmail',
        'responsableAchatPhone',
        'serviceComptaEmail',
        'serviceComptaPhone',
        'deliveryAddress',
        'deliveryPostalCode',
        'deliveryCity',
      ],
      // Étape 3: Documents & Signature
      ['legalDocument', 'signature'],
    ]

    return fieldsByStep[step - 1] || []
  }

  /**
   * Validation d'une étape spécifique
   */
  const validateStep = useCallback(
    async (step: number): Promise<boolean> => {
      const fields = getFieldsForStep(step)
      if (fields.length === 0) return true

      try {
        const result = await trigger(fields as any)
        return result
      } catch (error) {
        console.error('Erreur lors de la validation:', error)
        return false
      }
    },
    [trigger]
  )

  /**
   * Validation de l'étape actuelle
   */
  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    return validateStep(currentStep)
  }, [validateStep, currentStep])

  /**
   * Scroll vers le stepper avec animation douce
   */
  const scrollToStepper = useCallback(() => {
    setTimeout(() => {
      if (typeof document !== 'undefined') {
        const stepperElement = document.getElementById('form-stepper')
        if (stepperElement) {
          const yOffset = -20 // 20px au-dessus du stepper
          const y =
            stepperElement.getBoundingClientRect().top +
            (typeof window !== 'undefined' ? window.pageYOffset : 0) +
            yOffset
          if (typeof window !== 'undefined') {
            window.scrollTo({
              top: y,
              behavior: 'smooth',
            })
          }
        }
      }
    }, 150)
  }, [])

  /**
   * Passage à l'étape suivante avec validation
   */
  const goToNext = useCallback(async (): Promise<boolean> => {
    const isValid = await validateCurrentStep()

    if (isValid && currentStep < totalSteps) {
      setIsTransitioning(true)

      setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
        setIsTransitioning(false)
        scrollToStepper()
      }, 200)

      return true
    }

    return false
  }, [validateCurrentStep, currentStep, totalSteps, scrollToStepper])

  /**
   * Retour à l'étape précédente
   */
  const goToPrevious = useCallback(() => {
    if (currentStep > 1) {
      setIsTransitioning(true)

      setTimeout(() => {
        setCurrentStep((prev) => prev - 1)
        setIsTransitioning(false)
        scrollToStepper()
      }, 200)
    }
  }, [currentStep, scrollToStepper])

  /**
   * Navigation directe vers une étape avec validation
   */
  const goToStep = useCallback(
    async (step: number): Promise<boolean> => {
      if (step < 1 || step > totalSteps) return false

      // Si on va vers une étape précédente, pas de validation
      if (step < currentStep) {
        setIsTransitioning(true)
        setTimeout(() => {
          setCurrentStep(step)
          setIsTransitioning(false)
          scrollToStepper()
        }, 200)
        return true
      }

      // Si on va vers une étape suivante, valider toutes les étapes intermédiaires
      for (let i = currentStep; i < step; i++) {
        const isValid = await validateStep(i)
        if (!isValid) return false
      }

      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep(step)
        setIsTransitioning(false)
        scrollToStepper()
      }, 200)

      return true
    },
    [currentStep, totalSteps, validateStep, scrollToStepper]
  )

  // Calculs dérivés
  const canGoNext = currentStep < totalSteps
  const canGoPrevious = currentStep > 1
  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === totalSteps
  const progress = (currentStep / totalSteps) * 100

  return {
    // État
    currentStep,
    isTransitioning,
    totalSteps,

    // Actions
    goToNext,
    goToPrevious,
    goToStep,
    validateCurrentStep,

    // Utilitaires
    scrollToStepper,
    canGoNext,
    canGoPrevious,
    isFirstStep,
    isLastStep,
    progress,
  }
}

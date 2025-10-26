import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { accountFormSchema, type AccountFormData } from '@/lib/validation'
import { useFormStep } from './useFormStep'
import { useAutoSave } from './useAutoSave'
import { useFormContext } from '@/contexts'

const STEPS = [
  { id: 1, title: 'Votre Entreprise', description: 'Identification' },
  { id: 2, title: 'Contact', description: 'Coordonnées' },
  { id: 3, title: 'Validation', description: 'Documents' },
]

interface UseAccountFormOptions {
  enableAutoSave?: boolean
  autoSaveDebounceMs?: number
}

export interface UseAccountFormReturn {
  // Form
  form: ReturnType<typeof useForm<AccountFormData>>

  // Steps
  currentStep: number
  isTransitioning: boolean
  totalSteps: number
  progress: number

  // Navigation
  goToNext: () => Promise<boolean>
  goToPrevious: () => void
  goToStep: (step: number) => Promise<boolean>
  validateCurrentStep: () => Promise<boolean>

  // Auto-save
  saveDraft: (data: Partial<AccountFormData>) => void
  loadDraft: () => Partial<AccountFormData> | null
  clearDraft: () => void
  hasDraft: () => boolean

  // Utilitaires
  scrollToStepper: () => void
  canGoNext: boolean
  canGoPrevious: boolean
  isFirstStep: boolean
  isLastStep: boolean
}

/**
 * Hook principal pour gérer le formulaire de création de compte
 * Combine tous les hooks nécessaires pour une expérience complète
 */
export function useAccountForm(
  options: UseAccountFormOptions = {}
): UseAccountFormReturn {
  const { enableAutoSave = true, autoSaveDebounceMs = 1000 } = options

  // Initialisation du formulaire
  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountFormSchema),
    mode: 'onChange',
    defaultValues: {
      siren: '',
      nafApe: '',
      tvaIntracom: '',
    },
  })

  // Hook pour la gestion des étapes
  const {
    currentStep,
    isTransitioning,
    goToNext,
    goToPrevious,
    goToStep,
    validateCurrentStep,
    scrollToStepper,
    canGoNext,
    canGoPrevious,
    isFirstStep,
    isLastStep,
    progress,
  } = useFormStep(form, { steps: STEPS })

  // Hook pour la sauvegarde automatique
  const { saveDraft, loadDraft, clearDraft, hasDraft } = useAutoSave({
    debounceMs: autoSaveDebounceMs,
    enabled: enableAutoSave,
  })

  // Contexte du formulaire (si utilisé)
  const { updateFormData } = useFormContext()

  // Sauvegarde automatique des données du formulaire
  useEffect(() => {
    if (enableAutoSave) {
      const subscription = form.watch((data) => {
        saveDraft(data as Partial<AccountFormData>)

        // Mettre à jour le contexte si disponible
        if (updateFormData) {
          updateFormData(data as Partial<AccountFormData>)
        }
      })

      return () => subscription.unsubscribe()
    }
  }, [enableAutoSave, saveDraft, form, updateFormData])

  // Chargement du brouillon au montage
  useEffect(() => {
    if (enableAutoSave && hasDraft()) {
      const draftData = loadDraft()
      if (draftData) {
        // Charger les données dans le formulaire
        Object.entries(draftData).forEach(([key, value]) => {
          if (value !== undefined && key !== '_timestamp') {
            form.setValue(key as keyof AccountFormData, value as any)
          }
        })
      }
    }
  }, [enableAutoSave, hasDraft, loadDraft, form])

  return {
    // Form
    form,

    // Steps
    currentStep,
    isTransitioning,
    totalSteps: STEPS.length,
    progress,

    // Navigation
    goToNext,
    goToPrevious,
    goToStep,
    validateCurrentStep,

    // Auto-save
    saveDraft,
    loadDraft,
    clearDraft,
    hasDraft,

    // Utilitaires
    scrollToStepper,
    canGoNext,
    canGoPrevious,
    isFirstStep,
    isLastStep,
  }
}
